import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, spacing } from '@/constants/theme';

export function LoadingView({ label = 'Carregando...' }: { label?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.md,
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
});
