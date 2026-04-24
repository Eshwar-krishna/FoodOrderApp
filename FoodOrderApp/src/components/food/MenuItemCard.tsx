import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../common/AppText';
import FoodImage from './FoodImage';
import Colors from '../../constants/colors';
import Spacing from '../../constants/spacing';
import Typography from '../../constants/typography';
import { MenuItem } from '../../types/food.types';
import { formatCurrency } from '../../utils/priceUtils';

interface Props {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onAdd }: Props) {
  return (
    <View style={styles.container}>
      <FoodImage uri={item.imageUri} width={90} height={90} />
      <View style={styles.info}>
        <AppText variant="body" style={styles.name} numberOfLines={1}>
          {item.name}
        </AppText>
        <AppText variant="caption" color={Colors.textSecondary} numberOfLines={2} style={styles.desc}>
          {item.description}
        </AppText>
        <View style={styles.footer}>
          <AppText style={styles.price}>{formatCurrency(item.price)}</AppText>
          <TouchableOpacity
            onPress={() => onAdd(item)}
            style={styles.addBtn}
            activeOpacity={0.78}
          >
            <Ionicons name="add" size={22} color={Colors.textInverse} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: Typography.weight.semibold,
    marginBottom: 2,
  },
  desc: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  price: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.primary,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Spacing.borderRadius.full,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
