# FoodOrderApp

A React Native mobile app for browsing restaurants, placing food orders, and tracking deliveries in real time — built with Expo, TypeScript, and no backend.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Platform | Expo (Managed Workflow, SDK 54) |
| Language | TypeScript |
| Framework | React Native 0.81 |
| State Management | Context API + useReducer |
| Navigation | React Navigation v7 (Native Stack + Bottom Tabs) |
| Persistence | AsyncStorage |
| Notifications | expo-notifications (local) |
| Icons | @expo/vector-icons (Ionicons) |

---

## Setup Instructions

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9
- Expo Go app on your device (iOS or Android) — [iOS](https://apps.apple.com/app/expo-go/id982107779) · [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Install & Run

```bash
# 1. Clone or navigate to the project directory
cd FoodOrderApp

# 2. Install dependencies (already done if you followed the plan)
npm install

# 3. Start the development server
npx expo start

# 4. Scan the QR code with Expo Go (Android) or Camera app (iOS)
```

### Build an APK (Android)

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to your Expo account
eas login

# Build a preview APK
eas build --platform android --profile preview
```

---

## Project Structure

```
FoodOrderApp/
├── App.tsx                    # Entry point
├── app.json                   # Expo config + notification plugin
└── src/
    ├── types/                 # TypeScript interfaces & enums
    ├── constants/             # Colors, spacing, mock data, timers
    ├── utils/                 # Pure business logic (price, dates, validation)
    ├── reducers/              # cartReducer, orderReducer
    ├── hooks/                 # Infrastructure hooks (storage, notifications, simulation)
    ├── context/               # CartContext, OrderContext, AppContext
    ├── components/
    │   ├── common/            # AppText, AppButton, AppCard, Badge, EmptyState…
    │   ├── food/              # RestaurantCard, MenuItemCard, CategoryChip…
    │   ├── cart/              # CartItemRow, QuantityStepper, PriceSummary
    │   └── tracking/          # StatusStepper, TrackingHeader, ETADisplay
    ├── screens/               # 6 screens: Home, Menu, ItemDetail, Cart, Orders, Tracking
    └── navigation/            # HomeStack, OrdersStack, TabNavigator, RootNavigator
```

---

## Features

### Restaurants & Menu
- Browse 4 mock restaurants (Burger House, Pizza Palace, Sushi Zen, Taco Fiesta)
- Search by name or cuisine
- Filter by cuisine chip
- Tap a restaurant to see its categorized menu
- Add items with the `+` button or from the detail screen

### Cart
- Per-restaurant cart (adding from a second restaurant shows a clear-cart alert)
- Quantity stepper clamped to [1–99]
- Real-time subtotal, 8% tax, total
- Delivery address input with validation (min 5 characters)

### Order Placement
- Validates non-empty cart and address before submitting
- Duplicate-submission guard via `isPlacing` state + reducer ID check
- Navigates directly to the live tracking screen on success

### Live Order Tracking
- Status timeline: **Placed → Preparing → Out for Delivery → Delivered**
- Auto-advances via timer chain (8s → 15s → 20s)
- Catches up on app foreground resume (computes elapsed time vs `updatedAt`)
- Visual step-by-step progress indicator with icons and colors

### Order History
- Persisted to AsyncStorage — survives app restarts
- Active-order badge on the Orders tab icon
- Tap any order to re-open its tracking screen

### Notifications
- Local notifications triggered for: Order Placed, Out for Delivery, Delivered
- Gracefully degrades when permission is denied

---

## Assumptions & Trade-offs

| Decision | Rationale |
|---|---|
| No backend | Scope requirement; all state lives in AsyncStorage |
| Simulated order status | Timers (8s/15s/20s) — fast enough to demo the full flow; adjust `STATUS_DURATIONS` in `src/constants/timers.ts` to change pacing |
| Single-restaurant carts | Simplifies state; cross-restaurant merging requires a backend cart service |
| AsyncStorage over SQLite | No relational queries needed; a flat JSON array is sufficient for order history |
| No authentication | Out of scope; user identity would require a backend |
| Expo Managed over Bare RN | Zero native toolchain setup; all required APIs are available via Expo SDK |
| `__DEV__` console warnings | Invalid reducer actions log warnings in development mode but silently no-op in production |
| Image loading via URLs | Unsplash URLs are used for demo data; real app would use CDN images |

---

## Edge Cases Handled

- **Empty cart checkout** — Place Order button disabled; validator also guards against API-level dispatch
- **Mixed-restaurant cart** — Alert prompts user to clear cart before switching restaurants
- **Duplicate order submission** — `isPlacing` flag prevents double-tap; reducer rejects duplicate order IDs
- **Invalid quantity** — Stepper clamps to [1–99]; reducer normalises any out-of-range value
- **Incorrect state transitions** — `guardStatusTransition()` enforces the linear sequence; reducer ignores out-of-order advances
- **AsyncStorage hydration race** — `isHydrated` flag keeps screens on a loading spinner until data is ready
- **App backgrounding** — `AppState` listener fast-forwards skipped statuses on foreground resume
- **Notification permission denied** — Silently skipped; no crash

---

## Customisation

- **Timer speeds** → `src/constants/timers.ts` — `STATUS_DURATIONS`
- **Tax rate** → `src/utils/priceUtils.ts` — `TAX_RATE`
- **Restaurant data** → `src/constants/mockData.ts`
- **Color palette** → `src/constants/colors.ts`
