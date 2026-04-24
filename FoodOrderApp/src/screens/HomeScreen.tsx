import React, { useState, useMemo } from 'react';
import {
  View,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import RestaurantCard from '../components/food/RestaurantCard';
import CategoryChip from '../components/food/CategoryChip';
import AppText from '../components/common/AppText';
import EmptyState from '../components/common/EmptyState';
import Colors from '../constants/colors';
import Spacing from '../constants/spacing';
import Typography from '../constants/typography';
import { RESTAURANTS, ALL_CUISINES } from '../constants/mockData';
import { HomeStackParamList } from '../types/navigation.types';
import { useAuth } from '../context/AuthContext';

type Nav = NativeStackNavigationProp<HomeStackParamList, 'RestaurantList'>;

// Emoji + display label for each cuisine filter
const CUISINE_META: Record<string, { emoji: string; label: string }> = {
  'All':      { emoji: '🍽️', label: 'All' },
  'Indian':   { emoji: '🍛',  label: 'Indian' },
  'American': { emoji: '🍔',  label: 'American' },
  'Italian':  { emoji: '🍕',  label: 'Italian' },
  'Chinese':  { emoji: '🥡',  label: 'Chinese' },
  'Japanese': { emoji: '🍣',  label: 'Japanese' },
  'Mexican':  { emoji: '🌮',  label: 'Mexican' },
};

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { user, signOut } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');

  // First initial of the user's name for the avatar
  const initials = user?.name?.trim().charAt(0).toUpperCase() ?? '?';

  const filtered = useMemo(() => {
    return RESTAURANTS.filter((r) => {
      const matchSearch =
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(search.toLowerCase());
      const matchCuisine = selectedCuisine === 'All' || r.cuisine === selectedCuisine;
      return matchSearch && matchCuisine;
    });
  }, [search, selectedCuisine]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* ─── Orange gradient header ─── */}
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <AppText style={styles.brandName}>FoodOrder</AppText>
            <AppText style={styles.tagline}>
              Hey {user?.name?.split(' ')[0] ?? 'there'} 👋 What are you craving?
            </AppText>
          </View>
          {/* User avatar + logout */}
          <TouchableOpacity
            onPress={signOut}
            style={styles.avatarBtn}
            activeOpacity={0.8}
          >
            <View style={styles.avatar}>
              <AppText style={styles.avatarText}>{initials}</AppText>
            </View>
            <Ionicons name="log-out-outline" size={15} color={Colors.textInverse} style={styles.logoutIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
          <Ionicons name="search" size={18} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search restaurants or cuisine..."
            placeholderTextColor={Colors.textMuted}
            style={styles.searchInput}
          />
          {search.length > 0 && (
            <Ionicons
              name="close-circle"
              size={18}
              color={Colors.textMuted}
              onPress={() => setSearch('')}
            />
          )}
        </View>
      </LinearGradient>

      {/* ─── Cuisine filter strip ─── */}
      {/* White card band so chips clearly stand out */}
      <View style={styles.chipStrip}>
        <AppText style={styles.chipStripLabel}>Filter by cuisine</AppText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipContent}
        >
          {ALL_CUISINES.map((cuisine) => {
            const meta = CUISINE_META[cuisine] ?? { emoji: '', label: cuisine };
            return (
              <CategoryChip
                key={cuisine}
                label={`${meta.emoji}  ${meta.label}`}
                active={selectedCuisine === cuisine}
                onPress={() => setSelectedCuisine(cuisine)}
              />
            );
          })}
        </ScrollView>
      </View>

      {/* ─── Section heading ─── */}
      <View style={styles.sectionRow}>
        <AppText style={styles.sectionTitle}>
          {selectedCuisine === 'All' ? 'All Restaurants' : `${CUISINE_META[selectedCuisine]?.emoji ?? ''} ${selectedCuisine}`}
        </AppText>
        <AppText style={styles.sectionCount}>
          {filtered.length} place{filtered.length !== 1 ? 's' : ''}
        </AppText>
      </View>

      {/* ─── Restaurant list ─── */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="No restaurants found"
          message="Try a different search or filter."
          actionLabel="Clear filters"
          onAction={() => { setSearch(''); setSelectedCuisine('All'); }}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(r) => r.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <RestaurantCard
              restaurant={item}
              onPress={() => navigation.navigate('MenuDetail', { restaurantId: item.id })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ─── Header ───
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  brandName: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.extrabold,
    color: Colors.textInverse,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: Typography.size.sm,
    color: 'rgba(255,255,255,0.82)',
    marginTop: 2,
  },
  deliveryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.textInverse,
    borderRadius: Spacing.borderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
  },
  deliveryText: {
    color: Colors.primary,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Spacing.borderRadius.full,
    paddingHorizontal: Spacing.md,
    height: 46,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  // ─── Avatar / logout ───
  avatarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: Spacing.sm,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.60)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.extrabold,
    color: Colors.textInverse,
  },
  logoutIcon: {
    opacity: 0.85,
  },

  searchIcon: { marginRight: Spacing.sm },
  searchInput: {
    flex: 1,
    fontSize: Typography.size.md,
    color: Colors.text,
  },

  // ─── Cuisine filter strip ───
  chipStrip: {
    backgroundColor: Colors.surface,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  chipStripLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  chipContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xs,
  },

  // ─── Section heading ───
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
  },
  sectionCount: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
  },

  // ─── Restaurant list ───
  list: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
});
