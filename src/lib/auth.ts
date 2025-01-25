// lib/auth.ts
import { AuthService } from './auth-service';
import { cookies } from 'next/headers';
import type { User, OnboardingStage } from '@/types/user';

export type SessionUser = Pick<User, 'id' | 'email' | 'roles' | 'isVerified'> & {
  onboarding: {
    stage: OnboardingStage;
    completed: OnboardingStage[];
  };
};

export interface Session {
  user?: SessionUser;
}

export async function getSession(): Promise<Session | null> {
  try {
    const sessionToken = cookies().get('session')?.value;
    if (!sessionToken) return null;

    // Validate session through AuthService
    const user = AuthService.validateSession(sessionToken);
    if (!user) return null;

    return {
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
        isVerified: user.isVerified,
        onboarding: {
          stage: user.onboarding.stage,
          completed: user.onboarding.completed
        }
      }
    };
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}

export async function validateSession(sessionToken: string): Promise<Session | null> {
  try {
    const user = AuthService.validateSession(sessionToken);
    return user ? { user } : null;
  } catch (error) {
    console.error('Session validation failed:', error);
    return null;
  }
}