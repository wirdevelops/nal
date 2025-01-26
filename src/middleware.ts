// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AuthService } from '@/lib/auth-service';

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
  '/auth/onboarding/role-selection',
  '/auth/onboarding/basic-info',
  '/auth/onboarding/role-details',
  '/auth/onboarding/verification',
  '/auth/onboarding/completed'
];

const securityHeaders = {
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: blob: /api/placeholder/; " +
    "font-src 'self' data:; " +
    "frame-src 'none'; " +
    "object-src 'none'; " +
    "connect-src 'self'",
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};

function applySecurityHeaders(response: NextResponse) {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

async function getMiddlewareSession(request: NextRequest) {
  const sessionId = request.cookies.get('session')?.value;
  if (!sessionId) return null;

  try {
    const user = await AuthService.validateSession(sessionId, request);
    if (!user) return null;

    // Only include necessary session data
    return {
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
        isVerified: user.isVerified,
        onboarding: {
          stage: user.onboarding.stage,
          completed: user.onboarding.completed
        },
        activeRole: user.activeRole
      }
    };
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getMiddlewareSession(request);
  let response: NextResponse;

  // Public paths check
  if (publicPaths.has(pathname)) {
    if (session?.user) {
      response = NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      response = NextResponse.next();
    }
    return applySecurityHeaders(response);
  }

  // Authentication check
  if (!session?.user) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', encodeURIComponent(pathname));
    response = NextResponse.redirect(loginUrl);
    return applySecurityHeaders(response);
  }

  // Onboarding flow check
  if (!session.user.onboarding.completed.includes('completed')) {
    const currentStage = session.user.onboarding.stage;
    const targetPath = `/auth/onboarding/${currentStage}`;

    if (!pathname.startsWith('/auth/onboarding')) {
      response = NextResponse.redirect(new URL(targetPath, request.url));
      return applySecurityHeaders(response);
    }

    const currentPathStage = pathname.split('/').pop();
    if (currentPathStage !== currentStage && !onboardingPaths.includes(pathname)) {
      response = NextResponse.redirect(new URL(targetPath, request.url));
      return applySecurityHeaders(response);
    }
  }

  // Verify completion before dashboard access
  if (pathname.startsWith('/dashboard') && !session.user.onboarding.completed.includes('completed')) {
    response = NextResponse.redirect(new URL('/auth/onboarding/role-selection', request.url));
    return applySecurityHeaders(response);
  }

  // Session refresh and continuation
  response = NextResponse.next();
  
  // Set secure session cookie
  response.cookies.set({
    name: 'session',
    value: request.cookies.get('session')?.value || '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60
  });

  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/|api/).*)',
  ],
};