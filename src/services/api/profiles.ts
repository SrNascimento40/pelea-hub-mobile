import { apiClient } from '@/services/apiClient';
import { PhysicalProfile, ProgressCheckin, ProgressScores, TechProfile, User } from '@/types';

export async function listPhysicalProfiles(_actingUser: User, studentId: string): Promise<PhysicalProfile[]> {
  const { data } = await apiClient.get(`/students/${studentId}/physical`);
  return data;
}

export async function latestPhysicalProfile(actingUser: User, studentId: string): Promise<PhysicalProfile | null> {
  const list = await listPhysicalProfiles(actingUser, studentId);
  return list[0] ?? null;
}

export interface PhysicalProfileInput {
  weightKg: number;
  heightCm: number;
  category: string;
}

export async function createPhysicalProfile(
  _actingUser: User,
  studentId: string,
  input: PhysicalProfileInput
): Promise<PhysicalProfile> {
  const { data } = await apiClient.post(`/students/${studentId}/physical`, input);
  return data;
}

export async function listTechnicalProfiles(_actingUser: User, studentId: string): Promise<TechProfile[]> {
  const { data } = await apiClient.get(`/students/${studentId}/technical`);
  return data;
}

export async function latestTechnicalProfile(actingUser: User, studentId: string): Promise<TechProfile | null> {
  const list = await listTechnicalProfiles(actingUser, studentId);
  return list[0] ?? null;
}

export interface TechnicalProfileInput {
  level: string;
  graduation: string;
  trainingTime: string;
  trainerNotes: string;
}

export async function createTechnicalProfile(
  _actingUser: User,
  studentId: string,
  input: TechnicalProfileInput
): Promise<TechProfile> {
  const { data } = await apiClient.post(`/students/${studentId}/technical`, input);
  return data;
}

export async function listProgressCheckins(_actingUser: User, studentId: string): Promise<ProgressCheckin[]> {
  const { data } = await apiClient.get(`/students/${studentId}/progress`);
  return data;
}

export interface ProgressCheckinInput extends ProgressScores {
  checkinDate: string;
  frequency: string;
  developmentFocus: string;
  strengths: string;
  weaknesses: string;
}

export async function createProgressCheckin(
  _actingUser: User,
  studentId: string,
  input: ProgressCheckinInput
): Promise<ProgressCheckin> {
  const { data } = await apiClient.post(`/students/${studentId}/progress`, input);
  return data;
}

export async function deleteProgressCheckin(_actingUser: User, studentId: string, checkinId: string): Promise<void> {
  await apiClient.delete(`/students/${studentId}/progress/${checkinId}`);
}
