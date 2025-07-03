import express from 'express';
import { AccessToken } from 'livekit-server-sdk';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.get('/get-livekit-token', async (req, res) => {
  const { room, identity } = req.query;

  if (typeof room !== 'string' || typeof identity !== 'string') {
    return res.status(400).send('Missing "room" or "identity" query parameters');
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    return res.status(500).send('Server-side LiveKit credentials are not configured.');
  }

  const at = new AccessToken(apiKey, apiSecret, {
    identity,
    ttl: '1h',
  });
  
  // --- THIS IS THE FIX ---
  // We are adding 'canPublish' and 'canSubscribe' to grant full permissions.
  at.addGrant({
    roomJoin: true,
    room: room,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });
  // ----------------------

  const token = await at.toJwt(); 

  res.send({ token });
});

const port = 3001;
app.listen(port, () => console.log(`Token server running on port ${port}`));