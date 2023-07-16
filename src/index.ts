import 'dotenv/config';
import { InfoService } from './services/info-service';
import { TgtgClient } from './models/TgtgClient';
import { AuthResponse } from './models/AuthResponse';
import { sleep } from './utils/sleep';
import { Token } from './models/Token';

export async function main() {
    InfoService.info();

    const tgtgClient = new TgtgClient();

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

    const res = await tgtgClient.getFavoriteItems();
    console.log(res);
}

main();
