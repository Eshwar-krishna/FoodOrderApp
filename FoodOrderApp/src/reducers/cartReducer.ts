import { CartState, CartAction } from '../types/cart.types';

export const initialCartState: CartState = {
  items: [],
};

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const item = action.payload;
      const existing = state.items.find((i) => i.id === item.id);

      if (existing) {
        // Same menu item already in cart — increment quantity
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: Math.min(99, i.quantity + item.quantity) }
              : i,
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...item, quantity: Math.min(99, Math.max(1, item.quantity)) }],
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload.id),
      };

    case 'UPDATE_QTY': {
      const clamped = Math.min(99, Math.max(1, action.payload.quantity));
      return {
        ...state,
        items: state.items
          .map((i) => (i.id === action.payload.id ? { ...i, quantity: clamped } : i))
          .filter((i) => i.quantity > 0),
      };
    }

    case 'CLEAR_CART':
      return initialCartState;

    default:
      return state;
  }
}
