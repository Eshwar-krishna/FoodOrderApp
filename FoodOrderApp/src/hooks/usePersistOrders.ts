import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Order, OrderAction } from '../types/order.types';
import { storageGet, storageSet, STORAGE_KEYS } from './useAsyncStorage';
import { PERSIST_DEBOUNCE_MS } from '../constants/timers';

// Loads orders from AsyncStorage on mount and saves them whenever they change.
export function usePersistOrders(orders: Order[], dispatch: React.Dispatch<OrderAction>) {
  const isFirstRun = useRef(true);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ordersRef = useRef(orders);
  ordersRef.current = orders;

  // Hydrate on mount
  useEffect(() => {
    storageGet<Order[]>(STORAGE_KEYS.ORDERS).then((saved) => {
      dispatch({ type: 'HYDRATE_ORDERS', payload: { orders: saved ?? [] } });
    });
  }, []);

  // Persist on change (skip the initial hydration write)
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      storageSet(STORAGE_KEYS.ORDERS, orders);
    }, PERSIST_DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [orders]);

  // Flush any pending debounced save immediately when the app backgrounds,
  // so orders are never lost if the OS kills the app before the timer fires.
  useEffect(() => {
    function handleAppState(nextState: AppStateStatus) {
      if (nextState === 'background' || nextState === 'inactive') {
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
          debounceTimer.current = null;
        }
        storageSet(STORAGE_KEYS.ORDERS, ordersRef.current);
      }
    }
    const sub = AppState.addEventListener('change', handleAppState);
    return () => sub.remove();
  }, []);
}
