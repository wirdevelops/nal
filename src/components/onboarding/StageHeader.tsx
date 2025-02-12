// src/components/onboarding/StageHeader.tsx
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface StageHeaderProps {
  title: string;
  description?: string;
}

export function StageHeader({ title, description }: StageHeaderProps) {
  return (
    <CardHeader>
      <CardTitle className="text-2xl text-center">{title}</CardTitle>
      {description && (
        <CardDescription className="text-center">
          {description}
        </CardDescription>
      )}
    </CardHeader>
  );
}