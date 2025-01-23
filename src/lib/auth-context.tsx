"use client"

import React, { createContext, useState, useEffect } from 'react'

type User = {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      // In a real app, you'd make an API call to validate the session
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }

    checkSession()
  }, [])

  const login = async (email: string, password: string) => {
    // In a real app, you'd make an API call to authenticate
    // This is a mock implementation
    if (email === 'admin@example.com' && password === 'password') {
      const user: User = {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
      }
      setUser(user)
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      throw new Error('Invalid credentials')
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

