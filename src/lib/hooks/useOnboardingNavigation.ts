// src/lib/hooks/useOnboardingNavigation.ts
import { OnboardingStage } from '@/lib/types';

const STAGE_ORDER: OnboardingStage[] = [
  'setup',
  'role-selection',
  'basic-info',
  'role-details',
  'portfolio',
  'verification',
  'completed'
];

export function validateStageTransition(
  current: OnboardingStage,
  target: OnboardingStage
): boolean {
  const currentIndex = STAGE_ORDER.indexOf(current);
  const targetIndex = STAGE_ORDER.indexOf(target);
  
  return targetIndex === currentIndex + 1 || // Next stage
         targetIndex < currentIndex; // Allow going back
}