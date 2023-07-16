export interface Store {
    store_id: string;
    store_name: string;
    branch: string;
    description: string;
    tax_identifier: string;
    website: string;
    store_location: [Object];
    logo_picture: [Object];
    store_time_zone: string;
    hidden: boolean;
    favorite_count: number;
    we_care: boolean;
    distance: number;
    cover_picture: [Object];
    is_manufacturer: boolean;
}
