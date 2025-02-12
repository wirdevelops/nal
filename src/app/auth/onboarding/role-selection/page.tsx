// /app/auth/onboarding/role-selection/page.tsx (Verification)
'use client';

import { RoleSelector } from '@/components/onboarding/RoleSelector';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/auth/store';
import { UserRole } from '@/lib/user/types'; 
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useOnboardingStore } from '@/lib/onboarding/store';
import { Card } from '@/components/ui/card';

export default function RoleSelectionPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, updateUser } = useAuthStore();
  const { completeStep } = useOnboardingStore();

  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]); // Correct Type
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth/login');
    }

    if (!authLoading && user && user.hasCompletedOnboarding) {
      router.replace("/dashboard");
      return;
    }

    if (user && user.roles) {
      setSelectedRoles(user.roles); 
    }
  }, [authLoading, user, router]);

  const handleRoleChange = (roles: UserRole[]) => {
    setSelectedRoles(roles);
    setError(null);
  };

  const handleSubmit = async () => {
    if (selectedRoles.length === 0) {
      setError('Please select at least one role.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Replace with your actual API call (using authApi or a new userApi)
        if (user) {
            const response = await fetch('/api/user/profile', { // <--- Change to an actual API endpoint
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roles: selectedRoles }), // Send only the roles
              });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update user roles');
            }
            const updatedUser = await response.json(); // Get updated user.

            await updateUser(updatedUser); // Update user with backend response.

            // Mark 'role-selection' as complete and move to next stage
            completeStep('role-selection');
        }

      router.push('/auth/onboarding/basic-info');
    } catch (error: any) {
      setError(error.message || 'An error occurred while updating roles.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className='p-6'>
        <RoleSelector
          selectedRoles={selectedRoles}
          onChange={handleRoleChange}
          maxSelections={2}
        />
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </Card>

      <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Saving...
          </div>
        ) : (
          'Continue'
        )}
      </Button>
    </div>
  );
}