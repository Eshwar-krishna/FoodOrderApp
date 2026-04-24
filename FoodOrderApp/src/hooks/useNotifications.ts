import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { OrderStatus } from '../types/order.types';
import { ORDER_STATUS_LABELS } from '../constants/orderStatus';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const NOTIFY_ON_STATUSES = new Set([
  OrderStatus.PLACED,
  OrderStatus.OUT_FOR_DELIVERY,
  OrderStatus.DELIVERED,
]);

export function useNotifications() {
  const permGranted = useRef(false);

  useEffect(() => {
    (async () => {
      if (!Device.isDevice) return; // simulators need real device for push perms
      const { status } = await Notifications.requestPermissionsAsync();
      permGranted.current = status === 'granted';

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('order-updates', {
          name: 'Order Updates',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
        });
      }
    })();
  }, []);

  async function sendStatusNotification(status: OrderStatus, restaurantName: string) {
    if (!permGranted.current || !NOTIFY_ON_STATUSES.has(status)) return;

    const messages: Record<string, { title: string; body: string }> = {
      [OrderStatus.PLACED]: {
        title: 'Order Received!',
        body: `${restaurantName} has received your order.`,
      },
      [OrderStatus.OUT_FOR_DELIVERY]: {
        title: 'On the Way!',
        body: 'Your order is out for delivery.',
      },
      [OrderStatus.DELIVERED]: {
        title: 'Order Delivered!',
        body: 'Your order has been delivered. Enjoy!',
      },
    };

    const msg = messages[status];
    if (!msg) return;

    await Notifications.scheduleNotificationAsync({
      content: { title: msg.title, body: msg.body, sound: true },
      trigger: null, // fire immediately
    });
  }

  return { sendStatusNotification, permGranted };
}
