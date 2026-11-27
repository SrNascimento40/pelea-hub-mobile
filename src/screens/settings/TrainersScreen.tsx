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
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [toRemove, setToRemove] = useState<User | null>(null);

  function closeForm() {
    setFullName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setFormError('');
    setShowForm(false);
  }

  async function handleAdd() {
    setFormError('');
    if (!fullName.trim() || !email.trim()) {
      setFormError('Preencha nome e email.');
      return;
    }
    if (password.length < 8) {
      setFormError('A senha de acesso precisa ter ao menos 8 caracteres.');
      return;
    }
    try {
      await addTrainer.mutateAsync({ fullName: fullName.trim(), email: email.trim(), phone: phone.trim(), password });
      closeForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Não foi possível adicionar o treinador.');
    }
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
          <TextField
            label="Senha de acesso"
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 8 caracteres — repasse ao treinador"
            autoCapitalize="none"
            secureTextEntry
          />
          {formError ? <Text style={styles.error}>{formError}</Text> : null}
          <View style={styles.formActions}>
            <Button label="Cancelar" variant="secondary" onPress={closeForm} style={styles.flex1} />
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
  error: {
    color: colors.danger,
    fontSize: fontSize.sm,
  },
});
