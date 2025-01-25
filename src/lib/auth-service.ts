// lib/auth-service.ts
import { AuthCredentials, AuthCredentialsSchema } from '@/types/auth';
import { User, OnboardingStage, UserRole, ProfileRole } from '@/types/user';
import { useUserStore } from '@/stores/useUserStore';

const SESSION_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7 days
const PBKDF2_ITERATIONS = 100000;

export class AuthService {
  // --- Authentication Methods --- //
  static async signUp(credentials: AuthCredentials, name: User['name']) {
    const { email, password } = AuthCredentialsSchema.parse(credentials);
    
    if (this.userExists(email)) {
      throw new Error('User already exists');
    }

    const hashedPassword = await this.hashPassword(password);
    const user = this.createNewUser(email, name);
    
    this.storeUserCredentials(email, hashedPassword, user.id);
    useUserStore.getState().setUser(user);
    this.createSession(user.id);
    
    return user;
  }

  static async login(credentials: AuthCredentials) {
    const { email, password } = AuthCredentialsSchema.parse(credentials);
    const userCredential = this.getUserCredentials(email);
    
    const isValid = await this.verifyPassword(password, userCredential.password);
    if (!isValid) throw new Error('Invalid credentials');

    const user = this.getUserData(userCredential.userId);
    useUserStore.getState().setUser(user);
    this.createSession(user.id);
    
    return user;
  }

  // --- User Management --- //
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

  static updateUserProfile<T extends ProfileRole>(
    role: T,
    data: Partial<User['profiles'][T]>
  ) {
    const user = useUserStore.getState().user;
    if (!user) throw new Error('User not authenticated');

    const currentProfile = user.profiles[role] || {} as User['profiles'][T];

    const updated = {
      ...user,
      profiles: {
        ...user.profiles,
        [role]: { ...currentProfile, ...data }
      },
      metadata: {
        ...user.metadata,
        updatedAt: new Date().toISOString()
      }
    };

    useUserStore.getState().setUser(updated);
    this.persistUser(updated);
  }

  static addUserRole(role: UserRole) {
    const user = useUserStore.getState().user;
    if (!user) throw new Error('User not authenticated');
    if (user.roles.includes(role)) return;

    const updated = {
      ...user,
      roles: [...user.roles, role],
      metadata: {
        ...user.metadata,
        updatedAt: new Date().toISOString()
      }
    };

    useUserStore.getState().setUser(updated);
    this.persistUser(updated);
  }

  static updateOnboardingProgress(stage: OnboardingStage, data?: Record<string, unknown>) {
    const user = useUserStore.getState().user;
    if (!user) throw new Error('User not authenticated');

    const updated = {
      ...user,
      onboarding: {
        stage,
        completed: [...user.onboarding.completed, stage],
        data: { ...user.onboarding.data, ...data }
      },
      metadata: {
        ...user.metadata,
        updatedAt: new Date().toISOString()
      }
    };

    useUserStore.getState().setUser(updated);
    this.persistUser(updated);
  }

  // --- Storage Integration --- //
  private static persistUser(user: User) {
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

  // --- Session Management --- //
  static validateSession(): User | null {
    try {
      const sessionToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('session='))
        ?.split('=')[1];

      if (!sessionToken) return null;

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

  private static createSession(userId: string) {
    const sessionToken = crypto.randomUUID();
    const sessionData = {
      userId,
      expiresAt: Date.now() + SESSION_EXPIRATION
    };

    localStorage.setItem(`session:${sessionToken}`, JSON.stringify(sessionData));
    document.cookie = `session=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_EXPIRATION}`;
  }

  static clearSession() {
    document.cookie = 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
    localStorage.removeItem('session');
    useUserStore.getState().logout();
  }

  private static storeUserCredentials(email: string, passwordHash: string, userId: string) {
    localStorage.setItem(`credentials:${email}`, JSON.stringify({
      email,
      password: passwordHash,
      userId
    }));
  }
  
  private static getUserCredentials(email: string) {
    const credentials = localStorage.getItem(`credentials:${email}`);
    if (!credentials) throw new Error('User not found');
    return JSON.parse(credentials) as {
      email: string;
      password: string;
      userId: string;
    };
  }

  // --- Security Methods --- //
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

// // types/user.ts updates
// //export type ProfileRole = 'actor' | 'crew' | 'vendor' | 'producer';
// //export type UserRole = ProfileRole | 'admin' | 'project-owner' | 'ngo';

// export interface User {
//   id: string;
//   email: string;
//   name: {
//     first: string;
//     last: string;
//   };
//   isVerified: boolean;
//   roles: UserRole[];
//   profiles: {
//     [K in ProfileRole]?: K extends 'actor' ? ActorProfile :
//     K extends 'crew' ? CrewProfile :
//     K extends 'vendor' ? VendorProfile :
//     K extends 'producer' ? ProducerProfile : never;
//   };
//   onboarding: {
//     stage: OnboardingStage;
//     completed: OnboardingStage[];
//     data: Record<string, unknown>;
//   };
//   settings: {
//     notifications: {
//       email: boolean;
//       projects: boolean;
//       messages: boolean;
//     };
//     privacy: {
//       profile: 'public' | 'private' | 'connections';
//       contactInfo: boolean;
//     };
//   };
//   status: 'active' | 'inactive' | 'pending';
//   metadata: {
//     createdAt: string;
//     updatedAt: string;
//     lastActive?: string;
//   };
// }

interface ActorProfile {
  skills: string[];
  experience: Array<{
    title: string;
    role: string;
    duration: string;
    description?: string;
  }>;
  portfolio: string[];
  availability?: string;
  actingStyles: string[];
  reels: string[];
  unionStatus?: string;
}

interface CrewProfile {
  department: string;
  certifications: string[];
  equipment: string[];
  experience: Array<{
    title: string;
    role: string;
    duration: string;
    description?: string;
  }>;
  portfolio: string[];
}

interface VendorProfile {
  businessName: string;
  services: string[];
  paymentMethods: string[];
  inventory: Array<{
    category: string;
    items: string[];
  }>;
}

interface ProducerProfile {
  projects: string[];
  collaborations: string[];
  certifications: string[];
}