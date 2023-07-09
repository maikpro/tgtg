export interface Token {
    access_token: string;
    refresh_token: string;
    created_at: number;
    lifetime: number;

    user_id: string;
}
