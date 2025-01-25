// app/auth/onboarding/layout.tsx
'use client';

import { useUser } from '@/hooks/useUser';
import { OnboardingProgress } from '@/components/auth/OnboardingProgress';
import { redirect } from 'next/navigation';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="container max-w-screen-lg py-6">
          <OnboardingProgress 
            currentStage={user.onboarding.stage}
            completedStages={user.onboarding.completed}
          />
          <main className="mt-8">{children}</main>
        </div>
      </div>
    </div>
  );
}