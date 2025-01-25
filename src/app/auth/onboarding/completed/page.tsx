// app/auth/onboarding/completed/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from "@/stores/useUserStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from 'lucide-react';
import { OnboardingProgress } from "@/components/auth/OnboardingProcess";

export default function CompletedPage() {
  const router = useRouter();
  const { user } = useUserStore();

  useEffect(() => {
    if (!user || user.onboarding.stage !== 'completed') {
      router.push('/auth/onboarding');
    }
  }, [user, router]);

  const roleBasedNextSteps: Record<string, string[]> = {
    'project-owner': [
      'Create your first project',
      'Invite team members',
      'Explore available talent'
    ],
    'crew': [
      'Browse available projects',
      'Complete your portfolio',
      'Connect with other professionals'
    ],
    'actor': [
      'Browse casting calls',
      'Add more portfolio items',
      'Connect with casting directors'
    ],
    'vendor': [
      'List your equipment/services',
      'Set up your rental terms',
      'Connect with production houses'
    ],
    'ngo': [
      'Post your first project',
      'Connect with filmmakers',
      'Explore impact stories'
    ]
  };

  const getNextSteps = () => {
    if (!user?.roles) return [];
    return user.roles.flatMap(role => roleBasedNextSteps[role] || []);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <OnboardingProgress
        currentStage="completed"
        completedStages={user?.onboarding.completed || []}
      />

      <Card className="p-8 text-center">
        <div className="space-y-6">
          <CheckCircle className="w-12 h-12 text-primary mx-auto" />
          
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Welcome to Nalevel Empire!</h1>
            <p className="text-muted-foreground">
              Your profile is set up and ready to go. Here's what you can do next:
            </p>
          </div>

          <div className="space-y-4 text-left">
            {getNextSteps().slice(0, 3).map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">
                  {index + 1}
                </div>
                <span>{step}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-6">
            <Button onClick={() => router.push('/dashboard')}>
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button variant="outline" onClick={() => router.push('/profile')}>
              View Your Profile
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}