import React from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Não foi possível carregar os dados.', onRetry }: ErrorStateProps) {
  return (
    <EmptyState
      icon="alert-circle-outline"
      title="Algo deu errado"
      description={message}
      action={onRetry ? <Button label="Tentar novamente" variant="secondary" onPress={onRetry} /> : undefined}
    />
  );
}
