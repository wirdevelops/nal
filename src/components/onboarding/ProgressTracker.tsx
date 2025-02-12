//src/components/onboarding/ProgressTracker.tsx
import { Progress } from "@radix-ui/react-progress";

export const ProgressTracker = ({ currentStage, stages }) => {
  const currentIndex = stages.indexOf(currentStage);
  const progress = ((currentIndex + 1) / stages.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between mt-2">
        {stages.map((stage, index) => (
          <div
            key={stage}
            className={`flex flex-col items-center ${
              index <= currentIndex ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <div className={`w-3 h-3 rounded-full mb-2 ${
              index <= currentIndex ? 'bg-primary' : 'bg-muted'
            }`} />
            <span className="text-xs capitalize">
              {stage.replace('-', ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};