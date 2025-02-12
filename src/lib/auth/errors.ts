// @/lib/auth/errors.ts
export class AuthError extends Error {
  constructor(message: string) {
      super(message);
      this.name = 'AuthError';
  }
}

export class LoginError extends AuthError {
  constructor(message: string = 'Login failed') {
      super(message);
      this.name = 'LoginError';
  }
}

export class RegistrationError extends AuthError {
  constructor(message: string = 'Registration failed') {
      super(message);
      this.name = 'RegistrationError';
  }
}

export class PasswordResetError extends AuthError {
  constructor(message: string = 'Password reset failed') {
      super(message);
      this.name = 'PasswordResetError';
  }
}

export class EmailVerificationError extends AuthError {
  constructor(message: string = 'Email verification failed') {
      super(message);
      this.name = 'EmailVerificationError';
  }
}

export class TokenRefreshError extends AuthError {
  constructor(message: string = 'Token refresh failed') {
      super(message);
      this.name = 'TokenRefreshError';
  }
}