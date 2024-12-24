"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Shield } from 'lucide-react';
import { RoleForm } from './forms/RoleForm';
import { RolePermissions } from './forms/RolePermissions';
import { useToast } from '@/hooks/use-toast';
import { RoleList } from './RoleList';
import { UserStats } from './analytics/RoleStats';
import { RoleUsageChart } from './analytics/RoleUsageChart';
import { PermissionDistribution } from './analytics/PermissionDistribution';
import type { Role } from '@/types';

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Administrator',
    description: 'Full system access',
    level: 1,
    permissions: ['*'],
    isDefault: false,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Editor',
    description: 'Content management access',
    level: 2,
    permissions: ['content.*'],
    isDefault: false,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

type DialogContent = {
  type: 'create' | 'edit' | 'permissions';
  role?: Role;
} | null;

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [dialogContent, setDialogContent] = useState<DialogContent>(null);
  const { toast } = useToast();

  const handleCreateRole = (data: Partial<Role>) => {
    const newRole: Role = {
      id: Math.random().toString(),
      name: data.name!,
      description: data.description!,
      level: data.level!,
      permissions: [],
      createdAt: new Date().toISOString(),
    };
    setRoles([...roles, newRole]);
    setDialogContent(null);
    toast({
      title: 'Role Created',
      description: `${newRole.name} role has been created.`,
    });
  };

  const handleUpdatePermissions = (roleId: string, permissions: string[]) => {
    setRoles(roles.map(role => 
      role.id === roleId 
        ? { ...role, permissions } 
        : role
    ));
    setDialogContent(null);
    toast({
      title: 'Permissions Updated',
      description: 'Role permissions have been updated.',
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Role Management</h2>
          <p className="text-muted-foreground">Manage system roles and permissions</p>
        </div>
        <Button onClick={() => setDialogContent({ type: 'create' })}>
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      <UserStats />
      
      <div className="grid gap-6 md:grid-cols-7">
        <RoleUsageChart />
        <PermissionDistribution />
      </div>

      <RoleList
        roles={roles}
        onCreateRole={() => setDialogContent({ type: 'create' })}
        onEditRole={(role) => setDialogContent({ type: 'edit', role })}
        onManagePermissions={(role) => setDialogContent({ type: 'permissions', role })}
      />

      <Dialog 
        open={dialogContent !== null} 
        onOpenChange={() => setDialogContent(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogContent?.type === 'create' && 'Create Role'}
              {dialogContent?.type === 'edit' && 'Edit Role'}
              {dialogContent?.type === 'permissions' && 'Manage Permissions'}
            </DialogTitle>
          </DialogHeader>
          
          {(dialogContent?.type === 'create' || dialogContent?.type === 'edit') && (
            <RoleForm
              role={dialogContent.role}
              onSubmit={handleCreateRole}
              onCancel={() => setDialogContent(null)}
            />
          )}
          
          {dialogContent?.type === 'permissions' && dialogContent.role && (
            <RolePermissions
              role={dialogContent.role}
              onSave={(permissions) => 
                handleUpdatePermissions(dialogContent.role!.id, permissions)
              }
              onCancel={() => setDialogContent(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}