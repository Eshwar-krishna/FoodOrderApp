import { NavigatorScreenParams } from '@react-navigation/native';

export type HomeStackParamList = {
  RestaurantList: undefined;
  MenuDetail: { restaurantId: string };
  ItemDetail: { menuItemId: string; restaurantId: string };
};

export type OrdersStackParamList = {
  OrdersList: undefined;
  OrderTracking: { orderId: string };
};

export type TabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  CartTab: undefined;
  OrdersTab: NavigatorScreenParams<OrdersStackParamList>;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
};
