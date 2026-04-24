import React from 'react';
import { FlatList, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/common/AppText';
import Badge from '../components/common/Badge';
import StarRating from '../components/common/StarRating';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Colors from '../constants/colors';
import Spacing from '../constants/spacing';
import Typography from '../constants/typography';
import { useOrders } from '../hooks/useOrders';
import { Order, OrderItem, OrderStatus } from '../types/order.types';
import { OrdersStackParamList } from '../types/navigation.types';
import { ORDER_STATUS_COLORS } from '../constants/orderStatus';
import { RESTAURANTS } from '../constants/mockData';
import { formatOrderTime } from '../utils/dateUtils';
import { formatCurrency } from '../utils/priceUtils';

type Nav = NativeStackNavigationProp<OrdersStackParamList, 'OrdersList'>;

function OrderCard({ order, onPress }: { order: Order; onPress: () => void }) {
  const isDelivered = order.status === OrderStatus.DELIVERED;
  const isActive = !isDelivered;
  const statusColor = ORDER_STATUS_COLORS[order.status];
  const restaurantImage = RESTAURANTS.find((r) => r.id === order.restaurantId)?.imageUri;

  return (
    <View style={styles.cardShadow}>
      {/* Status stripe on left edge */}
      <View style={styles.cardInner}>
        <View style={[styles.statusStripe, { backgroundColor: statusColor }]} />

        {/* Main content */}
        <View style={styles.cardBody}>
          {/* Top: restaurant image + name/status */}
          <View style={styles.cardTop}>
            {restaurantImage ? (
              <Image source={{ uri: restaurantImage }} style={styles.restaurantThumb} resizeMode="cover" />
            ) : (
              <View style={[styles.restaurantThumb, styles.thumbPlaceholder]}>
                <Ionicons name="storefront-outline" size={18} color={Colors.textMuted} />
              </View>
            )}

            <View style={styles.cardTopInfo}>
              <View style={styles.nameRow}>
                <AppText style={styles.restaurantName} numberOfLines={1}>
                  {order.restaurantName}
                </AppText>
                {isActive && (
                  <View style={styles.liveDot} />
                )}
              </View>
              <Badge status={order.status} />
            </View>
          </View>

          {/* Date & address */}
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
            <AppText style={styles.metaText}>{formatOrderTime(order.placedAt)}</AppText>
            <View style={styles.dot} />
            <Ionicons name="location-outline" size={12} color={Colors.textMuted} />
            <AppText style={styles.metaText} numberOfLines={1}>
              {order.deliveryAddress}
            </AppText>
          </View>

          <View style={styles.divider} />

          {/* Items summary */}
          <View style={styles.itemsRow}>
            {order.items.slice(0, 3).map((item: OrderItem, i: number) => (
              <AppText key={item.menuItemId} style={styles.itemChip} numberOfLines={1}>
                {item.quantity}× {item.name}{i < Math.min(order.items.length, 3) - 1 ? ',' : ''}
              </AppText>
            ))}
            {order.items.length > 3 && (
              <AppText style={styles.moreItems}>+{order.items.length - 3} more</AppText>
            )}
          </View>

          {/* Footer: total + rating + action */}
          <View style={styles.footer}>
            <View>
              <AppText style={styles.totalLabel}>Total</AppText>
              <AppText style={styles.totalValue}>{formatCurrency(order.total)}</AppText>
            </View>

            <View style={styles.footerRight}>
              {isDelivered && order.rating !== null && (
                <StarRating value={order.rating} size={13} />
              )}
              <TouchableOpacity
                onPress={onPress}
                style={[styles.actionBtn, { borderColor: statusColor }]}
                activeOpacity={0.7}
              >
                <AppText style={[styles.actionText, { color: statusColor }]}>
                  {isActive ? 'Track Order' : 'View Receipt'} →
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function OrdersScreen() {
  const navigation = useNavigation<Nav>();
  const { state } = useOrders();

  if (!state.isHydrated) return <LoadingSpinner />;

  const activeOrders = state.orders.filter((o) => o.status !== OrderStatus.DELIVERED);
  const pastOrders   = state.orders.filter((o) => o.status === OrderStatus.DELIVERED);
  const sortedOrders = [...activeOrders, ...pastOrders];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <AppText style={styles.headerTitle}>My Orders</AppText>
        {activeOrders.length > 0 && (
          <View style={styles.activeBadge}>
            <View style={styles.activeDotSmall} />
            <AppText style={styles.activeBadgeText}>
              {activeOrders.length} active
            </AppText>
          </View>
        )}
      </View>

      {sortedOrders.length === 0 ? (
        <EmptyState
          icon="receipt-outline"
          title="No orders yet"
          message="Place your first order and it will appear here."
          actionLabel="Browse Restaurants"
          onAction={() => navigation.navigate('OrdersList')}
        />
      ) : (
        <FlatList
          data={sortedOrders}
          keyExtractor={(o) => o.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: order }) => (
            <OrderCard
              order={order}
              onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },

  headerTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.extrabold,
    color: Colors.text,
    letterSpacing: -0.3,
  },

  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: `${Colors.success}15`,
    borderRadius: Spacing.borderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  activeDotSmall: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },

  activeBadgeText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.success,
  },

  list: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },

  // ─── Card layout ───
  cardShadow: {
    borderRadius: Spacing.borderRadius.lg,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 4,
    backgroundColor: Colors.surface,
  },

  cardInner: {
    flexDirection: 'row',
    borderRadius: Spacing.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },

  statusStripe: {
    width: 5,
  },

  cardBody: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
  },

  // ─── Card top (image + name/status) ───
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },

  restaurantThumb: {
    width: 52,
    height: 52,
    borderRadius: Spacing.borderRadius.md,
  },

  thumbPlaceholder: {
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardTopInfo: {
    flex: 1,
    gap: 6,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  restaurantName: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
    flex: 1,
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },

  // ─── Meta row ───
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'nowrap',
  },

  metaText: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    flexShrink: 1,
  },

  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.border,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.divider,
  },

  // ─── Items summary ───
  itemsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },

  itemChip: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },

  moreItems: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },

  // ─── Footer ───
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },

  totalLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    marginBottom: 2,
  },

  totalValue: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.extrabold,
    color: Colors.text,
  },

  footerRight: {
    alignItems: 'flex-end',
    gap: 6,
  },

  actionBtn: {
    borderWidth: 1,
    borderRadius: Spacing.borderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },

  actionText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
  },
});
