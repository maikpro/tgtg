import { RestClientService } from '../services/rest-client-service';
import { AuthResponse } from './AuthResponse';
import { Post } from './Post';
import { Token } from './Token';

export class TgtgClient {
    private baseUrl: string;
    private emailAuthUrl: string;
    private requestPollingIdUrl: string;
    private refreshUrl: string;

    private itemsUrl: string;

    private email: string;
    private deviceType: string;
    private token: Token | null = null;
    private cookie?: any;

    constructor() {
        const baseUrl = process.env.BASE_URL;
        const authEmail = process.env.AUTH_EMAIL;
        const requestPollingIdUrl = process.env.REQUEST_POLLING_ID_URL;
        const refreshUrl = process.env.REFRESH_URL;
        const itemsUrlEnv = process.env.ITEMS_URL;
        const yourEmail = process.env.YOUR_EMAIL!;

        if (!baseUrl) throw 'Define your BASE_URL inside .env file!';
        if (!authEmail) throw 'Define your AUTH_EMAIL inside .env file!';
        if (!requestPollingIdUrl) throw 'Define your REQUEST_POLLING_ID_URL inside .env file!';
        if (!refreshUrl) throw 'Define your REFRESH_URL inside .env file!';
        if (!itemsUrlEnv) throw 'Define your ITEMS_URL inside .env file!';
        if (!yourEmail) throw 'Define your YOUR_EMAIL inside .env file!';

        this.baseUrl = baseUrl;
        this.emailAuthUrl = this.baseUrl + authEmail;
        this.requestPollingIdUrl = this.baseUrl + requestPollingIdUrl;
        this.refreshUrl = this.baseUrl + refreshUrl;

        this.itemsUrl = this.baseUrl + itemsUrlEnv;

        this.email = yourEmail;
        this.deviceType = 'IOS';
    }

    private get getHeaders(): any {
        const headers: any = {
            'User-Agent': 'TooGoodToGo/21.9.0 (813) (iPhone/iPhone 7 (GSM); iOS 15.1; Scale/2.00)',
            'Content-Type': 'application/json; charset=utf-8',
            Accept: 'application/json',
            'Accept-Language': 'en-US',
            'Accept-Encoding': 'gzip',
        };

        if (this.cookie) {
            headers['Cookie'] = this.cookie;
        }

        if (this.token && this.token.access_token) {
            headers['Authorization'] = `Bearer ${this.token.access_token}`;
        }

        return headers;
    }

    public get getToken(): Token | null {
        return this.token;
    }

    public setToken(token: Token): void {
        this.token = token;
    }

    public get getCookie(): any {
        return this.cookie;
    }

    public setCookie(cookie: any): void {
        this.cookie = cookie;
    }

    /**
     * sends an email to your email. Open this email with its link on your computer to verify the login.
     */
    public async login(): Promise<AuthResponse> {
        return await RestClientService.postForJson<AuthResponse>(this.emailAuthUrl, this.getHeaders, {
            device_type: this.deviceType,
            email: this.email,
        });
    }

    public async authByRequestPollingId(polling_id: string): Promise<void> {
        const response = await RestClientService.postForResponse(this.requestPollingIdUrl, this.getHeaders, {
            device_type: this.deviceType,
            email: this.email,
            request_polling_id: polling_id,
        });
        const responseJson = await response.json();
        this.token = this.createToken(responseJson);
        this.cookie = response.headers.get('Set-Cookie');
    }

    private createToken(responseJson: any): Token {
        return {
            access_token: responseJson.access_token,
            refresh_token: responseJson.refresh_token,
            created_at: Date.now(),
            lifetime: responseJson.access_token_ttl_seconds * 1000,
            user_id: responseJson?.startup_data.user.user_id,
        };
    }

    public async refreshToken(): Promise<void> {
        try {
            const response = await RestClientService.postForResponse(this.refreshUrl, this.getHeaders, {
                refresh_token: this.token?.refresh_token,
            });
            const responseJson = await response.json();
            this.token = this.createToken(responseJson);
            this.cookie = response.headers.get('Set-Cookie');
        } catch (e: unknown) {
            console.error(e);
        }
    }

    public isTokenValid(): boolean {
        if (!this.token) {
            return false;
        }
        return Date.now() - this.token.created_at <= this.token.lifetime;
    }

    public async getFavoriteItems(): Promise<Post[]> {
        return (
            await RestClientService.postForJson<any>(this.itemsUrl, this.getHeaders, {
                favorites_only: true,
                origin: {
                    latitude: 0.0,
                    longitude: 0.0,
                },
                radius: 20,
                user_id: this.token?.user_id,
            })
        )['items'];
    }

    public async getFavoriteItemsById(id: string): Promise<Post> {
        return await RestClientService.postForJson<any>(`${this.itemsUrl}/${id}`, this.getHeaders, {
            user_id: this.token?.user_id,
        });
    }
}
