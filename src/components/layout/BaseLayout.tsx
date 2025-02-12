'use client'

import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth/hooks'
import { GuestLayout } from './GuestLayout'
import { AuthenticatedLayout } from './AuthenticatedLayout'
import { AdminLayout } from './AdminLayout'
import { LoadingSpinner } from '@/components/loading-spinner'

export function BaseLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, isLoading } = useAuth()
  
  // Paths that should use the guest layout even when authenticated
  const guestPaths = [ '/auth/login', '/auth/register']
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">
      <LoadingSpinner />
    </div>
  }

  // Force guest layout for auth pages
  if (guestPaths.includes(pathname)) {
    return <GuestLayout>{children}</GuestLayout>
  }

  // Select layout based on user role
  if (!user) {
    return <GuestLayout>{children}</GuestLayout>
  }

  if (user.roles[0] === 'admin') {
    return <AdminLayout>{children}</AdminLayout>
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>
}