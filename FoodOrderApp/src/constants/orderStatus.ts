import { OrderStatus } from '../types/order.types';
import Colors from './colors';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PLACED]: 'Order Placed',
  [OrderStatus.PREPARING]: 'Preparing',
  [OrderStatus.OUT_FOR_DELIVERY]: 'Out for Delivery',
  [OrderStatus.DELIVERED]: 'Delivered',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PLACED]: Colors.statusPlaced,
  [OrderStatus.PREPARING]: Colors.statusPreparing,
  [OrderStatus.OUT_FOR_DELIVERY]: Colors.statusOutForDelivery,
  [OrderStatus.DELIVERED]: Colors.statusDelivered,
};

export const ORDER_STATUS_ICONS: Record<OrderStatus, string> = {
  [OrderStatus.PLACED]: 'receipt-outline',
  [OrderStatus.PREPARING]: 'restaurant-outline',
  [OrderStatus.OUT_FOR_DELIVERY]: 'bicycle-outline',
  [OrderStatus.DELIVERED]: 'checkmark-circle-outline',
};

export const ORDER_STATUS_SEQUENCE: OrderStatus[] = [
  OrderStatus.PLACED,
  OrderStatus.PREPARING,
  OrderStatus.OUT_FOR_DELIVERY,
  OrderStatus.DELIVERED,
];
