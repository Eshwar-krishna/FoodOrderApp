import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../common/AppText';
import FoodImage from '../food/FoodImage';
import QuantityStepper from './QuantityStepper';
import Colors from '../../constants/colors';
import Spacing from '../../constants/spacing';
import Typography from '../../constants/typography';
import { CartItem } from '../../types/cart.types';
import { formatCurrency } from '../../utils/priceUtils';

interface Props {
  item: CartItem;
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
}

export default function CartItemRow({ item, onRemove, onUpdateQty }: Props) {
  return (
    <View style={styles.row}>
      <FoodImage uri={item.imageUri} width={60} height={60} />
      <View style={styles.info}>
        <View style={styles.topRow}>
          <AppText variant="body" style={styles.name} numberOfLines={1}>
            {item.name}
          </AppText>
          <TouchableOpacity onPress={() => onRemove(item.id)} hitSlop={8}>
            <Ionicons name="trash-outline" size={18} color={Colors.error} />
          </TouchableOpacity>
        </View>
        <AppText variant="caption" color={Colors.textSecondary}>
          {formatCurrency(item.price)} each
        </AppText>
        <View style={styles.bottomRow}>
          <QuantityStepper
            value={item.quantity}
            onDecrement={() => onUpdateQty(item.id, item.quantity - 1)}
            onIncrement={() => onUpdateQty(item.id, item.quantity + 1)}
          />
          <AppText style={styles.subtotal}>
            {formatCurrency(item.price * item.quantity)}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    flex: 1,
    fontWeight: Typography.weight.semibold,
    marginRight: Spacing.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  subtotal: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.primary,
  },
});
