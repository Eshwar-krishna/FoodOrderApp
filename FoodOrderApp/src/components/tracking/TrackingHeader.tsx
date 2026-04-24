import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../common/AppText';
import Colors from '../../constants/colors';
import Spacing from '../../constants/spacing';
import { formatOrderTime } from '../../utils/dateUtils';

interface Props {
  orderId: string;
  restaurantName: string;
  placedAt: string;
}

export default function TrackingHeader({ orderId, restaurantName, placedAt }: Props) {
  return (
    <View style={styles.container}>
      <AppText variant="caption" color={Colors.textSecondary}>
        Order ID
      </AppText>
      <AppText variant="body" style={styles.id}>
        {orderId}
      </AppText>
      <AppText variant="subheading" style={styles.restaurant}>
        {restaurantName}
      </AppText>
      <AppText variant="caption" color={Colors.textSecondary}>
        Placed: {formatOrderTime(placedAt)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  id: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  restaurant: {
    marginTop: 4,
  },
});
