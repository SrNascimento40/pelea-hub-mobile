import { UserRole } from '@/types';

export function homeRouteForRole(role: UserRole): '/(owner)/dashboard' | '/(trainer)/dashboard' | '/(student)/dashboard' {
  if (role === 'owner') return '/(owner)/dashboard';
  if (role === 'trainer') return '/(trainer)/dashboard';
  return '/(student)/dashboard';
}
