// app/layout.tsx
import React from 'react';
import { Inter } from 'next/font/google';
// import { Header } from '@/components/Header';
// import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
          {/* <Header /> */}
          <main className="min-h-screen">
              {children}
          </main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}