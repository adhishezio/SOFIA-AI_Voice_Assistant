import { useDataChannel } from '@livekit/components-react';
import { useState } from 'react';

// Define the structure of a chat message
interface ChatMessage {
  sender: string;
  message: string;
}

export const Transcript = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // useDataChannel is a hook that listens for messages on a specific topic
  useDataChannel({
    topic: 'sofia-transcript',
    onMessage: (payload) => {
      // Decode the message payload
      const textDecoder = new TextDecoder();
      const message = textDecoder.decode(payload);
      
      // Add the new message to our list
      setMessages((prev) => [...prev, { sender: 'SOFIA', message }]);
    },
  });

  return (
    <div className="transcript-container">
      {messages.map((msg, index) => (
        <div key={index} className="chat-message">
          <strong>{msg.sender}:</strong> {msg.message}
        </div>
      ))}
    </div>
  );
};