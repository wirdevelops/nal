// lib/auth-service.ts
import { AuthCredentials } from '@/types/auth';
import { User, OnboardingStage, UserRole } from '@/types/user';
import { useUserStore } from '@/stores/useUserStore';

const SESSION_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7 days
const PBKDF2_ITERATIONS = 100000;

export class AuthService {
  private static async refreshToken(): Promise<void> {
    const response = await fetch('/api/auth/refresh');
    if (!response.ok) {
      this.clearSession();
      throw new Error('Session expired');
    }
  }
  
  static async handleApiError(error: unknown): Promise<never> {
    if (error instanceof Response && error.status === 401) {
      await this.refreshToken();
    }
    throw error;
  }
  
    static async socialLogin(provider: 'google' | 'facebook'): Promise<User> {
      try {
        const popup = window.open(
          `/api/auth/${provider}`,
          `${provider}Login`,
          'width=500,height=600'
        );
  
        return new Promise((resolve, reject) => {
          window.addEventListener('message', async (event) => {
            if (event.origin !== window.location.origin) return;
            
            if (event.data?.type === 'social_auth_success') {
              const { user } = event.data;
              useUserStore.getState().setUser(user);
              this.createSession(user.id);
              popup?.close();
              resolve(user);
            }
            
            if (event.data?.type === 'social_auth_error') {
              popup?.close();
              reject(new Error(event.data.error));
            }
          });
        });
      } catch (error) {
        throw new Error('Social login failed');
      }
    }

  // --- Authentication Methods --- //
  static async signUp(credentials: AuthCredentials, name: User['name']): Promise<User> {
    console.log('Creating new user...');
    if (this.userExists(credentials.email)) {
      throw new Error('User already exists');
    }
  
    const hashedPassword = await this.hashPassword(credentials.password);
    const user = this.createNewUser(credentials.email, name);
    
    // Add these lines to persist the user and create session
    this.persistUser(user);
    this.createSession(user.id);
    useUserStore.getState().setUser(user);
    
    console.log('User created:', user.id);
    
    this.storeUserCredentials(credentials.email, hashedPassword, user.id);
    console.log('Stored credentials for:', credentials.email);
    
    return user;
  }

  static async login(credentials: AuthCredentials): Promise<User> {
    console.log('AuthService.login called with:', { ...credentials, password: '[REDACTED]' });
    const { email, password } = credentials;
  
    const userCredential = this.getUserCredentials(email);
    console.log('Found user credentials:', { email: userCredential.email, userId: userCredential.userId });
  
    const isValid = await this.verifyPassword(password, userCredential.password);
    console.log('Password verification:', isValid);
  
    if (!isValid) throw new Error('Invalid credentials');
  
    const user = this.getUserData(userCredential.userId);
    
    // Add session creation and store update
    this.createSession(user.id);
    useUserStore.getState().setUser(user);
    
    return user;
  }

  // --- Session Management --- //
  private static createSession(userId: string): void {
    const sessionToken = crypto.randomUUID();
    const sessionData = {
      userId,
      expiresAt: Date.now() + SESSION_EXPIRATION
    };

    localStorage.setItem(`session:${sessionToken}`, JSON.stringify(sessionData));
    document.cookie = `session=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_EXPIRATION}`;
  }

  static validateSession(sessionToken: string): User | null {
    try {
      const sessionData = localStorage.getItem(`session:${sessionToken}`);
      if (!sessionData) return null;

      const { userId, expiresAt } = JSON.parse(sessionData);
      if (Date.now() > expiresAt) {
        this.clearSession();
        return null;
      }

      return this.getUserData(userId);
    } catch {
      return null;
    }
  }

  static clearSession(): void {
    document.cookie = 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
    localStorage.removeItem('session');
    useUserStore.getState().logout();
  }

  // --- Password Handling --- //
  private static async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: PBKDF2_ITERATIONS,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    const exportedKey = await crypto.subtle.exportKey('raw', key);
    return bufferToHex(exportedKey);
  }

  private static async verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const hashed = await this.hashPassword(password);
    return timingSafeEqual(hashed, storedHash);
  }

  // --- Storage Methods --- //
  private static storeUserCredentials(email: string, passwordHash: string, userId: string): void {
    localStorage.setItem(`credentials:${email}`, JSON.stringify({
      email,
      password: passwordHash,
      userId
    }));
  }

  static getUserCredentials(email: string) {
    console.log('Checking credentials for email:', email);
    const credentials = localStorage.getItem(`credentials:${email}`);
    console.log('Found credentials:', credentials);
    if (!credentials) throw new Error('User not found');
    return JSON.parse(credentials);
  }

  private static createNewUser(email: string, name: User['name']): User {
    return {
      id: crypto.randomUUID(),
      email,
      name,
      isVerified: false,
      roles: [],
      profiles: {},
      onboarding: {
        stage: 'role-selection',
        completed: [],
        data: {}
      },
      settings: {
        notifications: {
          email: true,
          projects: true,
          messages: true
        },
        privacy: {
          profile: 'public',
          contactInfo: false
        }
      },
      status: 'pending',
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  }

  private static persistUser(user: User): void {
    localStorage.setItem(`user:${user.id}`, JSON.stringify(user));
    localStorage.setItem(`user-email:${user.email}`, user.id);
  }

  private static getUserData(userId: string): User {
    const data = localStorage.getItem(`user:${userId}`);
    if (!data) throw new Error('User not found');
    return JSON.parse(data);
  }

  private static userExists(email: string): boolean {
    return !!localStorage.getItem(`user-email:${email}`);
  }

  static debugStorage() {
    return {
      users: Object.entries(localStorage)
        .filter(([key]) => key.startsWith('user:') || key.startsWith('user-email:')),
      sessions: Object.entries(localStorage)
        .filter(([key]) => key.startsWith('session:')),
      credentials: Object.entries(localStorage)
        .filter(([key]) => key.startsWith('credentials:'))
    };
  }
  
  static printDebugInfo() {
    console.log('=== Auth Service Debug ===');
    console.log('Users:', this.debugStorage().users);
    console.log('Sessions:', this.debugStorage().sessions);
    console.log('Credentials:', this.debugStorage().credentials);
    console.log('Document Cookie:', document.cookie);
    console.log('User Store State:', useUserStore.getState().user);
    console.log('==========================');
  }
}

// Utility functions
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqual(a: string, b: string): boolean {
  const aBuf = new TextEncoder().encode(a);
  const bBuf = new TextEncoder().encode(b);
  if (aBuf.length !== bBuf.length) return false;

  let result = 0;
  for (let i = 0; i < aBuf.length; i++) {
    result |= aBuf[i] ^ bBuf[i];
  }
  return result === 0;
}