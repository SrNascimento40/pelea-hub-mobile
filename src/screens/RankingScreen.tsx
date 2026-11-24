import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { RankingListItem } from '@/components/RankingListItem';
import { TopBar } from '@/components/TopBar';
import { spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useMonthlyRanking, useOverallRanking } from '@/hooks/useRanking';
import { useMyStudentProfile } from '@/hooks/useStudents';
import { formatMonthYear } from '@/utils/format';

type Role = 'owner' | 'trainer' | 'student';

export function RankingScreen({ role }: { role: Role }) {
  const { user } = useAuth();
  const { data: myStudent } = useMyStudentProfile();
  const now = new Date();
  const [period, setPeriod] = useState<'monthly' | 'overall'>('monthly');

  const monthly = useMonthlyRanking(now.getMonth() + 1, now.getFullYear());
  const overall = useOverallRanking();
  const { data: rows, isLoading } = period === 'monthly' ? monthly : overall;

  return (
    <Screen contentStyle={styles.content}>
      <TopBar
        title="Ranking"
        subtitle={period === 'monthly' ? formatMonthYear(now.getMonth() + 1, now.getFullYear()) : 'Acumulado geral'}
        notificationsHref={`/(${role})/notifications`}
      />

      <SegmentedControl
        options={[
          { key: 'monthly', label: 'Mensal' },
          { key: 'overall', label: 'Geral' },
        ]}
        value={period}
        onChange={setPeriod}
      />

      {isLoading ? (
        <LoadingView />
      ) : rows && rows.length > 0 ? (
        <Card>
          {rows.map((row) => (
            <RankingListItem key={row.studentId} row={row} highlighted={user?.role === 'student' && row.studentId === myStudent?.id} />
          ))}
        </Card>
      ) : (
        <EmptyState icon="trophy-outline" title="Ranking ainda vazio" description="Os pontos aparecem conforme os check-ins acontecem." />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
});
