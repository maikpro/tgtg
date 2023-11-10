import { Telegraf, Telegram } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { UpdateType } from 'telegraf/typings/telegram-types';

export class TelegramBotService {
    private telegramBot: Telegram;
    private chatId: string;

    constructor() {
        this.telegramBot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!).telegram;
        this.chatId = process.env.CHAT_ID!;
    }

    public sendMessage(message: string): void {
        this.telegramBot.sendMessage(this.chatId, `${message}`);
    }

    public async hearsHi(): Promise<void> {
        let allowedUpdates: UpdateType[] = ['message'];
        let updates: Update[] = await this.telegramBot.getUpdates(0, 100, 10, allowedUpdates);

        console.log(updates);
    }
}
