// app/auth/onboarding/page.tsx
'use client';

import { RoleSelector } from "@/components/auth/RoleSelector";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { UserRole } from "@/types/user";

export default function RoleSelectionPage() {
  const router = useRouter();
  const { user, addRole } = useUser();

  const handleRoleSelection = async (roles: UserRole[]) => {
    await Promise.all(roles.map(role => addRole(role)));
    router.push('/auth/onboarding/basic-info');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <RoleSelector
        selectedRoles={user?.roles || []}
        onChange={handleRoleSelection}
        maxSelections={2}
      />
    </div>
  );
}

