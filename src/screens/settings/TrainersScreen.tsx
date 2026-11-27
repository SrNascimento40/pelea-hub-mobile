import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListRow } from '@/components/ui/ListRow';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import { colors, fontSize, spacing } from '@/constants/theme';
import { useRemoveTrainer, useTrainers } from '@/hooks/useAcademy';
import { User } from '@/types';

export function TrainersScreen() {
  const router = useRouter();
  const { data: trainers, isLoading } = useTrainers();
  const removeTrainer = useRemoveTrainer();

  const [toRemove, setToRemove] = useState<User | null>(null);

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={22} color={colors.textMuted} />
        </Pressable>
        <Text style={styles.title}>Treinadores</Text>
        <View style={{ width: 22 }} />
      </View>

      <Button label="Novo treinador" variant="secondary" onPress={() => router.push('/(owner)/settings/new-trainer')} />

      {isLoading ? (
        <LoadingView />
      ) : trainers && trainers.length > 0 ? (
        <View>
          {trainers.map((trainer) => (
            <ListRow
              key={trainer.id}
              leading={<Avatar name={trainer.fullName} />}
              title={trainer.fullName}
              subtitle={trainer.email}
              trailing={
                <Ionicons name="trash-outline" size={20} color={colors.danger} onPress={() => setToRemove(trainer)} />
              }
            />
          ))}
        </View>
      ) : (
        <EmptyState icon="people-outline" title="Nenhum treinador cadastrado" />
      )}

      <ConfirmDialog
        visible={!!toRemove}
        title="Remover treinador?"
        description={toRemove ? `${toRemove.fullName} perderá o acesso ao sistema.` : ''}
        destructive
        loading={removeTrainer.isPending}
        onConfirm={async () => {
          if (toRemove) await removeTrainer.mutateAsync(toRemove.id);
          setToRemove(null);
        }}
        onCancel={() => setToRemove(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
});
