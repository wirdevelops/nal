// lib/auth.ts
import { AuthService } from './auth-service';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export interface Session {
  user?: {
    id: string;
    email: string;
    onboarding: {
      stage: string;
      completed: string[];
    };
    // Add other user properties as needed
  };
}

export async function getSession(request?: NextRequest): Promise<Session | null> {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) return null;

  try {
    const sessionData = JSON.parse(
      Buffer.from(sessionCookie, 'base64').toString('utf-8')
    );
    return AuthService.validateSession(sessionData.userId);
  } catch (error) {
    console.error('Session parsing error:', error);
    return null;
  }
}

export async function validateSession(userId: string): Promise<Session | null> {
  return AuthService.validateSession(userId);
}