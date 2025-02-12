'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/lib/auth/store'
import { authApi } from '@/lib/auth/api'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const setUser = useAuthStore((state) => state.setUser)

  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      try {
        const response = await authApi.refreshToken()
        if (response.user) {
          setUser(response.user)
        }
      } catch (error) {
        console.error('Token refresh failed:', error)
      }
    }, 14 * 60 * 1000) // Refresh token every 14 minutes

    return () => clearInterval(refreshInterval)
  }, [setUser])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}