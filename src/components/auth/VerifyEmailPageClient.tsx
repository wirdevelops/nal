'use client';

import { VerifyEmailForm } from '@/components/auth/VerifyEmailForm';
import { useSearchParams } from 'next/navigation';

export default function VerifyEmailPageClient() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    if (!email) {
        return (
          <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="text-center">
                <h1 className="text-2xl font-semibold">Invalid Verification Request</h1>
                <p className="mt-2 text-muted-foreground">
                  Please use the verification link sent to your email
                </p>
              </div>
            </div>
          </div>
        );
      }
    
      return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <VerifyEmailForm email={email} />
          </div>
        </div>
      );
}