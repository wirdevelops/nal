// app/auth/onboarding/verification/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useUser } from "@/hooks/useUserere";
import { Card } from "@/components/ui/card";
import { OnboardingProgress } from "@/components/auth/OnboardingProcess";
import { VerificationForm } from '@/components/auth/VerificationForm';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default function VerificationPage() {
  const router = useRouter();
  const { user, updateUser } = useUser();

  const handleVerificationComplete = async (data: any) => {
    try {
      await updateUser({
        ...user,
        onboarding: {
          stage: 'completed',
          completed: [...user.onboarding.completed, 'verification'],
          data: { ...user.onboarding.data, verification: data }
        },
        verificationStatus: 'pending'
      });
      router.push('/auth/onboarding/completed');
    } catch (error) {
      console.error('Verification submission failed:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <OnboardingProgress
        currentStage="verification"
        completedStages={user?.onboarding.completed || []}
      />

      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }>
        <Card className="p-6">
          <VerificationForm 
            roles={user?.roles || []}
            onSubmit={handleVerificationComplete}
            defaultValues={user?.onboarding.data?.verification}
          />
        </Card>
      </Suspense>
    </div>
  );
}