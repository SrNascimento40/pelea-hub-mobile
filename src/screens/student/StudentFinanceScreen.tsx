import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import { FeeActionModal } from '@/components/FeeActionModal';
import { FeeRow } from '@/components/FeeRow';
import { TopBar } from '@/components/TopBar';
import { spacing } from '@/constants/theme';
import { useStudentFees } from '@/hooks/useFinance';
import { useMyStudentProfile } from '@/hooks/useStudents';
import { MonthlyFee } from '@/types';

export function StudentFinanceScreen() {
  const { data: student } = useMyStudentProfile();
  const { data: fees, isLoading } = useStudentFees(student?.id);
  const [selectedFee, setSelectedFee] = useState<MonthlyFee | null>(null);

  return (
    <Screen contentStyle={styles.content}>
      <TopBar title="Financeiro" subtitle="Suas mensalidades" notificationsHref="/(student)/notifications" />

      {isLoading ? (
        <LoadingView />
      ) : fees && fees.length > 0 ? (
        <View>
          {fees.map((fee) => (
            <FeeRow key={fee.id} fee={fee} onPress={() => setSelectedFee(fee)} />
          ))}
        </View>
      ) : (
        <EmptyState icon="cash-outline" title="Nenhuma mensalidade registrada" />
      )}

      <FeeActionModal fee={selectedFee} onClose={() => setSelectedFee(null)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
});
