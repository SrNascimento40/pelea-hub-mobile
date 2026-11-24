import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListRow } from '@/components/ui/ListRow';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatTile } from '@/components/ui/StatTile';
import { RankingListItem } from '@/components/RankingListItem';
import { TopBar } from '@/components/TopBar';
import { spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useTodayAttendance } from '@/hooks/useAttendance';
import { useOverallRanking } from '@/hooks/useRanking';
import { useStudents } from '@/hooks/useStudents';
import { formatDateTime } from '@/utils/format';

export function TrainerDashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: today } = useTodayAttendance();
  const { data: activeStudents } = useStudents({ status: 'active' });
  const { data: ranking } = useOverallRanking();

  return (
    <Screen contentStyle={styles.content}>
      <TopBar title={`Olá, ${user?.fullName.split(' ')[0]}`} subtitle="Painel do treinador" notificationsHref="/(trainer)/notifications" />

      <View style={styles.stats}>
        <StatTile icon="people-outline" label="Alunos ativos" value={String(activeStudents?.length ?? 0)} />
        <StatTile icon="checkmark-done-outline" label="Check-ins hoje" value={String(today?.length ?? 0)} tone="success" />
      </View>

      <Button label="Fazer check-in" onPress={() => router.push('/(trainer)/attendance')} fullWidth />

      <SectionHeader title="Check-ins recentes" actionLabel="Ver tudo" onAction={() => router.push('/(trainer)/attendance/history')} />
      {today && today.length > 0 ? (
        <Card>
          {today.slice(0, 5).map((row) => (
            <ListRow
              key={row.log.id}
              leading={<Avatar name={row.studentName} photoUrl={row.studentPhotoUrl} size={36} />}
              title={row.studentName}
              subtitle={formatDateTime(row.log.checkedInAt)}
            />
          ))}
        </Card>
      ) : (
        <EmptyState icon="calendar-outline" title="Nenhum check-in hoje ainda" />
      )}

      <SectionHeader title="Top ranking" actionLabel="Ver ranking" onAction={() => router.push('/(trainer)/ranking')} />
      {ranking && ranking.length > 0 ? (
        <Card>
          {ranking.slice(0, 3).map((row) => (
            <RankingListItem key={row.studentId} row={row} />
          ))}
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
});
