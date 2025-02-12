import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/components/context';

export const ProtectedRoute: React.FC<{ 
  children: React.ReactNode, 
  allowedRoles?: string[] 
}> = ({ children, allowedRoles = ['user', 'admin'] }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (allowedRoles && !allowedRoles.includes(user.activeRole)) {
      router.push('/unauthorized');
    }
  }, [user, router, allowedRoles]);

  return user && allowedRoles.includes(user.activeRole) ? <>{children}</> : null;
};