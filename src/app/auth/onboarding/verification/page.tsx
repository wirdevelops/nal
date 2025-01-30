'use client';

import { useRouter } from 'next/navigation';
import { useUserStore } from "@/stores/useUserStore";
import { Card } from "@/components/ui/card";
import { OnboardingProgress } from "@/components/auth/OnboardingProcess";
import { VerificationForm } from '@/components/auth/VerificationForm';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { UserRole, ActorProfile, CrewProfile, VendorProfile, ProducerProfile, BaseProfile, VerificationData } from '@/types/user';


// Create a type for the possible profiles that our profile can be
type ProfileFromRole<R extends UserRole> =
    R extends 'actor' ? ActorProfile :
    R extends 'crew' ? CrewProfile :
    R extends 'vendor' ? VendorProfile :
    R extends 'producer' ? ProducerProfile :
    BaseProfile;


export default function VerificationPage() {
  const router = useRouter();
  const { user, updateProfile, updateUser } = useUserStore();

  const handleVerificationComplete = async (data: VerificationData) => {
    try {
        const role = user.roles[0];
      if (role === 'actor' || role === 'crew' ||
          role === 'vendor' || role === 'producer') {
            const profile = user?.profiles?.[role] as ProfileFromRole<typeof role>;
              
        await updateProfile(role, {
          ...profile,
          verificationData: data,
        });
          await updateUser({
              status: 'pending'
          });
      }
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