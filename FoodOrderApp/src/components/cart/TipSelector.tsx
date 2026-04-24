import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../common/AppText';
import Colors from '../../constants/colors';
import Spacing from '../../constants/spacing';
import Typography from '../../constants/typography';

interface Props {
  value: number;          // current tip in dollars
  onChange: (tip: number) => void;
  orderCount?: number;    // shown when > 1 so user knows tip is per order
}

const PRESETS = [
  { label: 'No Tip', amount: 0 },
  { label: '$1',     amount: 1 },
  { label: '$2',     amount: 2 },
  { label: '$3',     amount: 3 },
  { label: '$5',     amount: 5 },
];

const CUSTOM_KEY = 'custom';

export default function TipSelector({ value, onChange, orderCount = 1 }: Props) {
  const isPreset = PRESETS.some((p) => p.amount === value);
  const [mode, setMode] = useState<number | 'custom'>(isPreset ? value : CUSTOM_KEY);
  const [customText, setCustomText] = useState(isPreset ? '' : String(value));

  function selectPreset(amount: number) {
    setMode(amount);
    onChange(amount);
  }

  function selectCustom() {
    setMode(CUSTOM_KEY);
    const parsed = parseFloat(customText);
    onChange(isNaN(parsed) ? 0 : Math.max(0, parsed));
  }

  function handleCustomChange(text: string) {
    setCustomText(text);
    const parsed = parseFloat(text);
    onChange(isNaN(parsed) ? 0 : Math.max(0, parsed));
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="heart" size={16} color={Colors.error} />
        <AppText variant="body" style={styles.title}>
          Tip Your Dasher
        </AppText>
      </View>
      <AppText variant="caption" color={Colors.textSecondary} style={styles.subtitle}>
        100% goes directly to your delivery person
      </AppText>

      {orderCount > 1 && (
        <AppText variant="caption" color={Colors.textMuted} style={styles.perOrder}>
          Tip is applied per order ({orderCount} orders)
        </AppText>
      )}

      {/* Preset buttons */}
      <View style={styles.presets}>
        {PRESETS.map((preset) => {
          const active = mode === preset.amount;
          return (
            <TouchableOpacity
              key={preset.label}
              onPress={() => selectPreset(preset.amount)}
              style={[styles.chip, active && styles.chipActive]}
              activeOpacity={0.75}
            >
              <AppText
                style={[styles.chipText, active && styles.chipTextActive]}
              >
                {preset.label}
              </AppText>
            </TouchableOpacity>
          );
        })}

        {/* Custom button */}
        <TouchableOpacity
          onPress={selectCustom}
          style={[styles.chip, mode === CUSTOM_KEY && styles.chipActive]}
          activeOpacity={0.75}
        >
          <AppText
            style={[styles.chipText, mode === CUSTOM_KEY && styles.chipTextActive]}
          >
            Other
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Custom amount input */}
      {mode === CUSTOM_KEY && (
        <View style={styles.customRow}>
          <AppText style={styles.dollar}>$</AppText>
          <TextInput
            value={customText}
            onChangeText={handleCustomChange}
            placeholder="0.00"
            placeholderTextColor={Colors.textMuted}
            keyboardType="decimal-pad"
            style={styles.customInput}
            autoFocus
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },

  title: {
    fontWeight: Typography.weight.semibold,
  },

  subtitle: {
    marginBottom: Spacing.sm,
  },

  perOrder: {
    marginBottom: Spacing.sm,
    fontStyle: 'italic',
  },

  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },

  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 2,
    borderRadius: Spacing.borderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },

  chipActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}14`,
  },

  chipText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.textSecondary,
  },

  chipTextActive: {
    color: Colors.primary,
    fontWeight: Typography.weight.semibold,
  },

  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: Spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    height: 44,
  },

  dollar: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.primary,
    marginRight: 4,
  },

  customInput: {
    flex: 1,
    fontSize: Typography.size.md,
    color: Colors.text,
  },
});
