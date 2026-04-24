import React, { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/common/AppText';
import AppButton from '../components/common/AppButton';
import DeliveryTracker from '../components/tracking/DeliveryTracker';
import TrackingHeader from '../components/tracking/TrackingHeader';
import ETADisplay from '../components/tracking/ETADisplay';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StarRating from '../components/common/StarRating';
import RatingModal from '../components/common/RatingModal';
import Colors from '../constants/colors';
import Spacing from '../constants/spacing';
import Typography from '../constants/typography';
import { OrdersStackParamList } from '../types/navigation.types';
import { OrderStatus } from '../types/order.types';
import { useOrders } from '../hooks/useOrders';
import { useOrderSimulation } from '../hooks/useOrderSimulation';
import { formatCurrency } from '../utils/priceUtils';
import { ORDER_STATUS_COLORS } from '../constants/orderStatus';

type RouteProps = RouteProp<OrdersStackParamList, 'OrderTracking'>;

export default function OrderTrackingScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const { state, dispatch, rateOrder } = useOrders();
  const [ratingModalVisible, setRatingModalVisible] = useState(false);

  const order = useMemo(
    () => state.orders.find((o) => o.id === route.params.orderId),
    [state.orders, route.params.orderId],
  );

  useOrderSimulation(order, dispatch);

  if (!state.isHydrated) return <LoadingSpinner />;

  if (!order) {
    return (
      <SafeAreaView style={styles.safe}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <AppText variant="body" color={Colors.textSecondary} style={{ padding: Spacing.lg }}>
          Order not found.
        </AppText>
      </SafeAreaView>
    );
  }

  const isDelivered = order.status === OrderStatus.DELIVERED;
  const hasRating   = order.rating !== null && order.rating !== undefined;
  const statusColor = ORDER_STATUS_COLORS[order.status];

  function handleRatingSubmit(rating: number) {
    rateOrder(order!.id, rating);
    setRatingModalVisible(false);
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* ─── Top navigation bar ─── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.topBarCenter}>
          <AppText style={styles.topBarTitle}>Track Order</AppText>
          <AppText style={styles.topBarSub}>#{order.id.slice(-6).toUpperCase()}</AppText>
        </View>
        {/* Live / Done indicator */}
        <View style={[styles.statusPill, { backgroundColor: `${statusColor}18`, borderColor: statusColor }]}>
          {!isDelivered && <View style={[styles.statusDot, { backgroundColor: statusColor }]} />}
          <AppText style={[styles.statusPillText, { color: statusColor }]}>
            {isDelivered ? 'Delivered' : 'Live'}
          </AppText>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ─── ETA / header card ─── */}
        <View style={styles.card}>
          <TrackingHeader
            orderId={order.id}
            restaurantName={order.restaurantName}
            placedAt={order.placedAt}
          />
          <ETADisplay
            estimatedDeliveryAt={order.estimatedDeliveryAt}
            status={order.status}
          />
        </View>

        {/* ─── Delivery journey tracker ─── */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="navigate-outline" size={16} color={Colors.primary} />
            <AppText style={styles.cardTitle}>Delivery Journey</AppText>
            {!isDelivered && (
              <View style={styles.liveChip}>
                <View style={styles.liveDot} />
                <AppText style={styles.liveText}>Live</AppText>
              </View>
            )}
          </View>
          <DeliveryTracker
            restaurantName={order.restaurantName}
            deliveryAddress={order.deliveryAddress}
            currentStatus={order.status}
          />
        </View>

        {/* ─── Rating card (after delivery) ─── */}
        {isDelivered && (
          <View style={styles.card}>
            {hasRating ? (
              <View style={styles.ratingDoneRow}>
                <View style={styles.ratingCheckCircle}>
                  <Ionicons name="checkmark" size={18} color={Colors.success} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText style={styles.cardTitle}>Your Rating</AppText>
                  <StarRating value={order.rating!} size={22} />
                </View>
              </View>
            ) : (
              <View style={styles.ratingPromptRow}>
                <View style={styles.ratingStarCircle}>
                  <Ionicons name="star-half-outline" size={22} color={Colors.warning} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText style={styles.cardTitle}>How was your order?</AppText>
                  <AppText style={styles.cardSub}>
                    Rate your experience with {order.restaurantName}
                  </AppText>
                </View>
                <AppButton
                  title="Rate"
                  onPress={() => setRatingModalVisible(true)}
                  style={styles.rateBtn}
                />
              </View>
            )}
          </View>
        )}

        {/* ─── Receipt ─── */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="receipt-outline" size={16} color={Colors.primary} />
            <AppText style={styles.cardTitle}>Receipt</AppText>
          </View>

          {order.items.map((item) => (
            <View key={item.menuItemId} style={styles.receiptRow}>
              <AppText style={styles.receiptQty}>{item.quantity}×</AppText>
              <AppText style={styles.receiptName} numberOfLines={1}>{item.name}</AppText>
              <AppText style={styles.receiptPrice}>
                {formatCurrency(item.unitPrice * item.quantity)}
              </AppText>
            </View>
          ))}

          <View style={styles.receiptDivider} />

          <View style={styles.receiptRow}>
            <AppText style={styles.receiptMeta}>Subtotal</AppText>
            <AppText style={styles.receiptMeta}>{formatCurrency(order.subtotal)}</AppText>
          </View>
          <View style={styles.receiptRow}>
            <AppText style={styles.receiptMeta}>Tax</AppText>
            <AppText style={styles.receiptMeta}>{formatCurrency(order.tax)}</AppText>
          </View>
          <View style={styles.receiptRow}>
            <AppText style={styles.receiptMeta}>Delivery fee</AppText>
            <AppText style={styles.receiptMeta}>{formatCurrency(order.deliveryFee)}</AppText>
          </View>
          {order.tip > 0 && (
            <View style={styles.receiptRow}>
              <AppText style={styles.tipLabel}>Dasher Tip ❤️</AppText>
              <AppText style={styles.tipValue}>{formatCurrency(order.tip)}</AppText>
            </View>
          )}

          <View style={styles.receiptDivider} />

          <View style={styles.receiptRow}>
            <AppText style={styles.totalLabel}>Total</AppText>
            <AppText style={styles.totalValue}>{formatCurrency(order.total)}</AppText>
          </View>
        </View>
      </ScrollView>

      <RatingModal
        visible={ratingModalVisible}
        restaurantName={order.restaurantName}
        onSubmit={handleRatingSubmit}
        onDismiss={() => setRatingModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },

  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },

  topBarCenter: { alignItems: 'center' },

  topBarTitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
  },

  topBarSub: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },

  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Spacing.borderRadius.full,
    borderWidth: 1,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  statusPillText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
  },

  scroll: {
    padding: Spacing.md,
    gap: Spacing.md,
  },

  // ─── Generic card ───
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    gap: Spacing.sm,
  },

  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  cardTitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
    flex: 1,
  },

  cardSub: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${Colors.success}15`,
    borderRadius: Spacing.borderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },

  liveText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.success,
  },

  // ─── Rating ───
  ratingDoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },

  ratingCheckCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.success}18`,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ratingPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },

  ratingStarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${Colors.warning}18`,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rateBtn: {
    paddingHorizontal: Spacing.sm,
    minHeight: 38,
  },

  // ─── Receipt ───
  receiptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
  },

  receiptQty: {
    width: 28,
    fontSize: Typography.size.sm,
    color: Colors.primary,
    fontWeight: Typography.weight.semibold,
  },

  receiptName: {
    flex: 1,
    fontSize: Typography.size.sm,
    color: Colors.text,
  },

  receiptPrice: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },

  receiptDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.divider,
    marginVertical: 4,
  },

  receiptMeta: {
    flex: 1,
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },

  tipLabel: {
    flex: 1,
    fontSize: Typography.size.sm,
    color: Colors.primary,
    fontWeight: Typography.weight.medium,
  },

  tipValue: {
    fontSize: Typography.size.sm,
    color: Colors.primary,
    fontWeight: Typography.weight.semibold,
  },

  totalLabel: {
    flex: 1,
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
  },

  totalValue: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.extrabold,
    color: Colors.primary,
  },
});
