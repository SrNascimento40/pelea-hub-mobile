import { StudentFormScreen } from '@/screens/students/StudentFormScreen';

export default function TrainerNewStudentRoute() {
  return <StudentFormScreen mode="create" basePath="/(trainer)" />;
}
