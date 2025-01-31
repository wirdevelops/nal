
// hooks/useOnboarding.ts
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';

export function useOnboarding() {
  const router = useRouter();
  const { user, updateUser } = useUser();

  const completeStage = async (stage: string, data?: any) => {
    if (!user) return;

    let nextStage;
    switch (stage) {
      case 'role-selection':
        nextStage = 'basic-info';
        break;
      case 'basic-info':
        nextStage = 'role-details';
        break;
      case 'role-details':
        nextStage = 'verification';
        break;
      case 'verification':
        nextStage = 'completed';
        break;
      default:
        nextStage = stage;
    }

    await updateUser({
      ...user,
      onboarding: {
        stage: nextStage,
        completed: [...user.onboarding.completed, stage],
        data: { ...user.onboarding.data, [stage]: data }
      }
    });

    router.push(`/auth/onboarding/${nextStage}`);
  };

  return {
    currentStage: user?.onboarding.stage,
    completedStages: user?.onboarding.completed || [],
    completeStage,
    stageData: user?.onboarding.data || {}
  };
}