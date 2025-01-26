// app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AuthService } from '@/lib/auth-service';

const verifySchema = z.object({
  token: z.string(),
  email: z.string().email()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, email } = verifySchema.parse(body);

    const verified = await AuthService.verifyEmail(token, email);
    if (!verified) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[VERIFY_ERROR]', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
