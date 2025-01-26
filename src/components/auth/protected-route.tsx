'use client';

import { useEffect } from 'react';
import { initializeAuth } from '@/lib/init-auth';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}