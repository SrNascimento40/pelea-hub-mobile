import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '@/constants/theme';

type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  tone?: Tone;
}

const toneMap: Record<Tone, { bg: string; fg: string }> = {
  success: { bg: colors.successMuted, fg: colors.success },
  warning: { bg: colors.warningMuted, fg: colors.warning },
  danger: { bg: colors.dangerMuted, fg: colors.danger },
  info: { bg: colors.infoMuted, fg: colors.info },
  neutral: { bg: colors.surfaceAlt, fg: colors.textMuted },
};

export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  const t = toneMap[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      <Text style={[styles.label, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});
