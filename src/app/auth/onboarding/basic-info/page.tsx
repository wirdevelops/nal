
// app/auth/onboarding/basic-info/page.tsx
'use client';

import { BasicInfoForm } from "@/components/auth/BasicInfoForm";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";

export default function BasicInfoPage() {
  const router = useRouter();
  const { user, updateProfile } = useUserStore();


  const handleSubmit = async (data) => {
    const role = user.roles[0];
    if (role === 'actor' || role === 'crew' || role === 'vendor' || role === 'producer') {
      await updateProfile(role, data);
    }
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