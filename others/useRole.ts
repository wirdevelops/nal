// hooks/useRole.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import { UserRole } from '@/types/user';

export const useRole = (allowedRoles: UserRole[]) => {
  const { isAuthenticated, roles } = useAuth();
  const router = useRouter();

  const hasAccess = isAuthenticated && roles.some(role => allowedRoles.includes(role));

  useEffect(() => {
    if (!hasAccess) {
      router.push('/login');
    }
  }, [hasAccess, router]);

  return {
    hasAccess,
    isAuthenticated,
    roles
  };
};

export const useProtectedRoute = (allowedRoles: UserRole[]) => {
  const { hasAccess } = useRole(allowedRoles);
  return { hasAccess };
};