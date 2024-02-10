import dotenvFlow from 'dotenv-flow';
dotenvFlow.config();
import { InfoService } from './services/info-service';
import { TgtgClient } from './models/TgtgClient';
import { AuthResponse } from './models/AuthResponse';
import { sleep } from './utils/sleep';
import { TelegramBotService } from './services/telegram-bot-service';
import { FileService } from './services/file-service';
import { TokenService } from './services/token-service';

const tgtgClient = new TgtgClient();
const telegramBotService = new TelegramBotService();

const itemIDsSend = new Map<string, number>();
const tokenFilePath = process.env.TOKEN_FILEPATH;
const tokenFilename = process.env.TOKEN_FILENAME;
const cookieFilePath = process.env.COOKIE_FILEPATH;
const cookieFilename = process.env.COOKIE_FILENAME;
const verifyInterval = process.env.VERIFY_INTERVAL;

export async function main() {
    if (!tokenFilePath) throw 'Define your filepath in TOKEN_FILEPATH inside .env file!';
    if (!tokenFilename) throw 'Define your filename in TOKEN_FILENAME inside .env file!';
    if (!cookieFilePath) throw 'Define your filepath in COOKIE_FILEPATH inside .env file!';
    if (!cookieFilename) throw 'Define your filename in COOKIE_FILENAME inside .env file!';
    if (!verifyInterval) throw 'Define your filename in VERIFY_INTERVAL inside .env file!';

    await telegramBotService.listenForCommands();

    try {
        if (!tgtgClient.getToken) {
            // check if file with token is available
            const tokenFileExists = await FileService.checkIfFileExists(tokenFilePath, tokenFilename);
            const cookieFileExists = await FileService.checkIfFileExists(cookieFilePath, cookieFilename);

            if (tokenFileExists && cookieFileExists) {
                const tokenFromFile = await FileService.readJSONFile(tokenFilePath, tokenFilename);
                tgtgClient.setToken(tokenFromFile);

                const cookieFromFile = await FileService.readFile(cookieFilePath, cookieFilename);
                tgtgClient.setCookie(cookieFromFile);

                if (!tgtgClient.isTokenValid()) {
                    console.log(`${InfoService.dateTimeNow()} Token will be refreshed...`);
                    telegramBotService.sendMessage(`🔁 Token will be refreshed...`);
                    await tgtgClient.refreshToken();
                    await FileService.writeJSONFile(tokenFilePath, tokenFilename, tgtgClient.getToken);
                    await FileService.writeFile(cookieFilePath, cookieFilename, tgtgClient.getCookie);
                } else {
                    telegramBotService.sendMessage(`👋🏻🐻 BreadBot started from file-tokens...`);
                }
            } else {
                // first start needs a login...
                InfoService.info();

                console.log('Trying to login...');

                const authResponse: AuthResponse = await tgtgClient.login();
                if (!authResponse.polling_id) {
                    console.error('No polling_id found!');
                    return;
                }

                console.log(
                    `Check your email ('${process.env.YOUR_EMAIL}') to verify the login. You have ${verifyInterval} Seconds! (Mailbox on mobile won't work, if you have installed tgtg app.) ;D`,
                );

                await sleep(parseInt(verifyInterval) * 1000);

                await tgtgClient.authByRequestPollingId(authResponse.polling_id);
                telegramBotService.sendMessage(`👋🏻🐻 BreadBot started...`);
                await FileService.writeJSONFile(tokenFilePath, tokenFilename, tgtgClient.getToken);
                await FileService.writeFile(cookieFilePath, cookieFilename, tgtgClient.getCookie);
            }
        } else {
            // after first login
            if (!tgtgClient.isTokenValid()) {
                console.log(`${InfoService.dateTimeNow()} Token will be refreshed...`);
                telegramBotService.sendMessage(`🔁 Token will be refreshed...`);
                await tgtgClient.refreshToken();
                await FileService.writeJSONFile(tokenFilePath, tokenFilename, tgtgClient.getToken);
                await FileService.writeFile(cookieFilePath, cookieFilename, tgtgClient.getCookie);
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
                    `🆕🍞 @${post.display_name} 🍞🥳 - 🔹Quantity: ${post.items_available}
                    https://share.toogoodtogo.com/item/${post.item.item_id}`,
                );

                // save item to prevent from sending again every 30s...
                itemIDsSend.set(post.item.item_id, post.items_available);
            }
        });

        // check for updates
        for (let itemID of itemIDsSend.keys()) {
            const post = await tgtgClient.getFavoriteItemsById(itemID);
            const lastAvailable = itemIDsSend.get(itemID);
            const updatedAvailable = post.items_available;
            if (lastAvailable !== updatedAvailable) {
                telegramBotService.sendMessage(
                    `🔄️[UPDATE] in ${post.display_name} - 🔹Quantity: ${post.items_available}
                    https://share.toogoodtogo.com/item/${post.item.item_id}`,
                );

                // update old value
                itemIDsSend.set(post.item.item_id, post.items_available);
            }
        }

        // Polling...
        await new Promise((resolve) => setTimeout(resolve, parseInt(process.env.CRAWLING_INTERVAL!) * 1000));
        await main();
    } catch (e) {
        console.error(e);

        console.log('Trying to clean up...');

        await TokenService.deleteTokens();
        tgtgClient.setToken(null);

        // on error restart after 30mins...
        await new Promise((resolve) => setTimeout(resolve, 30 * 60 * 1000));
        await main();
    }
}

main();
