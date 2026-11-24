export type UserRole = 'owner' | 'trainer' | 'student';

export type StudentStatus = 'active' | 'inactive';

export type FeeStatus = 'pending' | 'paid' | 'overdue';

export type PaymentAction = 'registered' | 'cancelled' | 'edited';

export type RankingSource = 'attendance' | 'bonus' | 'manual';

export type NotificationType = 'fee_due' | 'fee_overdue' | 'announcement' | 'system';

export interface Academy {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  logoUrl: string | null;
  plan: 'free' | 'pro' | 'enterprise';
  isActive: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  academyId: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface Student {
  id: string;
  userId: string;
  academyId: string;
  fullName: string;
  email: string;
  phone: string;
  photoUrl: string | null;
  birthDate: string;
  address: string;
  observations: string;
  enrollmentDate: string;
  status: StudentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyFee {
  id: string;
  studentId: string;
  academyId: string;
  amount: number;
  dueDate: string;
  referenceMonth: string;
  status: FeeStatus;
  paidAt: string | null;
  paidBy: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentHistoryEntry {
  id: string;
  feeId: string;
  action: PaymentAction;
  performedBy: string;
  performedByName: string;
  createdAt: string;
  notes: string;
}

export interface AttendanceLog {
  id: string;
  studentId: string;
  academyId: string;
  checkedInAt: string;
  checkedInBy: string;
  checkedInByName: string;
  notes: string;
}

export interface RankingPoint {
  id: string;
  studentId: string;
  academyId: string;
  points: number;
  month: number;
  year: number;
  source: RankingSource;
  createdAt: string;
}

export interface RankingRow {
  studentId: string;
  studentName: string;
  studentPhotoUrl: string | null;
  points: number;
  position: number;
}

export interface PhysicalProfile {
  id: string;
  studentId: string;
  academyId: string;
  weightKg: number;
  heightCm: number;
  category: string;
  evaluatedAt: string;
  evaluatedBy: string;
  evaluatedByName: string;
}

export interface TechProfile {
  id: string;
  studentId: string;
  academyId: string;
  level: string;
  graduation: string;
  trainingTime: string;
  trainerNotes: string;
  updatedAt: string;
  updatedBy: string;
  updatedByName: string;
}

export interface AppNotification {
  id: string;
  academyId: string;
  targetUserId: string | null;
  title: string;
  body: string;
  type: NotificationType;
  sentAt: string;
  readAt: string | null;
}

export interface FinanceSummary {
  totalStudents: number;
  activeStudents: number;
  paidThisMonth: number;
  pendingThisMonth: number;
  overdueCount: number;
  overdueAmount: number;
  revenueThisMonth: number;
}
