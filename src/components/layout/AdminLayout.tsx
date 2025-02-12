// src/components/layout/AdminLayout.tsx
import { Settings, ChevronRight } from 'lucide-react';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="h-screen w-full bg-background flex">
      <nav className="w-64 bg-card border-r flex flex-col">
        <div className="h-16 border-b flex items-center px-6">
          <h1 className="text-xl font-bold text-primary">FilmMaker</h1>
        </div>
        <AdminNavigation />
        <AdminProfile />
      </nav>

      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};