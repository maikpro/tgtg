import 'dotenv/config';
import { InfoService } from './services/info-service';
import { TgtgClient } from './models/TgtgClient';
import { AuthResponse } from './models/AuthResponse';
import { sleep } from './utils/sleep';
import { TelegramBotService } from './services/telegram-bot-service';

const tgtgClient = new TgtgClient();
const telegramBotService = new TelegramBotService();

const itemIDsSend = new Map<string, number>();

export async function main() {
    //await telegramBotService.hearsHi();

    if (!tgtgClient.getToken) {
        // first start needs a login...

        InfoService.info();

        const authResponse: AuthResponse = await tgtgClient.login();
        if (!authResponse.polling_id) {
            console.error('No polling_id found!');
            return;
        }

        // sleep to verify email
        const sleepTimeSec = 30;

        console.log(
            `Check your email ('${process.env.YOUR_EMAIL}') to verify the login. You have ${sleepTimeSec} Seconds! (Mailbox on mobile won't work, if you have installed tgtg app.) ;D`,
        );

        await sleep(sleepTimeSec * 1000);

        await tgtgClient.authByRequestPollingId(authResponse.polling_id);
        telegramBotService.sendMessage(`👋🏻🐻 BreadBot started...`);
    } else {
        // after first login
        if (!tgtgClient.isTokenValid()) {
            console.log(`${InfoService.dateTimeNow()} Token will be refreshed...`);
            telegramBotService.sendMessage(`🔁 Token will be refreshed...`);
            await tgtgClient.refreshToken();
        }
    }

    console.log(`${InfoService.dateTimeNow()} Crawling started...`);
    const posts = await tgtgClient.getFavoriteItems();
    posts.forEach((post) => {
        //console.log(JSON.stringify(post));
        const isMessageAlreadySaved = itemIDsSend.has(post.item.item_id);
        if (post.items_available > 0 && !isMessageAlreadySaved) {
            console.log(
                `${InfoService.dateTimeNow()} I've found some 🍞🥳 @${post.display_name} - 🔹Quantity: ${
                    post.items_available
                }`,
            );

            // send message to telegram chat but every 30min updates!
            telegramBotService.sendMessage(
                `New 🍞 in ${post.display_name} - 🔹Quantity: ${post.items_available}
                https://share.toogoodtogo.com/item/${post.item.item_id}`,
            );

            // save item to prevent from sending again every 30s...
            itemIDsSend.set(post.item.item_id, Date.now());
        }

        // clean up
        const timeSaved = itemIDsSend.get(post.item.item_id);
        if (timeSaved && Date.now() >= timeSaved + 30 * 60 * 1000) {
            console.log(`${InfoService.dateTimeNow()} [${post.items_available}} deleted...`);
            itemIDsSend.delete(post.item.item_id);
            telegramBotService.sendMessage(`🚮 Cleaned up the saved items...`);
        }
    });

    // Polling...
    await new Promise((resolve) => setTimeout(resolve, parseInt(process.env.CRAWLING_INTERVAL!) * 1000));
    main();
}
main();
