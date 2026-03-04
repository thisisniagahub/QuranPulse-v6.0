import pkg from 'whatsapp-web.js';
const { Client, LocalAuth, MessageMedia } = pkg;
import qrcode from 'qrcode-terminal';
import { askUstazAI } from './aiService';
import { VoiceService } from './ai/VoiceService';
import { WhatsappCRM } from './whatsappCRM';
import type { ChatMessage } from '../types';
import { Server } from 'socket.io';

// Minimal Interface for Type Safety
interface WhatsAppMessage {
    from: string;
    body: string;
    isStatus: boolean;
    getContact: () => Promise<{ name?: string, pushname?: string }>;
    getChat: () => Promise<{ sendStateTyping: () => Promise<void> }>;
    reply: (content: string) => Promise<any>;
}

export class WhatsappService {
    private client: any; // Client type is hard to import if pkg is used
    private isReady: boolean = false;
    private io?: Server; // Optional Socket.IO server

    constructor(io?: Server) {
        this.io = io;
        console.log("👳 Tok Imam: Initializing WhatsApp Client...");

        this.client = new Client({
            authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
            puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            },
            webVersionCache: {
                type: 'remote',
                remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
            }
        });

        this.initialize();
    }

    private initialize() {
        // 1. QR Code Generation
        this.client.on('qr', (qr: string) => {
            console.log('📌 Scan QR Code ini untuk login sebagai Tok Imam:');
            qrcode.generate(qr, { small: false });

            // Emit to Dashboard if connected
            if (this.io) {
                this.io.emit('whatsapp_qr', qr);
                console.log("📡 QR Code emitted to Socket.IO");
            }
        });

        // 2. Ready State
        this.client.on('ready', () => {
            console.log('✅ Tok Imam is ONLINE and ready to serve!');
            this.isReady = true;

            // Emit to Dashboard
            if (this.io) {
                this.io.emit('whatsapp_ready', true);
            }
        });

        // 3. Message Handling
        this.client.on('message', async (msg: any) => {
            console.log("📨 RAW EVENT:", msg.type, msg.from, msg.body?.substring(0, 20)); // DEBUG
            if (msg.isStatus) return;
            if (msg.from.includes('@g.us')) return; // Ignore groups

            // Cast to our interface for internal usage
            await this.handleMessage(msg as WhatsAppMessage);
        });

        this.client.initialize();
    }

    private async handleMessage(msg: WhatsAppMessage) {
        const contact = await msg.getContact();
        const name = contact.pushname || contact.name || "Hamba Allah";

        // 1. CRM SYNC (Auto-Save Contact)
        await WhatsappCRM.syncContact(msg.from, contact.name, contact.pushname);

        const question = msg.body;

        console.log(`📩 New Message from ${name}: ${question.substring(0, 50)}...`);

        try {
            const chat = await msg.getChat();

            // A. Anti-Ban Strategy: Simulate Typing
            await chat.sendStateTyping();

            // Random delay (2-5 seconds)
            const delay = Math.floor(Math.random() * 3000) + 2000;
            await new Promise(r => setTimeout(r, delay));

            // B. AI Processing (The Brain)
            // Construct context for AI with "Bridge Strategy"
            const systemPrompt = `
ROLE: Anda adalah "Tok Imam AI", pembantu digital yang ramah dan bijaksana.
GOAL: Jawab soalan pengguna secara RINGKAS (teaser) dan ajak mereka ke Web App QuranPulse untuk info penuh.

STRATEGI JAWAPAN:
1. Bagi jawapan padat (maksimum 2 ayat).
2. Bagi LINK yang relevan mengikut topik:
   - Waktu Solat/Kiblat -> "👉 Tengok Jadual Penuh: https://quranpulse.my/ibadah"
   - Quran/Ayat/Tafsir -> "👉 Baca & Dengar: https://quranpulse.my/quran"
   - Sedih/Stress/Audio -> "🎧 Dengar Terapi Jiwa: https://quranpulse.my/media"
   - Derma/Sedekah -> "💚 Jom Infaq: https://quranpulse.my/barakah"
   - Belajar Iqra/Tajwid -> "📖 Kelas Digital: https://quranpulse.my/iqra"
   - Lain-lain -> "👉 Info Lanjut: https://quranpulse.my"

CONTOH:
User: "Waktu maghrib?"
Bot: "Maghrib masuk jam 7:20 PM hari ni. Jangan lupa solat awal waktu ya! 🕌\n\n👉 *Semak arah Kiblat & Waktu Solat:* https://quranpulse.my/ibadah"
`;

            const history: ChatMessage[] = [
                { id: '1', role: 'system', content: systemPrompt, timestamp: Date.now() },
                { id: '2', role: 'user', content: `Nama: ${name}\nSoalan: ${question}`, timestamp: Date.now() }
            ];

            const answer = await askUstazAI(history);

            // C. OPTIONAL: Voice Note (Wow Factor)
            // We only generate voice for the text part (not the link if possible, or just the whole thing)
            const voiceResult = await VoiceService.generateVoice(answer);

            if (voiceResult && voiceResult.type === 'buffer' && voiceResult.data) {
                const base64 = Buffer.from(voiceResult.data).toString('base64');
                // @ts-ignore - MessageMedia constructor not fully typed in this hacky import
                const media = new MessageMedia('audio/mp3', base64, 'voice.mp3');
                await this.client.sendMessage(msg.from, media, { sendAudioAsVoice: true });
                console.log(`🎙️ Sent Voice Note to ${name}`);
            }

            // D. Text Reply (As backup/companion)
            await msg.reply(answer);
            console.log(`📤 Replied to ${name}`);

        } catch (error) {
            console.error("❌ Error processing message:", error);
            await msg.reply("Maaf, Tok Imam sedang mengalami gangguan teknikal.");
        }
    }
}
