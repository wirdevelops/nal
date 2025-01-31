// hooks/useAuth.ts
import { useEffect } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import { AuthService } from '@/lib/auth-service';

export const useAuth = () => {
  // Access store directly
  const user = useUserStore(state => state.user);
  const setUser = useUserStore(state => state.setUser);
  const logout = useUserStore(state => state.logout);

  useEffect(() => {
    const checkSession = () => {
      if (!AuthService.validateSession()) {
        logout();
      }
    };

    window.addEventListener('storage', checkSession);
    return () => window.removeEventListener('storage', checkSession);
  }, [logout]);

  return {
    isAuthenticated: !!user,
    isVerified: user?.isVerified || false,
    roles: user?.roles || [],
    user,
    refreshUser: () => {
      const session = localStorage.getItem('session');
      if (session) {
        const { userId } = JSON.parse(atob(session));
        const userData = localStorage.getItem(`userdata:${userId}`);
        if (userData) setUser(JSON.parse(userData));
      }
    }
  };
};