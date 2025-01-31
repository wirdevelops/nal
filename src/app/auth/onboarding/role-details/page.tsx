'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from "@/stores/useUserStore";
import { RoleDetailsForm } from '@/components/auth/RoleDetailsForm';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft} from 'lucide-react';

export default function RoleDetailsPage() {
  const router = useRouter();
  const { user, updateProfile } = useUserStore();
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  const handleSubmit = async (data: any) => {
    const currentRole = user?.roles[currentRoleIndex];
    if (currentRole === 'actor' || currentRole === 'crew' || 
        currentRole === 'vendor' || currentRole === 'producer') {
      await updateProfile(currentRole, data);
    }
  
    if (currentRoleIndex < (user?.roles.length ?? 0) - 1) {
      setCurrentRoleIndex(prev => prev + 1);
    } else {
      router.push('/auth/onboarding/verification');
    }
  };

  const handleBack = () => {
    if (currentRoleIndex > 0) {
      setCurrentRoleIndex(prev => prev - 1);
    } else {
      router.push('/auth/onboarding/basic-info');
    }
  };

  if (!user?.roles.length) {
    router.push('/auth/onboarding');
    return null;
  }

  const currentRole = user.roles[currentRoleIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {currentRole} Details
            </h2>
            {user.roles.length > 1 && (
              <p className="text-sm text-muted-foreground">
                Role {currentRoleIndex + 1} of {user.roles.length}
              </p>
            )}
          </div>

          <RoleDetailsForm 
            role={currentRole}
            onSubmit={handleSubmit}
            defaultValues={user.profiles[currentRole]}
          />

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}