import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { colors, fontSize, radius, spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useCancelFee, useFeeHistory, usePayFee } from '@/hooks/useFinance';
import { MonthlyFee } from '@/types';
import { formatCurrency, formatDate, formatDateTime } from '@/utils/format';
import { permissions } from '@/utils/permissions';

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

interface FeeActionModalProps {
  fee: MonthlyFee | null;
  studentName?: string;
  onClose: () => void;
}

export function FeeActionModal({ fee, studentName, onClose }: FeeActionModalProps) {
  const { user } = useAuth();
  const { data: history } = useFeeHistory(fee?.id);
  const payMutation = usePayFee();
  const cancelMutation = useCancelFee();
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (!fee || !user) return null;

  async function handlePay() {
    if (!fee) return;
    await payMutation.mutateAsync({ feeId: fee.id });
  }

  async function handleCancel() {
    if (!fee) return;
    await cancelMutation.mutateAsync({ feeId: fee.id });
    setConfirmCancel(false);
  }

  return (
    <Modal visible={!!fee} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <ScrollView contentContainerStyle={styles.content}>
            {studentName ? <Text style={styles.studentName}>{studentName}</Text> : null}
            <View style={styles.headerRow}>
              <Text style={styles.month}>{fee.referenceMonth}</Text>
              <Badge label={STATUS_LABEL[fee.status]} tone={STATUS_TONE[fee.status]} />
            </View>
            <Text style={styles.amount}>{formatCurrency(fee.amount)}</Text>
            <Text style={styles.due}>Vencimento em {formatDate(fee.dueDate)}</Text>

            <View style={styles.actions}>
              {fee.status !== 'paid' && permissions.registerPayment(user.role) ? (
                <Button label="Registrar pagamento" onPress={handlePay} loading={payMutation.isPending} fullWidth />
              ) : null}
              {fee.status === 'paid' && permissions.cancelPayment(user.role) ? (
                <Button
                  label="Cancelar pagamento"
                  variant="danger"
                  onPress={() => setConfirmCancel(true)}
                  fullWidth
                />
              ) : null}
              <Button label="Fechar" variant="secondary" onPress={onClose} fullWidth />
            </View>

            {history && history.length > 0 ? (
              <View style={styles.history}>
                <Text style={styles.historyTitle}>Histórico</Text>
                {history.map((entry) => (
                  <View key={entry.id} style={styles.historyRow}>
                    <Text style={styles.historyAction}>
                      {entry.action === 'registered' ? 'Pagamento registrado' : entry.action === 'cancelled' ? 'Pagamento cancelado' : 'Editado'}
                    </Text>
                    <Text style={styles.historyMeta}>
                      {entry.performedByName} · {formatDateTime(entry.createdAt)}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>

      <ConfirmDialog
        visible={confirmCancel}
        title="Cancelar pagamento?"
        description="Esta ação registra o cancelamento no histórico e volta a mensalidade para pendente."
        confirmLabel="Cancelar pagamento"
        destructive
        loading={cancelMutation.isPending}
        onConfirm={handleCancel}
        onCancel={() => setConfirmCancel(false)}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.xs,
  },
  studentName: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  month: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  amount: {
    color: colors.text,
    fontSize: fontSize.display,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  due: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginBottom: spacing.lg,
  },
  actions: {
    gap: spacing.sm,
  },
  history: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  historyTitle: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  historyRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    gap: 2,
  },
  historyAction: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  historyMeta: {
    color: colors.textFaint,
    fontSize: fontSize.xs,
  },
});
