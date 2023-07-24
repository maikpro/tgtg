import 'dotenv/config';
import { InfoService } from './services/info-service';
import { TgtgClient } from './models/TgtgClient';
import { AuthResponse } from './models/AuthResponse';
import { sleep } from './utils/sleep';
import { TelegramBotService } from './services/telegram-bot-service';

const tgtgClient = new TgtgClient();
const telegramBotService = new TelegramBotService();

export async function main() {
    if (!tgtgClient.getToken) {
        // first start needs a login...

        InfoService.info();

        const authResponse: AuthResponse = await tgtgClient.login();
        if (!authResponse.polling_id) {
            console.error('No polling_id found!');
            return;
        }

        // sleep to verify email
        const sleepTimeSec = 20;

        console.log(
            `Check your email ('${process.env.YOUR_EMAIL}') to verify the login. You have ${sleepTimeSec} Seconds! (Mailbox on mobile won't work, if you have installed tgtg app.) ;D`,
        );

        await sleep(sleepTimeSec * 1000);

        await tgtgClient.authByRequestPollingId(authResponse.polling_id);
    } else {
        // after first login
        console.log(`${InfoService.dateTimeNow()} Crawling again...`);

        if (!tgtgClient.isTokenValid()) {
            console.log(`${InfoService.dateTimeNow()} Token will be refreshed...`);
            await tgtgClient.refreshToken();
        }
    }
    const posts = await tgtgClient.getFavoriteItems();

    posts.forEach((post) => {
        console.log(post.display_name, post.items_available);
        if (post.items_available > 0) {
            // send message to telegram chat!
        }
    });

    telegramBotService.start();
}

main();
sleep(5000);
setInterval(() => main(), parseInt(process.env.CRAWLING_INTERVAL!) * 1000);
