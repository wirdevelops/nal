
// components/auth/ResendTimer.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useResendVerification } from '@/lib/auth/hooks';

interface ResendTimerProps {
  email: string;
  onResend?: () => void;
}

export const ResendTimer = ({ email, onResend }: ResendTimerProps) => {
  const [seconds, setSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { mutate: resendVerification, isPending } = useResendVerification();

  useEffect(() => {
    if (seconds <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const handleResend = () => {
    if (canResend && !isPending) {
      resendVerification(email);
      setSeconds(60);
      setCanResend(false);
      onResend?.();
    }
  };

  if (!canResend) {
    return (
      <span className="text-muted-foreground">
        Resend available in {seconds}s
      </span>
    );
  }

  return (
    <Button
      variant="link"
      className="p-0 h-auto"
      onClick={handleResend}
      disabled={isPending}
    >
      Resend verification email
    </Button>
  );
};