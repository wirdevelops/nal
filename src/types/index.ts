export interface Permission {
    id: string;
    name: string;
    description: string;
    group: string;
  }
  
  export interface Role {
    id: string;
    name: string;
    description: string;
    level: number;
    permissions: string[];
    isDefault?: boolean;
    createdAt: string;
  }