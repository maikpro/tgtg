export interface Item {
    item_id: string;
    sales_taxes: any[];
    tax_amount: [Object];
    price_excluding_taxes: [Object];
    price_including_taxes: [Object];
    value_excluding_taxes: [Object];
    value_including_taxes: [Object];
    taxation_policy: string;
    show_sales_taxes: boolean;
    item_price: [Object];
    item_value: [Object];
    cover_picture: [Object];
    logo_picture: [Object];
    name: boolean;
    description: string;
    can_user_supply_packaging: boolean;
    packaging_option: string;
    collection_info: string;
    diet_categories: [];
    item_category: string;
    buffet: boolean;
    badges: any[];
    positive_rating_reasons: any[];
    average_overall_rating: [Object];
    favorite_count: number;
}
