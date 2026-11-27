import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import { maskPhone } from '@/utils/masks';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { TopBar } from '@/components/TopBar';
import { colors, fontSize, spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { usePhysicalProfiles, useTechnicalProfiles } from '@/hooks/useProfiles';
import { useMyStudentProfile, useUpdateStudent, useUploadStudentPhoto } from '@/hooks/useStudents';
import { formatDate } from '@/utils/format';

export function StudentProfileScreen() {
  const { user, logout } = useAuth();
  const { data: student, isLoading } = useMyStudentProfile();
  const { data: physical } = usePhysicalProfiles(student?.id);
  const { data: technical } = useTechnicalProfiles(student?.id);
  const updateStudent = useUpdateStudent(student?.id ?? '');
  const uploadPhoto = useUploadStudentPhoto(student?.id ?? '');

  const [phone, setPhone] = useState('');
  const [editingPhone, setEditingPhone] = useState(false);
  const [address, setAddress] = useState('');
  const [editingAddress, setEditingAddress] = useState(false);

  if (isLoading || !student || !user) {
    return (
      <Screen>
        <LoadingView />
      </Screen>
    );
  }

  async function handlePickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      await uploadPhoto.mutateAsync(result.assets[0].uri);
    }
  }

  async function handleSavePhone() {
    if (!phone.trim()) return;
    await updateStudent.mutateAsync({ phone: phone.trim() });
    setEditingPhone(false);
  }

  async function handleSaveAddress() {
    await updateStudent.mutateAsync({ address: address.trim() });
    setEditingAddress(false);
  }

  const latestPhysical = physical?.[0];
  const latestTechnical = technical?.[0];

  return (
    <Screen contentStyle={styles.content}>
      <TopBar title="Meu perfil" notificationsHref="/(student)/notifications" />

      <View style={styles.avatarSection}>
        <Pressable onPress={handlePickPhoto}>
          <Avatar name={student.fullName} photoUrl={student.photoUrl} size={88} />
          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={14} color={colors.white} />
          </View>
        </Pressable>
        <Text style={styles.name}>{student.fullName}</Text>
        <Text style={styles.email}>{student.email}</Text>
      </View>

      <Card>
        <View style={styles.phoneRow}>
          <Text style={styles.phoneLabel}>Telefone</Text>
          {editingPhone ? (
            <View style={styles.phoneEdit}>
              <TextField label="" value={phone} onChangeText={(v) => setPhone(maskPhone(v))} placeholder="(11) 99999-9999" keyboardType="phone-pad" />
              <Button label="Salvar" size="sm" onPress={handleSavePhone} loading={updateStudent.isPending} />
            </View>
          ) : (
            <Pressable
              style={styles.phoneValueRow}
              onPress={() => {
                setPhone(maskPhone(student.phone));
                setEditingPhone(true);
              }}
            >
              <Text style={styles.phoneValue}>{student.phone}</Text>
              <Ionicons name="create-outline" size={16} color={colors.primary} />
            </Pressable>
          )}
        </View>
      </Card>

      <Card>
        <View style={styles.phoneRow}>
          <Text style={styles.phoneLabel}>Endereço</Text>
          {editingAddress ? (
            <View style={styles.phoneEdit}>
              <TextField
                label=""
                value={address}
                onChangeText={setAddress}
                placeholder={student.address || 'Seu endereço'}
                style={styles.addressInput}
              />
              <Button label="Salvar" size="sm" onPress={handleSaveAddress} loading={updateStudent.isPending} />
            </View>
          ) : (
            <Pressable
              style={styles.phoneValueRow}
              onPress={() => {
                setAddress(student.address);
                setEditingAddress(true);
              }}
            >
              <Text style={styles.phoneValue}>{student.address || 'Adicionar endereço'}</Text>
              <Ionicons name="create-outline" size={16} color={colors.primary} />
            </Pressable>
          )}
        </View>
      </Card>

      <Text style={styles.sectionLabel}>Perfil físico</Text>
      <Card>
        {latestPhysical ? (
          <>
            <Text style={styles.metric}>{latestPhysical.weightKg} kg · {latestPhysical.heightCm} cm</Text>
            <Text style={styles.metricMeta}>Categoria {latestPhysical.category} · Avaliado em {formatDate(latestPhysical.evaluatedAt)}</Text>
          </>
        ) : (
          <Text style={styles.metricMeta}>Sem avaliações registradas ainda</Text>
        )}
      </Card>

      <Text style={styles.sectionLabel}>Perfil técnico</Text>
      <Card>
        {latestTechnical ? (
          <>
            <Text style={styles.metric}>{latestTechnical.level}</Text>
            <Text style={styles.metricMeta}>{latestTechnical.graduation} · {latestTechnical.trainingTime} de treino</Text>
            {latestTechnical.trainerNotes ? <Text style={styles.notes}>{latestTechnical.trainerNotes}</Text> : null}
          </>
        ) : (
          <Text style={styles.metricMeta}>Sem avaliações registradas ainda</Text>
        )}
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
  cameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  name: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  email: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  phoneRow: {
    gap: spacing.xs,
  },
  phoneLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  phoneValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  phoneValue: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  phoneEdit: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  sectionLabel: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  metric: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  metricMeta: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  notes: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  logout: {
    marginTop: spacing.lg,
  },
});
