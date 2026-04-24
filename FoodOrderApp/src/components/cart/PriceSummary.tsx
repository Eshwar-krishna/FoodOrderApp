import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../common/AppText';
import Divider from '../common/Divider';
import Colors from '../../constants/colors';
import Spacing from '../../constants/spacing';
import Typography from '../../constants/typography';
import { formatCurrency } from '../../utils/priceUtils';

interface Props {
  subtotal: number;
  tax: number;
  deliveryFee: number;
  tip: number;
  total: number;
}

function Row({
  label,
  value,
  bold,
  highlight,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <View style={styles.row}>
      <AppText style={bold ? styles.boldText : highlight ? styles.highlightText : styles.label}>
        {label}
      </AppText>
      <AppText style={bold ? styles.boldPrice : highlight ? styles.highlightPrice : styles.value}>
        {value}
      </AppText>
    </View>
  );
}

export default function PriceSummary({ subtotal, tax, deliveryFee, tip, total }: Props) {
  return (
    <View style={styles.container}>
      <Row label="Subtotal"     value={formatCurrency(subtotal)} />
      <Row label="Tax (8%)"     value={formatCurrency(tax)} />
      <Row label="Delivery Fee" value={formatCurrency(deliveryFee)} />
      {tip > 0 && (
        <Row label="Dasher Tip ❤️" value={formatCurrency(tip)} highlight />
      )}
      <Divider margin={Spacing.sm} />
      <Row label="Total" value={formatCurrency(total)} bold />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs + 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: Colors.textSecondary,
    fontSize: Typography.size.md,
  },
  value: {
    color: Colors.textSecondary,
    fontSize: Typography.size.md,
  },
  highlightText: {
    fontSize: Typography.size.md,
    color: Colors.error,
    fontWeight: Typography.weight.medium,
  },
  highlightPrice: {
    fontSize: Typography.size.md,
    color: Colors.error,
    fontWeight: Typography.weight.semibold,
  },
  boldText: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
  },
  boldPrice: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.primary,
  },
});
