// @/lib/admin/types.ts

export interface Role {
    name: string;
    permissions: string[];
    isActive: boolean;
  }
  
  export type AdminAccessLevel = 
    | 'super-admin'
    | 'content-admin' 
    | 'user-admin' 
    | 'financial-admin';
  
  export type AdminManagedSection = 
    | 'users'
    | 'content'
    | 'projects'
    | 'financial'
    | 'marketplace'
    | 'blog'
    | 'podcast';