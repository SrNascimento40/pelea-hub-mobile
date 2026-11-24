import { StudentFormScreen } from '@/screens/students/StudentFormScreen';

export default function OwnerNewStudentRoute() {
  return <StudentFormScreen mode="create" basePath="/(owner)" />;
}
