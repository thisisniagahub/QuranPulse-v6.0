import { Telegraf, Markup } from 'telegraf';
import { askUstazAI, analyzeImage } from './aiService';
import axios from 'axios';
import { ChatMessage } from './GroqClient';
import { VoiceService } from './VoiceService';
import { supabase } from '../lib/supabase';
import { getEnv } from '../utils/env';

export class TelegramService {
    private bot!: Telegraf;

    constructor() {
        const token = getEnv('TELEGRAM_BOT_TOKEN');
        if (!token) {
            console.warn("⚠️ Telegram Bot Token missing! Telegram bot disabled.");
            return;
        }

        this.bot = new Telegraf(token);
        this.initialize();
    }

    private async initialize() {
        console.log("🧕 Ustazah AI: Initializing Telegram Bot (Server Mode)...");

        // 0. Set Bot Commands
        try {
            await this.bot.telegram.setMyCommands([
                { command: 'start', description: 'Mula bersembang dengan Ustazah' },
                { command: 'quran', description: 'Baca Al-Quran Digital' },
                { command: 'solat', description: 'Semak Waktu Solat & Kiblat' },
                { command: 'link', description: 'Sambung Akaun Web App' },
                { command: 'verify', description: 'Sahkan Kod OTP' },
                { command: 'profil', description: 'Lihat Prestasi & Streak' },
                { command: 'help', description: 'Bantuan penggunaan bot' }
            ]);

            await this.bot.telegram.setChatMenuButton({
                menuButton: {
                    type: 'web_app',
                    text: '🚀 Buka Web App',
                    web_app: { url: 'https://quranpulse.my' }
                }
            });
        } catch (e) {
            console.warn("Failed to set commands:", e);
        }

        this.bot.start(async (ctx) => {
            const { data: profile } = await supabase
                .from('profiles')
                .select('name')
                .eq('telegram_id', ctx.from.id)
                .single();

            const welcomeMsg = `✨ **Ahlan Wa Sahlan, ${ctx.from.first_name}!** ✨\n\n` +
                `Saya adalah **Ustazah AI 2.0**.\n` +
                (profile ? `✅ Akaun dihubungkan: ${profile.name}` : `⚠️ Akaun belum dihubungkan. /link [email]`);

            await ctx.reply(welcomeMsg, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('🌟 Teroka Topik Ilmu', 'explore_topics')],
                    [Markup.button.url('🎓 Jom Belajar IQRA', 'https://quranpulse.my/iqra')]
                ])
            });
        });

        // Simplified Logic for Server Refactor (Detailed logic can be ported identically)
        this.bot.action('explore_topics', (ctx) => {
             ctx.editMessageCaption(`📚 **Pilih Topik Ilmu:**`, Markup.inlineKeyboard([
                 [Markup.button.callback('🤲 Doa', 'topic_doa'), Markup.button.callback('⚖️ Fekah', 'topic_fekah')]
             ]));
        });

        this.bot.action(/topic_(.*)/, async (ctx) => {
            const topic = ctx.match[1].toUpperCase();
            await ctx.answerCbQuery();
            await ctx.reply(`Topik: ${topic}. Sedang menjana...`);
            const answer = await askUstazAI([{ role: 'user', content: `Beri tazkirah ringkas tentang ${topic}` }]);
            await ctx.reply(answer, { parse_mode: 'Markdown' });
        });

        this.bot.on('photo', async (ctx) => {
            const photo = ctx.message.photo[ctx.message.photo.length - 1];
            const link = await this.bot.telegram.getFileLink(photo.file_id);
            const response = await axios.get(link.href, { responseType: 'arraybuffer' });
            const base64Image = Buffer.from(response.data).toString('base64');
            const analysis = await analyzeImage(base64Image, "Analisis gambar ini dari sudut Islam.");
            await ctx.reply(analysis);
        });

        this.bot.on('text', async (ctx) => {
            const question = ctx.message.text;
            if (question.startsWith('/')) return; // Ignore commands

            await ctx.sendChatAction('typing');
            const answer = await askUstazAI([{ role: 'user', content: question }]);
            await ctx.reply(answer, { parse_mode: 'Markdown' });

            // Voice
            if (answer.length < 300) {
                 const audioBuffer = await VoiceService.generateVoice(answer.replace(/\[.*?\]\(.*?\)/g, ''));
                 if (audioBuffer) await ctx.sendVoice({ source: audioBuffer });
            }
        });

        this.bot.launch();
        console.log("✅ Ustazah AI Telegram is ONLINE!");

        process.once('SIGINT', () => this.bot.stop('SIGINT'));
        process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
    }
}
