import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from './AppText';
import { OrderStatus } from '../../types/order.types';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../constants/orderStatus';
import Spacing from '../../constants/spacing';
import Typography from '../../constants/typography';

interface Props {
  status: OrderStatus;
}

export default function Badge({ status }: Props) {
  const color = ORDER_STATUS_COLORS[status];
  const label = ORDER_STATUS_LABELS[status];

  return (
    <View style={[styles.pill, { backgroundColor: `${color}22`, borderColor: color }]}>
      <AppText style={[styles.text, { color }]}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Spacing.borderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: Typography.size.xs,
    fontWeight: '600',
  },
});
