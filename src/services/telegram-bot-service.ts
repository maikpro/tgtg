import { Telegraf, Telegram } from 'telegraf';

export class TelegramBotService {
    private telegramBot: Telegram;
    private chatId: string;

    constructor() {
        this.telegramBot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!).telegram;
        this.chatId = process.env.CHAT_ID!;
    }

    public start() {
        this.telegramBot.sendMessage(this.chatId, 'Hello World!');
    }
}
