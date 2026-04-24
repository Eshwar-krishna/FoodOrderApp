import { CartState } from '../types/cart.types';
import { OrderStatus } from '../types/order.types';
import { ORDER_STATUS_SEQUENCE } from '../constants/orderStatus';

export type ValidationResult<T = true> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export function validateCartNotEmpty(cart: CartState): ValidationResult {
  if (cart.items.length === 0) {
    return { ok: false, error: 'Your cart is empty. Add items before placing an order.' };
  }
  return { ok: true, value: true };
}

export function validateQuantity(quantity: number): ValidationResult<number> {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    return { ok: false, error: 'Quantity must be between 1 and 99.' };
  }
  return { ok: true, value: quantity };
}

export function validateDeliveryAddress(address: string): ValidationResult {
  const trimmed = address.trim();
  if (trimmed.length < 5) {
    return { ok: false, error: 'Please enter a valid delivery address (min 5 characters).' };
  }
  return { ok: true, value: true };
}

// Ensures transitions only move forward one step in the sequence
export function guardStatusTransition(
  current: OrderStatus,
  next: OrderStatus,
): boolean {
  const currentIdx = ORDER_STATUS_SEQUENCE.indexOf(current);
  const nextIdx = ORDER_STATUS_SEQUENCE.indexOf(next);
  return nextIdx === currentIdx + 1;
}
