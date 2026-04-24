import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../../constants/colors';
import Spacing from '../../constants/spacing';

export default function Divider({ margin = Spacing.md }: { margin?: number }) {
  return <View style={[styles.line, { marginVertical: margin }]} />;
}

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: Colors.divider,
  },
});
