import { OrderState, OrderAction } from '../types/order.types';
import { guardStatusTransition } from '../utils/validationUtils';

export const initialOrderState: OrderState = {
  orders: [],
  activeOrderId: null,
  isHydrated: false,
};

export function orderReducer(state: OrderState, action: OrderAction): OrderState {
  switch (action.type) {
    case 'PLACE_ORDER': {
      // Prevent duplicate order IDs
      if (state.orders.some((o) => o.id === action.payload.id)) {
        if (__DEV__) console.warn('[orderReducer] Duplicate order id blocked:', action.payload.id);
        return state;
      }
      return {
        ...state,
        orders: [action.payload, ...state.orders], // newest first
        activeOrderId: action.payload.id,
      };
    }

    case 'ADVANCE_STATUS': {
      const { orderId, nextStatus } = action.payload;
      return {
        ...state,
        orders: state.orders.map((order) => {
          if (order.id !== orderId) return order;

          // Guard: only allow valid forward transitions
          if (!guardStatusTransition(order.status, nextStatus)) {
            if (__DEV__)
              console.warn(
                `[orderReducer] Invalid transition ${order.status} → ${nextStatus} blocked`,
              );
            return order;
          }

          return {
            ...order,
            status: nextStatus,
            updatedAt: new Date().toISOString(),
          };
        }),
      };
    }

    case 'SET_ACTIVE_ORDER':
      return { ...state, activeOrderId: action.payload.orderId };

    case 'HYDRATE_ORDERS': {
      // Merge stored orders with any already in state (e.g., placed before hydration completed).
      // In-memory orders take precedence; stored orders that aren't in memory are appended.
      if (state.orders.length === 0) {
        return { ...state, orders: action.payload.orders, isHydrated: true };
      }
      const inMemoryIds = new Set(state.orders.map((o) => o.id));
      const toMerge = action.payload.orders.filter((o) => !inMemoryIds.has(o.id));
      return {
        ...state,
        orders: [...state.orders, ...toMerge],
        isHydrated: true,
      };
    }

    case 'RATE_ORDER': {
      const { orderId, rating } = action.payload;
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === orderId ? { ...order, rating } : order,
        ),
      };
    }

    default:
      return state;
  }
}
