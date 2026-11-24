import { useLocalSearchParams } from 'expo-router';
import { StudentDetailScreen } from '@/screens/students/StudentDetailScreen';

export default function TrainerStudentDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <StudentDetailScreen studentId={id} basePath="/(trainer)" />;
}
