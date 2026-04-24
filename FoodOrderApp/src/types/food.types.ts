export interface Category {
  id: string;
  name: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUri: string;
  isAvailable: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTimeMin: number;
  deliveryFee: number;
  imageUri: string;
  categories: Category[];
  menuItems: MenuItem[];
}
