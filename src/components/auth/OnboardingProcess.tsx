import { OnboardingStage } from '@/types/user';
import { Progress } from "@/components/ui/progress";

interface OnboardingProgressProps {
  currentStage: OnboardingStage;
  completedStages: OnboardingStage[];
}

const STAGES: { id: OnboardingStage; label: string }[] = [
  { id: 'role-selection', label: 'Choose Role' },
  { id: 'basic-info', label: 'Basic Info' },
  { id: 'role-details', label: 'Role Details' },
  { id: 'verification', label: 'Verify' }
];

export function OnboardingProgress({ currentStage, completedStages }: OnboardingProgressProps) {
  const currentIndex = STAGES.findIndex(stage => stage.id === currentStage);
  const progress = ((currentIndex + 1) / STAGES.length) * 100;

  return (
    <div className="space-y-4">
      <Progress value={progress} className="h-2" />
      
      <div className="grid grid-cols-4 gap-2 text-center">
        {STAGES.map((stage, index) => {
          const isCompleted = completedStages.includes(stage.id);
          const isCurrent = currentStage === stage.id;
          
          return (
            <div key={stage.id} className="space-y-1">
              <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs
                ${isCompleted ? 'bg-primary text-primary-foreground' : 
                  isCurrent ? 'border-2 border-primary text-primary' : 
                  'bg-muted text-muted-foreground'}`}>
                {index + 1}
              </div>
              <span className={`text-xs ${isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}