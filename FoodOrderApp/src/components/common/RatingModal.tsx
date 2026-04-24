import React, { useState } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';
import AppButton from './AppButton';
import StarRating from './StarRating';
import Colors from '../../constants/colors';
import Spacing from '../../constants/spacing';
import Typography from '../../constants/typography';

interface Props {
  visible: boolean;
  restaurantName: string;
  onSubmit: (rating: number) => void;
  onDismiss: () => void;
}

const LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Great',
  5: 'Excellent!',
};

export default function RatingModal({ visible, restaurantName, onSubmit, onDismiss }: Props) {
  const [selected, setSelected] = useState(0);

  function handleSubmit() {
    if (selected === 0) return;
    onSubmit(selected);
    setSelected(0);
  }

  function handleDismiss() {
    setSelected(0);
    onDismiss();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleDismiss}
    >
      <TouchableWithoutFeedback onPress={handleDismiss}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              {/* Close button */}
              <TouchableOpacity style={styles.closeBtn} onPress={handleDismiss} hitSlop={8}>
                <Ionicons name="close" size={22} color={Colors.textSecondary} />
              </TouchableOpacity>

              {/* Trophy icon */}
              <View style={styles.iconWrap}>
                <Ionicons name="trophy" size={48} color={Colors.warning} />
              </View>

              <AppText variant="heading" style={styles.title}>
                Order Delivered!
              </AppText>
              <AppText variant="body" color={Colors.textSecondary} style={styles.subtitle}>
                How was your experience with
              </AppText>
              <AppText variant="subheading" style={styles.restaurant}>
                {restaurantName}
              </AppText>

              {/* Stars */}
              <View style={styles.starsWrap}>
                <StarRating value={selected} onChange={setSelected} size={40} />
              </View>

              {/* Label */}
              <AppText
                variant="body"
                style={[styles.label, { opacity: selected > 0 ? 1 : 0 }]}
              >
                {selected > 0 ? LABELS[selected] : ' '}
              </AppText>

              {/* Submit */}
              <AppButton
                title="Submit Rating"
                onPress={handleSubmit}
                disabled={selected === 0}
                fullWidth
                style={styles.submitBtn}
              />

              <TouchableOpacity onPress={handleDismiss} style={styles.laterBtn}>
                <AppText variant="caption" color={Colors.textMuted}>
                  Maybe Later
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

  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.sm,
  },

  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${Colors.warning}18`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },

  title: {
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },

  subtitle: {
    textAlign: 'center',
  },

  restaurant: {
    textAlign: 'center',
    color: Colors.primary,
    marginTop: 2,
  },

  starsWrap: {
    marginVertical: Spacing.lg,
  },

  label: {
    fontWeight: Typography.weight.semibold,
    color: Colors.warning,
    fontSize: Typography.size.md,
    marginBottom: Spacing.md,
    minHeight: 22,
  },

  submitBtn: {
    marginTop: Spacing.xs,
  },

  laterBtn: {
    marginTop: Spacing.md,
    padding: Spacing.xs,
  },
});
