// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Paths that don't require authentication
const publicPaths = [
  '/',
  '/auth/login',
  '/auth/register',
  '/blog',
  '/projects',
  '/marketplace',
  '/community'
];

// Paths that require specific roles
const roleProtectedPaths = {
  '/admin': ['admin'],
  '/ngo/dashboard': ['ngo'],
  '/filmmaker/dashboard': ['filmmaker']
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Check if path is public
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check authentication
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Check role-based access
  for (const [path, roles] of Object.entries(roleProtectedPaths)) {
    if (pathname.startsWith(path)) {
      const userRoles = token.roles as string[];
      if (!roles.some(role => userRoles.includes(role))) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
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
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|public|assets).*)',
  ],
};