import pkg from 'whatsapp-web.js';
const { Client, LocalAuth, MessageMedia } = pkg;
import qrcode from 'qrcode-terminal';
import { askUstazAI } from './aiService';
import { VoiceService } from './VoiceService';
import { WhatsappCRM } from './whatsappCRM';
import { ChatMessage } from './GroqClient';

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

    constructor() {
        console.log("👳 Tok Imam: Initializing WhatsApp Client (Server Mode)...");

        this.client = new Client({
            // Ensure auth strategy works in server environment (file system based)
            authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
            puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        });

        this.initialize();
    }

    private initialize() {
        // 1. QR Code Generation
        this.client.on('qr', (qr: string) => {
            console.log('📌 Scan QR Code ini untuk login sebagai Tok Imam:');
            qrcode.generate(qr, { small: true });
        });

        // 2. Ready State
        this.client.on('ready', () => {
            console.log('✅ Tok Imam is ONLINE and ready to serve!');
            this.isReady = true;
        });

        // 3. Message Handling
        this.client.on('message', async (msg: any) => {
            if (msg.isStatus || msg.from.includes('@g.us')) return;
            await this.handleMessage(msg as WhatsAppMessage);
        });

        this.client.initialize();
    }

    private async handleMessage(msg: WhatsAppMessage) {
        const contact = await msg.getContact();
        const name = contact.pushname || contact.name || "Hamba Allah";

        // 1. CRM SYNC
        await WhatsappCRM.syncContact(msg.from, contact.name, contact.pushname);

        const question = msg.body;

        console.log(`📩 New Message from ${name}: ${question.substring(0, 50)}...`);

        try {
            const chat = await msg.getChat();
            await chat.sendStateTyping();

            // Random delay
            const delay = Math.floor(Math.random() * 3000) + 2000;
            await new Promise(r => setTimeout(r, delay));

            const history: ChatMessage[] = [
                { role: 'user', content: `Nama: ${name}\nSoalan: ${question}` }
            ];

            const answer = await askUstazAI(history);

            // Voice Note
            const audioBuffer = await VoiceService.generateVoice(answer);
            if (audioBuffer) {
                // @ts-ignore
                const media = new MessageMedia('audio/mp3', audioBuffer.toString('base64'), 'voice.mp3');
                await this.client.sendMessage(msg.from, media, { sendAudioAsVoice: true });
            }

            // Text Reply
            await msg.reply(answer);
            console.log(`📤 Replied to ${name}`);

        } catch (error) {
            console.error("❌ Error processing message:", error);
            await msg.reply("Maaf, Tok Imam sedang mengalami gangguan teknikal.");
        }
    }
}
