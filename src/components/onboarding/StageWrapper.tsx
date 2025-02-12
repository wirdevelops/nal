// src/components/onboarding/StageWrapper.tsx
import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { StageHeader } from './StageHeader';
import { StageNavigation } from './StageNavigation';
import { useOnboardingStore } from '@/lib/onboarding/store';

interface StageWrapperProps {
  children: ReactNode;
  title: string;
  description?: string;
  showBack?: boolean;
  showNext?: boolean;
  onNext?: () => void;
  onBack?: () => void;
}

export function StageWrapper({
  children,
  title,
  description,
  showBack = true,
  showNext = true,
  onNext,
  onBack
}: StageWrapperProps) {
  const { isLoading } = useOnboardingStore();

  return (
    <Card className="max-w-2xl mx-auto">
      <StageHeader 
        title={title}
        description={description}
      />
      
      <div className="p-6">
        {children}
      </div>

      <StageNavigation
        showBack={showBack}
        showNext={showNext}
        onNext={onNext}
        onBack={onBack}
        loading={isLoading}
      />
    </Card>
  );
}
