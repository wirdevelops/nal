// lib/auth-service.ts
import { AuthCredentials } from '@/types/auth';
import { User, UserRole } from '@/types/user';
import { Redis } from '@upstash/redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { hash, verify } from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'node:crypto';

const redis = Redis.fromEnv();
const rateLimiter = new RateLimiterRedis({
  storeClient: redis,
  points: 5,
  duration: 15 * 60, // 15 minutes
  keyPrefix: 'auth_rate_limit'
});

const SECURITY = {
  SESSION_EXPIRATION: 7 * 24 * 60 * 60, // 7 days
  VERIFICATION_EXPIRATION: 24 * 60 * 60, // 24 hours
  RESET_TOKEN_EXPIRATION: 60 * 60, // 1 hour
  MAX_SESSIONS: 5,
  PASSWORD_MIN_LENGTH: 12,
  ACCOUNT_LOCK_THRESHOLD: 5,
  ACCOUNT_LOCK_DURATION: 60 * 60, // 1 hour
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/
};

interface SessionData {
  id: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
  userAgent?: string;
  ip?: string;
  lastUsed: number;
  fingerprint: string;
}

export class AuthService {
  private static async rateLimit(ip: string) {
    try {
      await rateLimiter.consume(ip);
    } catch (e) {
      throw new Error('Too many requests');
    }
  }

  private static getBrowserFingerprint(req: Request) {
    const headers = req.headers;
    return createHash('sha256')
      .update([
        headers.get('user-agent'),
        headers.get('accept-language'),
        headers.get('sec-ch-ua-platform')
      ].join('|'))
      .digest('hex');
  }

  static async rotateSession(oldSessionId: string) {
    const user = await this.validateSession(oldSessionId);
    if (!user) return null;
    
    await this.clearAllSessions(oldSessionId);
    return this.createSession(user.id);
  }

  static async signUp(credentials: AuthCredentials, name: User['name'], ip: string): Promise<User> {
    await this.rateLimit(ip);
    const { email, password } = credentials;

    if (password.length < SECURITY.PASSWORD_MIN_LENGTH) {
      throw new Error(`Password must be at least ${SECURITY.PASSWORD_MIN_LENGTH} characters`);
    }

    if (!SECURITY.PASSWORD_REGEX.test(password)) {
      throw new Error('Password must contain uppercase, lowercase, number, and special character');
    }

    const existingUser = await this.findUserByEmail(email);
    if (existingUser) throw new Error('User already exists');

    const userId = uuidv4();
    const hashedPassword = await hash(password);
    const now = new Date().toISOString();

    const user: User = {
      id: userId,
      email,
      name,
      isVerified: false,
      roles: [],
      activeRole: null,
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
        createdAt: now,
        updatedAt: now,
        lastActive: null
      }
    };

    await redis.multi()
      .set(`user:${userId}`, JSON.stringify(user))
      .set(`user-email:${email}`, userId)
      .set(`credentials:${userId}`, hashedPassword)
      .exec();

    return user;
  }

  static async login(credentials: AuthCredentials, ip: string): Promise<User> {
    await this.rateLimit(ip);
    const { email, password } = credentials;

    const user = await this.findUserByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    // Check account lock status
    const isLocked = await redis.get(`user:${user.id}:locked`);
    if (isLocked) {
      throw new Error('Account temporarily locked. Please try again later.');
    }

    const hashedPassword = await redis.get<string>(`credentials:${user.id}`);
    if (!hashedPassword) throw new Error('Invalid credentials');

    const isValid = await verify(hashedPassword, password);
    if (!isValid) {
      await this.recordFailedAttempt(user.id);
      throw new Error('Invalid credentials');
    }

    await this.resetFailedAttempts(user.id);
    user.metadata.lastActive = new Date().toISOString();
    await this.updateUser(user);

    return user;
  }

  private static async recordFailedAttempt(userId: string) {
    const attempts = await redis.incr(`user:${userId}:failed-attempts`);
    
    if (attempts >= SECURITY.ACCOUNT_LOCK_THRESHOLD) {
      await redis.multi()
        .set(`user:${userId}:locked`, 'true', { ex: SECURITY.ACCOUNT_LOCK_DURATION })
        .del(`user:${userId}:failed-attempts`)
        .exec();
      
      throw new Error('Account temporarily locked due to multiple failed attempts');
    }
  }

  private static async resetFailedAttempts(userId: string) {
    await redis.del(`user:${userId}:failed-attempts`);
  }

  static async createSession(userId: string, userAgent?: string, ip?: string): Promise<string> {
    const sessionsKey = `sessions:${userId}`;
    const sessionCount = await redis.llen(sessionsKey);
    
    if (sessionCount >= SECURITY.MAX_SESSIONS) {
      const oldestSession = await redis.lpop(sessionsKey);
      if (oldestSession) await redis.del(`session:${oldestSession}`);
    }

    const sessionId = uuidv4();
    const session: SessionData = {
      id: sessionId,
      userId,
      createdAt: Date.now(),
      expiresAt: Date.now() + SECURITY.SESSION_EXPIRATION * 1000,
      userAgent,
      ip,
      lastUsed: Date.now(),
      fingerprint: ''
    };

    await redis.multi()
      .set(`session:${sessionId}`, JSON.stringify(session), { ex: SECURITY.SESSION_EXPIRATION })
      .rpush(sessionsKey, sessionId)
      .exec();

    return sessionId;
  }

  static async validateSession(sessionId: string, req?: Request): Promise<User | null> {
    const session = await redis.get<SessionData>(`session:${sessionId}`);
    if (!session) return null;
  
    // Browser fingerprint validation
    if (req) {
      const currentFingerprint = this.getBrowserFingerprint(req);
      if (session.fingerprint && session.fingerprint !== currentFingerprint) {
        await this.clearAllSessions(sessionId);
        return null;
      }
    }

    // Validate against user's active sessions
    const validSession = await redis.lpos(`sessions:${session.userId}`, sessionId);
    if (validSession === null) return null;
  
    // Update session last used and expiration
    session.lastUsed = Date.now();
    await redis.multi()
      .set(`session:${sessionId}`, JSON.stringify(session))
      .expire(`session:${sessionId}`, SECURITY.SESSION_EXPIRATION)
      .exec();
    
    return this.findUserById(session.userId);
  }

  static async clearAllSessions(userId: string): Promise<void> {
    const sessionsKey = `sessions:${userId}`;
    const sessionIds = await redis.lrange(sessionsKey, 0, -1);
    
    const multi = redis.multi();
    sessionIds.forEach(id => multi.del(`session:${id}`));
    multi.del(sessionsKey);
    
    await multi.exec();
  }

  static async rotateCredentials(userId: string, newPassword: string): Promise<void> {
    if (!SECURITY.PASSWORD_REGEX.test(newPassword)) {
      throw new Error('Password does not meet security requirements');
    }

    const hashedPassword = await hash(newPassword);
    await redis.set(`credentials:${userId}`, hashedPassword);
    await this.clearAllSessions(userId);
  }

  static async createVerificationToken(userId: string): Promise<string> {
    const token = uuidv4();
    await redis.set(`verify:${token}`, userId, { 
      ex: SECURITY.VERIFICATION_EXPIRATION 
    });
    return token;
  }

  static async verifyEmail(token: string, email: string): Promise<boolean> {
    const userId = await redis.get<string>(`verify:${token}`);
    if (!userId) return false;

    const user = await this.findUserByEmail(email);
    if (!user || user.id !== userId) return false;

    user.isVerified = true;
    user.status = 'active';
    user.metadata.updatedAt = new Date().toISOString();
    
    await redis.multi()
      .set(`user:${user.id}`, JSON.stringify(user))
      .del(`verify:${token}`)
      .exec();

    return true;
  }

  static async createPasswordResetToken(userId: string): Promise<string> {
    const token = uuidv4();
    await redis.multi()
      .set(`reset:${token}`, userId, { ex: SECURITY.RESET_TOKEN_EXPIRATION })
      .del(`reset:old:${userId}`) // Invalidate previous tokens
      .rename(`reset:${token}`, `reset:old:${userId}`)
      .exec();
    
    return token;
  }

  static async resetPassword(token: string, newPassword: string): Promise<boolean> {
    if (!SECURITY.PASSWORD_REGEX.test(newPassword)) {
      throw new Error('Password does not meet security requirements');
    }

    const userId = await redis.get<string>(`reset:old:${token}`);
    if (!userId) return false;

    const hashedPassword = await hash(newPassword);
    
    await redis.multi()
      .set(`credentials:${userId}`, hashedPassword)
      .del(`reset:old:${token}`)
      .exec();

    await this.clearAllSessions(userId);
    return true;
  }

  static buildSessionCookie(sessionId: string): string {
    const isProduction = process.env.NODE_ENV === 'production';
    const maxAge = SECURITY.SESSION_EXPIRATION;
    
    return [
      `session=${sessionId}`,
      `Path=/`,
      `HttpOnly`,
      `SameSite=Lax`,
      `Max-Age=${maxAge}`,
      isProduction ? `Secure` : '',
      isProduction ? `Domain=${process.env.COOKIE_DOMAIN}` : ''
    ].filter(Boolean).join('; ');
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    const userId = await redis.get<string>(`user-email:${email}`);
    return userId ? this.findUserById(userId) : null;
  }

  static async findUserById(userId: string): Promise<User | null> {
    return await redis.get<User>(`user:${userId}`);
  }

  static async updateUser(user: User): Promise<void> {
    user.metadata.updatedAt = new Date().toISOString();
    await redis.set(`user:${user.id}`, JSON.stringify(user));
  }

  static async deleteUnverifiedUser(userId: string): Promise<void> {
    const user = await this.findUserById(userId);
    if (!user || user.isVerified) return;

    await redis.multi()
      .del(`user:${userId}`)
      .del(`user-email:${user.email}`)
      .del(`credentials:${userId}`)
      .del(`verify:${userId}`)
      .exec();
  }

  static async userExists(email: string): Promise<boolean> {
    const userId = await redis.get<string>(`user-email:${email}`);
    return !!userId;
  }
}