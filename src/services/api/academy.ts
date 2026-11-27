import { apiClient } from '@/services/apiClient';
import { Academy, User } from '@/types';

export async function getAcademy(_actingUser: User): Promise<Academy> {
  const { data } = await apiClient.get('/academy');
  return data;
}

export type UpdateAcademyInput = Partial<Pick<Academy, 'name' | 'address' | 'phone' | 'logoUrl'>>;

export async function updateAcademy(_actingUser: User, input: UpdateAcademyInput): Promise<Academy> {
  const { data } = await apiClient.put('/academy', input);
  return data;
}

export async function listTrainers(_actingUser: User): Promise<User[]> {
  const { data } = await apiClient.get('/academy/trainers');
  return data;
}

export interface CreateTrainerInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export async function addTrainer(_actingUser: User, input: CreateTrainerInput): Promise<User> {
  const { data } = await apiClient.post('/academy/trainers', input);
  return data;
}

export async function removeTrainer(_actingUser: User, trainerId: string): Promise<void> {
  await apiClient.delete(`/academy/trainers/${trainerId}`);
}
