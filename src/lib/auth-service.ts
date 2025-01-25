// lib/auth-service.ts
import { AuthCredentials, AuthCredentialsSchema } from '@/types/auth';
import { useUserStore } from '@/stores/useUserStore';
import { User } from '@/types/user';

const SESSION_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export class AuthService {
  static async signUp(credentials: AuthCredentials, name: { first: string; last: string }) {
    try {
      const { email, password } = AuthCredentialsSchema.parse(credentials);
      
      if (localStorage.getItem(`user:${email}`)) {
        throw new Error('User already exists');
      }

      const hashedPassword = await this.hashPassword(password);
      const userStore = useUserStore.getState();
      
      userStore.initializeUser(email, name);
      
      if (!userStore.user) {
        throw new Error('User initialization failed');
      }

      // Store credentials separately from user data
      localStorage.setItem(`user:${email}`, JSON.stringify({
        email,
        password: hashedPassword,
        userId: userStore.user.id
      }));

      // Save full user data
      localStorage.setItem(`userdata:${userStore.user.id}`, JSON.stringify(userStore.user));
      
      this.setSessionToken(userStore.user.id);
      return userStore.user;
    } catch (error) {
      throw new Error(`Signup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async login(credentials: AuthCredentials) {
    try {
      const { email, password } = AuthCredentialsSchema.parse(credentials);
      const userCredential = localStorage.getItem(`user:${email}`);
      
      if (!userCredential) {
        throw new Error('User not found');
      }
      
      const { password: storedHash, userId } = JSON.parse(userCredential);
      const isValid = await this.verifyPassword(password, storedHash);
      
      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      const userData = localStorage.getItem(`userdata:${userId}`);
      if (!userData) {
        throw new Error('User data not found');
      }
      
      const user = JSON.parse(userData) as User;
      useUserStore.getState().setUser(user);
      this.setSessionToken(userId);
      return user;
    } catch (error) {
      throw new Error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async resetPassword(email: string, token: string, newPassword: string) {
    try {
      const resetData = localStorage.getItem(`reset:${email}`);
      if (!resetData) {
        throw new Error('Invalid reset token');
      }

      const { token: storedToken, expiresAt } = JSON.parse(resetData);
      if (Date.now() > expiresAt) {
        localStorage.removeItem(`reset:${email}`);
        throw new Error('Token expired');
      }

      if (token !== storedToken) {
        throw new Error('Invalid reset token');
      }

      const hashedPassword = await this.hashPassword(newPassword);
      const credentials = JSON.parse(localStorage.getItem(`user:${email}`) || '{}');
      
      if (!credentials.userId) {
        throw new Error('User not found');
      }

      credentials.password = hashedPassword;
      localStorage.setItem(`user:${email}`, JSON.stringify(credentials));
      localStorage.removeItem(`reset:${email}`);
      
      return true;
    } catch (error) {
      throw new Error(`Password reset failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async requestPasswordReset(email: string): Promise<void> {
    try {
      // Verify email exists
      const userCredential = localStorage.getItem(`user:${email}`);
      if (!userCredential) {
        throw new Error('No account found with this email address');
      }

      // Generate reset token
      const resetToken = crypto.randomUUID();
      const expiresAt = Date.now() + 3600000; // 1 hour

      // Store reset token
      localStorage.setItem(`reset:${email}`, JSON.stringify({
        token: resetToken,
        expiresAt
      }));

      // In real implementation: Send email with reset token
      console.log(`Password reset token for ${email}: ${resetToken}`);
      
    } catch (error) {
      throw new Error(`Password reset request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async validateResetToken(email: string, token: string): Promise<boolean> {
    const resetData = localStorage.getItem(`reset:${email}`);
    if (!resetData) return false;

    try {
      const { token: storedToken, expiresAt } = JSON.parse(resetData);
      return token === storedToken && Date.now() < expiresAt;
    } catch {
      return false;
    }
  }

//   static async resetPassword(
//     email: string, 
//     token: string, 
//     newPassword: string
//   ): Promise<void> {
//     try {
//       const isValid = await this.validateResetToken(email, token);
//       if (!isValid) {
//         throw new Error('Invalid or expired reset token');
//       }

//       const credentials = localStorage.getItem(`user:${email}`);
//       if (!credentials) {
//         throw new Error('User not found');
//       }

//       // Update password
//       const hashedPassword = await this.hashPassword(newPassword);
//       const userData = JSON.parse(credentials);
//       userData.password = hashedPassword;

//       // Update stored credentials
//       localStorage.setItem(`user:${email}`, JSON.stringify(userData));
      
//       // Update user data if logged in
//       const currentUser = this.getCurrentUser();
//       if (currentUser?.email === email) {
//         useUserStore.getState().setUser(currentUser);
//       }

//       // Clear reset token
//       localStorage.removeItem(`reset:${email}`);

//     } catch (error) {
//       throw new Error(`Password reset failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     }
//   }


  // Add email verification method
  static async sendVerificationEmail(email: string) {
    const user = this.getCurrentUser();
    if (!user || user.email !== email) {
      throw new Error('User not authenticated');
    }

    const verificationToken = crypto.randomUUID();
    const expiresAt = Date.now() + 3600000; // 1 hour
    
    localStorage.setItem(`verify:${email}`, JSON.stringify({
      token: verificationToken,
      expiresAt
    }));

    // In a real implementation, send the token via email
    return verificationToken;
  }

  static async verifyEmail(token: string, email: string) {
    try {
      const storedToken = localStorage.getItem(`verify:${email}`);
      if (!storedToken) {
        throw new Error('Invalid verification token');
      }

      const { token: savedToken, expiresAt } = JSON.parse(storedToken);
      if (Date.now() > expiresAt) {
        localStorage.removeItem(`verify:${email}`);
        throw new Error('Verification token expired');
      }

      if (token !== savedToken) {
        throw new Error('Invalid verification token');
      }

      const user = this.getCurrentUser();
      if (user?.email === email) {
        useUserStore.getState().verifyEmail();
        localStorage.removeItem(`verify:${email}`);
        return true;
      }

      throw new Error('User not found');
    } catch (error) {
      throw new Error(`Email verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    
  }



  static logout() {
    useUserStore.getState().logout();
    this.clearSessionToken();
  }

  private static async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
  }

  private static async verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const hashed = await this.hashPassword(password);
    return hashed === storedHash;
  }

  private static setSessionToken(userId: string) {
    const token = btoa(JSON.stringify({ 
      userId, 
      expiresAt: Date.now() + SESSION_EXPIRATION 
    }));
    localStorage.setItem('session', token);
  }

  static validateSession(): boolean {
    const session = localStorage.getItem('session');
    if (!session) return false;

    try {
      const { userId, expiresAt } = JSON.parse(atob(session));
      if (Date.now() > expiresAt) {
        this.clearSessionToken();
        return false;
      }
      return !!localStorage.getItem(`userdata:${userId}`);
    } catch {
      return false;
    }
  }

  static getCurrentUser(): User | null {
    if (!this.validateSession()) return null;
    const session = localStorage.getItem('session');
    if (!session) return null;

    const { userId } = JSON.parse(atob(session));
    return JSON.parse(localStorage.getItem(`userdata:${userId}`) || 'null');
  }

  private static clearSessionToken() {
    localStorage.removeItem('session');
  }
}