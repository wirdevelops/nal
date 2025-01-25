import { UserRole } from '@/types/user';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Film, Camera, Users, Building, ShoppingBag, Heart } from 'lucide-react';
import { cn } from "@/lib/utils";

const ROLES: {
  id: UserRole;
  icon: React.ElementType;
  title: string;
  description: string;
}[] = [
  {
    id: 'project-owner',
    icon: Film,
    title: 'Project Owner',
    description: 'Create and manage film projects, collaborate with teams'
  },
  {
    id: 'crew',
    icon: Camera,
    title: 'Crew Member',
    description: 'Join film projects, showcase your skills and expertise'
  },
  {
    id: 'actor',
    icon: Users,
    title: 'Actor',
    description: 'Find casting opportunities and manage your portfolio'
  },
  {
    id: 'producer',
    icon: Building,
    title: 'Producer',
    description: 'Oversee projects, manage budgets and resources'
  },
  {
    id: 'vendor',
    icon: ShoppingBag,
    title: 'Vendor',
    description: 'Sell or rent equipment, provide services to productions'
  },
  {
    id: 'ngo',
    icon: Heart,
    title: 'NGO Partner',
    description: 'Collaborate on impact projects, reach filmmakers'
  }
];

interface RoleSelectorProps {
  selectedRoles: UserRole[];
  onChange: (roles: UserRole[]) => void;
  maxSelections?: number;
}

export function RoleSelector({ 
  selectedRoles, 
  onChange, 
  maxSelections = 2 
}: RoleSelectorProps) {
  const handleRoleToggle = (role: UserRole) => {
    if (selectedRoles.includes(role)) {
      onChange(selectedRoles.filter(r => r !== role));
    } else if (selectedRoles.length < maxSelections) {
      onChange([...selectedRoles, role]);
    }
  };

  const canSelectMore = selectedRoles.length < maxSelections;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Choose your role{maxSelections > 1 ? 's' : ''}</h2>
        <p className="text-sm text-muted-foreground">
          Select how you'll primarily use the platform 
          {maxSelections > 1 && ` (up to ${maxSelections} roles)`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ROLES.map((role) => {
          const isSelected = selectedRoles.includes(role.id);
          const Icon = role.icon;
          
          return (
            <Card
              key={role.id}
              className={cn(
                "relative p-6 cursor-pointer hover:bg-accent transition-colors",
                isSelected && "ring-2 ring-primary"
              )}
              onClick={() => handleRoleToggle(role.id)}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
              )}
              
              <div className="flex gap-4">
                <Icon className={cn(
                  "h-8 w-8",
                  isSelected ? "text-primary" : "text-muted-foreground"
                )} />
                <div className="space-y-1">
                  <h3 className="font-medium">{role.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {role.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {!canSelectMore && (
        <p className="text-sm text-muted-foreground text-center">
          Maximum {maxSelections} roles selected. Deselect a role to choose a different one.
        </p>
      )}
    </div>
  );
}