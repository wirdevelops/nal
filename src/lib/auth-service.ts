// lib/auth-service.ts
import { AuthCredentials } from '@/types/auth';
import { User } from '@/types/user';
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail as sendVerificationEmailService } from './email-service';

const SECURITY = {
  SESSION_EXPIRATION: 7 * 24 * 60 * 60, // 7 days
  PASSWORD_MIN_LENGTH: 12,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/
};

export class AuthService {
  static requestPasswordReset() {
    throw new Error('Method not implemented.');
  }
  static async login(credentials: AuthCredentials): Promise<User> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  }

  static async signUp(credentials: AuthCredentials, name: User['name']): Promise<User> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...credentials,
        firstName: name.first,
        lastName: name.last
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
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

  // Changed to use a session ID that you generate, then tell the backend to create the session for a user.
  static async createSession(userId: string): Promise<string> {
    const sessionId = uuidv4(); // Generate a unique session ID
     try {
      const response = await fetch('/api/auth/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, sessionId })
      });

      if (!response.ok) {
           const error = await response.json();
           console.error("Error creating session: ", error)
          throw new Error(error.message || 'Session creation failed on backend');
        }
      return sessionId; // Return the session ID
    } catch (error) {
        console.error("Error creating session:", error)
        throw new Error('Session creation failed');
    }

  }
  
  static clearSession(): void {
    document.cookie = 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }

  static validatePassword(password: string): boolean {
    return SECURITY.PASSWORD_REGEX.test(password) && 
      password.length >= SECURITY.PASSWORD_MIN_LENGTH;
  }

  static async sendVerificationEmail(email: string): Promise<void> {
    const token = uuidv4(); // Generate a new token
    try {
      await sendVerificationEmailService(email, token);
    } catch(error){
        console.error("Error sending verification email", error);
      throw new Error("Failed to send verification email");
    }
  }

  static async handleNewUser(user: User): Promise<void> {
    try {
      // Create user session
      await AuthService.createSession(user.id);
      // Send verification email
      await AuthService.sendVerificationEmail(user.email);
      
       // Redirect to the email verification page
       window.location.href = '/auth/verify';

    } catch (error) {
       console.error("Error handling new user:", error);
      throw new Error("Registration process failed")
    }
  }
}