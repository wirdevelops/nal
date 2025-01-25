
// app/auth/onboarding/basic-info/page.tsx
'use client';

import { BasicInfoForm } from "@/components/auth/BasicInfoForm";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

export default function BasicInfoPage() {
  const router = useRouter();
  const { user, updateProfile } = useUser();

  const handleSubmit = async (data) => {
    await updateProfile(user.roles[0], data);
    router.push('/auth/onboarding/verification');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <BasicInfoForm
        roles={user?.roles || []}
        onSubmit={handleSubmit}
        defaultValues={user?.profiles?.[user.roles[0]]}
      />
    </div>
  );
}