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
import { TextField } from '@/components/ui/TextField';
import { colors, fontSize, spacing } from '@/constants/theme';
import { useAddTrainer, useRemoveTrainer, useTrainers } from '@/hooks/useAcademy';
import { User } from '@/types';

export function TrainersScreen() {
  const router = useRouter();
  const { data: trainers, isLoading } = useTrainers();
  const addTrainer = useAddTrainer();
  const removeTrainer = useRemoveTrainer();

  const [showForm, setShowForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [toRemove, setToRemove] = useState<User | null>(null);

  async function handleAdd() {
    if (!fullName.trim() || !email.trim() || !phone.trim()) return;
    await addTrainer.mutateAsync({ fullName: fullName.trim(), email: email.trim(), phone: phone.trim() });
    setFullName('');
    setEmail('');
    setPhone('');
    setShowForm(false);
  }

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={22} color={colors.textMuted} />
        </Pressable>
        <Text style={styles.title}>Treinadores</Text>
        <View style={{ width: 22 }} />
      </View>

      {showForm ? (
        <View style={styles.form}>
          <TextField label="Nome completo" value={fullName} onChangeText={setFullName} />
          <TextField label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          <TextField label="Telefone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <View style={styles.formActions}>
            <Button label="Cancelar" variant="secondary" onPress={() => setShowForm(false)} style={styles.flex1} />
            <Button label="Adicionar" onPress={handleAdd} loading={addTrainer.isPending} style={styles.flex1} />
          </View>
        </View>
      ) : (
        <Button label="Novo treinador" variant="secondary" onPress={() => setShowForm(true)} />
      )}

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
  form: {
    gap: spacing.md,
  },
  formActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flex1: {
    flex: 1,
  },
});
