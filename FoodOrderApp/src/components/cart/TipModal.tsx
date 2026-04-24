import React, { useState } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../common/AppText';
import AppButton from '../common/AppButton';
import TipSelector from './TipSelector';
import Colors from '../../constants/colors';
import Spacing from '../../constants/spacing';
import Typography from '../../constants/typography';

interface Props {
  visible: boolean;
  orderCount: number;
  onConfirm: (tip: number) => void;
  onDismiss: () => void;
}

export default function TipModal({ visible, orderCount, onConfirm, onDismiss }: Props) {
  const [tip, setTip] = useState(2);

  function handleConfirm() {
    onConfirm(tip);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              {/* Handle bar */}
              <View style={styles.handle} />

              {/* Close */}
              <TouchableOpacity style={styles.closeBtn} onPress={onDismiss} hitSlop={8}>
                <Ionicons name="close" size={22} color={Colors.textSecondary} />
              </TouchableOpacity>

              {/* Dasher illustration area */}
              <View style={styles.iconWrap}>
                <Ionicons name="bicycle" size={44} color={Colors.primary} />
              </View>

              <AppText variant="heading" style={styles.title}>
                Tip Your Dasher
              </AppText>
              <AppText variant="body" color={Colors.textSecondary} style={styles.subtitle}>
                Show your appreciation — 100% goes directly to your delivery person.
              </AppText>

              {/* Tip selector */}
              <View style={styles.selectorWrap}>
                <TipSelector
                  value={tip}
                  onChange={setTip}
                  orderCount={orderCount}
                />
              </View>

              {/* Confirm button */}
              <AppButton
                title={`Confirm & Place Order${orderCount > 1 ? 's' : ''}`}
                onPress={handleConfirm}
                fullWidth
                style={styles.confirmBtn}
              />

              {/* Skip tip */}
              <TouchableOpacity
                onPress={() => { setTip(0); onConfirm(0); }}
                style={styles.skipBtn}
              >
                <AppText variant="caption" color={Colors.textMuted}>
                  Skip tip
                </AppText>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },

  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Spacing.borderRadius.xl,
    borderTopRightRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
  },

  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: Spacing.sm,
  },

  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.sm,
  },

  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },

  title: {
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },

  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },

  selectorWrap: {
    width: '100%',
    marginBottom: Spacing.lg,
  },

  confirmBtn: {},

  skipBtn: {
    marginTop: Spacing.md,
    padding: Spacing.xs,
  },
});
