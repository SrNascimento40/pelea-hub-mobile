import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '@/constants/theme';

interface SegmentedControlProps<T extends string> {
  options: { key: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
      <View style={styles.container}>
        {options.map((option) => {
          const active = option.key === value;
          return (
            <TouchableOpacity
              key={option.key}
              onPress={() => onChange(option.key)}
              style={[styles.segment, active && styles.segmentActive]}
            >
              <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginBottom: spacing.md,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: 4,
    gap: 4,
  },
  segment: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  segmentActive: {
    backgroundColor: colors.primary,
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
