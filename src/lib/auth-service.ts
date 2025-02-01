// lib/auth-service.ts
import { AuthCredentials } from '@/types/auth';
import { User } from '@/types/user';
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail as sendVerificationEmailService } from './email-service';

const SECURITY = {
  SESSION_EXPIRATION: 7 * 24 * 60 * 60, // 7 days in seconds
  PASSWORD_MIN_LENGTH: 12,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/,
  VERIFICATION_TOKEN_EXPIRY: 24 * 60 * 60 // 24 hours in seconds
};

export class AuthService {
  static async userExists(email: string): Promise<boolean> {
    const response = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      throw new Error('Failed to check email existence');
    }

    const { exists } = await response.json();
    return exists;
  }

  static async login(credentials: AuthCredentials, ip: string): Promise<User> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...credentials, ip })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  }

  static async signUp(
    credentials: AuthCredentials, 
    name: User['name'], 
    ip: string
  ): Promise<User> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...credentials,
        firstName: name.first,
        lastName: name.last,
        ip
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  }

  static async createVerificationToken(userId: string): Promise<string> {
    const token = uuidv4();
    const response = await fetch('/api/auth/create-verification-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        token,
        expiresIn: SECURITY.VERIFICATION_TOKEN_EXPIRY
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create verification token');
    }

    return token;
  }

  static async verifyEmail(token: string, email: string): Promise<boolean> {
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, email })
    });

    if (!response.ok) {
      throw new Error('Email verification failed');
    }

    const { success } = await response.json();
    return success;
  }

  static async deleteUnverifiedUser(userId: string): Promise<boolean> {
    const response = await fetch(`/api/auth/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error('Failed to delete unverified user');
    }

    return true;
  }

  static async createSession(
    userId: string,
    userAgent?: string | null,
    ip?: string
  ): Promise<string> {
    const sessionId = uuidv4();
    try {
      const response = await fetch('/api/auth/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          sessionId,
          userAgent,
          ip,
          expiresIn: SECURITY.SESSION_EXPIRATION
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Session creation failed');
      }

      return sessionId;
    } catch (error) {
      console.error("Error creating session:", error);
      throw new Error('Session creation failed');
    }
  }

  static buildSessionCookie(sessionId: string): string {
    const expires = new Date(Date.now() + SECURITY.SESSION_EXPIRATION * 1000);
    return `session=${sessionId}; Path=/; Expires=${expires.toUTCString()}; HttpOnly; Secure; SameSite=Strict`;
  }

  static async validateSession(sessionId: string): Promise<User | null> {
    try {
      const response = await fetch('/api/auth/session', {
        headers: {
          Cookie: `session=${sessionId}`
        }
      });

      if (!response.ok) return null;
      
      const { user } = await response.json();
      return user;
    } catch {
      return null;
    }
  }

  static async requestPasswordReset(email: string): Promise<boolean> {
    const response = await fetch('/api/auth/request-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      throw new Error('Password reset request failed');
    }

    const { success } = await response.json();
    return success;
  }

  static async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const response = await fetch('/api/auth/reset-password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password: newPassword })
    });

    if (!response.ok) {
      throw new Error('Password reset failed');
    }

    const { success } = await response.json();
    return success;
  }
  
  static clearSession(): void {
    document.cookie = `session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict`;
  }

  static validatePassword(password: string): boolean {
    return SECURITY.PASSWORD_REGEX.test(password) && 
      password.length >= SECURITY.PASSWORD_MIN_LENGTH;
  }

  static async handleNewUser(user: User): Promise<void> {
    try {
      const sessionId = await AuthService.createSession(user.id);
      const verificationToken = await AuthService.createVerificationToken(user.id);
      await sendVerificationEmailService(user.email, verificationToken);
      
      // Set the session cookie
      document.cookie = AuthService.buildSessionCookie(sessionId);
      
      // Redirect to verification page
      window.location.href = '/auth/verify';
    } catch (error) {
      console.error("Error handling new user:", error);
      throw new Error("Registration process failed");
    }
  }
}