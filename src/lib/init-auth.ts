import { AuthService } from '@/lib/auth-service';
import { useUserStore } from '@/stores/useUserStore';

export function initializeAuth() {
  const sessionToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('session='))
    ?.split('=')[1];

  if (sessionToken) {
    const user = AuthService.validateSession(sessionToken);
    if (user) {
      useUserStore.getState().setUser(user);
    } else {
      AuthService.clearSession();
    }
  }
}