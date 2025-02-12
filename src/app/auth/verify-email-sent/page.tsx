// app/auth/verify-email-sent/page.tsx
'use client';

import { ResendTimer } from '@/components/auth/ResendTimer';
import { Card } from '@/components/ui';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function VerificationEmailSentPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  return (
    <div className="container relative h-[80vh] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left side remain unchanged */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Verification Email Sent
            </h1>
            <p className="text-sm text-muted-foreground">
              We've sent a verification email to {email}. Please check your inbox or spam folder.
            </p>
            <div className="text-sm text-muted-foreground">
              Didn't receive the email?{' '}
              {email ? (
                <ResendTimer email={email} />
              ) : (
                <Link 
                  href="/auth/resend-verification"
                  className="text-primary hover:underline"
                >
                  Resend
                </Link>
              )}
            </div>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary/90 h-10 py-2 px-4 mt-4"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// // app/auth/verify-email-sent/page.tsx
// import {ResendTimer} from '@/components/auth/ResendTimer';
// import { Metadata } from 'next';
// import Link from 'next/link';

// export const metadata: Metadata = {
//   title: 'Verification Email Sent',
//   description: 'Please check your email for a verification link.',
// };

// export default function VerificationEmailSentPage() {
//   return (
//     <div className="container relative h-[80vh] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
//       <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
//         <div className="absolute inset-0 bg-zinc-900" />
//         <div className="relative z-20 flex items-center text-lg font-medium">
//           Your App Name
//         </div>
//         <div className="relative z-20 mt-auto">
//           <blockquote className="space-y-2">
//             <p className="text-lg">
//               "Check your inbox or spam folder to complete registration."
//             </p>
//           </blockquote>
//         </div>
//       </div>
//       <div className="lg:p-8">
//         <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
//           <div className="flex flex-col space-y-2 text-center">
//             <h1 className="text-2xl font-semibold tracking-tight">
//               Verification Email Sent
//             </h1>
//             <p className="text-sm text-muted-foreground">
//               We've sent a verification email to your inbox or spam folder.  Please click the link
//               in the email to verify your account.
//             </p>
//             <p className="text-sm text-muted-foreground">
//               Didn't receive the email? Check your spam folder or{' '}
//               <ResendTimer onResend={() => resendVerification(email)} />
//               <Link href="/auth/resend-verification" 
//               className="text-primary hover:underline">
//                 resend the email
//               </Link>.
//             </p>
//              <Link
//                  href="/auth/login"
//                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary/90 h-10 py-2 px-4 mt-4"
//                >
//                Go to Login
//              </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }