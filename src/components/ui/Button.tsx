import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, fontSize, radius, spacing } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'sm';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  fullWidth,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        size === 'sm' && styles.sm,
        variantStyles[variant],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' || variant === 'ghost' ? colors.text : colors.white} />
      ) : (
        <Text style={[styles.label, size === 'sm' && styles.labelSm, textVariantStyles[variant]]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  labelSm: {
    fontSize: fontSize.sm,
  },
});

const variantStyles: Record<Variant, ViewStyle> = {
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: colors.danger },
};

const textVariantStyles: Record<Variant, { color: string }> = {
  primary: { color: colors.white },
  secondary: { color: colors.text },
  ghost: { color: colors.primary },
  danger: { color: colors.white },
};
