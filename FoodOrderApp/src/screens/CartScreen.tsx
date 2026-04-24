import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/common/AppText';
import AppButton from '../components/common/AppButton';
import CartItemRow from '../components/cart/CartItemRow';
import PriceSummary from '../components/cart/PriceSummary';
import TipModal from '../components/cart/TipModal';
import EmptyState from '../components/common/EmptyState';
import Colors from '../constants/colors';
import Spacing from '../constants/spacing';
import Typography from '../constants/typography';
import { useCart } from '../hooks/useCart';
import { useOrders } from '../hooks/useOrders';
import { RESTAURANTS } from '../constants/mockData';
import { calculateSubtotal, calculateTax, calculateTotal } from '../utils/priceUtils';
import { validateCartNotEmpty, validateDeliveryAddress } from '../utils/validationUtils';
import { generateOrderId, getEstimatedDeliveryAt } from '../utils/orderUtils';
import { CartItem } from '../types/cart.types';
import { Order, OrderStatus } from '../types/order.types';

interface RestaurantGroup {
  restaurantId: string;
  restaurantName: string;
  deliveryFee: number;
  items: CartItem[];
}

function groupByRestaurant(items: CartItem[]): RestaurantGroup[] {
  const map = new Map<string, RestaurantGroup>();
  for (const item of items) {
    if (!map.has(item.restaurantId)) {
      const restaurant = RESTAURANTS.find((r) => r.id === item.restaurantId);
      map.set(item.restaurantId, {
        restaurantId: item.restaurantId,
        restaurantName: item.restaurantName,
        deliveryFee: restaurant?.deliveryFee ?? 0,
        items: [],
      });
    }
    map.get(item.restaurantId)!.items.push(item);
  }
  return Array.from(map.values());
}

export default function CartScreen() {
  const navigation = useNavigation();
  const { state: cart, removeItem, updateQuantity, clearCart, itemCount } = useCart();
  const { placeOrder } = useOrders();
  const [address, setAddress]           = useState('');
  const [addressError, setAddressError] = useState('');
  const [addressFocused, setAddressFocused] = useState(false);
  const [isPlacing, setIsPlacing]       = useState(false);
  const [tipModalVisible, setTipModalVisible] = useState(false);

  const groups = useMemo(() => groupByRestaurant(cart.items), [cart.items]);

  const grandSubtotal    = useMemo(() => calculateSubtotal(cart.items), [cart.items]);
  const grandTax         = useMemo(() => calculateTax(grandSubtotal), [grandSubtotal]);
  const grandDeliveryFee = useMemo(
    () => groups.reduce((sum, g) => sum + g.deliveryFee, 0),
    [groups],
  );
  const estimatedTip   = 2 * groups.length;
  const estimatedTotal = calculateTotal(grandSubtotal, grandTax, grandDeliveryFee) + estimatedTip;

  function handlePressPlaceOrder() {
    const cartCheck = validateCartNotEmpty(cart);
    if (!cartCheck.ok) { Alert.alert('Empty Cart', cartCheck.error); return; }
    const addrCheck = validateDeliveryAddress(address);
    if (!addrCheck.ok) { setAddressError(addrCheck.error); return; }
    setAddressError('');
    setTipModalVisible(true);
  }

  function handleTipConfirmed(tip: number) {
    setTipModalVisible(false);
    setIsPlacing(true);

    const now = new Date().toISOString();
    let lastOrderId = '';

    for (const group of groups) {
      const subtotal = calculateSubtotal(group.items);
      const tax      = calculateTax(subtotal);
      const total    = calculateTotal(subtotal, tax, group.deliveryFee) + tip;
      const orderId  = generateOrderId();
      lastOrderId    = orderId;

      const order: Order = {
        id:              orderId,
        restaurantId:    group.restaurantId,
        restaurantName:  group.restaurantName,
        deliveryAddress: address.trim(),
        items: group.items.map((i) => ({
          menuItemId: i.menuItemId,
          name:       i.name,
          quantity:   i.quantity,
          unitPrice:  i.price,
        })),
        subtotal, tax,
        deliveryFee:         group.deliveryFee,
        tip, total,
        status:              OrderStatus.PLACED,
        placedAt:            now,
        updatedAt:           now,
        estimatedDeliveryAt: getEstimatedDeliveryAt(now),
        rating:              null,
      };
      placeOrder(order);
    }

    clearCart();
    setIsPlacing(false);

    navigation.dispatch(
      CommonActions.navigate('OrdersTab', {
        screen: 'OrderTracking',
        params: { orderId: lastOrderId },
      }),
    );
  }

  if (itemCount === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <AppText style={styles.headerTitle}>Your Cart</AppText>
        </View>
        <EmptyState
          icon="cart-outline"
          title="Cart is empty"
          message="Browse restaurants and add items to get started."
          actionLabel="Browse Restaurants"
          onAction={() => navigation.navigate('HomeTab' as never)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ─── Header ─── */}
        <View style={styles.header}>
          <View>
            <AppText style={styles.headerTitle}>Your Cart</AppText>
            <AppText style={styles.headerSub}>
              {itemCount} item{itemCount !== 1 ? 's' : ''} from {groups.length} restaurant{groups.length !== 1 ? 's' : ''}
            </AppText>
          </View>
          <TouchableOpacity
            onPress={() => { Alert.alert('Clear cart?', 'Remove all items?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear', style: 'destructive', onPress: clearCart },
            ]); }}
            hitSlop={8}
          >
            <AppText style={styles.clearText}>Clear</AppText>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* ─── Restaurant groups ─── */}
          {groups.map((group, gIdx) => {
            const groupSubtotal = calculateSubtotal(group.items);
            return (
              <View key={group.restaurantId} style={styles.groupCard}>
                {/* Group header */}
                <View style={styles.groupHeader}>
                  <View style={styles.groupHeaderLeft}>
                    <View style={styles.storeIconWrap}>
                      <Ionicons name="storefront" size={14} color={Colors.primary} />
                    </View>
                    <AppText style={styles.groupTitle} numberOfLines={1}>
                      {group.restaurantName}
                    </AppText>
                  </View>
                  <AppText style={styles.groupItemCount}>
                    {group.items.length} item{group.items.length !== 1 ? 's' : ''}
                  </AppText>
                </View>

                <View style={styles.groupDivider} />

                {/* Cart items */}
                {group.items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onRemove={removeItem}
                    onUpdateQty={updateQuantity}
                  />
                ))}

                {/* Group subtotal footer */}
                <View style={styles.groupFooter}>
                  <AppText style={styles.groupSubLabel}>Group subtotal</AppText>
                  <AppText style={styles.groupSubtotal}>${groupSubtotal.toFixed(2)}</AppText>
                </View>

                {gIdx < groups.length - 1 && <View style={styles.groupSep} />}
              </View>
            );
          })}

          {/* ─── Delivery address ─── */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.sectionIconWrap, { backgroundColor: `${Colors.info}15` }]}>
                <Ionicons name="location" size={16} color={Colors.info} />
              </View>
              <AppText style={styles.sectionTitle}>Delivery Address</AppText>
            </View>

            <TextInput
              value={address}
              onChangeText={(t) => { setAddress(t); setAddressError(''); }}
              onFocus={() => setAddressFocused(true)}
              onBlur={() => setAddressFocused(false)}
              placeholder="123 Main St, Apt 4B, City"
              placeholderTextColor={Colors.textMuted}
              style={[
                styles.addressInput,
                addressFocused && styles.addressInputFocused,
                !!addressError && styles.addressInputError,
              ]}
              multiline
              numberOfLines={2}
            />
            {!!addressError && (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle-outline" size={13} color={Colors.error} />
                <AppText style={styles.errorText}>{addressError}</AppText>
              </View>
            )}
          </View>

          {/* ─── Price summary ─── */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.sectionIconWrap, { backgroundColor: `${Colors.success}15` }]}>
                <Ionicons name="receipt-outline" size={16} color={Colors.success} />
              </View>
              <AppText style={styles.sectionTitle}>Order Summary</AppText>
            </View>

            <PriceSummary
              subtotal={grandSubtotal}
              tax={grandTax}
              deliveryFee={grandDeliveryFee}
              tip={estimatedTip}
              total={estimatedTotal}
            />
          </View>

          {/* ─── Dasher tip hint ─── */}
          <View style={styles.tipHint}>
            <Ionicons name="bicycle" size={16} color={Colors.primary} />
            <AppText style={styles.tipHintText}>
              You'll choose your dasher tip on the next step
            </AppText>
          </View>

          {/* Multi-restaurant note */}
          {groups.length > 1 && (
            <View style={styles.multiNote}>
              <Ionicons name="information-circle-outline" size={14} color={Colors.textMuted} />
              <AppText style={styles.multiNoteText}>
                {groups.length} separate orders will be placed — one per restaurant
              </AppText>
            </View>
          )}

          {/* ─── Place order button ─── */}
          <AppButton
            title={groups.length > 1 ? `Place ${groups.length} Orders` : 'Place Order'}
            onPress={handlePressPlaceOrder}
            loading={isPlacing}
            disabled={isPlacing}
            fullWidth
            style={styles.orderBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <TipModal
        visible={tipModalVisible}
        orderCount={groups.length}
        onConfirm={handleTipConfirmed}
        onDismiss={() => setTipModalVisible(false)}
      />
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

  headerSub: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },

  clearText: {
    fontSize: Typography.size.sm,
    color: Colors.error,
    fontWeight: Typography.weight.semibold,
  },

  scroll: { padding: Spacing.md, gap: Spacing.md },

  // ─── Restaurant group card ───
  groupCard: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.borderRadius.lg,
    overflow: 'hidden',
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    backgroundColor: `${Colors.primary}08`,
  },

  groupHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },

  storeIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${Colors.primary}18`,
    alignItems: 'center',
    justifyContent: 'center',
  },

  groupTitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
    flex: 1,
  },

  groupItemCount: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
    fontWeight: Typography.weight.medium,
  },

  groupDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.divider,
  },

  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.divider,
    backgroundColor: Colors.surfaceAlt,
  },

  groupSubLabel: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },

  groupSubtotal: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
  },

  groupSep: { height: Spacing.xs },

  // ─── Section cards (address + summary) ───
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
    gap: Spacing.sm,
  },

  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 4,
  },

  sectionIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionTitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
  },

  addressInput: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Spacing.borderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.size.md,
    color: Colors.text,
    borderWidth: 1.5,
    borderColor: Colors.border,
    minHeight: 64,
    textAlignVertical: 'top',
  },

  addressInputFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },

  addressInputError: {
    borderColor: Colors.error,
  },

  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  errorText: {
    fontSize: Typography.size.sm,
    color: Colors.error,
  },

  // ─── Tip hint ───
  tipHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: Spacing.sm,
    backgroundColor: `${Colors.primary}0E`,
    borderRadius: Spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: `${Colors.primary}28`,
  },

  tipHintText: {
    flex: 1,
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },

  multiNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    padding: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Spacing.borderRadius.md,
  },

  multiNoteText: {
    flex: 1,
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
    lineHeight: 18,
  },

  orderBtn: { marginTop: 4 },
});
