// src/lib/auth/api.ts
import { AxiosError } from 'axios';
import { axiosInstance } from './axios'; // Import the configured instance
import { AuthError } from './errors';
import type { LoginCredentials, RegisterCredentials, AuthTokens } from './types';
import type { User } from '@/lib/user/types';
import type { ForgotPasswordInput, ResetPasswordInput, VerifyEmailInput } from './validations';

export const authApi = {
    async login(credentials: LoginCredentials) {
        try {
            const response = await axiosInstance.post<{ message: string; user: User; requiresMFA?: boolean; }>('/v1/auth/login', credentials);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new AuthError(error.response?.data?.error || 'Login failed');
            }
            throw error;
        }
    },

    async register(credentials: RegisterCredentials) {
        try {
            const response = await axiosInstance.post<{ message: string; user_id: string }>('/v1/auth/register', credentials);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new AuthError(error.response?.data?.error || 'Registration failed');
            }
            throw error;
        }
    },

    async resendVerification(email: string) {
        try {
            const response = await axiosInstance.post<{ message: string }>('/v1/auth/resend-verification', { email });
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new AuthError(error.response?.data?.error || 'Failed to resend verification email');
            }
            throw error;
        }
    },

    async logout() {
        try {
            const response = await axiosInstance.post<{ message: string }>('/v1/auth/logout');
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new AuthError(error.response?.data?.error || 'Logout failed');
            }
            throw error;
        }
    },

    async forgotPassword(data: ForgotPasswordInput) {
        try {
            const response = await axiosInstance.post<{ message: string }>('/v1/auth/forgot-password', data);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new AuthError(error.response?.data?.error || 'Failed to send reset email');
            }
            throw error;
        }
    },

    async resetPassword(data: ResetPasswordInput) {
        try {
            const response = await axiosInstance.post<{ message: string }>('/v1/auth/reset-password', data);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new AuthError(error.response?.data?.error || 'Password reset failed');
            }
            throw error;
        }
    },

    async verifyEmail(token: string) {
        try {
            const response = await axiosInstance.get<{ message: string, user: User }>(`/v1/auth/verify-email?token=${token}`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new AuthError(error.response?.data?.error || 'Email verification failed');
            }
            throw error;
        }
    },

    async refreshToken() {
        try {
            const response = await axiosInstance.post<{ message: string }>('/v1/auth/refresh');
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new AuthError(error.response?.data?.error || 'Token refresh failed');
            }
            throw error;
        }
    },

    async getCurrentUser() {
        try {
            const response = await axiosInstance.get<User>('/v1/auth/me');
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new AuthError(error.response?.data?.error || 'Failed to fetch user');
            }
            throw error;
        }
    },
};