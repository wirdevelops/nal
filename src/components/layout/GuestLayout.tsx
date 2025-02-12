// src/components/layout/GuestLayout.tsx
import { LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link'; // Import the Link component from Next.js

export const GuestLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="h-screen w-full bg-background flex flex-col">
      <header className="h-16 px-4 bg-card border-b flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-primary">Nalevel Empire</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/auth/login"> {/* Added Link component with href */}
            <Button variant="ghost" className="flex items-center">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </Link>
          <Link href="/auth/register"> {/* Added Link component with href */}
            <Button className="flex items-center">
              <UserPlus className="w-4 h-4 mr-2" />
              Join Now
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2">
        <Link href="/auth/login">  {/* Added link for the bottom button */}
          <Button variant="secondary" className="shadow-lg">
            Sign in to access all features
          </Button>
        </Link>
      </div>
    </div>
  );
};