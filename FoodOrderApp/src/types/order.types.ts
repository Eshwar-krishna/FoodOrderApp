export enum OrderStatus {
  PLACED = 'PLACED',
  PREPARING = 'PREPARING',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;                   // ORD-${timestamp}-${rand4}
  restaurantId: string;
  restaurantName: string;
  deliveryAddress: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  tip: number;
  total: number;
  status: OrderStatus;
  placedAt: string;             // ISO 8601
  updatedAt: string;            // ISO 8601 — updated on each status change
  estimatedDeliveryAt: string;  // ISO 8601
  rating: number | null;        // 1–5 stars; null = not yet rated
}

export interface OrderState {
  orders: Order[];              // newest first
  activeOrderId: string | null;
  isHydrated: boolean;
}

export type OrderAction =
  | { type: 'PLACE_ORDER'; payload: Order }
  | { type: 'ADVANCE_STATUS'; payload: { orderId: string; nextStatus: OrderStatus } }
  | { type: 'SET_ACTIVE_ORDER'; payload: { orderId: string | null } }
  | { type: 'HYDRATE_ORDERS'; payload: { orders: Order[] } }
  | { type: 'RATE_ORDER'; payload: { orderId: string; rating: number } };
