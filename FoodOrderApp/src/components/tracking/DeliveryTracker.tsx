import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../common/AppText';
import Colors from '../../constants/colors';
import Spacing from '../../constants/spacing';
import Typography from '../../constants/typography';
import { OrderStatus } from '../../types/order.types';
import {
  ORDER_STATUS_SEQUENCE,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_ICONS,
  ORDER_STATUS_COLORS,
} from '../../constants/orderStatus';

interface Props {
  restaurantName: string;
  deliveryAddress: string;
  currentStatus: OrderStatus;
}

interface Stop {
  key: string;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  isDone: boolean;
  isActive: boolean;
}

const ICON_SIZE = 46;

export default function DeliveryTracker({ restaurantName, deliveryAddress, currentStatus }: Props) {
  const currentIdx = ORDER_STATUS_SEQUENCE.indexOf(currentStatus);
  const isDelivered = currentStatus === OrderStatus.DELIVERED;

  const stops: Stop[] = [
    {
      key: 'origin',
      icon: 'storefront',
      title: restaurantName,
      subtitle: 'Restaurant',
      color: Colors.primary,
      isDone: true,
      isActive: false,
    },
    ...ORDER_STATUS_SEQUENCE.map((status, idx) => {
      const isDone = idx <= currentIdx;
      const isActive = idx === currentIdx;
      return {
        key: status,
        icon: ORDER_STATUS_ICONS[status],
        title: ORDER_STATUS_LABELS[status],
        subtitle: isActive ? 'Current status' : isDone ? 'Completed' : 'Upcoming',
        color: isDone ? ORDER_STATUS_COLORS[status] : Colors.border,
        isDone,
        isActive,
      };
    }),
    {
      key: 'destination',
      icon: 'home',
      title: deliveryAddress,
      subtitle: 'Your Delivery Address',
      color: isDelivered ? Colors.success : Colors.border,
      isDone: isDelivered,
      isActive: false,
    },
  ];

  return (
    <View style={styles.container}>
      {stops.map((stop, idx) => {
        const isLast = idx === stops.length - 1;
        const nextStop = stops[idx + 1];
        const lineColor = stop.isDone && nextStop?.isDone ? stop.color : Colors.border;

        return (
          <View key={stop.key}>
            {/* Stop row */}
            <View style={styles.stopRow}>
              {/* Icon circle */}
              <View style={styles.iconColumn}>
                <View
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor: stop.isDone ? stop.color : Colors.surface,
                      borderColor: stop.isDone ? stop.color : Colors.border,
                    },
                    stop.isActive && styles.activeGlow,
                  ]}
                >
                  <Ionicons
                    name={stop.icon as any}
                    size={20}
                    color={stop.isDone ? Colors.textInverse : Colors.textMuted}
                  />
                </View>
              </View>

              {/* Text block */}
              <View style={styles.textBlock}>
                <AppText
                  variant="caption"
                  style={[
                    styles.subtitle,
                    stop.isActive && { color: stop.color },
                  ]}
                >
                  {stop.subtitle.toUpperCase()}
                </AppText>
                <AppText
                  variant="body"
                  style={[
                    styles.title,
                    stop.isDone && { color: Colors.text },
                    stop.isActive && { color: stop.color, fontWeight: Typography.weight.bold },
                    !stop.isDone && { color: Colors.textMuted },
                  ]}
                  numberOfLines={2}
                >
                  {stop.title}
                </AppText>
              </View>

              {/* Done checkmark */}
              {stop.isDone && !stop.isActive && (
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={stop.color}
                  style={styles.check}
                />
              )}

              {/* Active pulse indicator */}
              {stop.isActive && (
                <View style={[styles.activeDot, { backgroundColor: stop.color }]} />
              )}
            </View>

            {/* Connecting line to next stop */}
            {!isLast && (
              <View style={styles.lineRow}>
                <View style={styles.lineColumn}>
                  <View style={[styles.connector, { backgroundColor: lineColor }]} />
                </View>
                <View style={styles.lineGap} />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },

  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconColumn: {
    width: ICON_SIZE + Spacing.md,
    alignItems: 'center',
  },

  iconCircle: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeGlow: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },

  textBlock: {
    flex: 1,
    paddingVertical: Spacing.sm,
  },

  subtitle: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: 2,
  },

  title: {
    fontSize: Typography.size.md,
    color: Colors.textSecondary,
  },

  check: {
    marginLeft: Spacing.sm,
  },

  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: Spacing.sm,
  },

  lineRow: {
    flexDirection: 'row',
    height: 36,
  },

  lineColumn: {
    width: ICON_SIZE + Spacing.md,
    alignItems: 'center',
  },

  connector: {
    width: 2,
    flex: 1,
    borderRadius: 1,
  },

  lineGap: {
    flex: 1,
  },
});
