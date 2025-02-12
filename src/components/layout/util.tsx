import { LucideIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const NavIcon: React.FC<{ icon: LucideIcon; label: string }> = ({ icon: Icon, label }) => (
    <div className="flex flex-col items-center">
      <Icon className="w-6 h-6" />
      <span className="text-xs mt-1">{label}</span>
    </div>
  );
  
  export const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="w-8 h-8 rounded-full bg-primary"></div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );