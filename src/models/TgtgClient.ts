import { RestClientService } from '../services/rest-client-service';
import { AuthResponse } from './AuthResponse';
import { Post } from './Post';
import { Token } from './Token';

export class TgtgClient {
    private baseUrl: string;
    private emailAuthUrl: string;
    private requestPollingIdUrl: string;
    private itemsUrl: string;

    private email: string;
    private deviceType: string;
    private token?: Token;
    private cookie?: any;

    constructor() {
        this.baseUrl = process.env.BASE_URL!;
        this.emailAuthUrl = this.baseUrl + process.env.AUTH_EMAIL!;
        this.requestPollingIdUrl =
            this.baseUrl + process.env.REQUEST_POLLING_ID_URL!;
        this.itemsUrl = this.baseUrl + process.env.ITEMS_URL!;

        this.email = process.env.YOUR_EMAIL!;
        this.deviceType = 'IOS';
    }

    private getHeaders(): any {
        const headers: any = {
            'User-Agent':
                'TooGoodToGo/21.9.0 (813) (iPhone/iPhone 7 (GSM); iOS 15.1; Scale/2.00)',
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

    /**
     * sends an email to your email. Open this email with its link on your computer to verify the login.
     */
    public async login(): Promise<AuthResponse> {
        return await RestClientService.postForJson<AuthResponse>(
            this.emailAuthUrl,
            this.getHeaders(),
            {
                device_type: this.deviceType,
                email: this.email,
            },
        );
    }

    public async authByRequestPollingId(polling_id: string): Promise<Token> {
        const response = await RestClientService.postForResponse(
            this.requestPollingIdUrl,
            this.getHeaders(),
            {
                device_type: this.deviceType,
                email: this.email,
                request_polling_id: polling_id,
            },
        );
        const responseJson = await response.json();
        this.token = {
            access_token: responseJson.access_token,
            refresh_token: responseJson.refresh_token,
            created_at: Date.now(),
            lifetime: responseJson.access_token_ttl_seconds,
            user_id: responseJson.startup_data.user.user_id,
        };

        this.cookie = response.headers.get('Set-Cookie');
        return this.token;
    }

    public async getFavoriteItems(): Promise<Post[]> {
        return (
            await RestClientService.postForJson<any>(
                this.itemsUrl,
                this.getHeaders(),
                {
                    favorites_only: true,
                    origin: {
                        latitude: 0.0,
                        longitude: 0.0,
                    },
                    radius: 20,
                    user_id: this.token?.user_id,
                },
            )
        )['items'];
    }
}
