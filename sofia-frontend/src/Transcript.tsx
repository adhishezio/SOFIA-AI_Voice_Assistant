import { useDataChannel } from '@livekit/components-react';
import { useState } from 'react';

interface ChatMessage {
  sender: string;
  message: string;
}

export const Transcript = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useDataChannel({
    topic: 'sofia-transcript',
    onMessage: (payload) => {
      const textDecoder = new TextDecoder();
      const json_string = textDecoder.decode(payload);
      

      const data = JSON.parse(json_string);
      const message = data.text;
      // ------------------------

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