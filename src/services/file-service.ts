import * as fsPromise from 'fs/promises';

export class FileService {
    public static async writeFile(filename: string, content: any): Promise<void> {
        try {
            await fsPromise.writeFile(filename, content);
        } catch {
            console.log(`could not write ${filename}`);
        }

        console.log(`created ${filename}`);
    }

    public static async writeJSONFile(filename: string, content: any): Promise<void> {
        try {
            await fsPromise.writeFile(filename, JSON.stringify(content));
        } catch {
            console.log(`could not write ${filename}`);
        }

        console.log(`created ${filename}`);
    }

    public static async readFile(filename: string): Promise<any> {
        let readContent: string | null = null;
        try {
            readContent = await fsPromise.readFile(filename, 'utf-8');
        } catch {
            console.error(`cannot read ${filename}`);
        }
        return readContent;
    }

    public static async readJSONFile(filename: string): Promise<any> {
        const readContent = await this.readFile(filename);
        if (readContent) {
            return JSON.parse(readContent);
        }
        return null;
    }

    public static async checkIfFileExists(filename: string): Promise<boolean> {
        let result: boolean = false;
        try {
            await fsPromise.access(filename, fsPromise.constants.F_OK);
            result = true;
        } catch {
            console.error(`cannot access ${filename}`);
            result = false;
        }
        return result;
    }

    public static async deleteFile(filename: string): Promise<void> {
        try {
            await fsPromise.unlink(filename);
            console.log(`File ${filename} has been deleted.`);
        } catch (err) {
            console.error(err);
        }
    }
}
