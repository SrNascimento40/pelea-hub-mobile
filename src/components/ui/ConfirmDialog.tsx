import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '@/constants/theme';
import { Button } from '@/components/ui/Button';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive,
  loading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
          <View style={styles.actions}>
            <Button label={cancelLabel} variant="secondary" onPress={onCancel} style={styles.actionButton} />
            <Button
              label={confirmLabel}
              variant={destructive ? 'danger' : 'primary'}
              onPress={onConfirm}
              loading={loading}
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 360,
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  description: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});
