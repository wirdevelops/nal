// app/dashboard/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/components/ProtectedRoute';
// import { Metadata } from 'next';

// export const metadata: Metadata = {
//     title: "Dashboard | CineVerse",
//     description: "Dashboard page for cineverse"
// }

const DashboardPage = () => {
  const { logout, user } = useAuth();

  return (
    <ProtectedRoute>
      <div>
        <h1>Dashboard</h1>
        <p>Welcome to your dashboard!</p>
        <p>You are logged in as: {user?.email}</p>
        <Button onClick={logout}>Logout</Button>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;