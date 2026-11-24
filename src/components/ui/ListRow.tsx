import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing } from '@/constants/theme';

interface ListRowProps {
  leading?: React.ReactNode;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
}

export function ListRow({ leading, title, subtitle, trailing, onPress, showChevron }: ListRowProps) {
  const content = (
    <View style={styles.row}>
      {leading}
      <View style={styles.middle}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
      {showChevron ? <Ionicons name="chevron-forward" size={18} color={colors.textFaint} /> : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
        {content}
      </Pressable>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  middle: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  pressed: {
    opacity: 0.7,
  },
});
