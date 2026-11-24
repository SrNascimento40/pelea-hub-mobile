import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, spacing } from '@/constants/theme';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  action: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
});
