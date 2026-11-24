import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { colors, fontSize, spacing } from '@/constants/theme';
import { RankingRow } from '@/types';

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export function RankingListItem({ row, highlighted }: { row: RankingRow; highlighted?: boolean }) {
  return (
    <View style={[styles.row, highlighted && styles.highlighted]}>
      <Text style={styles.position}>{MEDAL[row.position] ?? row.position}</Text>
      <Avatar name={row.studentName} photoUrl={row.studentPhotoUrl} size={38} />
      <Text style={styles.name} numberOfLines={1}>
        {row.studentName}
      </Text>
      <Text style={styles.points}>{row.points} pts</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
  },
  highlighted: {
    backgroundColor: colors.primaryMuted,
  },
  position: {
    width: 28,
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  name: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  points: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
});
