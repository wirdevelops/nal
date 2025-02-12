// src/components/onboarding/StageNavigation.tsx
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StageNavigationProps {
  showBack?: boolean;
  showNext?: boolean;
  onNext?: () => void;
  onBack?: () => void;
  loading?: boolean;
  nextLabel?: string;
  backLabel?: string;
}

export function StageNavigation({
  showBack = true,
  showNext = true,
  onNext,
  onBack,
  loading = false,
  nextLabel = 'Continue',
  backLabel = 'Back'
}: StageNavigationProps) {
  return (
    <div className="flex justify-between px-6 py-4 border-t">
      {showBack ? (
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={loading}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          {backLabel}
        </Button>
      ) : (
        <div /> // Empty div for spacing
      )}

      {showNext && (
        <Button
          onClick={onNext}
          disabled={loading}
          className="gap-2"
        >
          {nextLabel}
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}