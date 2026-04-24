import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../common/AppText';
import Colors from '../../constants/colors';
import Spacing from '../../constants/spacing';
import Typography from '../../constants/typography';
import { Restaurant } from '../../types/food.types';
import { formatCurrency } from '../../utils/priceUtils';

interface Props {
  restaurant: Restaurant;
  onPress: () => void;
}

export default function RestaurantCard({ restaurant, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.88} style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: restaurant.imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Rating badge overlay */}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={11} color={Colors.accent} />
          <AppText style={styles.ratingText}>{restaurant.rating.toFixed(1)}</AppText>
        </View>
        {/* Cuisine tag overlay */}
        <View style={styles.cuisineTag}>
          <AppText style={styles.cuisineText}>{restaurant.cuisine}</AppText>
        </View>
      </View>

      <View style={styles.body}>
        <AppText variant="subheading" style={styles.name} numberOfLines={1}>
          {restaurant.name}
        </AppText>
        <View style={styles.meta}>
          <Ionicons name="time-outline" size={13} color={Colors.textMuted} />
          <AppText variant="caption" color={Colors.textSecondary} style={styles.metaText}>
            {restaurant.deliveryTimeMin} min
          </AppText>
          <View style={styles.dot} />
          <Ionicons name="bicycle-outline" size={13} color={Colors.textMuted} />
          <AppText variant="caption" color={Colors.textSecondary} style={styles.metaText}>
            {formatCurrency(restaurant.deliveryFee)} delivery
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.borderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 4,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 190,
  },
  ratingBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.62)',
    borderRadius: Spacing.borderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 3,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: Typography.weight.bold,
  },
  cuisineTag: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Spacing.borderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  cuisineText: {
    color: Colors.textInverse,
    fontSize: 11,
    fontWeight: Typography.weight.semibold,
  },
  body: {
    padding: Spacing.md,
    paddingTop: Spacing.sm,
  },
  name: {
    marginBottom: 4,
    fontWeight: Typography.weight.bold,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    marginLeft: 2,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.textMuted,
    marginHorizontal: 2,
  },
});
