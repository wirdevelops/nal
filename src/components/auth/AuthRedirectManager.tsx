// src/components/AuthRedirectManager.tsx
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Import usePathname
import { useAuthStore } from '@/lib/auth/store';

const AuthRedirectManager = () => {
  const router = useRouter();
  const pathname = usePathname(); // Use usePathname
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      console.log('AuthRedirectManager: Running redirect check', {
        isLoading,
        user,
        currentPath: pathname // Use pathname here
      });

      if (isLoading) {
        return;
      }

      const isAuthRoute = pathname.startsWith('/auth'); // Use pathname
      const isOnboardingRoute = pathname.startsWith('/auth/onboarding'); //Use pathname

      // Not authenticated
      if (!user) {
        console.log('AuthRedirectManager: No user found');
        if (!isAuthRoute) {
          console.log('AuthRedirectManager: Redirecting to login');
          router.replace('/auth/login');
        }
        return;
      }

      // User exists but needs onboarding
      if (user && !user.hasCompletedOnboarding) { //check user exists
        console.log('AuthRedirectManager: User needs onboarding');
        if (!isOnboardingRoute) {
          console.log('AuthRedirectManager: Redirecting to onboarding');
          router.replace('/auth/onboarding');
        }
        return;
      }

      // User is fully authenticated and onboarded
      if (user && isAuthRoute) { //check user exists
        console.log('AuthRedirectManager: Redirecting to dashboard');
        router.replace('/dashboard');
      }
    };

    handleAuthRedirect();
  }, [user, isLoading, router, pathname]); // Include pathname in dependencies

  // Debug component render
  useEffect(() => {
    console.log('AuthRedirectManager: Component mounted');
    return () => console.log('AuthRedirectManager: Component unmounted');
  }, []);

  return null;
};

export default AuthRedirectManager;