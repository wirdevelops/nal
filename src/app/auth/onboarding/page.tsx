'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useUserStore } from "@/stores/useUserStore";
import { RoleSelector } from "@/components/auth/RoleSelector";
import { OnboardingProgress } from "@/components/auth/OnboardingProcess";

const STAGES = [
  'role-selection',
  'basic-info',
  'role-details',
  'verification',
  'completed'
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateProfile } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const role = data.roles[0];
      if (role === 'actor' || role === 'crew' || 
          role === 'vendor' || role === 'producer') {
        await updateProfile(role, {
          onboarding: {
            stage: 'basic-info',
            completed: [...(user?.onboarding.completed || []), 'role-selection']
          }
        });
      }
      router.push('/auth/onboarding/basic-info');
    } catch (error) {
      console.error('Failed to save roles:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <OnboardingProgress
        currentStage="role-selection"
        completedStages={user?.onboarding.completed || []}
      />

      <Card className="p-6">
        <RoleSelector
          selectedRoles={user?.roles || []}
          onChange={handleRoleSubmit}
          isLoading={isSubmitting}
        />
      </Card>
    </div>
  );
}