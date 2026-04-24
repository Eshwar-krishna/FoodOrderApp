import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import AppText from './AppText';
import Colors from '../../constants/colors';
import Spacing from '../../constants/spacing';
import Typography from '../../constants/typography';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

const variantContainer: Record<Variant, ViewStyle> = {
  primary:   { backgroundColor: Colors.primary },
  secondary: { backgroundColor: Colors.accent },
  outline:   { backgroundColor: 'transparent', borderWidth: 2, borderColor: Colors.primary },
  ghost:     { backgroundColor: 'transparent' },
};

const variantText: Record<Variant, TextStyle> = {
  primary:   { color: Colors.textInverse },
  secondary: { color: Colors.textInverse },
  outline:   { color: Colors.primary },
  ghost:     { color: Colors.primary },
};

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  fullWidth = false,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        variantContainer[variant],
        isDisabled && styles.disabled,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'secondary' ? '#fff' : Colors.primary}
        />
      ) : (
        <AppText
          style={[styles.text, variantText[variant], isDisabled && styles.disabledText]}
        >
          {title}
        </AppText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: Spacing.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.45,
  },
  disabledText: {},
});
