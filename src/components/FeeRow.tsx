import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge } from '@/components/ui/Badge';
import { ListRow } from '@/components/ui/ListRow';
import { colors, fontSize } from '@/constants/theme';
import { MonthlyFee } from '@/types';
import { formatCurrency, formatDate } from '@/utils/format';

const STATUS_LABEL: Record<MonthlyFee['status'], string> = {
  paid: 'Pago',
  pending: 'Pendente',
  overdue: 'Atrasado',
};

const STATUS_TONE: Record<MonthlyFee['status'], 'success' | 'warning' | 'danger'> = {
  paid: 'success',
  pending: 'warning',
  overdue: 'danger',
};

interface FeeRowProps {
  fee: MonthlyFee;
  studentName?: string;
  onPress?: () => void;
}

export function FeeRow({ fee, studentName, onPress }: FeeRowProps) {
  return (
    <ListRow
      onPress={onPress}
      showChevron={!!onPress}
      title={studentName ?? fee.referenceMonth}
      subtitle={`Vencimento ${formatDate(fee.dueDate)}${studentName ? ` · ${fee.referenceMonth}` : ''}`}
      trailing={
        <View style={styles.trailing}>
          <Text style={styles.amount}>{formatCurrency(fee.amount)}</Text>
          <Badge label={STATUS_LABEL[fee.status]} tone={STATUS_TONE[fee.status]} />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  trailing: {
    alignItems: 'flex-end',
    gap: 4,
  },
  amount: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
});
