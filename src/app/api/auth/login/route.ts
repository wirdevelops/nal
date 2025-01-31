
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AuthService } from '@/lib/auth-service';
import { rateLimit } from '@/lib/rate-limit';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const limiter = await rateLimit(req);
    if (!limiter.success) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validatedData = loginSchema.parse(body);

    // Authenticate user
    const user = await AuthService.login({
      email: validatedData.email,
      password: validatedData.password
    }, req.ip );
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session
    const session = await AuthService.createSession(user.id);

    return NextResponse.json(
      { user: { id: user.id, email: user.email } },
      {
        headers: {
          'Set-Cookie': `session=${session}; HttpOnly; Path=/`
        }
      }
    );
  } catch (error) {
    console.error('[LOGIN_ERROR]', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}
