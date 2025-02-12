import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => {
    if (!password) return 0;

    let score = 0;
    const checks = [
      password.length >= 8,                    // Length >= 8
      /[A-Z]/.test(password),                 // Has uppercase
      /[a-z]/.test(password),                 // Has lowercase
      /[0-9]/.test(password),                 // Has number
      /[^A-Za-z0-9]/.test(password),          // Has special char
      password.length >= 12,                   // Extra length bonus
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{12,}$/.test(password) // Has all requirements and is long
    ];

    score = checks.filter(Boolean).length;
    return Math.min(100, Math.round((score / checks.length) * 100));
  }, [password]);

  const getStrengthText = (strength: number) => {
    if (strength === 0) return 'Enter a password';
    if (strength < 40) return 'Weak';
    if (strength < 75) return 'Moderate';
    return 'Strong';
  };

  const getStrengthColor = (strength: number) => {
    if (strength < 40) return 'bg-red-500';
    if (strength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${getStrengthColor(strength)}`}
          style={{ width: `${strength}%` }}
        />
      </div>
      <p className={`text-sm ${strength >= 75 ? 'text-green-500' : strength >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
        {getStrengthText(strength)}
      </p>
    </div>
  );
}