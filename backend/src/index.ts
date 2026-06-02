import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import fs from 'fs';
import { connectDB } from './config/database';
import { wsManager } from './services/websocketManager';
import assignmentRoutes from './routes/assignmentRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
const server = http.createServer(app);

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://vedaai-seven.vercel.app',
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

wsManager.initialize(server);

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`WebSocket available at ws://localhost:${PORT}/ws`);
  });
});