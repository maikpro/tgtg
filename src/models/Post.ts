import { Item } from './Item';
import { Store } from './Store';

export interface Post {
    item: Item;
    store: Store;
    display_name: string;
    pickup_location: [Object];
    items_available: number;
    distance: number;
    favorite: boolean;
    in_sales_window: boolean;
    new_item: boolean;
    item_type: string;
    matches_filters: boolean;
}
