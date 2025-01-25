// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

const publicPaths = new Set([
  '/',
  '/about',
  '/contact',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify'
]);
const onboardingPaths = [
  '/onboarding/role-selection',
  '/onboarding/basic-info',
  '/onboarding/role-details',
  '/onboarding/verification'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSession(request);

  // Allow public paths
  if (publicPaths.has(pathname)) {
    return session?.user
      ? NextResponse.redirect(new URL('/dashboard', request.url))
      : NextResponse.next();
  }

  // Redirect unauthenticated users
  if (!session?.user) {
    return NextResponse.redirect(new URL(`/auth/login?redirect=${encodeURIComponent(pathname)}`, request.url));
  }

  // Handle onboarding flow
  if (!session.user.onboarding.completed.includes('completed')) {
    const currentStage = session.user.onboarding.stage;
    const targetPath = `/onboarding/${currentStage}`;
    
    if (!pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL(targetPath, request.url));
    }
    
    if (pathname !== targetPath) {
      return NextResponse.redirect(new URL(targetPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/|api/).*)',
  ],
};