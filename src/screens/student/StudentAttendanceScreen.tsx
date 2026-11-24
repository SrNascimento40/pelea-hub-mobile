import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import { StatTile } from '@/components/ui/StatTile';
import { TopBar } from '@/components/TopBar';
import { colors, fontSize, spacing } from '@/constants/theme';
import { useStudentAttendance } from '@/hooks/useAttendance';
import { useMyStudentProfile } from '@/hooks/useStudents';
import { formatDateTime } from '@/utils/format';

export function StudentAttendanceScreen() {
  const { data: student } = useMyStudentProfile();
  const { data: logs, isLoading } = useStudentAttendance(student?.id);

  const now = new Date();
  const thisMonth = (logs ?? []).filter((l) => {
    const d = new Date(l.checkedInAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <Screen contentStyle={styles.content}>
      <TopBar title="Presença" subtitle="Seu histórico de treinos" notificationsHref="/(student)/notifications" />

      <View style={styles.stats}>
        <StatTile icon="flame-outline" label="Treinos este mês" value={String(thisMonth)} tone="success" />
        <StatTile icon="calendar-outline" label="Total de treinos" value={String(logs?.length ?? 0)} />
      </View>

      {isLoading ? (
        <LoadingView />
      ) : logs && logs.length > 0 ? (
        <Card>
          {logs.map((log, index) => (
            <View key={log.id} style={[styles.row, index < logs.length - 1 && styles.rowBorder]}>
              <Text style={styles.date}>{formatDateTime(log.checkedInAt)}</Text>
            </View>
          ))}
        </Card>
      ) : (
        <EmptyState icon="calendar-outline" title="Nenhum treino registrado ainda" />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  row: {
    paddingVertical: spacing.sm,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  date: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
});
