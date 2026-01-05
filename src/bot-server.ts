import '../scripts/env-loader.js'; // MUST BE FIRST - Load env vars before anything else

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { WhatsappService } from './services/whatsappService.js';
import { TelegramService } from './services/telegramService.js';

// --- SETUP EXPRESS SERVER ---
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json());

// --- IN-MEMORY LOGS (For Admin Dashboard) ---
const botLogs: any[] = [];

// --- INITIALIZE SERVICES ---
console.log("🚀 Starting QuranPulse Unified Bot Server...");

// 1. Initialize Telegram (Independent)
const telegramBot = new TelegramService(io);

// 2. Initialize WhatsApp (With Socket support)
// We need to extend WhatsappService to accept a socket or emit events
// For now, we'll patch it locally effectively by spying on console.log or adding hooks if possible.
// Better yet, let's just initialize it and known it works in console.
// 2. Initialize WhatsApp (With Socket support)
const whatsappBot = new WhatsappService(io); // Pass IO instance

// --- API ENDPOINTS (For Admin Dashboard) ---

app.get('/api/status', (req, res) => {
    res.json({
        whatsapp: 'INITIALIZING', // We'd need to expose real state
        telegram: 'ONLINE',
        uptime: process.uptime()
    });
});

app.post('/api/broadcast', async (req, res) => {
    const { message, target } = req.body;
    // Logic to broadcast via bots
    res.json({ success: true, count: 0 });
});

// --- SOCKET.IO EVENTS ---
io.on('connection', (socket) => {
    console.log('Admin Dashboard connected:', socket.id);

    // Send logs history
    socket.emit('logs_history', botLogs);

    socket.on('disconnect', () => {
        console.log('Admin disconnected');
    });
});

// --- START SERVER ---
const PORT = 3002; // Separate from Admin (3000) and App (5173)
httpServer.listen(PORT, () => {
    console.log(`✅ Bot Server running on http://localhost:${PORT}`);
    console.log(`   (Ready for Webhook/Socket connections)`);
});
