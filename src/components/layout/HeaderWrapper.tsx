// components/HeaderWrapper.tsx
'use client'

import { usePathname } from 'next/navigation'
import { DynamicHeader } from './DynamicHeader'

export function HeaderWrapper() {
  const pathname = usePathname()
  const isProjectPage = /^\/projects\/[^/]+/.test(pathname)

  if (isProjectPage) return null

  return <DynamicHeader />
}