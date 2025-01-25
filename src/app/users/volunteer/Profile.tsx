'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { MultiRoleProfile } from './MultiRoleProfile';
import { useUser } from '@/hooks/useUserere';
import { ArrowLeft, Edit2, Archive } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { UserRole } from '@/types/user';
import { useUserStore } from '@/stores/useUserStore';
import { Badge } from '@/components/ui/badge';
import {
  X,
  Plus,
} from 'lucide-react';

export default function UserProfilePage({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const { user, isLoading } = useUser(params.userId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
          <p className="text-muted-foreground">
            The user you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const handleEditProfile = () => {
    router.push(`/users/${user.id}/edit`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={handleEditProfile}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <RoleBadges roles={user.roles} />
        </div>
      </div>

      <MultiRoleProfile 
        user={user}
        onEditProfile={handleEditProfile}
      />
    </div>
  );
}

export const RoleManager = ({ userId }: { userId: string }) => {
  const { currentUser, addRole, removeRole } = useUserStore();

  if (!currentUser || currentUser.id !== userId) return null;

  const availableRoles: UserRole[] = ['volunteer', 'seller', 'creator'];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Manage Roles</h3>
      <div className="flex flex-wrap gap-2">
        {currentUser.roles.map(role => (
          <div key={role} className="flex items-center gap-2 bg-accent px-3 py-1 rounded-full">
            <span className="capitalize">{role}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => removeRole(role)}
              className="h-6 w-6 p-1 rounded-full"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}
        
        {availableRoles
          .filter(role => !currentUser.roles.includes(role))
          .map(role => (
            <Button
              key={role}
              variant="outline"
              onClick={() => addRole(role)}
              className="capitalize"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add {role}
            </Button>
          ))}
      </div>
    </div>
  );
};

export const RoleBadges = ({ roles }: { roles: UserRole[] }) => (
  <div className="flex flex-wrap gap-2">
    {roles.map(role => (
      <Badge key={role} variant="secondary" className="capitalize">
        {role}
      </Badge>
    ))}
  </div>
);