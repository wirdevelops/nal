// src/middleware/onboarding.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import { useOnboardingStore } from '@/lib/onboarding';

export const useOnboardingGuard = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { status } = useOnboardingStore();

  useEffect(() => {
    if (user && !user.hasCompletedOnboarding) {
      router.push('/onboarding');
    } else if (!user?.hasCompletedOnboarding && status?.stage !== 'completed') {
      router.push('/onboarding');
    }
  }, [user, status, router]);
};

// Usage in components/layouts:
// import { useOnboardingGuard } from '@/middleware/onboarding';
// useOnboardingGuard();