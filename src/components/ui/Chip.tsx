import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fontSize, radius, spacing } from '@/constants/theme';

interface ChipProps {
  label: string;
  active?: boolean;
  onPress: () => void;
}

export function Chip({ label, active, onPress }: ChipProps) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  labelActive: {
    color: colors.white,
  },
});
