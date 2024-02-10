import { Telegraf, Telegram } from 'telegraf';
import { UpdateType } from 'telegraf/typings/telegram-types';
import { Message, Update } from 'typegram';
import { TokenService } from './token-service';

export class TelegramBotService {
    private telegramBot: Telegram;
    private chatId: string;
    private sentMessagesQueue: Map<number, string>;
    // on Server start dont read chat... to stop strange behaviour on !deleteTokens
    private isFirstStart = true;

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
        if (messageUpdate) {
            const textMessage = messageUpdate.message as Message.TextMessage;
            const isMessageAlreadySent = this.sentMessagesQueue.has(messageUpdate.update_id);

            if (this.isFirstStart) {
                console.log('skip telegram-messages before start');
                this.sentMessagesQueue.set(messageUpdate.update_id, textMessage.text);
                this.isFirstStart = false;
            }

            if (textMessage.text === '!health' && !isMessageAlreadySent) {
                this.sendMessage("I'm alive! 🥳💚");
                this.sentMessagesQueue.set(messageUpdate.update_id, textMessage.text);
            }

            if (textMessage.text === '!deleteTokens' && !isMessageAlreadySent) {
                this.sendMessage('Tokens will be deleted now... 🚮');
                await TokenService.deleteTokens();
                this.sentMessagesQueue.set(messageUpdate.update_id, textMessage.text);
            }

            if (textMessage.text === '!cmds' && !isMessageAlreadySent) {
                this.sendMessage('!health, !deleteTokens');
                this.sentMessagesQueue.set(messageUpdate.update_id, textMessage.text);
            }
        }
    }
}
