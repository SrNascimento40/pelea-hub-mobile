import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { FAB } from '@/components/ui/FAB';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { Chip } from '@/components/ui/Chip';
import { StudentListItem } from '@/components/StudentListItem';
import { TopBar } from '@/components/TopBar';
import { spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useStudents } from '@/hooks/useStudents';
import { StudentStatus } from '@/types';
import { permissions } from '@/utils/permissions';

type Role = 'owner' | 'trainer';

const FILTERS: { key: StudentStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'active', label: 'Ativos' },
  { key: 'inactive', label: 'Inativos' },
];

export function StudentsListScreen({ role }: { role: Role }) {
  const router = useRouter();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StudentStatus | 'all'>('all');
  const { data: students, isLoading, isError, refetch, isRefetching } = useStudents({ search, status });

  const canCreate = user ? permissions.createStudent(user.role) : false;

  const filterChips = useMemo(
    () =>
      FILTERS.map((f) => ({
        ...f,
        active: f.key === status,
      })),
    [status]
  );

  return (
    <Screen onRefresh={refetch} refreshing={isRefetching} contentStyle={styles.content}>
      <TopBar title="Alunos" subtitle="Gestão de matrículas" notificationsHref={`/(${role})/notifications`} />

      <TextField label="Buscar" placeholder="Nome ou email do aluno" value={search} onChangeText={setSearch} />

      <View style={styles.chips}>
        {filterChips.map((chip) => (
          <Chip key={chip.key} label={chip.label} active={chip.active} onPress={() => setStatus(chip.key)} />
        ))}
      </View>

      {isLoading ? (
        <LoadingView />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : students && students.length > 0 ? (
        <View style={styles.list}>
          {students.map((student) => (
            <StudentListItem
              key={student.id}
              student={student}
              onPress={() =>
                router.push({ pathname: `/(${role})/students/[id]`, params: { id: student.id } })
              }
            />
          ))}
        </View>
      ) : (
        <EmptyState
          icon="people-outline"
          title="Nenhum aluno encontrado"
          description="Ajuste os filtros ou cadastre um novo aluno."
        />
      )}

      {canCreate ? <FAB onPress={() => router.push(`/(${role})/students/new`)} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  chips: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  list: {
    gap: 2,
  },
});
