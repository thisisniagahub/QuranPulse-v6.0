import './env-loader.ts'; // Must be first
import { WhatsappService } from '../src/services/whatsappService.ts';
import { TelegramService } from '../src/services/telegramService.ts';

// 3. Start the Bot
async function main() {
    console.log("🚀 Starting Tok Imam Multi-Channel Bot Service...");
    
    // Start WhatsApp
    new WhatsappService();
    
    // Start Telegram
    new TelegramService();
}

main().catch(console.error);
