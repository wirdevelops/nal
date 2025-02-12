
// src/components/layout/AuthenticatedLayout.tsx
import { Home, Film, MessageCircle, Heart, ShoppingBag, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserMenu, NavIcon } from './util';

export const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="h-screen w-full bg-background flex flex-col">
      <header className="h-16 px-4 bg-card border-b flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-primary">Nalevel Empire</h1>
          <div className="hidden md:flex space-x-4">
            <Button variant="ghost">Projects</Button>
            <Button variant="ghost">Community</Button>
            <Button variant="ghost">Marketplace</Button>
            <Button variant="ghost">Blog</Button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Search className="w-6 h-6" />
          <Bell className="w-6 h-6" />
          <UserMenu />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      <nav className="md:hidden h-16 bg-card border-t flex items-center justify-around px-4">
        <NavIcon icon={Home} label="Home" />
        <NavIcon icon={Film} label="Projects" />
        <NavIcon icon={MessageCircle} label="Messages" />
        <NavIcon icon={Heart} label="Community" />
        <NavIcon icon={ShoppingBag} label="Market" />
      </nav>
    </div>
  );
};