import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/common/AppText';
import AppButton from '../components/common/AppButton';
import FoodImage from '../components/food/FoodImage';
import QuantityStepper from '../components/cart/QuantityStepper';
import Colors from '../constants/colors';
import Spacing from '../constants/spacing';
import Typography from '../constants/typography';
import { HomeStackParamList } from '../types/navigation.types';
import { CartItem } from '../types/cart.types';
import { RESTAURANTS } from '../constants/mockData';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/priceUtils';

type RouteProps = RouteProp<HomeStackParamList, 'ItemDetail'>;

export default function ItemDetailScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const { state: cart, addItem, clearCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const restaurant = RESTAURANTS.find((r) => r.id === route.params.restaurantId);
  const item = restaurant?.menuItems.find((m) => m.id === route.params.menuItemId);

  if (!item || !restaurant) return null;

  function handleAddToCart() {
    if (cart.restaurantId && cart.restaurantId !== restaurant!.id) {
      Alert.alert(
        'Different Restaurant',
        `Your cart has items from "${cart.restaurantName}". Clear and start fresh?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Clear & Add',
            style: 'destructive',
            onPress: () => {
              clearCart();
              doAdd();
            },
          },
        ],
      );
      return;
    }
    doAdd();
  }

  function doAdd() {
    const cartItem: CartItem = {
      id: item!.id,
      menuItemId: item!.id,
      restaurantId: restaurant!.id,
      restaurantName: restaurant!.name,
      name: item!.name,
      price: item!.price,
      quantity,
      imageUri: item!.imageUri,
    };
    addItem(cartItem);
    Alert.alert('Added!', `${quantity}× ${item!.name} added to cart.`);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={8}>
        <Ionicons name="arrow-back" size={24} color={Colors.text} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <FoodImage uri={item.imageUri} width={'100%' as any} height={240} style={styles.image} />

        <View style={styles.body}>
          <AppText variant="heading" style={styles.name}>
            {item.name}
          </AppText>
          <AppText variant="body" color={Colors.textSecondary} style={styles.desc}>
            {item.description}
          </AppText>

          <View style={styles.priceRow}>
            <AppText style={styles.price}>{formatCurrency(item.price)}</AppText>
            <QuantityStepper
              value={quantity}
              onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
              onIncrement={() => setQuantity((q) => Math.min(99, q + 1))}
            />
          </View>

          <AppButton
            title={`Add to Cart · ${formatCurrency(item.price * quantity)}`}
            onPress={handleAddToCart}
            fullWidth
            style={styles.addBtn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  backBtn: {
    position: 'absolute',
    top: Spacing.md + 8,
    left: Spacing.md,
    zIndex: 10,
    backgroundColor: Colors.surface,
    borderRadius: Spacing.borderRadius.full,
    padding: Spacing.sm,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  scroll: { paddingBottom: Spacing.xl },
  image: { borderRadius: 0 },
  body: { padding: Spacing.md },
  name: { marginBottom: Spacing.sm },
  desc: { lineHeight: 22, marginBottom: Spacing.lg },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  price: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
    color: Colors.primary,
  },
  addBtn: {},
});
