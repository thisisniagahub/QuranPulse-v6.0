import { Telegraf } from 'telegraf';
import { askUstazAI } from './aiService.ts';
import { ChatMessage } from '../types.ts';

export class TelegramService {
    private bot: Telegraf;

    constructor() {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        if (!token) {
            console.warn("⚠️ Telegram Bot Token missing! Telegram bot disabled.");
            return;
        }

        this.bot = new Telegraf(token);
        this.initialize();
    }

    private initialize() {
        console.log("🧕 Ustazah AI: Initializing Telegram Bot...");

        this.bot.start((ctx) => {
            ctx.reply(`Assalamualaikum ${ctx.from.first_name}! Saya Ustazah AI.\n\nAda apa-apa kemusykilan agama atau bantuan yang saya boleh berikan? Tanya saja di bawah.`);
        });

        this.bot.on('text', async (ctx) => {
            const question = ctx.message.text;
            const name = ctx.from.first_name;

            console.log(`📩 [TG] New Message from ${name}: ${question.substring(0, 50)}...`);

            try {
                // Show "typing" status
                await ctx.sendChatAction('typing');

                const systemPrompt = `
ROLE: Anda adalah "Ustazah AI" di Telegram, seorang pembantu digital yang lemah lembut, bijaksana dan sopan.
GOAL: Jawab soalan pengguna secara RINGKAS (teaser) dan ajak mereka ke Web App QuranPulse untuk info penuh.

STRATEGI JAWAPAN:
1. Bagi jawapan padat (maksimum 2 ayat).
2. Bagi LINK yang relevan:
   - Waktu Solat -> https://quranpulse.com/ibadah
   - Quran -> https://quranpulse.com/quran
   - Infaq -> https://quranpulse.com/barakah
`;

                const history: ChatMessage[] = [
                    { id: '1', role: 'system', content: systemPrompt },
                    { id: '2', role: 'user', content: `Nama: ${name}\nSoalan: ${question}`, timestamp: Date.now() }
                ];

                const answer = await askUstazAI(history);
                await ctx.reply(answer, { parse_mode: 'Markdown' });
                
                console.log(`📤 [TG] Replied to ${name}`);

            } catch (error) {
                console.error("❌ [TG] Error:", error);
                await ctx.reply("Maaf, saya mengalami gangguan teknikal.");
            }
        });

        this.bot.launch();
        console.log("✅ Tok Imam Telegram is ONLINE!");

        // Enable graceful stop
        process.once('SIGINT', () => this.bot.stop('SIGINT'));
        process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
    }
}
