import {
  AudioTrack,
  ControlBar,
  useTracks,
  type TrackReference, // Import the specific TrackReference type
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { SofiaUI } from './SofiaUI';

export const Room = () => {
  // Get all microphone audio tracks from all participants
  const audioTracks = useTracks(
    [{ source: Track.Source.Microphone, withPlaceholder: true }],
  );

  return (
    <div className="sofia-room-container">
      {/* This is the final fix. The .filter() method now includes a "type guard":
        `(trackRef): trackRef is TrackReference`.
        This explicitly tells TypeScript that any item that passes the filter IS of the
        type `TrackReference`, not a placeholder. This satisfies the type checker.
      */}
      {audioTracks
        .filter((trackRef): trackRef is TrackReference => !!trackRef.publication)
        .map((trackRef) => (
          <AudioTrack key={trackRef.publication.trackSid} trackRef={trackRef} />
        ))}
      
      <SofiaUI />

      <ControlBar 
        controls={{
          microphone: true,
          camera: true,
          chat: false, 
          screenShare: true,
          leave: true,
        }} 
      />
    </div>
  );
};