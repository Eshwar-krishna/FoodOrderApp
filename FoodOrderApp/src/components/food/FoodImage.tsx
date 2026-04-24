import React, { useState } from 'react';
import { Image, View, StyleSheet, ImageStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';

interface Props {
  uri?: string;
  style?: ImageStyle;
  width?: number;
  height?: number;
}

export default function FoodImage({ uri, style, width = 80, height = 80 }: Props) {
  const [error, setError] = useState(false);

  if (!uri || error) {
    return (
      <View style={[styles.placeholder, { width, height }, style as any]}>
        <Ionicons name="fast-food-outline" size={32} color={Colors.textMuted} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={[{ width, height, borderRadius: 8 }, style]}
      onError={() => setError(true)}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
