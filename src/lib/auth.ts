// lib/auth.ts
import { AuthService } from './auth-service';
import { cookies } from 'next/headers';
import type { User, OnboardingStage, UserRole } from '@/types/user';

// Session configuration
const SESSION_CONFIG = {
  name: 'secure_session', // Changed from name
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

// Type definitions
export type SessionUser = Pick<User, 'id' | 'email' | 'roles' | 'isVerified'> & {
  onboarding: {
    stage: OnboardingStage;
    completed: OnboardingStage[];
  };
  activeRole: UserRole | null;
};

export interface Session {
  user?: SessionUser;
  expiresAt: Date;
}

export type AuthSession = Session | null;

// Session management core functions
export async function createSession(userId: string): Promise<void> {
  try {
    const sessionId = await AuthService.createSession(userId); // Changed to createSession and await
    
    if (!sessionId) {
      console.error('Session ID is undefined after creation.');
        throw new Error('Session creation failed: No session ID returned from AuthService.');
    }

    cookies().set({
      ...SESSION_CONFIG,
      value: sessionId,
      maxAge: SESSION_CONFIG.maxAge,
    });
  } catch (error) {
    console.error('Session creation failed:', error);
    throw new Error('Authentication failed');
  }
}

export async function destroySession(): Promise<void> {
  try {
    const sessionId = cookies().get(SESSION_CONFIG.name)?.value;
    if (!sessionId) return;

    await AuthService.clearSession();
    cookies().delete(SESSION_CONFIG.name);
  } catch (error) {
    console.error('Session destruction failed:', error);
    throw new Error('Logout failed');
  }
}

export async function getSession(): Promise<AuthSession> {
  try {
    const sessionId = cookies().get(SESSION_CONFIG.name)?.value;
    if (!sessionId) return null;

    const user = await AuthService.validateSession(sessionId);
    if (!user) {
      cookies().delete(SESSION_CONFIG.name);
      return null;
    }

    return {
      user: transformToSessionUser(user),
      expiresAt: new Date(Date.now() + SESSION_CONFIG.maxAge * 1000)
    };
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}

// Security utilities
export async function refreshSession(): Promise<void> {
  const sessionId = cookies().get(SESSION_CONFIG.name)?.value;
  if (!sessionId) return;

  try {
    cookies().set({
      ...SESSION_CONFIG,
      value: sessionId,
      maxAge: SESSION_CONFIG.maxAge,
    });
  } catch (error) {
    console.error('Session refresh failed:', error);
    throw new Error('Session maintenance failed');
  }
}

export async function validateSessionToken(token: string): Promise<AuthSession> {
  try {
    const user = await AuthService.validateSession(token);
    return user ? { 
      user: transformToSessionUser(user),
      expiresAt: new Date(Date.now() + SESSION_CONFIG.maxAge * 1000)
    } : null;
  } catch (error) {
    console.error('Session validation failed:', error);
    return null;
  }
}

// Helper functions
function transformToSessionUser(user: User): SessionUser {
  return {
    id: user.id,
    email: user.email,
    roles: user.roles,
    isVerified: user.isVerified,
    activeRole: user.activeRole,
    onboarding: {
      stage: user.onboarding.stage,
      completed: user.onboarding.completed
    }
  };
}

// Server-side session hooks
export async function useServerSession(): Promise<AuthSession> {
  return await getSession();
}

export async function useServerUser(): Promise<SessionUser | null> {
  const session = await getSession();
  return session?.user || null;
}

// Client-side session utilities (for client components)
import { useEffect, useState } from 'react';

export function useSession(): { user: SessionUser | null; status: 'loading' | 'authenticated' | 'unauthenticated' } {
  const [session, setSession] = useState<SessionUser | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        
        if (data.user) {
          setSession(data.user);
          setStatus('authenticated');
        } else {
          setSession(null);
          setStatus('unauthenticated');
        }
      } catch (error) {
        console.error('Session fetch error:', error);
        setSession(null);
        setStatus('unauthenticated');
      }
    };

    fetchSession();
  }, []);

  return { user: session, status };
}