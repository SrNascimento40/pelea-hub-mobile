import { UserRole } from '@/types';

const is = (role: UserRole, ...allowed: UserRole[]) => allowed.includes(role);

export const permissions = {
  createStudent: (role: UserRole) => is(role, 'owner', 'trainer'),
  editStudentFull: (role: UserRole) => is(role, 'owner', 'trainer'),
  editOwnProfile: (role: UserRole) => is(role, 'student'),
  inactivateStudent: (role: UserRole) => is(role, 'owner'),
  listAllStudents: (role: UserRole) => is(role, 'owner', 'trainer'),
  createFee: (role: UserRole) => is(role, 'owner', 'trainer'),
  registerPayment: (role: UserRole) => is(role, 'owner', 'trainer'),
  editFeeAmount: (role: UserRole) => is(role, 'owner'),
  cancelPayment: (role: UserRole) => is(role, 'owner'),
  listAllFees: (role: UserRole) => is(role, 'owner', 'trainer'),
  checkin: (role: UserRole) => is(role, 'owner', 'trainer'),
  listAllAttendance: (role: UserRole) => is(role, 'owner', 'trainer'),
  adjustRankingManually: (role: UserRole) => is(role, 'owner'),
  registerProfile: (role: UserRole) => is(role, 'owner', 'trainer'),
  sendNotifications: (role: UserRole) => is(role, 'owner', 'trainer'),
  configureAcademy: (role: UserRole) => is(role, 'owner'),
  manageTrainers: (role: UserRole) => is(role, 'owner'),
};
