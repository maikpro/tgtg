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
    console.log(
        `Check your email ('${process.env.YOUR_EMAIL}') to verify the login. You have 30 Seconds! (Mailbox on mobile won't work, if you have installed tgtg app.) ;D`,
    );
    await sleep(20 * 1000);

    const token: Token = await tgtgClient.authByRequestPollingId(
        authResponse.polling_id,
    );

    console.log(token);

    const res = await tgtgClient.getFavoriteItems();
    console.log(res);
}

main();
