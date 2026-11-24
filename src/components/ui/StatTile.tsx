import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, radius, spacing } from '@/constants/theme';

interface StatTileProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  tone?: 'default' | 'success' | 'warning' | 'danger';
}

const toneColor: Record<NonNullable<StatTileProps['tone']>, string> = {
  default: colors.primary,
  success: colors.success,
  warning: colors.warning,
  danger: colors.danger,
};

export function StatTile({ icon, label, value, tone = 'default' }: StatTileProps) {
  return (
    <View style={styles.tile}>
      <View style={[styles.iconWrap, { backgroundColor: `${toneColor[tone]}22` }]}>
        <Ionicons name={icon} size={18} color={toneColor[tone]} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexBasis: '48%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  value: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: '700',
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
});
