import { useLocalSearchParams } from 'expo-router';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import { useStudent } from '@/hooks/useStudents';
import { StudentFormScreen } from '@/screens/students/StudentFormScreen';

export default function OwnerStudentEditRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: student, isLoading } = useStudent(id);

  if (isLoading || !student) {
    return (
      <Screen>
        <LoadingView />
      </Screen>
    );
  }

  return <StudentFormScreen mode="edit" basePath="/(owner)" student={student} />;
}
