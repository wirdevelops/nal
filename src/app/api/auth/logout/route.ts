// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth-service';

export async function POST(req: NextRequest) {
  try {
    const session = req.cookies.get('session');
    if (session) {
      await AuthService.clearAllSessions(session.value);
    }

    return NextResponse.json(
      { success: true },
      {
        headers: {
          'Set-Cookie': 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
        }
      }
    );
  } catch (error) {
    console.error('[LOGOUT_ERROR]', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
