import { FileService } from './file-service';

export class TokenService {
    public static async deleteTokens() {
        const tokenFilePath = process.env.TOKEN_FILEPATH;
        const tokenFilename = process.env.TOKEN_FILENAME;
        const cookieFilePath = process.env.COOKIE_FILEPATH;
        const cookieFilename = process.env.COOKIE_FILENAME;

        if (!tokenFilePath) throw 'Define your filepath in TOKEN_FILEPATH inside .env file!';
        if (!tokenFilename) throw 'Define your filename in TOKEN_FILENAME inside .env file!';
        if (!cookieFilePath) throw 'Define your filepath in COOKIE_FILEPATH inside .env file!';
        if (!cookieFilename) throw 'Define your filename in COOKIE_FILENAME inside .env file!';

        const tokenFileExists = await FileService.checkIfFileExists(tokenFilePath, tokenFilename);
        const cookieFileExists = await FileService.checkIfFileExists(cookieFilePath, cookieFilename);

        if (tokenFileExists) {
            console.log(`Deleting ${tokenFilename}...`);
            FileService.deleteFile(tokenFilename);
        }

        if (cookieFileExists) {
            console.log(`Deleting ${cookieFilename}...`);
            FileService.deleteFile(cookieFilename);
        }
    }
}
