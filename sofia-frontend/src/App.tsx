import { useState } from 'react';
import { Room } from './Room';
import { LiveKitRoom } from '@livekit/components-react';
import '@livekit/components-styles';
import './App.css';

const serverUrl = import.meta.env.VITE_LIVEKIT_URL;
const tokenServerUrl = 'http://localhost:3001';

function App() {
  const [token, setToken] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      console.log('--- Starting Connection Process ---');
      const roomName = 'sofia-room';
      const userIdentity = 'human_user_adhish';

      const response = await fetch(
        `${tokenServerUrl}/get-livekit-token?room=${roomName}&identity=${userIdentity}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch token from server.');
      }
      
      const data = await response.json();
      

      console.log('1. Full response object from server:', data); 
      
      // This will show us what is inside the 'token' property.
      console.log('2. Extracted "token" property:', data.token);

      console.log('3. Type of extracted token:', typeof data.token);
  
      setToken(data.token);

    } catch (e) {
      console.error(e);
    }
  };

  if (!token) {
    return (
      <div className="container">
        <button onClick={handleConnect}>Connect to SOFIA</button>
      </div>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={serverUrl}
      token={token}
      connect={true}
      video={true}
      audio={true}
    >
      <Room />
    </LiveKitRoom>
  );
}

export default App;