import { Telegraf, Telegram } from 'telegraf';
import { UpdateType } from 'telegraf/typings/telegram-types';
import { Message, Update } from 'typegram';

export class TelegramBotService {
    private telegramBot: Telegram;
    private chatId: string;
    private sentMessagesQueue: Map<number, string>;

    constructor() {
        this.telegramBot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!).telegram;
        this.chatId = process.env.CHAT_ID!;
        this.sentMessagesQueue = new Map<number, string>();
    }

    public sendMessage(message: string): void {
        this.telegramBot.sendMessage(this.chatId, `${message}`);
    }

    public async listenForCommands(): Promise<void> {
        let allowedUpdates: UpdateType[] = ['message'];
        let updates: Update[] = await this.telegramBot.getUpdates(0, 100, 10, allowedUpdates);
        const messageUpdate = updates[updates.length - 1] as Update.MessageUpdate;
        const textMessage = messageUpdate.message as Message.TextMessage;
        const isMessageAlreadySent = this.sentMessagesQueue.has(messageUpdate.update_id);
        if (textMessage.text === '!health' && !isMessageAlreadySent) {
            this.sendMessage("I'm alive! 🥳💚");
            this.sentMessagesQueue.set(messageUpdate.update_id, textMessage.text);
        }
    }
}
