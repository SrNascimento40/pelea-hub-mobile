import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing } from '@/constants/theme';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon = 'file-tray-outline', title, description, action }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={40} color={colors.textFaint} />
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  description: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
  action: {
    marginTop: spacing.md,
  },
});
