// src/app/onboarding/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { ChevronRight, User2, Briefcase, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/lib/auth/store';
import { useEffect } from 'react';

const ONBOARDING_STEPS = [
  {
    icon: User2,
    title: 'Complete Your Profile',
    description: 'Tell us about yourself to personalize your experience'
  },
  {
    icon: Briefcase,
    title: 'Choose Your Role',
    description: 'Select your professional role and expertise level'
  },
  {
    icon: ShieldCheck,
    title: 'Verify Your Account',
    description: 'Quick verification to ensure platform security'
  }
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();

  console.log("OnboardingPage: Rendering"); // Add this

  useEffect(() => {
    console.log("OnboardingPage: useEffect running");
    console.log("OnboardingPage: authLoading:", authLoading);
    console.log("OnboardingPage: user:", user);

    if (!authLoading) {
      if (!user) {
        console.log("OnboardingPage: Redirecting to /auth/login");
        router.replace('/auth/login');
        return;
      }

      if (user.hasCompletedOnboarding) {
        console.log("OnboardingPage: Redirecting to /dashboard");
        router.replace('/dashboard');
        return;
      }
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    console.log("OnboardingPage: Rendering loading indicator");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.hasCompletedOnboarding) {
    console.log("OnboardingPage: User not authenticated or onboarding complete, returning null");
    return null;
  }

  const handleStart = () => {
    router.push('/auth/onboarding/role-selection');
  };

  console.log("OnboardingPage: Rendering onboarding content");

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome! 👋
        </h2>
        <p className="text-muted-foreground">
          Let's get your account set up in just a few simple steps
        </p>
      </div>

      <div className="grid gap-4">
        {ONBOARDING_STEPS.map((step, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <step.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button
        onClick={handleStart}
        className="w-full"
        size="lg"
      >
        Get Started
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}