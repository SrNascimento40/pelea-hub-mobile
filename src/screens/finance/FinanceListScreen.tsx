import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import { StatTile } from '@/components/ui/StatTile';
import { FeeActionModal } from '@/components/FeeActionModal';
import { FeeRow } from '@/components/FeeRow';
import { TopBar } from '@/components/TopBar';
import { spacing } from '@/constants/theme';
import { useAllFees, useFinanceSummary } from '@/hooks/useFinance';
import { FeeStatus, MonthlyFee } from '@/types';
import { formatCurrency } from '@/utils/format';

type Role = 'owner' | 'trainer';

const FILTERS: { key: FeeStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'overdue', label: 'Atrasadas' },
  { key: 'pending', label: 'Pendentes' },
  { key: 'paid', label: 'Pagas' },
];

export function FinanceListScreen({ role }: { role: Role }) {
  const { data: fees, isLoading, isError, refetch, isRefetching } = useAllFees();
  const { data: summary } = useFinanceSummary();
  const [status, setStatus] = useState<FeeStatus | 'all'>('all');
  const [selectedFee, setSelectedFee] = useState<MonthlyFee | null>(null);

  const filtered = useMemo(() => {
    if (!fees) return [];
    if (status === 'all') return fees;
    return fees.filter((f) => f.status === status);
  }, [fees, status]);

  const selectedStudentName = filtered.find((f) => f.id === selectedFee?.id)?.studentName;

  return (
    <Screen onRefresh={refetch} refreshing={isRefetching} contentStyle={styles.content}>
      <TopBar title="Financeiro" subtitle="Mensalidades da academia" notificationsHref={`/(${role})/notifications`} />

      {summary ? (
        <View style={styles.stats}>
          <StatTile icon="cash-outline" label="Receita do mês" value={formatCurrency(summary.revenueThisMonth)} tone="success" />
          <StatTile icon="alert-circle-outline" label="Em atraso" value={formatCurrency(summary.overdueAmount)} tone="danger" />
          <StatTile icon="people-outline" label="Alunos ativos" value={String(summary.activeStudents)} />
          <StatTile icon="time-outline" label="Pendentes no mês" value={String(summary.pendingThisMonth)} tone="warning" />
        </View>
      ) : null}

      <View style={styles.chips}>
        {FILTERS.map((f) => (
          <Chip key={f.key} label={f.label} active={status === f.key} onPress={() => setStatus(f.key)} />
        ))}
      </View>

      {isLoading ? (
        <LoadingView />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : filtered.length > 0 ? (
        <View>
          {filtered.map((fee) => (
            <FeeRow key={fee.id} fee={fee} studentName={fee.studentName} onPress={() => setSelectedFee(fee)} />
          ))}
        </View>
      ) : (
        <EmptyState icon="cash-outline" title="Nenhuma mensalidade encontrada" />
      )}

      <FeeActionModal fee={selectedFee} studentName={selectedStudentName} onClose={() => setSelectedFee(null)} />
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
