// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AuthService } from '@/lib/auth-service';
import { sendPasswordResetEmail } from '@/lib/email-service';

const requestResetSchema = z.object({
  email: z.string().email()
});

const resetSchema = z.object({
  token: z.string(),
  password: z.string().min(8)
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = requestResetSchema.parse(body);

    const user = await AuthService.findUserByEmail(email);
    if (user) {
      const resetToken = await AuthService.createPasswordResetToken(user.id);
      await sendPasswordResetEmail(email, resetToken);
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[RESET_REQUEST_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to process reset request' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, password } = resetSchema.parse(body);

    const success = await AuthService.resetPassword(token, password, password);
    if (!success) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[RESET_PASSWORD_ERROR]', error);
    return NextResponse.json(
      { error: 'Password reset failed' },
      { status: 500 }
    );
  }
}