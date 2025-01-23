// components/admin/layout/AdminLayout.tsx
"use client"

import { useState } from "react"
import { AdminHeader } from "./AdminHeader"
import { AdminSidebar } from "./AdminSidebar"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <div className={`
        fixed inset-y-0 z-50 md:relative md:flex
        ${isMobileMenuOpen ? "flex" : "hidden"}
      `}>
        <AdminSidebar />
      </div>

      <div className="flex flex-1 flex-col">
        <AdminHeader onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}