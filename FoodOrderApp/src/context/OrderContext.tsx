import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { OrderState, OrderAction, Order, OrderStatus } from '../types/order.types';
import { orderReducer, initialOrderState } from '../reducers/orderReducer';
import { usePersistOrders } from '../hooks/usePersistOrders';
import { useNotifications } from '../hooks/useNotifications';

interface OrderContextValue {
  state: OrderState;
  dispatch: React.Dispatch<OrderAction>;
  placeOrder: (order: Order) => void;
  setActiveOrder: (orderId: string | null) => void;
  rateOrder: (orderId: string, rating: number) => void;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(orderReducer, initialOrderState);
  const { sendStatusNotification } = useNotifications();

  // Persist orders to / hydrate from AsyncStorage
  usePersistOrders(state.orders, dispatch);

  // Send notifications when any order's status changes
  useEffect(() => {
    state.orders.forEach((order) => {
      // Only notify if order was updated very recently (within last 2s)
      const updatedMs = Date.now() - new Date(order.updatedAt).getTime();
      if (updatedMs < 2000) {
        sendStatusNotification(order.status, order.restaurantName);
      }
    });
  }, [state.orders.map((o) => `${o.id}:${o.status}`).join(',')]);

  const placeOrder = (order: Order) =>
    dispatch({ type: 'PLACE_ORDER', payload: order });

  const setActiveOrder = (orderId: string | null) =>
    dispatch({ type: 'SET_ACTIVE_ORDER', payload: { orderId } });

  const rateOrder = (orderId: string, rating: number) =>
    dispatch({ type: 'RATE_ORDER', payload: { orderId, rating } });

  return (
    <OrderContext.Provider value={{ state, dispatch, placeOrder, setActiveOrder, rateOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrderContext() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrderContext must be used within OrderProvider');
  return ctx;
}
