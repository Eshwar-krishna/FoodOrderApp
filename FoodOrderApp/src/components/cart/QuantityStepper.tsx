import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../common/AppText';
import Colors from '../../constants/colors';
import Spacing from '../../constants/spacing';

interface Props {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  min?: number;
  max?: number;
}

export default function QuantityStepper({
  value,
  onDecrement,
  onIncrement,
  min = 1,
  max = 99,
}: Props) {
  const atMin = value <= min;
  const atMax = value >= max;

  return (
    <View style={styles.row}>
      <TouchableOpacity
        onPress={onDecrement}
        disabled={atMin}
        style={[styles.btn, atMin ? styles.btnOutline : styles.btnFilled]}
        activeOpacity={0.72}
      >
        <Ionicons
          name="remove"
          size={15}
          color={atMin ? Colors.textMuted : Colors.textInverse}
        />
      </TouchableOpacity>

      <AppText style={styles.count}>{value}</AppText>

      <TouchableOpacity
        onPress={onIncrement}
        disabled={atMax}
        style={[styles.btn, atMax ? styles.btnOutline : styles.btnFilled]}
        activeOpacity={0.72}
      >
        <Ionicons
          name="add"
          size={15}
          color={atMax ? Colors.textMuted : Colors.textInverse}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  btn: {
    width: 30,
    height: 30,
    borderRadius: Spacing.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnFilled: {
    backgroundColor: Colors.primary,
  },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  count: {
    fontSize: 15,
    fontWeight: '700',
    minWidth: 22,
    textAlign: 'center',
    color: Colors.text,
  },
});
