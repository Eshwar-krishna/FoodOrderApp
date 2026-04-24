import React from 'react';
import { Text, TextStyle, StyleSheet, StyleProp } from 'react-native';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';

type Variant = 'title' | 'heading' | 'subheading' | 'body' | 'caption' | 'label';

interface Props {
  children: React.ReactNode;
  variant?: Variant;
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}

const variantStyles: Record<Variant, TextStyle> = {
  title:      { fontSize: Typography.size.xxxl, fontWeight: Typography.weight.extrabold },
  heading:    { fontSize: Typography.size.xxl,  fontWeight: Typography.weight.bold },
  subheading: { fontSize: Typography.size.xl,   fontWeight: Typography.weight.semibold },
  body:       { fontSize: Typography.size.md,   fontWeight: Typography.weight.regular },
  caption:    { fontSize: Typography.size.sm,   fontWeight: Typography.weight.regular },
  label:      { fontSize: Typography.size.xs,   fontWeight: Typography.weight.medium },
};

export default function AppText({ children, variant = 'body', color, style, numberOfLines }: Props) {
  return (
    <Text
      style={[styles.base, variantStyles[variant], color ? { color } : undefined, style]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: Colors.text,
  },
});
