export interface CartItem {
  id: string;           // same as menuItemId — used as row key
  menuItemId: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  price: number;        // unit price snapshot at time of adding
  quantity: number;     // 1–99
  imageUri?: string;
}

export interface CartState {
  items: CartItem[];
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QTY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };
