import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUserStore } from "@/stores/useUserStore";

export default function OnboardingLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUserStore();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const currentStage = user.onboarding.stage;
    const stagePaths = {
      'role-selection': '/auth/onboarding',
      'basic-info': '/auth/onboarding/basic-info',
      'role-details': '/auth/onboarding/role-details',
      'verification': '/auth/onboarding/verification',
      'completed': '/auth/onboarding/completed'
    };

    // Prevent skipping stages
    if (pathname !== stagePaths[currentStage]) {
      router.push(stagePaths[currentStage]);
    }
  }, [user, pathname, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-screen-lg py-8">
        {children}
      </main>
    </div>
  );
}