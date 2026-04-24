import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import MenuItemCard from '../components/food/MenuItemCard';
import CategoryChip from '../components/food/CategoryChip';
import AppText from '../components/common/AppText';
import Colors from '../constants/colors';
import Spacing from '../constants/spacing';
import Typography from '../constants/typography';
import { RESTAURANTS } from '../constants/mockData';
import { HomeStackParamList } from '../types/navigation.types';
import { MenuItem } from '../types/food.types';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/priceUtils';

type RouteProps = RouteProp<HomeStackParamList, 'MenuDetail'>;
type Nav = NativeStackNavigationProp<HomeStackParamList, 'MenuDetail'>;

const HERO_HEIGHT = 240;

export default function MenuScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { addItem, itemCount } = useCart();

  const restaurant = RESTAURANTS.find((r) => r.id === route.params.restaurantId);
  const [selectedCategory, setSelectedCategory] = useState(restaurant?.categories[0]?.id ?? '');

  const visibleItems = useMemo(
    () => restaurant?.menuItems.filter((m) => m.categoryId === selectedCategory && m.isAvailable) ?? [],
    [restaurant, selectedCategory],
  );

  if (!restaurant) return null;

  function handleAddItem(menuItem: MenuItem) {
    addItem({
      id: menuItem.id,
      menuItemId: menuItem.id,
      restaurantId: restaurant!.id,
      restaurantName: restaurant!.name,
      name: menuItem.name,
      price: menuItem.price,
      quantity: 1,
      imageUri: menuItem.imageUri,
    });
  }

  const heroHeight = HERO_HEIGHT + insets.top;

  return (
    <View style={styles.root}>
      <ScrollView
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: itemCount > 0 ? 110 : 40 }}
      >
        {/* ─── [0] Hero + restaurant info ─── */}
        <View>
          {/* Full-bleed image extends under status bar */}
          <Image
            source={{ uri: restaurant.imageUri }}
            style={[styles.hero, { height: heroHeight }]}
            resizeMode="cover"
          />
          {/* Darkening gradient at the bottom of the image */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.55)']}
            style={[styles.heroGradient, { height: heroHeight }]}
          />

          {/* Restaurant info panel */}
          <View style={styles.infoPanel}>
            <AppText style={styles.restaurantName} numberOfLines={2}>
              {restaurant.name}
            </AppText>

            <View style={styles.metaRow}>
              <View style={styles.starBadge}>
                <Ionicons name="star" size={11} color={Colors.accent} />
                <AppText style={styles.starText}>{restaurant.rating.toFixed(1)}</AppText>
              </View>
              <AppText style={styles.sep}>·</AppText>
              <AppText style={styles.metaLabel}>{restaurant.cuisine}</AppText>
              <AppText style={styles.sep}>·</AppText>
              <Ionicons name="time-outline" size={13} color={Colors.textMuted} />
              <AppText style={styles.metaLabel}> {restaurant.deliveryTimeMin} min</AppText>
            </View>

            <View style={styles.deliveryRow}>
              <View style={styles.deliveryChip}>
                <Ionicons name="bicycle-outline" size={14} color={Colors.primary} />
                <AppText style={styles.deliveryChipText}>
                  {restaurant.deliveryFee === 0
                    ? 'Free Delivery'
                    : `${formatCurrency(restaurant.deliveryFee)} delivery`}
                </AppText>
              </View>
              <View style={styles.deliveryChip}>
                <Ionicons name="bag-handle-outline" size={14} color={Colors.primary} />
                <AppText style={styles.deliveryChipText}>Pickup available</AppText>
              </View>
            </View>
          </View>
        </View>

        {/* ─── [1] Sticky category bar ─── */}
        <View style={styles.categoryBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContent}
          >
            {restaurant.categories.map((cat) => (
              <CategoryChip
                key={cat.id}
                label={cat.name}
                active={selectedCategory === cat.id}
                onPress={() => setSelectedCategory(cat.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* ─── [2] Menu items ─── */}
        <View style={styles.menuSection}>
          <View style={styles.menuSectionHeader}>
            <AppText style={styles.menuSectionTitle}>
              {restaurant.categories.find((c) => c.id === selectedCategory)?.name}
            </AppText>
            <AppText style={styles.menuSectionCount}>
              {visibleItems.length} item{visibleItems.length !== 1 ? 's' : ''}
            </AppText>
          </View>

          {visibleItems.map((item) => (
            <MenuItemCard key={item.id} item={item} onAdd={handleAddItem} />
          ))}
        </View>
      </ScrollView>

      {/* ─── Floating back button ─── */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[styles.backBtn, { top: insets.top + 10 }]}
        activeOpacity={0.85}
        hitSlop={8}
      >
        <Ionicons name="chevron-back" size={22} color={Colors.text} />
      </TouchableOpacity>

      {/* ─── Cart FAB ─── */}
      {itemCount > 0 && (
        <View style={[styles.fabWrap, { bottom: insets.bottom + 18 }]}>
          <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.getParent()?.navigate('CartTab')}
            activeOpacity={0.88}
          >
            <View style={styles.fabBadge}>
              <AppText style={styles.fabBadgeText}>{itemCount}</AppText>
            </View>
            <AppText style={styles.fabLabel}>View Cart</AppText>
            <Ionicons name="arrow-forward" size={18} color={Colors.textInverse} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  hero: { width: '100%' },

  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },

  infoPanel: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },

  restaurantName: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.extrabold,
    color: Colors.text,
    letterSpacing: -0.3,
    marginBottom: 6,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: Spacing.sm,
  },

  starBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.accent}25`,
    borderRadius: Spacing.borderRadius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
    gap: 3,
  },

  starText: {
    fontSize: 12,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
  },

  sep: { color: Colors.textMuted, fontSize: Typography.size.md },

  metaLabel: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },

  deliveryRow: { flexDirection: 'row', gap: Spacing.sm },

  deliveryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}12`,
    borderRadius: Spacing.borderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
  },

  deliveryChipText: {
    fontSize: Typography.size.sm,
    color: Colors.primary,
    fontWeight: Typography.weight.semibold,
  },

  categoryBar: {
    backgroundColor: Colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 10,
  },

  categoryContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
  },

  menuSection: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },

  menuSectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },

  menuSectionTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
  },

  menuSectionCount: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
  },

  backBtn: {
    position: 'absolute',
    left: Spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },

  fabWrap: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
  },

  fab: {
    backgroundColor: Colors.primary,
    borderRadius: Spacing.borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.40,
    shadowRadius: 14,
    elevation: 10,
  },

  fabBadge: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: Spacing.borderRadius.full,
    minWidth: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },

  fabBadgeText: {
    color: Colors.textInverse,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.extrabold,
  },

  fabLabel: {
    flex: 1,
    color: Colors.textInverse,
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    textAlign: 'center',
  },
});
