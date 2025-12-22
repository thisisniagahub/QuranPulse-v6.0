
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { WhatsappService } from './services/whatsappService';
import { TelegramService } from './services/telegramService';
import { getEnv } from './utils/env';

// --- SETUP EXPRESS SERVER ---
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json());

// --- IN-MEMORY LOGS ---
const botLogs: any[] = [];

// --- INITIALIZE SERVICES ---
console.log("🚀 Starting QuranPulse Unified Bot Server (Node.js)...");

// 1. Initialize Telegram
const telegramBot = new TelegramService();

// 2. Initialize WhatsApp
const whatsappBot = new WhatsappService();

// --- API ENDPOINTS ---
app.get('/api/status', (req, res) => {
    res.json({
        whatsapp: 'INITIALIZING',
        telegram: 'ONLINE',
        uptime: process.uptime()
    });
});

app.post('/api/broadcast', async (req, res) => {
    const { message, target } = req.body;
    // TODO: Connect to WhatsappService broadcast logic
    res.json({ success: true, count: 0 });
});

// --- SOCKET.IO ---
io.on('connection', (socket) => {
    console.log('Admin Dashboard connected:', socket.id);
    socket.emit('logs_history', botLogs);
    socket.on('disconnect', () => {
        console.log('Admin disconnected');
    });
});

// --- START SERVER ---
const PORT = parseInt(getEnv('BOT_SERVER_PORT') || '3002');
httpServer.listen(PORT, () => {
    console.log(`✅ Bot Server running on http://localhost:${PORT}`);
});
