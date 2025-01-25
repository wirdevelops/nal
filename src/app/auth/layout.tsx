// app/auth/layout.tsx
'use client';

// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
// import { useUser } from '@/stores/useUserStore';
// import { redirect } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
//   const user = useUser();
//   const router = useRouter();
//   useEffect(() => {
//   // If user is logged in and not in onboarding
//   if (user && !window.location.pathname.includes('/auth/onboarding')) {
//     redirect(user.onboarding.stage === 'completed' ? '/dashboard' : '/auth/onboarding');
//   }
// }, [user, router]);
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}