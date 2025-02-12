import { User } from '@/lib/user/types';
import * as z from 'zod';

export interface LoginResponse {
    requiresMFA?: boolean;
    user: User;
    message?: string;
}

const passwordRequirements = {
    minLength: 8,
    maxLength: 100,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
};

export const passwordSchema = z
    .string()
    .min(passwordRequirements.minLength, `Password must be at least ${passwordRequirements.minLength} characters`)
    .max(passwordRequirements.maxLength, `Password cannot exceed ${passwordRequirements.maxLength} characters`)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const loginSchema = z.object({
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional().default(false),
});

export const registerSchema = z.object({
    firstName: z.string().min(2, {
        message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Reset token is required'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const verifyEmailSchema = z.object({
    token: z.string().min(1, 'Verification token is required'),
});

export const resendVerificationSchema = z.object({
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
});

export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;