import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../common/AppText';
import Colors from '../../constants/colors';
import Spacing from '../../constants/spacing';
import { OrderStatus } from '../../types/order.types';
import { formatShortTime } from '../../utils/dateUtils';

interface Props {
  estimatedDeliveryAt: string;
  status: OrderStatus;
}

export default function ETADisplay({ estimatedDeliveryAt, status }: Props) {
  const isDelivered = status === OrderStatus.DELIVERED;

  return (
    <View style={styles.container}>
      <Ionicons
        name={isDelivered ? 'checkmark-circle' : 'time-outline'}
        size={20}
        color={isDelivered ? Colors.success : Colors.primary}
      />
      <AppText variant="body" style={styles.text}>
        {isDelivered ? 'Delivered' : `Estimated arrival by ${formatShortTime(estimatedDeliveryAt)}`}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    justifyContent: 'center',
    marginVertical: Spacing.sm,
  },
  text: {
    color: Colors.textSecondary,
  },
});
