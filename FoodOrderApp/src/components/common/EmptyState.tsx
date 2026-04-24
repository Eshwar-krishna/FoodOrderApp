import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';
import AppButton from './AppButton';
import Colors from '../../constants/colors';
import Spacing from '../../constants/spacing';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, title, message, actionLabel, onAction }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color={Colors.textMuted} />
      <AppText variant="subheading" style={styles.title}>
        {title}
      </AppText>
      <AppText variant="body" color={Colors.textSecondary} style={styles.message}>
        {message}
      </AppText>
      {actionLabel && onAction && (
        <AppButton title={actionLabel} onPress={onAction} style={styles.button} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  title: {
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  message: {
    marginTop: Spacing.sm,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    marginTop: Spacing.lg,
    minWidth: 180,
  },
});
