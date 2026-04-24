import { CartItem } from '../types/cart.types';

export const TAX_RATE = 0.08; // 8%

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calculateTax(subtotal: number): number {
  return subtotal * TAX_RATE;
}

export function calculateTotal(subtotal: number, tax: number, deliveryFee: number): number {
  return subtotal + tax + deliveryFee;
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
