import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../common/AppText';
import Colors from '../../constants/colors';
import Spacing from '../../constants/spacing';
import Typography from '../../constants/typography';
import { OrderStatus } from '../../types/order.types';
import { ORDER_STATUS_SEQUENCE, ORDER_STATUS_LABELS, ORDER_STATUS_ICONS, ORDER_STATUS_COLORS } from '../../constants/orderStatus';

interface Props {
  currentStatus: OrderStatus;
}

export default function StatusStepper({ currentStatus }: Props) {
  const currentIdx = ORDER_STATUS_SEQUENCE.indexOf(currentStatus);

  return (
    <View style={styles.container}>
      {ORDER_STATUS_SEQUENCE.map((status, idx) => {
        const isDone = idx <= currentIdx;
        const isActive = idx === currentIdx;
        const color = isDone ? ORDER_STATUS_COLORS[status] : Colors.border;
        const isLast = idx === ORDER_STATUS_SEQUENCE.length - 1;

        return (
          <View key={status} style={styles.stepWrapper}>
            <View style={styles.stepRow}>
              {/* Connector line above */}
              {idx > 0 && (
                <View
                  style={[
                    styles.connector,
                    { backgroundColor: idx <= currentIdx ? ORDER_STATUS_COLORS[ORDER_STATUS_SEQUENCE[idx - 1]] : Colors.border },
                  ]}
                />
              )}

              {/* Icon circle */}
              <View
                style={[
                  styles.circle,
                  { borderColor: color, backgroundColor: isDone ? color : Colors.surface },
                  isActive && styles.activeCircle,
                ]}
              >
                <Ionicons
                  name={ORDER_STATUS_ICONS[status] as any}
                  size={18}
                  color={isDone ? Colors.textInverse : Colors.border}
                />
              </View>

              {/* Connector line below */}
              {!isLast && (
                <View
                  style={[
                    styles.connector,
                    { backgroundColor: idx < currentIdx ? ORDER_STATUS_COLORS[status] : Colors.border },
                  ]}
                />
              )}
            </View>

            {/* Label */}
            <AppText
              variant="label"
              style={[styles.label, isDone && { color: color, fontWeight: Typography.weight.semibold }]}
              numberOfLines={2}
            >
              {ORDER_STATUS_LABELS[status]}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  stepWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  stepRow: {
    alignItems: 'center',
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCircle: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  connector: {
    width: 2,
    height: 18,
  },
  label: {
    marginTop: Spacing.xs,
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: 10,
    maxWidth: 70,
  },
});
