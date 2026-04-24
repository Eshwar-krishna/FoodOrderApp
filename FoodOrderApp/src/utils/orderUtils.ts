import { OrderStatus } from '../types/order.types';
import { ORDER_STATUS_SEQUENCE } from '../constants/orderStatus';
import { STATUS_DURATIONS, TOTAL_DELIVERY_MS } from '../constants/timers';

export function generateOrderId(): string {
  const timestamp = Date.now();
  const rand = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `ORD-${timestamp}-${rand}`;
}

export function getNextStatus(current: OrderStatus): OrderStatus | null {
  const idx = ORDER_STATUS_SEQUENCE.indexOf(current);
  if (idx === -1 || idx >= ORDER_STATUS_SEQUENCE.length - 1) return null;
  return ORDER_STATUS_SEQUENCE[idx + 1];
}

export function isTerminalStatus(status: OrderStatus): boolean {
  return status === OrderStatus.DELIVERED;
}

export function getEstimatedDeliveryAt(placedAt: string): string {
  return new Date(new Date(placedAt).getTime() + TOTAL_DELIVERY_MS).toISOString();
}

// Returns how many ms remain for the current status phase
export function getRemainingMs(status: OrderStatus, updatedAt: string): number {
  if (isTerminalStatus(status)) return 0;
  const elapsed = Date.now() - new Date(updatedAt).getTime();
  return Math.max(0, STATUS_DURATIONS[status] - elapsed);
}
