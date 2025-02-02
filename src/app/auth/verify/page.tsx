import { Suspense } from 'react';
import VerifyEmailPageClient from '@/components/auth/VerifyEmailPageClient';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<p>Loading verification page...</p>}>
      <VerifyEmailPageClient />
    </Suspense>
  );
}