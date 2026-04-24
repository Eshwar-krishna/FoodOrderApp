import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/common/AppText';
import HomeStack from './HomeStack';
import OrdersStack from './OrdersStack';
import CartScreen from '../screens/CartScreen';
import Colors from '../constants/colors';
import Spacing from '../constants/spacing';
import { TabParamList } from '../types/navigation.types';
import { useCart } from '../hooks/useCart';
import { useOrders } from '../hooks/useOrders';
import { OrderStatus } from '../types/order.types';

const Tab = createBottomTabNavigator<TabParamList>();

function CartBadge() {
  const { itemCount } = useCart();
  if (itemCount === 0) return null;
  return (
    <View style={badge.bubble}>
      <AppText style={badge.text}>{itemCount > 99 ? '99+' : itemCount}</AppText>
    </View>
  );
}

function OrdersBadge() {
  const { state } = useOrders();
  const activeCount = state.orders.filter((o) => o.status !== OrderStatus.DELIVERED).length;
  if (activeCount === 0) return null;
  return (
    <View style={badge.bubble}>
      <AppText style={badge.text}>{activeCount}</AppText>
    </View>
  );
}

const badge = StyleSheet.create({
  bubble: {
    position: 'absolute',
    top: -5,
    right: -9,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  text: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color, focused }) => (
            <View>
              <Ionicons name={focused ? 'cart' : 'cart-outline'} size={24} color={color} />
              <CartBadge />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersStack}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color, focused }) => (
            <View>
              <Ionicons name={focused ? 'receipt' : 'receipt-outline'} size={24} color={color} />
              <OrdersBadge />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.xs,
    height: Platform.OS === 'ios' ? 80 : 64,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 10,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabItem: {
    paddingTop: 4,
  },
});
