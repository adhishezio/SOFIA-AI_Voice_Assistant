import { useState } from 'react';
import {
  LiveKitRoom,
  ControlBar,
  Chat,
  AudioTrack,
  useTracks,
  type TrackReference,
  LayoutContextProvider, // Import the missing provider
} from '@livekit/components-react';
import '@livekit/components-styles';
import './App.css';
import { Track } from 'livekit-client';
import { SofiaUI } from './SofiaUI';
import clsx from 'clsx';

const serverUrl = import.meta.env.VITE_LIVEKIT_URL;
const tokenServerUrl = 'http://localhost:3001';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const connectToSofia = async () => {
    try {
      const roomName = 'sofia-room';
      const userIdentity = 'human_user_adhish';
      const response = await fetch(
        `${tokenServerUrl}/get-livekit-token?room=${roomName}&identity=${userIdentity}`
      );
      if (!response.ok) throw new Error('Failed to fetch token');
      const data = await response.json();
      setToken(data.token);
    } catch (e) {
      console.error(e);
    }
  };

  if (!token) {
    return (
      <div className="connect-container">
        <button onClick={connectToSofia}>Connect to SOFIA</button>
      </div>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={serverUrl}
      token={token}
      connect={true}
      video={false}
      audio={true}
      data-lk-theme="default"
    >
      {/* This provider is required for the chat controls to work */}
      <LayoutContextProvider onWidgetChange={(widget) => setIsChatOpen(widget.showChat)}>
        <div className="main-container">
          <SofiaUI />
          <AudioRenderer />
          
          <div className={clsx('chat-panel', { hidden: !isChatOpen })}>
            <Chat />
          </div>

          <ControlBar
            controls={{
              microphone: true,
              camera: true,
              chat: true, // Use the default library toggle behavior
              screenShare: true,
              leave: true,
            }}
          />
        </div>
      </LayoutContextProvider>
    </LiveKitRoom>
  );
}

// This helper component correctly renders remote audio
const AudioRenderer = () => {
  const audioTracks = useTracks([
    { source: Track.Source.Microphone, withPlaceholder: false },
  ]);
  return (
    <>
      {audioTracks
        .filter((trackRef): trackRef is TrackReference => !!trackRef.publication)
        .map((trackRef) => (
          <AudioTrack key={trackRef.publication.trackSid} trackRef={trackRef} />
        ))}
    </>
  );
};

export default App;