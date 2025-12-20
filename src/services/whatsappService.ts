import pkg from 'whatsapp-web.js';
const { Client, LocalAuth, MessageMedia } = pkg;
import qrcode from 'qrcode-terminal';
import { askUstazAI } from './aiService.ts';
import { VoiceService } from './ai/VoiceService.ts';
import { WhatsappCRM } from './whatsappCRM.ts';
import { ChatMessage } from '../types.ts';

export class WhatsappService {
    private client: any; // Client type is hard to import if pkg is used
    private isReady: boolean = false;

    constructor() {
        console.log("👳 Tok Imam: Initializing WhatsApp Client...");
        
        this.client = new Client({
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
        this.client.on('qr', (qr) => {
            console.log('📌 Scan QR Code ini untuk login sebagai Tok Imam:');
            qrcode.generate(qr, { small: true });
        });

        // 2. Ready State
        this.client.on('ready', () => {
            console.log('✅ Tok Imam is ONLINE and ready to serve!');
            this.isReady = true;
        });

        // 3. Message Handling
        this.client.on('message', async (msg) => {
            if (msg.isStatus || msg.from.includes('@g.us')) return;
            await this.handleMessage(msg);
        });

        this.client.initialize();
    }

    private async handleMessage(msg: any) {
        const contact = await msg.getContact();
        const name = contact.pushname || contact.name || "Hamba Allah";
        
        // 1. CRM SYNC (Auto-Save Contact)
        await WhatsappCRM.syncContact(msg.from, contact.name, contact.pushname);

        const question = msg.body;

        console.log(`📩 New Message from ${name}: ${question.substring(0, 50)}...`);

        try {
            const chat = await msg.getChat();
            await chat.sendStateTyping();
            
            const delay = Math.floor(Math.random() * 3000) + 2000;
            await new Promise(r => setTimeout(r, delay));

            const systemPrompt = `
ROLE: Anda adalah "Tok Imam AI", pembantu digital yang ramah dan bijaksana.
GOAL: Jawab soalan pengguna secara RINGKAS (teaser) dan ajak mereka ke Web App QuranPulse untuk info penuh.
STRATEGI JAWAPAN: Jawab dalam 1-2 ayat sahaja. Tambah link quranpulse.com.
`;

            const history: ChatMessage[] = [
                { id: '1', role: 'system', content: systemPrompt },
                { id: '2', role: 'user', content: `Nama: ${name}\nSoalan: ${question}`, timestamp: Date.now() }
            ];

            const answer = await askUstazAI(history);

            // C. OPTIONAL: Voice Note (Wow Factor)
            // We only generate voice for the text part (not the link if possible, or just the whole thing)
            const audioBuffer = await VoiceService.generateVoice(answer);
            
            if (audioBuffer) {
                const media = new MessageMedia('audio/mp3', audioBuffer.toString('base64'), 'voice.mp3');
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