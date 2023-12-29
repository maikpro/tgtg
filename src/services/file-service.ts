import * as fsPromise from 'fs/promises';
import * as fs from 'fs';

export class FileService {
    public static async writeFile(filePath: string, filename: string, content: any): Promise<void> {
        try {
            await this.checkDirectory(filePath);
            await fsPromise.writeFile(`${filePath}/${filename}`, content);
        } catch (e: unknown) {
            console.error(`could not write ${filename}. Reason: ${e}`);
        }

        console.log(`created ${filename}`);
    }

    public static async writeJSONFile(filePath: string, filename: string, content: any): Promise<void> {
        try {
            await this.checkDirectory(filePath);
            await fsPromise.writeFile(`${filePath}/${filename}`, JSON.stringify(content));
        } catch (e: unknown) {
            console.error(`could not write ${filename}. Reason: ${e}`);
        }

        console.log(`created ${filename}`);
    }

    public static async readFile(filePath: string, filename: string): Promise<any> {
        let readContent: string | null = null;
        try {
            readContent = await fsPromise.readFile(`${filePath}/${filename}`, 'utf-8');
        } catch (e: unknown) {
            console.error(`cannot read ${filename}. Reason: ${e}`);
        }
        return readContent;
    }

    public static async readJSONFile(filePath: string, filename: string): Promise<any> {
        const readContent = await this.readFile(filePath, filename);
        if (readContent) {
            return JSON.parse(readContent);
        }
        return null;
    }

    public static async checkIfFileExists(filePath: string, filename: string): Promise<boolean> {
        let result: boolean = false;
        try {
            await fsPromise.access(`${filePath}/${filename}`, fsPromise.constants.F_OK);
            result = true;
        } catch (e: unknown) {
            console.error(`cannot access ${filename}. Reason: ${e}`);
            result = false;
        }
        return result;
    }

    public static async deleteFile(filename: string): Promise<void> {
        try {
            await fsPromise.unlink(filename);
            console.log(`File ${filename} has been deleted.`);
        } catch (err: unknown) {
            console.error(err);
        }
    }

    private static async checkDirectory(filePath: string) {
        if (!fs.existsSync(filePath)) {
            await fsPromise.mkdir(filePath, { recursive: true });
        }
    }
}
