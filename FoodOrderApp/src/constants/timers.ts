import { OrderStatus } from '../types/order.types';

// Duration in milliseconds before auto-advancing to next status
export const STATUS_DURATIONS: Record<OrderStatus, number> = {
  [OrderStatus.PLACED]: 8_000,
  [OrderStatus.PREPARING]: 15_000,
  [OrderStatus.OUT_FOR_DELIVERY]: 20_000,
  [OrderStatus.DELIVERED]: 0, // terminal state
};

export const TOTAL_DELIVERY_MS = Object.values(STATUS_DURATIONS).reduce(
  (sum, ms) => sum + ms,
  0,
);

export const PERSIST_DEBOUNCE_MS = 500;
