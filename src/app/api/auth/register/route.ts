import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AuthService } from '@/lib/auth-service';
import { sendVerificationEmail } from '@/lib/email-service';
import { rateLimit } from '@/lib/rate-limit';

class AuthError extends Error {
    constructor(public message: string, public statusCode = 400) {  // Removed `: number`
      super(message);
      this.name = 'AuthError';
    }
}
  
// Rest of the file remains exactly the same
function handleApiError(error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', issues: error.errors },
        { status: 422 }
      );
    }
  
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
  
    if (error instanceof Error && error.message.includes('verification email')) {
      return NextResponse.json(
        { error: 'Account created but verification failed. Please contact support.' },
        { status: 500 }
      );
    }
  
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
}

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2)
});

export async function POST(req: NextRequest) {
    const limiter = await rateLimit(req, 'auth');
    if (!limiter.success) {
      return NextResponse.json(
        { error: limiter.error },
        { status: 429 }
      );
    }
  
    try {
      const body = await req.json();
      const validatedData = registerSchema.parse(body);
      
      if (await AuthService.userExists(validatedData.email)) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 409 }
        );
      }

      const credentials = {
        email: validatedData.email,
        password: validatedData.password
      };
   
      const name = {
        first: validatedData.firstName,
        last: validatedData.lastName
      };
  
      const user = await AuthService.signUp(credentials, name, req.ip);
  
      const verificationToken = await AuthService.createVerificationToken(user.id);
      // Transactional email with error recovery
      const emailResult = await sendVerificationEmail(user.email, verificationToken);
      if (!emailResult.success) {
        await AuthService.deleteUnverifiedUser(user.id);
        throw new Error('Failed to send verification email');
    }
      const session = await AuthService.createSession(
        user.id,
        req.headers.get('user-agent'),
        req.ip
      );
  
      return NextResponse.json(
        { user: { id: user.id } },
        {
          status: 201,
          headers: {
            'Set-Cookie': AuthService.buildSessionCookie(session)
          }
        }
      );
    } catch (error) {
      // Structured error handling
      return handleApiError(error);
    }
}