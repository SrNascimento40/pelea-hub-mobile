import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListRow } from '@/components/ui/ListRow';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { TopBar } from '@/components/TopBar';
import { colors, fontSize, spacing } from '@/constants/theme';
import { useCheckin, useTodayAttendance } from '@/hooks/useAttendance';
import { useStudents } from '@/hooks/useStudents';
import { formatDateTime } from '@/utils/format';

type Role = 'owner' | 'trainer';

export function CheckinScreen({ role }: { role: Role }) {
  const [search, setSearch] = useState('');
  const { data: students, isLoading } = useStudents({ status: 'active', search });
  const { data: today, refetch: refetchToday } = useTodayAttendance();
  const checkin = useCheckin();
  const [feedback, setFeedback] = useState<{ id: string; message: string; tone: 'success' | 'error' } | null>(null);

  const checkedInIds = useMemo(() => new Set((today ?? []).map((row) => row.log.studentId)), [today]);

  async function handleCheckin(studentId: string, name: string) {
    try {
      await checkin.mutateAsync({ studentId });
      setFeedback({ id: studentId, message: `${name} - check-in confirmado!`, tone: 'success' });
      refetchToday();
    } catch (err) {
      setFeedback({
        id: studentId,
        message: err instanceof Error ? err.message : 'Não foi possível fazer o check-in.',
        tone: 'error',
      });
    }
  }

  return (
    <Screen contentStyle={styles.content}>
      <TopBar title="Check-in" subtitle="Registrar presença no tatame" notificationsHref={`/(${role})/notifications`} />

      <TextField label="Buscar aluno" placeholder="Nome do aluno" value={search} onChangeText={setSearch} />

      {feedback ? (
        <View style={[styles.feedback, feedback.tone === 'error' && styles.feedbackError]}>
          <Ionicons
            name={feedback.tone === 'success' ? 'checkmark-circle' : 'alert-circle'}
            size={18}
            color={feedback.tone === 'success' ? colors.success : colors.danger}
          />
          <Text style={[styles.feedbackText, feedback.tone === 'error' && styles.feedbackTextError]}>
            {feedback.message}
          </Text>
        </View>
      ) : null}

      {isLoading ? (
        <LoadingView />
      ) : students && students.length > 0 ? (
        <View>
          {students.map((student) => {
            const done = checkedInIds.has(student.id);
            return (
              <ListRow
                key={student.id}
                leading={<Avatar name={student.fullName} photoUrl={student.photoUrl} />}
                title={student.fullName}
                subtitle={done ? 'Check-in feito hoje' : student.email}
                trailing={
                  done ? (
                    <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                  ) : (
                    <Ionicons
                      name="add-circle-outline"
                      size={24}
                      color={colors.primary}
                      onPress={() => handleCheckin(student.id, student.fullName)}
                    />
                  )
                }
              />
            );
          })}
        </View>
      ) : (
        <EmptyState icon="people-outline" title="Nenhum aluno ativo encontrado" />
      )}

      <Text style={styles.sectionLabel}>Check-ins de hoje ({today?.length ?? 0})</Text>
      {today && today.length > 0 ? (
        <View>
          {today.map((row) => (
            <ListRow
              key={row.log.id}
              leading={<Avatar name={row.studentName} photoUrl={row.studentPhotoUrl} size={36} />}
              title={row.studentName}
              subtitle={formatDateTime(row.log.checkedInAt)}
            />
          ))}
        </View>
      ) : (
        <Text style={styles.emptyToday}>Nenhum check-in registrado ainda hoje.</Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  feedback: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.successMuted,
    borderRadius: 12,
    padding: spacing.md,
  },
  feedbackError: {
    backgroundColor: colors.dangerMuted,
  },
  feedbackText: {
    color: colors.success,
    fontSize: fontSize.sm,
    fontWeight: '600',
    flex: 1,
  },
  feedbackTextError: {
    color: colors.danger,
  },
  sectionLabel: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '700',
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  emptyToday: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
});
