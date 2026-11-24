import { apiClient } from '@/services/apiClient';
import { AttendanceLog, User } from '@/types';

export async function checkin(_actingUser: User, studentId: string, notes = ''): Promise<AttendanceLog> {
  const { data } = await apiClient.post('/attendance/checkin', { studentId, notes });
  return data;
}

export async function listStudentAttendance(_actingUser: User, studentId: string): Promise<AttendanceLog[]> {
  const { data } = await apiClient.get(`/students/${studentId}/attendance`);
  return data;
}

export interface TodayAttendanceRow {
  log: AttendanceLog;
  studentName: string;
  studentPhotoUrl: string | null;
}

export async function todayAttendance(_actingUser: User): Promise<TodayAttendanceRow[]> {
  const { data } = await apiClient.get('/attendance/today');
  return data;
}

export async function attendanceSummary(_actingUser: User, days = 30): Promise<{ date: string; count: number }[]> {
  const { data } = await apiClient.get('/attendance/summary', { params: { days } });
  return data;
}
