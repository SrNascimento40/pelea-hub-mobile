import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/constants/theme';

interface FABProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function FAB({ onPress, icon = 'add' }: FABProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.fab, pressed && styles.pressed]}>
      <Ionicons name={icon} size={26} color={colors.white} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
    elevation: 6,
  },
  pressed: {
    opacity: 0.85,
  },
});
