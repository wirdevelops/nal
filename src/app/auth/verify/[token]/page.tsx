// pages/auth/verify/[token]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useVerifyEmail } from '@/lib/auth/hooks';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { mutate: verifyEmail, isPending } = useVerifyEmail();

  useEffect(() => {
    if (!token) {
      setError('No verification token found in URL');
      return;
    }

    // Decode the token if it's URL encoded
    const decodedToken = decodeURIComponent(token);
    console.log('Attempting verification with token:', decodedToken); // Debug log

    verifyEmail(decodedToken, {
      onSuccess: () => {
        console.log('Verification successful'); // Debug log
        setVerified(true);
        setTimeout(() => {
          router.push('/onboarding');
        }, 2000);
      },
      onError: (err: any) => {
        console.error('Verification error:', err); // Debug log
        setError(err.response?.data?.error || 'Failed to verify email');
      }
    });
  }, [token, verifyEmail, router]);

  if (error) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="space-y-4 max-w-md w-full">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="flex justify-center">
            <Button 
              onClick={() => router.push('/auth/resend-verification')}
              className="w-full"
            >
              Request New Verification Email
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex h-screen items-center justify-center">
      <div className="text-center space-y-4">
        {isPending && (
          <>
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="text-lg">Verifying your email...</p>
          </>
        )}
        
        {verified && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-green-600">Email Verified!</h1>
            <p>Redirecting you to complete your profile...</p>
            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
}