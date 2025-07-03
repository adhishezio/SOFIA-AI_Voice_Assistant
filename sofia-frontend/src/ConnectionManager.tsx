import { Room, RoomEvent } from 'livekit-client';
import { ReactNode, useCallback, useEffect, useState } from 'react';

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL;
const TOKEN_SERVER_URL = 'http://localhost:3001';

interface ConnectionManagerProps {
  onConnected: (room: Room) => void;
  children: (connectFn: () => Promise<void>) => ReactNode;
}

export const ConnectionManager = ({ onConnected, children }: ConnectionManagerProps) => {
  const [room] = useState(() => new Room());
  const [error, setError] = useState<Error | null>(null);

  const connect = useCallback(async () => {
    try {
      setError(null);
      const roomName = 'sofia-room';
      const userIdentity = 'human_user_adhish';

      console.log("Requesting token from server...");

      const response = await fetch(
        `${TOKEN_SERVER_URL}/get-livekit-token?room=${roomName}&identity=${userIdentity}`
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch token: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json(); 

      console.log("Token server response data:", data);

      const token = data.token; 

      if (!token || typeof token !== 'string') {
        throw new Error("Token received from server is invalid or empty.");
      }

      console.log("Connecting to LiveKit with token:", token.substring(0, 30) + "..."); // Show partial token for debug

      // Connect to LiveKit
      await room.connect(LIVEKIT_URL, token);

      console.log('Successfully connected to LiveKit room');
    } catch (e: any) {
      console.error('Failed to connect to LiveKit room:', e);
      setError(e);
    }
  }, [room]);

  useEffect(() => {
    const onConnectedListener = () => onConnected(room);
    room.on(RoomEvent.Connected, onConnectedListener);
    return () => {
      room.off(RoomEvent.Connected, onConnectedListener);
    };
  }, [room, onConnected]);

  if (error) {
    return <div>Error connecting: {error.message}</div>;
  }
  
  return children(connect);
};
