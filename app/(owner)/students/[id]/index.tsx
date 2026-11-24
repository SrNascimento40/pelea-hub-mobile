import { useLocalSearchParams } from 'expo-router';
import { StudentDetailScreen } from '@/screens/students/StudentDetailScreen';

export default function OwnerStudentDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <StudentDetailScreen studentId={id} basePath="/(owner)" />;
}
