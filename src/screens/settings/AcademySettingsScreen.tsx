import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { maskPhone } from '@/utils/masks';
import { Card } from '@/components/ui/Card';
import { ListRow } from '@/components/ui/ListRow';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { colors, fontSize, roleLabels, spacing } from '@/constants/theme';
import { useAcademy, useUpdateAcademy } from '@/hooks/useAcademy';
import { useAuth } from '@/hooks/useAuth';

export function AcademySettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { data: academy, isLoading } = useAcademy();
  const updateAcademy = useUpdateAcademy();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (academy) {
      setName(academy.name);
      setAddress(academy.address);
      setPhone(maskPhone(academy.phone));
    }
  }, [academy]);

  if (isLoading || !user) return <Screen><LoadingView /></Screen>;

  async function handleSave() {
    await updateAcademy.mutateAsync({ name, address, phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <Screen contentStyle={styles.content}>
      <Text style={styles.title}>Configurações</Text>

      <Card>
        <ListRow
          leading={<Ionicons name="person-circle-outline" size={28} color={colors.textMuted} />}
          title={user.fullName}
          subtitle={`${roleLabels[user.role]} · ${user.email}`}
        />
      </Card>

      <Pressable style={styles.settingsRow} onPress={() => router.push('/(owner)/settings/trainers')}>
        <Ionicons name="people-outline" size={20} color={colors.text} />
        <Text style={styles.settingsRowLabel}>Gerenciar treinadores</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
      </Pressable>

      <Text style={styles.sectionLabel}>Dados da academia</Text>
      <View style={styles.form}>
        <TextField label="Nome" value={name} onChangeText={setName} />
        <TextField label="Endereço" value={address} onChangeText={setAddress} />
        <TextField label="Telefone" value={phone} onChangeText={(v) => setPhone(maskPhone(v))} placeholder="(11) 3333-4444" keyboardType="phone-pad" />
        <Button label={saved ? 'Salvo!' : 'Salvar alterações'} onPress={handleSave} loading={updateAcademy.isPending} fullWidth />
      </View>

      <Button label="Sair da conta" variant="secondary" onPress={() => logout()} fullWidth style={styles.logout} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: '700',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
  },
  settingsRowLabel: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  sectionLabel: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  form: {
    gap: spacing.md,
  },
  logout: {
    marginTop: spacing.lg,
  },
});
