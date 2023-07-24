export class RestClientService {
    public static async postForJson<Type>(url: string, headers: HeadersInit, body: any): Promise<Type> {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                console.error(`${response.status} - ${response.text}`);
                throw new Error('Response failed!');
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    public static async postForResponse(url: string, headers: HeadersInit, body: any): Promise<Response> {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                console.error(`${response.status} - ${response.text}`);
                throw new Error('Response failed!');
            }
            return response;
        } catch (error) {
            throw error;
        }
    }
}
