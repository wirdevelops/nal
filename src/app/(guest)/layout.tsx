// app/(guest)/layout.tsx
'use client';

import { HeaderWrapper } from '@/components/layout/HeaderWrapper';

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <HeaderWrapper />
      {children}
    </div>
  )
}