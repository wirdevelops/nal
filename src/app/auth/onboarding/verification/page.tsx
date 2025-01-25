
// app/auth/onboarding/verification/page.tsx
'use client';

import { VerificationForm } from "@/components/auth/VerificationForm";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

export default function VerificationPage() {
  const router = useRouter();
  const { user, completeOnboarding } = useUser();

  const handleSubmit = async (data) => {
    await completeOnboarding();
    router.push('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <VerificationForm
        roles={user?.roles || []}
        onSubmit={handleSubmit}
      />
    </div>
  );
}