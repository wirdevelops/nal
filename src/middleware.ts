// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession, validateSession } from '@/lib/auth';

const publicPaths = ['/auth/login', '/auth/register', '/auth/forgot-password'];
const onboardingPaths = [
  '/auth/onboarding',
  '/auth/onboarding/basic-info',
  '/auth/onboarding/role-details',
  '/auth/onboarding/verification',
  '/auth/onboarding/completed'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSession(request);
  
  // Allow public paths
  if (publicPaths.includes(pathname)) {
    if (session) {
      // Redirect logged-in users away from auth pages
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Check authentication
  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Check session validity
  const isValidSession = await validateSession(session);
  if (!isValidSession) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Get onboarding status from session
  const { user } = session;
  const onboardingComplete = user.onboarding.stage === 'completed';
  const currentOnboardingStage = user.onboarding.stage;

  // Handle onboarding paths
  if (onboardingPaths.includes(pathname)) {
    if (onboardingComplete) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Prevent skipping stages
    const currentStageIndex = onboardingPaths.indexOf(`/auth/onboarding/${currentOnboardingStage}`);
    const requestedStageIndex = onboardingPaths.indexOf(pathname);
    
    if (requestedStageIndex > currentStageIndex) {
      return NextResponse.redirect(new URL(onboardingPaths[currentStageIndex], request.url));
    }

    return NextResponse.next();
  }

  // Redirect incomplete profiles to onboarding
  if (!onboardingComplete && !pathname.startsWith('/auth/onboarding')) {
    return NextResponse.redirect(
      new URL(`/auth/onboarding/${currentOnboardingStage}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}