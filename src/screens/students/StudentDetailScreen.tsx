import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { TextField } from '@/components/ui/TextField';
import { FeeActionModal } from '@/components/FeeActionModal';
import { FeeRow } from '@/components/FeeRow';
import { colors, fontSize, spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useCheckin, useStudentAttendance } from '@/hooks/useAttendance';
import { useCreateFee, useStudentFees } from '@/hooks/useFinance';
import { useCreatePhysicalProfile, useCreateTechnicalProfile, usePhysicalProfiles, useTechnicalProfiles } from '@/hooks/useProfiles';
import { useAdjustRankingPoints, useStudentRanking } from '@/hooks/useRanking';
import { useSetStudentStatus, useStudent } from '@/hooks/useStudents';
import { MonthlyFee } from '@/types';
import { age, formatDate, formatDateTime } from '@/utils/format';
import { permissions } from '@/utils/permissions';

type TabKey = 'info' | 'finance' | 'attendance' | 'ranking' | 'profile';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'info', label: 'Info' },
  { key: 'finance', label: 'Financeiro' },
  { key: 'attendance', label: 'Presença' },
  { key: 'ranking', label: 'Ranking' },
  { key: 'profile', label: 'Físico/Técnico' },
];

export function StudentDetailScreen({ studentId, basePath }: { studentId: string; basePath: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const { data: student, isLoading, isError, refetch } = useStudent(studentId);
  const [tab, setTab] = useState<TabKey>('info');

  if (isLoading || !user) return <Screen><LoadingView /></Screen>;
  if (isError || !student) return <Screen><ErrorState onRetry={refetch} /></Screen>;

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={styles.back} hitSlop={12}>
        <Ionicons name="chevron-back" size={20} color={colors.textMuted} />
        <Text style={styles.backLabel}>Voltar</Text>
      </Pressable>

      <View style={styles.header}>
        <Avatar name={student.fullName} photoUrl={student.photoUrl} size={64} />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{student.fullName}</Text>
          <Badge label={student.status === 'active' ? 'Ativo' : 'Inativo'} tone={student.status === 'active' ? 'success' : 'neutral'} />
        </View>
        {permissions.editStudentFull(user.role) ? (
          <Pressable onPress={() => router.push({ pathname: `${basePath}/students/[id]/edit`, params: { id: studentId } })}>
            <Ionicons name="create-outline" size={22} color={colors.primary} />
          </Pressable>
        ) : null}
      </View>

      <SegmentedControl options={TABS} value={tab} onChange={setTab} />

      {tab === 'info' ? <InfoTab studentId={studentId} /> : null}
      {tab === 'finance' ? <FinanceTab studentId={studentId} studentName={student.fullName} /> : null}
      {tab === 'attendance' ? <AttendanceTab studentId={studentId} isActive={student.status === 'active'} /> : null}
      {tab === 'ranking' ? <RankingTab studentId={studentId} /> : null}
      {tab === 'profile' ? <ProfileTab studentId={studentId} /> : null}
    </Screen>
  );
}

function InfoTab({ studentId }: { studentId: string }) {
  const { user } = useAuth();
  const { data: student } = useStudent(studentId);
  const setStatus = useSetStudentStatus(studentId);
  const [confirmInactivate, setConfirmInactivate] = useState(false);
  if (!student || !user) return null;

  return (
    <View style={styles.tabContent}>
      <Card>
        <InfoRow icon="mail-outline" label="Email" value={student.email} />
        <InfoRow icon="call-outline" label="Telefone" value={student.phone} />
        <InfoRow icon="calendar-outline" label="Nascimento" value={`${formatDate(student.birthDate)} · ${age(student.birthDate)} anos`} />
        <InfoRow icon="location-outline" label="Endereço" value={student.address || '—'} />
        <InfoRow icon="ribbon-outline" label="Matrícula" value={formatDate(student.enrollmentDate)} last />
      </Card>

      {student.observations ? (
        <Card style={styles.observationsCard}>
          <Text style={styles.observationsTitle}>Observações</Text>
          <Text style={styles.observationsText}>{student.observations}</Text>
        </Card>
      ) : null}

      {permissions.inactivateStudent(user.role) ? (
        <Button
          label={student.status === 'active' ? 'Inativar aluno' : 'Reativar aluno'}
          variant={student.status === 'active' ? 'danger' : 'secondary'}
          onPress={() => setConfirmInactivate(true)}
          fullWidth
          style={styles.dangerAction}
        />
      ) : null}

      <ConfirmDialog
        visible={confirmInactivate}
        title={student.status === 'active' ? 'Inativar aluno?' : 'Reativar aluno?'}
        description={
          student.status === 'active'
            ? 'O aluno deixará de aparecer nas listagens ativas e no ranking.'
            : 'O aluno voltará a aparecer nas listagens ativas.'
        }
        destructive={student.status === 'active'}
        loading={setStatus.isPending}
        onConfirm={async () => {
          await setStatus.mutateAsync(student.status === 'active' ? 'inactive' : 'active');
          setConfirmInactivate(false);
        }}
        onCancel={() => setConfirmInactivate(false)}
      />
    </View>
  );
}

function InfoRow({ icon, label, value, last }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.infoRow, !last && styles.infoRowBorder]}>
      <Ionicons name={icon} size={18} color={colors.textMuted} />
      <View style={styles.infoTexts}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function FinanceTab({ studentId, studentName }: { studentId: string; studentName: string }) {
  const { user } = useAuth();
  const { data: fees, isLoading } = useStudentFees(studentId);
  const [selectedFee, setSelectedFee] = useState<MonthlyFee | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [amount, setAmount] = useState('150');
  const [dueDate, setDueDate] = useState('');
  const [referenceMonth, setReferenceMonth] = useState('');
  const createFee = useCreateFee(studentId);

  if (!user) return null;

  async function handleCreate() {
    const value = Number(amount.replace(',', '.'));
    if (!value || !dueDate || !referenceMonth) return;
    await createFee.mutateAsync({ amount: value, dueDate: new Date(dueDate).toISOString(), referenceMonth });
    setShowCreate(false);
    setDueDate('');
    setReferenceMonth('');
  }

  return (
    <View style={styles.tabContent}>
      {permissions.createFee(user.role) ? (
        showCreate ? (
          <Card style={styles.formCard}>
            <TextField label="Valor (R$)" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
            <TextField label="Vencimento (AAAA-MM-DD)" value={dueDate} onChangeText={setDueDate} placeholder="2026-08-10" />
            <TextField label="Referência (AAAA-MM)" value={referenceMonth} onChangeText={setReferenceMonth} placeholder="2026-08" />
            <View style={styles.formActions}>
              <Button label="Cancelar" variant="secondary" onPress={() => setShowCreate(false)} style={styles.flex1} />
              <Button label="Criar" onPress={handleCreate} loading={createFee.isPending} style={styles.flex1} />
            </View>
          </Card>
        ) : (
          <Button label="Nova mensalidade" variant="secondary" onPress={() => setShowCreate(true)} />
        )
      ) : null}

      {isLoading ? (
        <LoadingView />
      ) : fees && fees.length > 0 ? (
        <View>
          {fees.map((fee) => (
            <FeeRow key={fee.id} fee={fee} onPress={() => setSelectedFee(fee)} />
          ))}
        </View>
      ) : (
        <EmptyState icon="cash-outline" title="Nenhuma mensalidade" />
      )}

      <FeeActionModal fee={selectedFee} studentName={studentName} onClose={() => setSelectedFee(null)} />
    </View>
  );
}

function AttendanceTab({ studentId, isActive }: { studentId: string; isActive: boolean }) {
  const { user } = useAuth();
  const { data: logs, isLoading } = useStudentAttendance(studentId);
  const checkin = useCheckin();
  const [checkinError, setCheckinError] = useState('');

  if (!user) return null;

  async function handleCheckin() {
    setCheckinError('');
    try {
      await checkin.mutateAsync({ studentId });
    } catch (err) {
      setCheckinError(err instanceof Error ? err.message : 'Não foi possível fazer check-in.');
    }
  }

  return (
    <View style={styles.tabContent}>
      {permissions.checkin(user.role) && isActive ? (
        <View>
          <Button label="Fazer check-in agora" onPress={handleCheckin} loading={checkin.isPending} />
          {checkinError ? <Text style={styles.error}>{checkinError}</Text> : null}
        </View>
      ) : null}

      {isLoading ? (
        <LoadingView />
      ) : logs && logs.length > 0 ? (
        <Card>
          {logs.map((log, index) => (
            <View key={log.id} style={[styles.infoRow, index < logs.length - 1 && styles.infoRowBorder]}>
              <Ionicons name="checkmark-circle-outline" size={18} color={colors.success} />
              <View style={styles.infoTexts}>
                <Text style={styles.infoValue}>{formatDateTime(log.checkedInAt)}</Text>
                <Text style={styles.infoLabel}>Registrado por {log.checkedInByName}</Text>
              </View>
            </View>
          ))}
        </Card>
      ) : (
        <EmptyState icon="calendar-outline" title="Nenhum check-in registrado" />
      )}
    </View>
  );
}

function RankingTab({ studentId }: { studentId: string }) {
  const { user } = useAuth();
  const { data: ranking, isLoading } = useStudentRanking(studentId);
  const adjust = useAdjustRankingPoints();
  const [points, setPoints] = useState('');

  if (!user || isLoading) return <LoadingView />;

  return (
    <View style={styles.tabContent}>
      <Card>
        <View style={styles.rankingStats}>
          <View>
            <Text style={styles.rankingValue}>{ranking?.position ? `#${ranking.position}` : '—'}</Text>
            <Text style={styles.infoLabel}>Posição geral</Text>
          </View>
          <View>
            <Text style={styles.rankingValue}>{ranking?.points ?? 0}</Text>
            <Text style={styles.infoLabel}>Pontos acumulados</Text>
          </View>
        </View>
      </Card>

      {permissions.adjustRankingManually(user.role) ? (
        <Card style={styles.formCard}>
          <TextField label="Ajustar pontos manualmente" value={points} onChangeText={setPoints} placeholder="Ex: 20 ou -10" />
          <Button
            label="Aplicar ajuste"
            onPress={async () => {
              const value = Number(points);
              if (!value) return;
              await adjust.mutateAsync({ studentId, points: value });
              setPoints('');
            }}
            loading={adjust.isPending}
          />
        </Card>
      ) : null}
    </View>
  );
}

function ProfileTab({ studentId }: { studentId: string }) {
  const { user } = useAuth();
  const { data: physical } = usePhysicalProfiles(studentId);
  const { data: technical } = useTechnicalProfiles(studentId);
  const createPhysical = useCreatePhysicalProfile(studentId);
  const createTechnical = useCreateTechnicalProfile(studentId);

  const [showPhysicalForm, setShowPhysicalForm] = useState(false);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [category, setCategory] = useState('');

  const [showTechForm, setShowTechForm] = useState(false);
  const [level, setLevel] = useState('');
  const [graduation, setGraduation] = useState('');
  const [trainingTime, setTrainingTime] = useState('');
  const [trainerNotes, setTrainerNotes] = useState('');

  if (!user) return null;
  const latestPhysical = physical?.[0];
  const latestTechnical = technical?.[0];
  const canRegister = permissions.registerProfile(user.role);

  return (
    <View style={styles.tabContent}>
      <Text style={styles.sectionLabel}>Perfil físico</Text>
      <Card>
        {latestPhysical ? (
          <>
            <InfoRow icon="body-outline" label="Peso" value={`${latestPhysical.weightKg} kg`} />
            <InfoRow icon="resize-outline" label="Altura" value={`${latestPhysical.heightCm} cm`} />
            <InfoRow icon="pricetag-outline" label="Categoria" value={latestPhysical.category} />
            <InfoRow icon="time-outline" label="Avaliado em" value={formatDate(latestPhysical.evaluatedAt)} last />
          </>
        ) : (
          <Text style={styles.infoLabel}>Sem avaliações registradas</Text>
        )}
      </Card>
      {canRegister ? (
        showPhysicalForm ? (
          <Card style={styles.formCard}>
            <TextField label="Peso (kg)" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" />
            <TextField label="Altura (cm)" value={height} onChangeText={setHeight} keyboardType="decimal-pad" />
            <TextField label="Categoria" value={category} onChangeText={setCategory} placeholder="Leve, Médio, Pesado..." />
            <View style={styles.formActions}>
              <Button label="Cancelar" variant="secondary" onPress={() => setShowPhysicalForm(false)} style={styles.flex1} />
              <Button
                label="Salvar"
                loading={createPhysical.isPending}
                style={styles.flex1}
                onPress={async () => {
                  const w = Number(weight.replace(',', '.'));
                  const h = Number(height.replace(',', '.'));
                  if (!w || !h || !category) return;
                  await createPhysical.mutateAsync({ weightKg: w, heightCm: h, category });
                  setShowPhysicalForm(false);
                  setWeight('');
                  setHeight('');
                  setCategory('');
                }}
              />
            </View>
          </Card>
        ) : (
          <Button label="Registrar nova avaliação física" variant="secondary" onPress={() => setShowPhysicalForm(true)} />
        )
      ) : null}

      <Text style={styles.sectionLabel}>Perfil técnico</Text>
      <Card>
        {latestTechnical ? (
          <>
            <InfoRow icon="ribbon-outline" label="Nível" value={latestTechnical.level} />
            <InfoRow icon="star-outline" label="Graduação" value={latestTechnical.graduation} />
            <InfoRow icon="time-outline" label="Tempo de treino" value={latestTechnical.trainingTime} />
            <InfoRow icon="document-text-outline" label="Notas" value={latestTechnical.trainerNotes || '—'} last />
          </>
        ) : (
          <Text style={styles.infoLabel}>Sem avaliações registradas</Text>
        )}
      </Card>
      {canRegister ? (
        showTechForm ? (
          <Card style={styles.formCard}>
            <TextField label="Nível" value={level} onChangeText={setLevel} placeholder="Faixa Azul" />
            <TextField label="Graduação" value={graduation} onChangeText={setGraduation} placeholder="2 graus" />
            <TextField label="Tempo de treino" value={trainingTime} onChangeText={setTrainingTime} placeholder="2 anos" />
            <TextField label="Notas do treinador" value={trainerNotes} onChangeText={setTrainerNotes} multiline numberOfLines={3} style={styles.textarea} />
            <View style={styles.formActions}>
              <Button label="Cancelar" variant="secondary" onPress={() => setShowTechForm(false)} style={styles.flex1} />
              <Button
                label="Salvar"
                loading={createTechnical.isPending}
                style={styles.flex1}
                onPress={async () => {
                  if (!level || !graduation || !trainingTime) return;
                  await createTechnical.mutateAsync({ level, graduation, trainingTime, trainerNotes });
                  setShowTechForm(false);
                  setLevel('');
                  setGraduation('');
                  setTrainingTime('');
                  setTrainerNotes('');
                }}
              />
            </View>
          </Card>
        ) : (
          <Button label="Registrar nova avaliação técnica" variant="secondary" onPress={() => setShowTechForm(true)} />
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: spacing.md,
  },
  backLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  headerInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  tabContent: {
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoTexts: {
    gap: 2,
  },
  infoLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  infoValue: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  observationsCard: {
    gap: spacing.xs,
  },
  observationsTitle: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  observationsText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  dangerAction: {
    marginTop: spacing.sm,
  },
  formCard: {
    gap: spacing.sm,
  },
  formActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  flex1: {
    flex: 1,
  },
  error: {
    color: colors.danger,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  rankingStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  rankingValue: {
    color: colors.primary,
    fontSize: fontSize.xxl,
    fontWeight: '800',
    textAlign: 'center',
  },
  sectionLabel: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  textarea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
});
