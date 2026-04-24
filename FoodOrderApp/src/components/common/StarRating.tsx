import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import Spacing from '../../constants/spacing';

interface Props {
  value: number;           // 0–5 (0 = none selected)
  onChange?: (rating: number) => void;  // omit for display-only mode
  size?: number;
}

export default function StarRating({ value, onChange, size = 32 }: Props) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        const icon = filled ? 'star' : 'star-outline';
        const color = filled ? Colors.warning : Colors.border;

        if (!onChange) {
          return (
            <Ionicons
              key={star}
              name={icon}
              size={size}
              color={color}
              style={styles.star}
            />
          );
        }

        return (
          <TouchableOpacity
            key={star}
            onPress={() => onChange(star)}
            hitSlop={6}
            activeOpacity={0.7}
          >
            <Ionicons name={icon} size={size} color={color} style={styles.star} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginHorizontal: Spacing.xs,
  },
});
