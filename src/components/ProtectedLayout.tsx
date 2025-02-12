// components/ProtectedLayout.tsx (Create this file)
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/auth/hooks'; // Import the useUser hook

interface Props {
  children: React.ReactNode;
  allowedStages?: string[]; // Optional:  Restrict access based on onboarding stage
}

export function ProtectedLayout({ children, allowedStages }: Props) {
  const router = useRouter();
  const { data: user, isLoading, isError } = useUser();

  useEffect(() => {
    if (isLoading) {
      return; // Wait for user data to load
    }

    if (isError) {
      // Handle error (e.g., redirect to login)
      router.push('/auth/login');
      return;
    }

    if (!user) {
      // Not logged in, redirect to login
      router.push('/auth/login');
      return;
    }

    // Check onboarding status
    if (user.onboarding.stage !== 'completed') {
      // Redirect to the appropriate onboarding step
      if (allowedStages && !allowedStages.includes(user.onboarding.stage)) {
          router.push(`/onboarding/${user.onboarding.stage}`); // Example: /onboarding/role-selection
        return;
      }
    }
  }, [isLoading, isError, user, router, allowedStages]);

  if (isLoading) {
    return <div>Loading...</div>; // Or a better loading indicator
  }
  // Render error page based on the error type

  return <>{children}</>;
}