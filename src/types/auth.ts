import { Type, Static } from '@sinclair/typebox';

export const LoginRequestSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 8 }),
});
export type LoginRequest = Static<typeof LoginRequestSchema>;

// What the *frontend* receives upon successful login/refresh.  Doesn't include tokens (httpOnly).
export const AuthResponseSchema = Type.Object({
  user: Type.Object({
    id: Type.String({ format: 'uuid' }), // Always expect a UUID from the backend
    email: Type.String({ format: 'email' }),
    roles: Type.Array(Type.String()), // Array of role strings
    onboardingStatus: Type.Union([
      Type.Literal('incomplete'),
      Type.Literal('basic'),
      Type.Literal('role'),
      Type.Literal('verification'),
      Type.Literal('complete'),
    ]),
  }),
});
export type AuthResponse = Static<typeof AuthResponseSchema>;

// Registration data sent *to* the backend
export const RegisterRequestSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 8 }),
  firstName: Type.String(), // Split name for better handling
  lastName: Type.String(),
});
export type RegisterRequest = Static<typeof RegisterRequestSchema>;


export const RefreshRequestSchema = Type.Object({}); // Empty, since it just uses the cookie
export type RefreshRequest = Static<typeof RefreshRequestSchema>;

export const ForgotPasswordRequestSchema = Type.Object({
    email: Type.String({format: 'email'})
})
export type ForgotPasswordRequest = Static<typeof ForgotPasswordRequestSchema>;

export const ResetPasswordRequestSchema = Type.Object({
    token: Type.String(),
    newPassword: Type.String({minLength: 8})
})
export type ResetPasswordRequest = Static<typeof ResetPasswordRequestSchema>;


export const VerifyEmailRequestSchema = Type.Object({
  token: Type.String() //Verification token from the email
})
export type VerifyEmailRequest = Static<typeof VerifyEmailRequestSchema>;

// // types/auth.ts
// import { Type, Static } from '@sinclair/typebox';
  
// export const AuthCredentialsSchema = Type.Object({
//   email: Type.String({ format: 'email' }),
//   password: Type.String({ minLength: 8 })
// });

// export type AuthCredentials = Static<typeof AuthCredentialsSchema>;

// export interface AuthTokens {
//   accessToken: string | null;
//   refreshToken: string | null;
// }

// export interface LoginData {
//   email: string;
//   password: string;
// }

// export interface RegistrationData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
// }

// export interface UserAuth {
//     accessToken: string;
//     refreshToken: string;
//     user:string;
// }