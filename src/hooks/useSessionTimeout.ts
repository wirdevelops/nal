// src/hooks/useSessionTimeout.ts
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

export function useSessionTimeout(timeoutMinutes = 15) {
  const { data: session, update } = useSession();
  const [showWarning, setShowWarning] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let warningTimeout: NodeJS.Timeout;

    const resetTimers = () => {
      clearTimeout(warningTimeout);
      clearTimeout(timeout);
      
      warningTimeout = setTimeout(() => {
        setShowWarning(true);
        toast({
          title: "Session About to Expire",
          description: "Your session will expire in 2 minutes. Continue working to stay logged in.",
        });
      }, (timeoutMinutes - 2) * 60 * 1000);

      timeout = setTimeout(() => {
        router.push('/auth/login');
        toast({
          title: "Session Expired",
          description: "Please log in again to continue.",
        });
      }, timeoutMinutes * 60 * 1000);
    };

    resetTimers();

    window.addEventListener('mousemove', resetTimers);
    window.addEventListener('keydown', resetTimers);

    return () => {
      clearTimeout(warningTimeout);
      clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimers);
      window.removeEventListener('keydown', resetTimers);
    };
  }, [session, router, timeoutMinutes, toast]);

  return { showWarning };
}