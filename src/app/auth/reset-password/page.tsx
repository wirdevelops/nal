
// // app/auth/reset-password/page.tsx
// import Form from '@/components/Form';
// import { Metadata } from 'next';
// export const metadata: Metadata = {
//   title: 'Reset Password - Nalevel Empire',
//   description: 'Reset your Nalevel Empire account password.',
// };


// interface PageProps {
//   searchParams: { token: string };
// }
// const ResetPasswordPage = ({ searchParams }: PageProps) => {
//   const { token } = searchParams;
//   if (!token) {
//       return <div>No token provided.</div>; // Handle case where token is missing
//   }

//   return (
//     <div>
//       <h1>Reset Password</h1>
//       <Form type="resetPassword" token={token} />
//     </div>
//   );
// };

// export default ResetPasswordPage;

// app/auth/reset-password/[token]/page.tsx
'use client';

import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage({
  params
}: {
  params: { token: string }
}) {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';


  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={48}
            height={48}
            className="mx-auto"
          />
          <h1 className="text-2xl font-semibold tracking-tight">Reset password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your new password
          </p>
        </div>
        <ResetPasswordForm token={params.token} email={email} />
      </div>
    </div>
  );
}