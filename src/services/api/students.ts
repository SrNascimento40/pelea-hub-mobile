import { apiClient } from '@/services/apiClient';
import { Student, StudentStatus, User } from '@/types';

export interface StudentFilters {
  search?: string;
  status?: StudentStatus | 'all';
}

export async function listStudents(_actingUser: User, filters: StudentFilters = {}): Promise<Student[]> {
  const { data } = await apiClient.get('/students', { params: filters });
  return data;
}

export async function getStudent(_actingUser: User, studentId: string): Promise<Student> {
  const { data } = await apiClient.get(`/students/${studentId}`);
  return data;
}

export async function getStudentByUserId(_userId: string): Promise<Student | null> {
  const { data } = await apiClient.get('/students/me');
  return data;
}

export interface CreateStudentInput {
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  observations: string;
  password: string;
}

export async function createStudent(_actingUser: User, input: CreateStudentInput): Promise<Student> {
  const { data } = await apiClient.post('/students', input);
  return data;
}

export type UpdateStudentInput = Partial<
  Pick<Student, 'fullName' | 'email' | 'phone' | 'birthDate' | 'address' | 'observations' | 'photoUrl'>
>;

export async function updateStudent(_actingUser: User, studentId: string, input: UpdateStudentInput): Promise<Student> {
  const { data } = await apiClient.put(`/students/${studentId}`, input);
  return data;
}

export async function setStudentStatus(_actingUser: User, studentId: string, status: StudentStatus): Promise<Student> {
  const { data } = await apiClient.patch(`/students/${studentId}/status`, { status });
  return data;
}

export async function uploadStudentPhoto(_actingUser: User, studentId: string, localUri: string): Promise<Student> {
  const response = await fetch(localUri);
  const blob = await response.blob();
  const formData = new FormData();
  formData.append('file', blob, 'photo.jpg');

  const { data } = await apiClient.post(`/students/${studentId}/photo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
