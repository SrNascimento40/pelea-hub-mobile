import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { maskPhone } from '@/utils/masks';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { TopBar } from '@/components/TopBar';
import { colors, fontSize, roleLabels, spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useChangePassword, useUpdateMe } from '@/hooks/useUsers';
import { formatDate } from '@/utils/format';

const MIN_PASSWORD_LENGTH = 6;

export function TrainerProfileScreen() {
  const { user, logout } = useAuth();
  const updateMe = useUpdateMe();
  const changePassword = useChangePassword();

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [phone, setPhone] = useState(maskPhone(user?.phone ?? ''));
  const [profileSaved, setProfileSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaved, setPasswordSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setPhone(maskPhone(user.phone));
    }
  }, [user?.id]);

  if (!user) {
    return (
      <Screen>
        <LoadingView />
      </Screen>
    );
  }

  const profileChanged = fullName.trim() !== user.fullName || phone !== maskPhone(user.phone);

  async function handleSaveProfile() {
    if (!fullName.trim()) return;
    setProfileSaved(false);
    try {
      await updateMe.mutateAsync({ fullName: fullName.trim(), phone: phone.trim() });
      setProfileSaved(true);
    } catch {
      // A mensagem de erro é exibida via updateMe.error
    }
  }

  async function handleChangePassword() {
    setPasswordSaved(false);
    setPasswordError(null);
    if (!currentPassword || !newPassword) {
      setPasswordError('Preencha a senha atual e a nova senha.');
      return;
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(`A nova senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('A confirmação não confere com a nova senha.');
      return;
    }
    try {
      await changePassword.mutateAsync({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSaved(true);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Não foi possível alterar a senha.');
    }
  }

  return (
    <Screen contentStyle={styles.content}>
      <TopBar title="Meu perfil" notificationsHref="/(trainer)/notifications" />

      <View style={styles.avatarSection}>
        <Avatar name={user.fullName} size={88} />
        <Text style={styles.name}>{user.fullName}</Text>
        <Text style={styles.meta}>
          {roleLabels[user.role]} · {user.email}
        </Text>
        <Text style={styles.meta}>Na equipe desde {formatDate(user.createdAt)}</Text>
      </View>

      <Text style={styles.sectionLabel}>Dados pessoais</Text>
      <Card style={styles.form}>
        <TextField
          label="Nome completo"
          value={fullName}
          onChangeText={(v) => {
            setFullName(v);
            setProfileSaved(false);
          }}
          error={!fullName.trim() ? 'Informe seu nome.' : undefined}
        />
        <TextField
          label="Telefone"
          value={phone}
          onChangeText={(v) => {
            setPhone(maskPhone(v));
            setProfileSaved(false);
          }}
          keyboardType="phone-pad"
        />
        {updateMe.error ? <Text style={styles.error}>{updateMe.error.message}</Text> : null}
        <Button
          label={profileSaved && !profileChanged ? 'Salvo!' : 'Salvar alterações'}
          onPress={handleSaveProfile}
          loading={updateMe.isPending}
          disabled={!profileChanged || !fullName.trim()}
          fullWidth
        />
      </Card>

      <Text style={styles.sectionLabel}>Alterar senha</Text>
      <Card style={styles.form}>
        <TextField
          label="Senha atual"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <TextField label="Nova senha" value={newPassword} onChangeText={setNewPassword} secureTextEntry autoCapitalize="none" />
        <TextField
          label="Confirmar nova senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
        {passwordSaved ? <Text style={styles.success}>Senha alterada com sucesso.</Text> : null}
        <Button label="Alterar senha" variant="secondary" onPress={handleChangePassword} loading={changePassword.isPending} fullWidth />
      </Card>

      <Button label="Sair da conta" variant="secondary" onPress={() => logout()} fullWidth style={styles.logout} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  avatarSection: {
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.sm,
  },
  name: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  meta: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
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
  error: {
    color: colors.danger,
    fontSize: fontSize.sm,
  },
  success: {
    color: colors.success,
    fontSize: fontSize.sm,
  },
  logout: {
    marginTop: spacing.lg,
  },
});
