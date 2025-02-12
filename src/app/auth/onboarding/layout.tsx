// src/app/onboarding/layout.tsx
'use client';

import { useAuthStore } from '@/lib/auth/store';
import { useOnboardingStore } from '@/lib/onboarding/store';
import { ProgressTracker } from '@/components/onboarding/ProgressTracker';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/loading-spinner'; // Import LoadingSpinner

const STAGES = [
  'setup',
  'role-selection',
  'basic-info',
  'role-details',
  'verification'
] as const;

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading: authLoading } = useAuthStore();
  const { status, isLoading: onboardingLoading } = useOnboardingStore();

  if (authLoading || onboardingLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner /> {/* Use the LoadingSpinner component */}
      </div>
    );
  }

  if (!user || user.hasCompletedOnboarding) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Complete Your Profile
          </h1>
          <p className="text-muted-foreground">
            Let's get you set up with everything you need
          </p>
        </div>

        <Card className="p-6">
          <ProgressTracker
            stages={STAGES}
            currentStage={status?.stage || 'setup'} // Get current stage from status
          />

          <div className="mt-8">
            {children}
          </div>
        </Card>
      </div>
    </div>
  );
}