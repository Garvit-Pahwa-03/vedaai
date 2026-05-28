import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import fs from 'fs';
import { connectDB } from './config/database';
import { wsManager } from './services/websocketManager';
import assignmentRoutes from './routes/assignmentRoutes';

const app = express();
const server = http.createServer(app);

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL, 'http://localhost:3000']
    : 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/assignments', assignmentRoutes);
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// WebSocket
wsManager.initialize(server);

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`WebSocket available at ws://localhost:${PORT}/ws`);
  });
});