import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Order, OrderStatus, OrderAction } from '../types/order.types';
import { ORDER_STATUS_SEQUENCE } from '../constants/orderStatus';
import { STATUS_DURATIONS } from '../constants/timers';
import { getNextStatus, isTerminalStatus, getRemainingMs } from '../utils/orderUtils';

export function useOrderSimulation(
  order: Order | undefined,
  dispatch: React.Dispatch<OrderAction>,
) {
  const dispatchRef = useRef(dispatch);
  dispatchRef.current = dispatch;

  // Timer-chain: schedules ONE timeout for the current status, then the effect
  // re-runs when status changes to schedule the next one.
  useEffect(() => {
    if (!order || isTerminalStatus(order.status)) return;

    const next = getNextStatus(order.status);
    if (!next) return;

    const remaining = getRemainingMs(order.status, order.updatedAt);

    const timerId = setTimeout(() => {
      dispatchRef.current({
        type: 'ADVANCE_STATUS',
        payload: { orderId: order.id, nextStatus: next },
      });
    }, remaining);

    return () => clearTimeout(timerId);
  }, [order?.id, order?.status]);

  // Catch-up on foreground resume: fast-forward through skipped statuses
  useEffect(() => {
    if (!order) return;

    function handleAppStateChange(nextState: AppStateStatus) {
      if (nextState !== 'active' || !order || isTerminalStatus(order.status)) return;

      const elapsed = Date.now() - new Date(order.updatedAt).getTime();
      let cumulative = 0;
      let currentStatus = order.status;

      for (const status of ORDER_STATUS_SEQUENCE) {
        if (ORDER_STATUS_SEQUENCE.indexOf(status) < ORDER_STATUS_SEQUENCE.indexOf(currentStatus))
          continue;
        if (isTerminalStatus(status)) break;

        cumulative += STATUS_DURATIONS[status];
        if (elapsed >= cumulative) {
          const next = getNextStatus(status);
          if (next) {
            dispatchRef.current({
              type: 'ADVANCE_STATUS',
              payload: { orderId: order.id, nextStatus: next },
            });
            currentStatus = next;
          }
        } else {
          break;
        }
      }
    }

    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => sub.remove();
  }, [order?.id]);
}
