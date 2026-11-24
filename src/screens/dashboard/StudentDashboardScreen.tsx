import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatTile } from '@/components/ui/StatTile';
import { TopBar } from '@/components/TopBar';
import { colors, fontSize, spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useStudentAttendance } from '@/hooks/useAttendance';
import { useStudentFees } from '@/hooks/useFinance';
import { useStudentRanking } from '@/hooks/useRanking';
import { useTechnicalProfiles } from '@/hooks/useProfiles';
import { useMyStudentProfile } from '@/hooks/useStudents';
import { formatCurrency, formatDate } from '@/utils/format';

const FEE_STATUS_LABEL: Record<string, string> = { paid: 'Pago', pending: 'Pendente', overdue: 'Atrasado' };
const FEE_STATUS_TONE: Record<string, 'success' | 'warning' | 'danger'> = {
  paid: 'success',
  pending: 'warning',
  overdue: 'danger',
};

export function StudentDashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: student, isLoading: loadingStudent } = useMyStudentProfile();
  const { data: fees } = useStudentFees(student?.id);
  const { data: attendance } = useStudentAttendance(student?.id);
  const { data: ranking } = useStudentRanking(student?.id);
  const { data: technicalList } = useTechnicalProfiles(student?.id);
  const technical = technicalList?.[0];

  if (loadingStudent || !student) {
    return (
      <Screen>
        <LoadingView />
      </Screen>
    );
  }

  const nextFee = fees?.find((f) => f.status !== 'paid');
  const now = new Date();
  const attendanceThisMonth = (attendance ?? []).filter((a) => {
    const d = new Date(a.checkedInAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <Screen contentStyle={styles.content}>
      <TopBar title={`Olá, ${user?.fullName.split(' ')[0]}`} subtitle="Seu painel" notificationsHref="/(student)/notifications" />

      <View style={styles.stats}>
        <StatTile icon="trophy-outline" label="Posição no ranking" value={ranking?.position ? `#${ranking.position}` : '—'} tone="success" />
        <StatTile icon="flame-outline" label="Treinos este mês" value={String(attendanceThisMonth)} />
      </View>

      <SectionHeader title="Próxima mensalidade" actionLabel="Ver todas" onAction={() => router.push('/(student)/finance')} />
      {nextFee ? (
        <Card>
          <View style={styles.feeRow}>
            <View>
              <Text style={styles.feeAmount}>{formatCurrency(nextFee.amount)}</Text>
              <Text style={styles.feeDue}>Vencimento {formatDate(nextFee.dueDate)}</Text>
            </View>
            <Badge label={FEE_STATUS_LABEL[nextFee.status]} tone={FEE_STATUS_TONE[nextFee.status]} />
          </View>
        </Card>
      ) : (
        <Card>
          <Text style={styles.upToDate}>Você está em dia com as mensalidades! 🎉</Text>
        </Card>
      )}

      <SectionHeader title="Perfil técnico" actionLabel="Ver perfil" onAction={() => router.push('/(student)/profile')} />
      <Card>
        <Text style={styles.techLevel}>{technical?.level ?? 'Ainda não avaliado'}</Text>
        {technical ? <Text style={styles.techMeta}>{technical.graduation} · {technical.trainingTime} de treino</Text> : null}
      </Card>
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
  feeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  feeAmount: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '800',
  },
  feeDue: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  upToDate: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  techLevel: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  techMeta: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
});
