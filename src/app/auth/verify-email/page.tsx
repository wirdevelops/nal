'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useVerifyEmail } from '@/lib/auth/hooks';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const { mutate: verifyEmail, isPending, isSuccess, isError, error } = useVerifyEmail();
  const verificationAttempted = useRef(false);

  useEffect(() => {
    const handleVerification = async () => {
      if (token && !verificationAttempted.current) {
        verificationAttempted.current = true;
        try {
          await verifyEmail(token);
        } catch (error) {
          router.push('/auth/resend-verification');
        }
      }
    };

    handleVerification();
  }, [token, verifyEmail, router]);

  if (!token) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Invalid Request</CardTitle>
            <CardDescription className="text-center">
              No verification token found. Please use the link from your email.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <XCircle className="h-16 w-16 text-destructive" />
            <Button asChild>
              <Link href="/auth/login">Back to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Email Verification
          </CardTitle>
          <CardDescription className="text-center">
            {isPending && 'Verifying your email address...'}
            {isSuccess && 'Your email has been successfully verified!'}
            {isError && 'Failed to verify your email address.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {isPending && (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Please wait while we verify your email...
              </p>
            </div>
          )}

          {isSuccess && (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <p className="text-sm text-muted-foreground">
                You can now sign in to your account.
              </p>
              <Button asChild>
                <Link href="/auth/login">Continue to Login</Link>
              </Button>
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="h-16 w-16 text-destructive" />
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : 'Verification failed. Please try again.'}
              </p>
              <div className="flex flex-col space-y-2 w-full">
                <Button asChild variant="outline">
                  <Link href="/auth/resend-verification">
                    Request New Verification Link
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/auth/login">Back to Login</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// // app/auth/verify-email/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { useVerifyEmail } from '@/lib/auth/hooks';
// import Link from 'next/link';

// export default function VerifyEmailPage() {
//   const searchParams = useSearchParams();
//   const token = searchParams.get('token');
//   const { mutate: verifyEmail, isPending, isSuccess, isError, error } = useVerifyEmail();
//   const [hasVerified, setHasVerified] = useState(false);

//   useEffect(() => {
//     let isSubscribed = true;

//     const verifyToken = async () => {
//       if (token && !hasVerified) {
//         setHasVerified(true);
//         try {
//           await verifyEmail(token);
//         } catch (error) {
//           // Handle error if needed
//           if (isSubscribed) {
//             setHasVerified(false);
//           }
//         }
//       }
//     };

//     verifyToken();

//     return () => {
//       isSubscribed = false;
//     };
//   }, [token, verifyEmail]);

//   if (!token) {
//     return (
//       <div className="container flex h-screen w-screen flex-col items-center justify-center">
//         <Card className="w-full max-w-lg">
//           <CardHeader className="space-y-1">
//             <CardTitle className="text-2xl font-bold text-center">Invalid Request</CardTitle>
//             <CardDescription className="text-center">
//               No verification token found. Please use the link from your email.
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="flex flex-col items-center space-y-4">
//             <XCircle className="h-16 w-16 text-destructive" />
//             <Button asChild>
//               <Link href="/auth/login">Back to Login</Link>
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="container flex h-screen w-screen flex-col items-center justify-center">
//       <Card className="w-full max-w-lg">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-bold text-center">
//             Email Verification
//           </CardTitle>
//           <CardDescription className="text-center">
//             {isPending && 'Verifying your email address...'}
//             {isSuccess && 'Your email has been successfully verified!'}
//             {isError && 'Failed to verify your email address.'}
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="flex flex-col items-center space-y-4">
//           {isPending && (
//             <div className="flex flex-col items-center space-y-4">
//               <Loader2 className="h-16 w-16 animate-spin text-primary" />
//               <p className="text-sm text-muted-foreground">
//                 Please wait while we verify your email...
//               </p>
//             </div>
//           )}

//           {isSuccess && (
//             <div className="flex flex-col items-center space-y-4">
//               <CheckCircle2 className="h-16 w-16 text-green-500" />
//               <p className="text-sm text-muted-foreground">
//                 You can now sign in to your account.
//               </p>
//               <Button asChild>
//                 <Link href="/auth/login">
//                   Continue to Login
//                 </Link>
//               </Button>
//             </div>
//           )}

//           {isError && (
//             <div className="flex flex-col items-center space-y-4">
//               <XCircle className="h-16 w-16 text-destructive" />
//               <p className="text-sm text-muted-foreground">
//                 {error instanceof Error ? error.message : 'Verification failed. Please try again.'}
//               </p>
//               <div className="flex flex-col space-y-2 w-full">
//                 <Button asChild variant="outline">
//                   <Link href="/auth/resend-verification">
//                     Request New Verification Link
//                   </Link>
//                 </Button>
//                 <Button asChild variant="secondary">
//                   <Link href="/auth/login">
//                     Back to Login
//                   </Link>
//                 </Button>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// // src/app/auth/verify-email/page.tsx
// 'use client';

// import { useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { useVerifyEmail } from '@/lib/auth/hooks';
// import Link from 'next/link';

// export default function VerifyEmailPage() {
//   const searchParams = useSearchParams();
//   const token = searchParams.get('token');
//   const { mutate: verifyEmail, isPending, isSuccess, isError, error } = useVerifyEmail();

//   useEffect(() => {
//     if (token) {
//       verifyEmail(token);
//     }
//   }, [token, verifyEmail]);

//   return (
//     <div className="container flex h-screen w-screen flex-col items-center justify-center">
//       <Card className="w-full max-w-lg">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-bold text-center">
//             Email Verification
//           </CardTitle>
//           <CardDescription className="text-center">
//             {isPending && 'Verifying your email address...'}
//             {isSuccess && 'Your email has been successfully verified!'}
//             {isError && 'Failed to verify your email address.'}
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="flex flex-col items-center space-y-4">
//           {isPending && (
//             <div className="flex flex-col items-center space-y-4">
//               <Loader2 className="h-16 w-16 animate-spin text-primary" />
//               <p className="text-sm text-muted-foreground">
//                 Please wait while we verify your email...
//               </p>
//             </div>
//           )}

//           {isSuccess && (
//             <div className="flex flex-col items-center space-y-4">
//               <CheckCircle2 className="h-16 w-16 text-green-500" />
//               <p className="text-sm text-muted-foreground">
//                 You can now sign in to your account.
//               </p>
//               <Button asChild>
//                 <Link href="/auth/login">
//                   Continue to Login
//                 </Link>
//               </Button>
//             </div>
//           )}

//           {isError && (
//             <div className="flex flex-col items-center space-y-4">
//               <XCircle className="h-16 w-16 text-destructive" />
//               <p className="text-sm text-muted-foreground">
//                 {error?.message || 'The verification link may have expired or is invalid.'}
//               </p>
//               <div className="flex flex-col space-y-2 w-full">
//                 <Button asChild variant="outline">
//                   <Link href="/auth/resend-verification">
//                     Request New Verification Link
//                   </Link>
//                 </Button>
//                 <Button asChild>
//                   <Link href="/auth/login">
//                     Back to Login
//                   </Link>
//                 </Button>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }