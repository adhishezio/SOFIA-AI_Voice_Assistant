import { useTracks } from '@livekit/components-react';
import { AudioTrack } from '@livekit/components-react';
import { Track } from 'livekit-client';
import type { TrackReference } from '@livekit/components-react';

export const AudioRenderer = () => {
  // Get all microphone audio tracks from all participants
  const audioTracks = useTracks(
    [{ source: Track.Source.Microphone, withPlaceholder: false }],
  );

  return (
    <>
      {audioTracks
        // The type guard filter to prevent crashes
        .filter((trackRef): trackRef is TrackReference => !!trackRef.publication)
        .map((trackRef) => (
          <AudioTrack key={trackRef.publication.trackSid} trackRef={trackRef} />
        ))}
    </>
  );
};