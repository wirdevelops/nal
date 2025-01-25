// components/HeaderWrapper.tsx
'use client'

import { usePathname } from 'next/navigation'
import { DynamicHeader } from './DynamicHeader'

import { HIDDEN_HEADER_PATHS } from '@/config/navigation'

export function HeaderWrapper() {
  const pathname = usePathname()
  
  // Check if current path matches any hidden paths
  const shouldHideHeader = HIDDEN_HEADER_PATHS.some(pattern => 
    pattern.test(pathname)
  )

  return shouldHideHeader ? null : <DynamicHeader />
}