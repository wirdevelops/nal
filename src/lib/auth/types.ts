import * as z from 'zod';
import { ObjectId } from 'mongodb';
import { User } from '@/lib/user/types';

export interface AuthResponse {
    message?: string;
    user?: User;
    requiresMFA?: boolean;
    token?: string;
}

export interface RegistrationResponse {
    message: string;
    user_id: string;
}

export interface LoginResponse {
    message: string;
    user: User;
    requiresMFA?: boolean;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

export interface PasswordResetRequestInput {
    email: string;
}

export interface PasswordResetConfirmInput {
    token: string;
    newPassword: string;
    confirmPassword: string;
}

export interface EmailVerificationInput {
    token: string;
}

export const registrationRequestSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters").max(50, "First name must be at most 50 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name must be at most 50 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export const loginRequestSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required")
});

export const passwordResetRequestSchema = z.object({
    email: z.string().email("Invalid email address")
});

export const passwordResetConfirmRequestSchema = z.object({
    token: z.string().min(1, "Token is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters")
});

export const authTokensSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string()
});

export const refreshTokenSchema = z.object({
    token: z.string(),
    expiresAt: z.date()
});

export const verificationTokenSchema = z.object({
    token: z.string(),
    expiresAt: z.date()
});

export const resetTokenSchema = z.object({
    token: z.string(),
    expiresAt: z.date()
});

export const failedLoginSchema = z.object({
    attempts: z.number().int().min(0),
    lastTry: z.date(),
    lockUntil: z.date().optional()
});

export const auditLogSchema = z.object({
    id: z.instanceof(ObjectId).optional(),
    userId: z.instanceof(ObjectId).optional(),
    action: z.string(),
    details: z.string().optional(),
    ipAddress: z.string(),
    timestamp: z.date()
});

export const verificationSchema = z.object({
    id: z.instanceof(ObjectId).optional(),
    userId: z.instanceof(ObjectId),
    email: z.string().email(),
    token: z.string(),
    expiresAt: z.date(),
    createdAt: z.date()
});

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
}
