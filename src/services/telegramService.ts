import { Telegraf, Markup } from 'telegraf';
import { askUstazAI, analyzeImage } from './aiService';
import axios from 'axios';
import type { ChatMessage } from '../types';
import { VoiceService } from './ai/VoiceService';
import { supabase } from '../lib/supabase';

import { Server } from 'socket.io';

export class TelegramService {
    private bot!: Telegraf;
    private io?: Server;

    constructor(io?: Server) {
        this.io = io;
        const token = process.env.TELEGRAM_BOT_TOKEN;
        if (!token) {
            console.warn("⚠️ Telegram Bot Token missing! Telegram bot disabled.");
            if (this.io) this.io.emit('telegram_status', { ready: false, error: 'MISSING_TOKEN' });
            return;
        }

        this.bot = new Telegraf(token);
        this.initialize();
    }

    private async initialize() {
        console.log("🧕 Ustazah AI: Initializing Telegram Bot...");

        // 0. Set Bot Commands for UX
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

            // 0.1 Set Menu Button (Direct Web App Access)
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

        // 1. Start Command (Ultra-Gempak Welcome)
        this.bot.start(async (ctx) => {
            // Check if user is linked
            const { data: profile } = await supabase
                .from('profiles')
                .select('name')
                .eq('telegram_id', ctx.from.id)
                .single();

            const welcomeMsg = `✨ **Ahlan Wa Sahlan, ${ctx.from.first_name}!** ✨\n\n` +
                `Saya adalah **Ustazah AI 2.0**, teman digital anda dalam perjalanan menuju keredhaan-Nya. 🤍\n\n` +
                (profile
                    ? `✅ **Akaun anda telah dihubungkan!** Selamat kembali, ${profile.name}. Kemajuan anda sedang dipantau secara global. 🔥\n\n`
                    : `⚠️ **Akaun tidak dihubungkan.** Gunakan arahan /link [email] untuk menyambung dengan Web App supaya XP & Streak anda tidak hilang! 🔗\n\n`) +
                `**Apa yang boleh saya bantu hari ini?**\n` +
                `• 📖 **Tadabbur Al-Quran**: Tanya tentang mana-mana ayat.\n` +
                `• 🕌 **Hukum Fekah**: Kemusykilan solat, puasa, dll.\n` +
                `• 📸 **Vision-X**: Hantar gambar bahan makanan/ayat Quran.\n` +
                `• 🎙️ **Voice Note**: Saya akan menjawab dengan suara yang lembut.\n\n` +
                `Pilih menu di bawah atau terus bertanya! 👇`;

            await ctx.replyWithPhoto('https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1000&auto=format&fit=crop', {
                caption: welcomeMsg,
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('🌟 Teroka Topik Ilmu', 'explore_topics')],
                    [Markup.button.url('🎓 Jom Belajar IQRA', 'https://quranpulse.my/iqra')],
                    [Markup.button.url('📖 Buka Mushaf Digital', 'https://quranpulse.my/quran')],
                    [Markup.button.url('🕌 Waktu Solat & Kiblat', 'https://quranpulse.my/ibadah')],
                    [Markup.button.url('💚 Jom Infaq Digital', 'https://quranpulse.my/barakah')]
                ])
            });
        });

        // 1.5 Topic Explorer Callback
        this.bot.action('explore_topics', (ctx) => {
            ctx.editMessageCaption(`📚 **Pilih Topik Ilmu yang ingin anda teroka:**`, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('🤲 Koleksi Doa', 'topic_doa'), Markup.button.callback('⚖️ Fekah Ibadah', 'topic_fekah')],
                    [Markup.button.callback('🌱 Akhlak & Tazkirah', 'topic_akhlak'), Markup.button.callback('🛡️ Akidah', 'topic_akidah')],
                    [Markup.button.callback('⬅️ Kembali', 'main_menu')]
                ])
            });
        });

        this.bot.action('main_menu', async (ctx) => {
            const welcomeMsg = `✨ **Menu Utama Ustazah AI** ✨\n\n` +
                `Saya sedia membantu anda mendalami ilmu agama dengan santun dan bijaksana.`;
            await ctx.editMessageCaption(welcomeMsg, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('🌟 Teroka Topik Ilmu', 'explore_topics')],
                    [Markup.button.url('📖 Buka Mushaf Digital', 'https://quranpulse.my/quran')],
                    [Markup.button.url('🕌 Waktu Solat & Kiblat', 'https://quranpulse.my/ibadah')],
                    [Markup.button.url('💚 Jom Infaq Digital', 'https://quranpulse.my/barakah')]
                ])
            });
        });

        // 1.6 Specific Topic Handlers
        this.bot.action(/topic_(.*)/, async (ctx) => {
            const topic = ctx.match[1].toUpperCase();
            await ctx.answerCbQuery();
            await ctx.reply(`Anda telah memilih topik **${topic}**. Tunggu sebentar, Ustazah sedang menyiapkan nota ringkas untuk anda... 📝`);

            const systemPrompt = `Anda adalah Ustazah AI. Berikan satu pesanan ringkas, padat dan sangat menyentuh hati tentang topik ${topic} (kurang 30 patah perkataan). Akhiri dengan satu soalan untuk pengguna. JANGAN guna JSON, beri teks SAHAJA.`;
            const answer = await askUstazAI([{ id: '1', role: 'system', content: systemPrompt, timestamp: Date.now() }]);
            await ctx.reply(answer, { parse_mode: 'Markdown' });
        });

        // 2. Command Handlers
        this.bot.command('help', (ctx) => {
            ctx.replyWithMarkdown(
                `**Panduan Penggunaan Ustazah AI**\n\n` +
                `• Taip soalan terus untuk bertanya (cth: "Cara solat dhuha?")\n` +
                `• Gunakan /quran untuk akses mushaf digital.\n` +
                `• Gunakan /solat untuk jadual waktu solat terkini.\n` +
                `• Gunakan /infaq untuk menyumbang ke tabung kebajikan.\n\n` +
                `Ustazah sedia membantu 24/7. InshaAllah.`
            );
        });

        this.bot.command('quran', (ctx) => {
            ctx.reply("Buka Al-Quran Digital QuranPulse:", Markup.inlineKeyboard([
                [Markup.button.url('📖 Jom Baca', 'https://quranpulse.my/quran')]
            ]));
        });

        this.bot.command('solat', (ctx) => {
            ctx.reply("Semak Waktu Solat & Arah Kiblat:", Markup.inlineKeyboard([
                [Markup.button.url('🕌 Semak Sekarang', 'https://quranpulse.my/ibadah')]
            ]));
        });

        this.bot.command('infaq', (ctx) => {
            ctx.reply("Keberkatan bermula di sini. Jom berinfaq:", Markup.inlineKeyboard([
                [Markup.button.url('💚 Infaq Sekarang', 'https://quranpulse.my/barakah')]
            ]));
        });

        // 3. Callback Handlers
        this.bot.action('ask_ai', (ctx) => {
            ctx.reply("Silakan... Tanya saja apa-apa soalan di bawah. Saya akan cuba menjawab sebaik mungkin. 😊");
        });

        this.bot.command('link', async (ctx) => {
            const email = ctx.message.text.split(' ')[1];
            if (!email) {
                return ctx.reply("Sila masukkan email anda. Contoh: `/link user@example.com`", { parse_mode: 'Markdown' });
            }

            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            try {
                const { error } = await supabase.from('pending_bot_links').insert({
                    telegram_id: ctx.from.id,
                    email: email.toLowerCase(),
                    otp: otp
                });

                if (error) throw error;

                await ctx.reply(`🛡️ **Proses Integrasi Dimulakan**\n\n` +
                    `Kod pengesahan (OTP) telah dijana. Sila masukkan kod ini menggunakan arahan /verify.\n\n` +
                    `**KOD ANDA: ${otp}**\n\n` +
                    `_Nota: Dalam fasa percubaan ini, kod dipaparkan terus di sini. Di masa hadapan, kod akan dihantar ke email anda._`, { parse_mode: 'Markdown' });

            } catch (err) {
                await ctx.reply("Maaf, gagal memulakan proses integrasi. Sila pastikan email anda sah.");
            }
        });

        this.bot.command('verify', async (ctx) => {
            const otp = ctx.message.text.split(' ')[1];
            if (!otp) {
                return ctx.reply("Sila masukkan kod OTP. Contoh: `/verify 123456`", { parse_mode: 'Markdown' });
            }

            try {
                // 1. Check OTP
                const { data: linkData, error: linkError } = await supabase
                    .from('pending_bot_links')
                    .select('*')
                    .eq('telegram_id', ctx.from.id)
                    .eq('otp', otp)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (linkError || !linkData) {
                    return ctx.reply("❌ Kod OTP tidak sah atau telah tamat tempoh.");
                }

                // 2. Link to Profile
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ telegram_id: ctx.from.id })
                    .eq('email', linkData.email);

                if (updateError) throw updateError;

                // 3. Cleanup
                await supabase.from('pending_bot_links').delete().eq('telegram_id', ctx.from.id);

                // 4. Trace interaction for streak
                await supabase.from('bot_interactions').insert({
                    telegram_id: ctx.from.id,
                    action_type: 'ACCOUNT_LINKED'
                });

                await ctx.reply("✅ **Taniah!** Akaun anda telah berjaya dihubungkan.\n\nKini XP, Streak, dan kemajuan pembelajaran anda akan dikongsi antara Telegram dan Web App QuranPulse. 🚀", { parse_mode: 'Markdown' });

            } catch (err) {
                await ctx.reply("Maaf, ralat berlaku semasa pengesahan.");
            }
        });

        this.bot.command('profil', async (ctx) => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select(`name, xp_total, level, streak, badges`)
                    .eq('telegram_id', ctx.from.id)
                    .single();

                if (error || !data) {
                    return ctx.reply("Akaun anda belum dihubungkan. Gunakan /link [email] untuk bermula.");
                }

                const profileMsg = `👤 **Profil QuranPulse - ${data.name}**\n\n` +
                    `⭐ **Level**: ${data.level}\n` +
                    `✨ **XP**: ${data.xp_total}\n` +
                    `🔥 **Streak**: ${data.streak} Hari\n` +
                    `🏅 **Badges**: ${data.badges?.length || 0} Diperolehi\n\n` +
                    `Teruskan istiqamah dalam ketaatan! 🕌`;

                await ctx.reply(profileMsg, { parse_mode: 'Markdown' });

            } catch (err) {
                await ctx.reply("Gagal mengambil data profil.");
            }
        });

        this.bot.command('leaderboard', async (ctx) => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('name, xp_total')
                    .order('xp_total', { ascending: false })
                    .limit(5);

                if (error || !data) throw error;

                let board = "🏆 **Leaderboard Global QuranPulse**\n\n";
                data.forEach((user, index) => {
                    const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "👤";
                    board += `${medal} ${user.name}: ${user.xp_total} XP\n`;
                });

                board += "\n_Jom kumpul XP dengan belajar IQRA!_ 🚀";
                await ctx.reply(board, { parse_mode: 'Markdown' });

            } catch (err) {
                await ctx.reply("Gagal memuatkan papan pendahulu.");
            }
        });

        this.bot.command('badges', async (ctx) => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('badges')
                    .eq('telegram_id', ctx.from.id)
                    .single();

                if (error || !data) return ctx.reply("Akaun belum dihubungkan atau tiada lencana lagi.");

                const badges = data.badges as any[];
                if (!badges || badges.length === 0) {
                    return ctx.reply("🏅 Anda belum mempunyai lencana lagi. Selesaikan pelajaran IQRA untuk mendapatkannya!");
                }

                let msg = "🏅 **Peti Lencana Anda**\n\n";
                badges.forEach(b => {
                    msg += `✨ **${b.name}**: ${b.description}\n`;
                });

                await ctx.reply(msg, { parse_mode: 'Markdown' });
            } catch (err) {
                await ctx.reply("Gagal mengambil data lencana.");
            }
        });

        this.bot.command('iqra', async (ctx) => {
            await ctx.reply("🎓 **Akademi IQRA Digital**\n\nSedia untuk cabaran hari ini? Klik butang di bawah untuk mula belajar dan kumpul XP!", {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.url('🎓 Buka IQRA Mini App', 'https://quranpulse.my/iqra')]
                ])
            });
        });

        // 4. Vision-X Handler (Photo Analysis)
        this.bot.on('photo', async (ctx) => {
            const name = ctx.from.first_name;
            const photo = ctx.message.photo[ctx.message.photo.length - 1]; // Get highest resolution

            console.log(`📸 [TG] Received photo from ${name}`);

            try {
                // 1. Show processing status
                await ctx.reply("Ustazah sedang melihat gambar anda... Tunggu sebentar ya. 🧐");
                await ctx.sendChatAction('typing');

                // 2. Get file link from Telegram
                const link = await this.bot.telegram.getFileLink(photo.file_id);

                // 3. Download image
                const response = await axios.get(link.href, { responseType: 'arraybuffer' });
                const base64Image = Buffer.from(response.data).toString('base64');

                // 4. Analyze with Vision AI
                const prompt = `
Anda adalah Ustazah AI. Analisis gambar ini dangan teliti. 
- Jika ia senarai bahan (ingredients), beritahu jika ada bahan yang meragukan (Halal Check).
- Jika ia ayat Quran, berikan Tafsir ringkas.
- Jika ia benda lain, berikan nasihat Islamik yang relevan.
Jawab dalam Bahasa Melayu yang sopan.
`;
                const analysis = await analyzeImage(base64Image, prompt);

                // 5. Reply
                await ctx.reply(analysis, { parse_mode: 'Markdown' });

                // 6. Log Interaction
                await supabase.from('bot_interactions').insert({
                    telegram_id: ctx.from.id,
                    action_type: 'VISION_X_SCAN'
                });

                console.log(`📤 [TG] Sent Vision Analysis to ${name}`);

            } catch (error) {
                console.error("❌ [TG] Vision Error:", error);
                await ctx.reply("Maaf, Ustazah gagal memproses gambar tersebut. Sila pastikan gambar jelas.");
            }
        });

        // 5. Main AI Text Handler
        this.bot.on('text', async (ctx) => {
            const question = ctx.message.text;
            const name = ctx.from.first_name;

            console.log(`📩 [TG] New Message from ${name}: ${question.substring(0, 50)}...`);

            try {
                // Show "typing" status
                await ctx.sendChatAction('typing');

                const systemPrompt = `
ROLE: Anda adalah "Ustazah AI" di Telegram, seorang pembantu digital yang lemah lembut, bijaksana dan sopan.
GOAL: Jawab soalan pengguna secara berhemah.
IMPORTANT: JANGAN letak link di setiap ayat.
STRATEGI JAWAPAN:
1. Mulakan dengan salam/panggilan sopan.
2. Jawab dengan padat.
3. Rujuk kepada Widget jika perlu.
`;

                const history: ChatMessage[] = [
                    { id: '1', role: 'system', content: systemPrompt, timestamp: Date.now() },
                    { id: '2', role: 'user', content: `Nama: ${name}\nSoalan: ${question}`, timestamp: Date.now() }
                ];

                const answer = await askUstazAI(history);

                // --- LOGIC BARU: Link at End & Widget Parsing ---

                let cleanAnswer = answer;
                let widgetData = null;

                // 1. Extract Widget
                const widgetMatch = answer.match(/<<<WIDGET:(.*?)>>>/);
                if (widgetMatch) {
                    try {
                        widgetData = JSON.parse(widgetMatch[1]);
                        cleanAnswer = answer.replace(widgetMatch[0], '').trim();
                    } catch (e) {
                        console.error("Widget Parse Error", e);
                    }
                }

                // 2. Append Footer (Link at End Strategy)
                // Only append if it's not already there (standardize)
                if (!cleanAnswer.includes("quranpulse.my")) {
                    cleanAnswer += `\n\n_Untuk pengalaman penuh, layari_ [QuranPulse.my](https://quranpulse.my)`;
                }

                // 3. Send Main Text
                await ctx.reply(cleanAnswer, { parse_mode: 'Markdown' });

                // 4. Handle Specific Advanced Tools (Widgets)
                if (widgetData) {
                    if (widgetData.id === 'ZAKAT_CALC') {
                        await ctx.reply("💰 *Kalkulator Zakat Digital*\nKira zakat pendapatan anda dengan mudah:",
                            Markup.inlineKeyboard([[Markup.button.webApp("🧮 Buka Kalkulator", "https://quranpulse.my/zakat")]])
                        );
                    } else if (widgetData.id === 'PRAYER_TIMES') {
                        await ctx.reply("🕌 *Jadual Waktu Solat*\nSemak waktu solat yang tepat:",
                            Markup.inlineKeyboard([[Markup.button.url("📅 Jadual Penuh", "https://quranpulse.my/ibadah")]])
                        );
                    } else if (widgetData.id === 'IQRA_LESSON') {
                        await ctx.reply("🎓 *Sambung Belajar IQRA*\nJom kumpul XP hari ini!",
                            Markup.inlineKeyboard([[Markup.button.url("🚀 Mula Belajar", "https://quranpulse.my/iqra")]])
                        );
                    }
                }

                // C. Log Interaction to Supabase (For Global Streaks)
                await supabase.from('bot_interactions').insert({
                    telegram_id: ctx.from.id,
                    action_type: 'AI_CHAT',
                    content: question.substring(0, 200)
                });

                // B. Voice Reply (Ultra-Advanced Feature)
                // Only for short answers or if requested
                if (cleanAnswer.length < 300) {
                    const result = await VoiceService.generateVoice(cleanAnswer.replace(/\[.*?\]\(.*?\)/g, ''));
                    if (result && result.type === 'buffer' && result.data) {
                        await ctx.sendVoice({ source: Buffer.from(result.data) });
                        console.log(`🎙️ [TG] Sent Voice Reply to ${name}`);
                    }
                }

                console.log(`📤 [TG] Replied to ${name}`);

            } catch (error) {
                console.error("❌ [TG] Error:", error);
                await ctx.reply("Maaf, saya mengalami gangguan teknikal. Sila cuba sebentar lagi.");
            }
        });

        this.bot.launch();
        console.log("✅ Ustazah AI Telegram is ONLINE!");

        if (this.io) {
            this.io.emit('telegram_status', {
                ready: true,
                username: (await this.bot.telegram.getMe()).username
            });
        }

        // Enable graceful stop
        process.once('SIGINT', () => this.bot.stop('SIGINT'));
        process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
    }
}
