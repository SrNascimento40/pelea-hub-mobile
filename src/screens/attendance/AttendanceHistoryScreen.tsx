import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListRow } from '@/components/ui/ListRow';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import { TopBar } from '@/components/TopBar';
import { colors, fontSize, spacing } from '@/constants/theme';
import { useAttendanceSummary, useTodayAttendance } from '@/hooks/useAttendance';
import { formatDateTime } from '@/utils/format';

type Role = 'owner' | 'trainer';

export function AttendanceHistoryScreen({ role }: { role: Role }) {
  const { data: today, isLoading } = useTodayAttendance();
  const { data: summary } = useAttendanceSummary(14);

  const maxCount = Math.max(1, ...(summary?.map((d) => d.count) ?? [1]));

  return (
    <Screen contentStyle={styles.content}>
      <TopBar title="Presença" subtitle="Histórico da academia" notificationsHref={`/(${role})/notifications`} />

      {summary ? (
        <Card>
          <Text style={styles.chartTitle}>Check-ins nos últimos 14 dias</Text>
          <View style={styles.chart}>
            {summary.map((day) => (
              <View key={day.date} style={styles.barWrap}>
                <View style={[styles.bar, { height: 8 + (day.count / maxCount) * 60 }]} />
              </View>
            ))}
          </View>
        </Card>
      ) : null}

      <Text style={styles.sectionLabel}>Hoje ({today?.length ?? 0})</Text>
      {isLoading ? (
        <LoadingView />
      ) : today && today.length > 0 ? (
        <View>
          {today.map((row) => (
            <ListRow
              key={row.log.id}
              leading={<Avatar name={row.studentName} photoUrl={row.studentPhotoUrl} />}
              title={row.studentName}
              subtitle={`${formatDateTime(row.log.checkedInAt)} · por ${row.log.checkedInByName}`}
            />
          ))}
        </View>
      ) : (
        <EmptyState icon="calendar-outline" title="Nenhum check-in hoje" />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  chartTitle: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 70,
  },
  barWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  sectionLabel: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});
