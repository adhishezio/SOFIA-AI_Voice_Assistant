import { useEffect, useRef, useCallback } from 'react';
import './sofia.css';
import * as THREE from 'three';
import { useLocalParticipant, useRemoteParticipants } from '@livekit/components-react';
import Particles from "react-tsparticles";
import { tsParticles } from "tsparticles-engine";
import type { Engine, ISourceOptions } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

export const SofiaUI = () => {
    const mountRef = useRef<HTMLDivElement>(null);
  
    const { localParticipant } = useLocalParticipant();
    const isUserSpeaking = localParticipant.isSpeaking;

    const remoteParticipants = useRemoteParticipants();
    const sofiaParticipant = remoteParticipants[0];
    const isSofiaSpeaking = sofiaParticipant?.isSpeaking ?? false;
    
    const particlesRef = useRef<any>(null);

    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine);
        const container = tsParticles.domItem(0);
        if (container) {
            particlesRef.current = container;
        }
    }, []);

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        let animationFrameId: number;
        const ORB_OFFSET_Y = 80;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 1000);
        camera.position.z = 400;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.id = 'orb-canvas';
        currentMount.appendChild(renderer.domElement);

        const circleTexture = () => {
            const size = 64;
            const canvas = document.createElement('canvas');
            canvas.width = canvas.height = size;
            const context = canvas.getContext('2d')!;
            context.beginPath();
            context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
            context.fillStyle = '#fff';
            context.fill();
            return new THREE.CanvasTexture(canvas);
        };
        const spriteTex = circleTexture();

        const cfg = { color: '#004aff', size: 2, count: 1200, radius: 70, shellThickness: 23 };
        let points: THREE.Points | undefined;

        const buildOrb = () => {
            if (points) scene.remove(points);
            const pos = [];
            for (let i = 0; i < cfg.count; i++) {
                const r = cfg.radius + (Math.random() * 2 - 1) * cfg.shellThickness;
                const phi = Math.acos(2 * Math.random() - 1);
                const th = Math.random() * Math.PI * 2;
                pos.push(r * Math.sin(phi) * Math.cos(th), r * Math.sin(phi) * Math.sin(th), r * Math.cos(phi));
            }
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
            const mat = new THREE.PointsMaterial({ map: spriteTex, transparent: true, depthWrite: false, color: new THREE.Color(cfg.color), size: cfg.size });
            points = new THREE.Points(geo, mat);
            points.position.y = ORB_OFFSET_Y;
            scene.add(points);
        };
        buildOrb();

        const repelStarsFromOrb = () => {
            if (!points || !particlesRef.current || !particlesRef.current.particles) return;
            const force = isSofiaSpeaking ? 10 : 4;
            const arr = particlesRef.current.particles.array;
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2 + ORB_OFFSET_Y;
            const r2 = cfg.radius * cfg.radius;
            for (const p of arr) {
                const dx = p.x - cx;
                const dy = p.y - cy;
                const d2 = dx * dx + dy * dy;
                if (d2 < r2) {
                    const d = Math.sqrt(d2) || 0.001;
                    const nx = dx / d;
                    const ny = dy / d;
                    p.vx += nx * force;
                    p.vy += ny * force;
                }
            }
        };

        const clock = new THREE.Clock();

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            if (!points) return;
            const elapsedTime = clock.getElapsedTime();
            points.rotation.y = elapsedTime * 0.1;
            points.rotation.x = elapsedTime * 0.1;
            repelStarsFromOrb();
            const isAnyoneSpeaking = isUserSpeaking || isSofiaSpeaking;
            const targetScale = isAnyoneSpeaking ? 1.2 : 1.0;
            const lerpFactor = 0.1;
            points.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), lerpFactor);
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            if (currentMount && renderer.domElement) {
                currentMount.removeChild(renderer.domElement);
            }
        };
    }, [isUserSpeaking, isSofiaSpeaking]);

    const particlesOptions: ISourceOptions = {
        "particles": {
            "number": { "value": 70, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#004aff" },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.5 },
            "size": { "value": 3, "random": true },
            "line_linked": { "enable": false },
            "move": { "enable": true, "speed": 1, "out_mode": "out" }
        },
        "interactivity": {
            "detect_on": "window",
            "events": { "onhover": { "enable": true, "mode": "repulse" }, "resize": true },
            "modes": { "repulse": { "distance": 200, "duration": 0.4 } }
        },
        "retina_detect": true
    };

    return (
        <div ref={mountRef} className="sofia-ui-container">
            <Particles id="particles-js" options={particlesOptions} init={particlesInit} />
            <header id="sofia-banner">
                <span>S</span><span>O</span><span>F</span><span>I</span><span>A</span>
            </header>
        </div>
    );
};