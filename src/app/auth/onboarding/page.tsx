// app/auth/onboarding/page.tsx
'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { RoleSelector } from "@/components/auth/RoleSelector";
import { OnboardingProgress } from "@/components/auth/OnboardingProcess";
import { useUserStore } from '@/stores/useUserStore';

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const { addRole, updateOnboarding } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Add selected roles
      for (const role of data.roles) {
        await addRole(role);
      }

      // Update onboarding stage
      await updateOnboarding('basic-info', {
        selectedRoles: data.roles
      });

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
          maxSelections={2}
        />
      </Card>
    </div>
  );
}