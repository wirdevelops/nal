// types/auth.ts
import { Type, Static } from '@sinclair/typebox';
  
export const AuthCredentialsSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 8 })
});

export type AuthCredentials = Static<typeof AuthCredentialsSchema>;