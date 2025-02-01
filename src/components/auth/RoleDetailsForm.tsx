// components/auth/RoleDetailsForm.tsx
import { UserRole } from '@/types/user';
import { CrewRoleForm } from './role-forms/CrewRoleForm';
import { ActorRoleForm } from './role-forms/ActorRoleForm';
import { ProducerRoleForm } from './role-forms/ProducerRoleForm';
import  {ProjectOwnerRoleForm}  from './role-forms/ProjectOwnerForm';
import { VendorRoleForm } from './role-forms/VendorRoleForm';
import { NGORoleForm } from './role-forms/NGORoleForm';

interface RoleDetailsFormProps<T = unknown> {
  role: UserRole;
  onSubmit: (data: T) => Promise<void>;
  defaultValues?: unknown;
}

export function RoleDetailsForm<T = unknown>({ role, onSubmit, defaultValues }: RoleDetailsFormProps<T>) {
  const getRoleForm = () => {
    switch (role) {
      case 'crew':
        return <CrewRoleForm onSubmit={onSubmit} defaultValues={defaultValues} />;
      case 'actor':
        return <ActorRoleForm onSubmit={onSubmit} defaultValues={defaultValues} />;
      case 'producer':
        return <ProducerRoleForm onSubmit={onSubmit} defaultValues={defaultValues} />;
      case 'project-owner':
        return <ProjectOwnerRoleForm onSubmit={onSubmit} defaultValues={defaultValues} />;
      case 'vendor':
        return <VendorRoleForm onSubmit={onSubmit} defaultValues={defaultValues} />;
      case 'ngo':
        return <NGORoleForm onSubmit={onSubmit} defaultValues={defaultValues} />;
      default:
        return null;
    }
  };

  return getRoleForm();
}