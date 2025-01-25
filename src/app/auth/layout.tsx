// app/auth/layout.tsx
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { useUser } from "@/hooks/useUser";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();

  // If user is logged in and not in onboarding
  if (user && !window.location.pathname.includes('/auth/onboarding')) {
    redirect(user.onboarding.stage === 'completed' ? '/dashboard' : '/auth/onboarding');
  }

  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}