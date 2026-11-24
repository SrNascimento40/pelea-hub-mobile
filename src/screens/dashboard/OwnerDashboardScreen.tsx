import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatTile } from '@/components/ui/StatTile';
import { FeeRow } from '@/components/FeeRow';
import { TopBar } from '@/components/TopBar';
import { colors, fontSize, spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useFinanceSummary, useOverdueFees } from '@/hooks/useFinance';
import { useTodayAttendance } from '@/hooks/useAttendance';
import { formatCurrency } from '@/utils/format';

export function OwnerDashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: summary, isLoading } = useFinanceSummary();
  const { data: overdue } = useOverdueFees();
  const { data: today } = useTodayAttendance();

  return (
    <Screen contentStyle={styles.content}>
      <TopBar title={`Olá, ${user?.fullName.split(' ')[0]}`} subtitle="Visão geral da academia" notificationsHref="/(owner)/notifications" />

      {isLoading ? (
        <LoadingView />
      ) : summary ? (
        <View style={styles.stats}>
          <StatTile icon="people-outline" label="Alunos ativos" value={String(summary.activeStudents)} />
          <StatTile icon="checkmark-done-outline" label="Check-ins hoje" value={String(today?.length ?? 0)} />
          <StatTile icon="cash-outline" label="Receita do mês" value={formatCurrency(summary.revenueThisMonth)} tone="success" />
          <StatTile icon="alert-circle-outline" label="Mensalidades atrasadas" value={String(summary.overdueCount)} tone="danger" />
        </View>
      ) : null}

      <SectionHeader title="Alunos em atraso" actionLabel="Ver financeiro" onAction={() => router.push('/(owner)/finance')} />
      {overdue && overdue.length > 0 ? (
        <Card>
          {overdue.slice(0, 5).map((entry) => (
            <FeeRow key={entry.fee.id} fee={entry.fee} studentName={entry.studentName} />
          ))}
        </Card>
      ) : (
        <EmptyState icon="checkmark-circle-outline" title="Nenhuma mensalidade em atraso" />
      )}

      <Text style={styles.footerNote}>{summary?.totalStudents ?? 0} alunos cadastrados no total</Text>
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
    marginBottom: spacing.sm,
  },
  footerNote: {
    color: colors.textFaint,
    fontSize: fontSize.xs,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
