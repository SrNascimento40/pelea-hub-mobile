import React from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { ListRow } from '@/components/ui/ListRow';
import { Student } from '@/types';

export function StudentListItem({ student, onPress }: { student: Student; onPress: () => void }) {
  return (
    <ListRow
      onPress={onPress}
      showChevron
      leading={<Avatar name={student.fullName} photoUrl={student.photoUrl} />}
      title={student.fullName}
      subtitle={student.email}
      trailing={
        student.status === 'inactive' ? <Badge label="Inativo" tone="neutral" /> : <Badge label="Ativo" tone="success" />
      }
    />
  );
}
