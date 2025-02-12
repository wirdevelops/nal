
// src/lib/auth/hooks.ts
'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { authApi } from './api'; // Import the real API
import { useAuthStore } from './store'; // Import YOUR store
import { User } from '@/lib/user/types';
import { LoginCredentials, RegisterCredentials } from './types';
import { LoginResponse } from './validations';
import { useCallback, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthError } from './errors'; // Import AuthError

export function useAuth() {
    const { user, isAuthenticated, isLoading } = useAuthStore();
    return { user, isAuthenticated, isLoading };
}

// Custom hook to handle initialization
export const useAuthInitialize = () => {
    const { setUser, setLoading, clearAuth, isInitialized } = useAuthStore();

    const initialize = useCallback(async () => {
        console.log("initialize() called");
        setLoading(true);

        try {
            console.log("Fetching user data...");
            const user = await authApi.getCurrentUser();
            console.log("Fetch successful", user);
            setUser(user); // This now correctly sets isInitialized
        } catch (error) {
            console.error('Failed to initialize auth:', error);
            clearAuth(); // This now sets isInitialized to true
        } finally {
            console.log("initialize() finished");
            setLoading(false);
        }
    }, [setUser, setLoading, clearAuth]);

    useEffect(() => {
        if (!isInitialized) {
            initialize();
        }
      }, [isInitialized, initialize]);

    return { initialize, isInitialized };
};

export function useLogin() {
    const { setUser } = useAuthStore();
    const router = useRouter();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation<LoginResponse, Error, LoginCredentials>({
        mutationFn: async (credentials) => {
            console.log("Login: Starting login request");
            const response = await authApi.login(credentials);  // Use the real API
            console.log("Login: Received response", response);
            return response;
        },
        onSuccess: (data) => {
            console.log("Login: Success handler running with data:", data);

            if (data.requiresMFA) {
                console.log("Login: MFA required, redirecting");
                router.push('/auth/mfa-verification');
                return;
            }

            if (!data.user) {
                console.error("Login: No user data in response");
                toast({
                    title: 'Login Error',
                    description: 'Invalid response from server',
                    variant: 'destructive',
                });
                return;
            }

            console.log("Login: Setting user in store:", data.user);
            setUser(data.user); // Uses your setUser, correctly handles isInitialized

            queryClient.invalidateQueries({ queryKey: ['user'] });

            if (!data.user.hasCompletedOnboarding) {
                console.log("Login: User needs onboarding, redirecting");
                toast({
                    title: 'Welcome!',
                    description: 'Please complete the onboarding process.',
                });
                router.push('/auth/onboarding');
                return;
            }

            const params = new URLSearchParams(window.location.search);
            const redirect = params.get('redirect') || '/dashboard';
            console.log("Login: Redirecting to:", redirect);

            toast({
                title: 'Welcome back!',
                description: 'You have successfully logged in.',
            });
            router.push(redirect);
        },
        onError: (error: Error) => {
            console.error("Login: Error during login:", error);
            let description = 'An unexpected error occurred.';
            if (error instanceof AuthError) {
                description = error.message;
            }
            toast({
                title: 'Login failed',
                description,
                variant: 'destructive',
            });
        },
    });
}

export function useRequireAuth(redirectTo = '/auth/login') {
    const { user, isAuthenticated, isLoading, isInitialized } = useAuthStore(); // Add isInitialized
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Check isInitialized *before* checking isAuthenticated
        if (!isLoading && isInitialized && !isAuthenticated) {
            router.push(`${redirectTo}?redirect=${encodeURIComponent(pathname)}`);
        }
    }, [isLoading, isAuthenticated, isInitialized, router, redirectTo, pathname]); // Include isInitialized

    return { user, isAuthenticated, isLoading };
}
export function useLogout() {
    const { clearAuth } = useAuthStore();
    const router = useRouter();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            await authApi.logout(); // Use the real API
        },
        onSuccess: () => {
            clearAuth(); // Uses your clearAuth, correctly sets isInitialized
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast({
                title: 'Goodbye!',
                description: 'You have been successfully logged out.',
            });
            router.push('/auth/login');
        },
        onError: (error: Error) => {
            console.error("Logout: Error during logout:", error);
            let description = 'An unexpected error occurred.';
            if (error instanceof AuthError) {
                description = error.message;
            }
            toast({
                title: 'Logout failed',
                description,
                variant: 'destructive',
            });
            clearAuth(); // Ensure auth is cleared even on error, uses your clearAuth
            queryClient.invalidateQueries({ queryKey: ['user'] });
            router.push('/auth/login');
        },
    });
}

export const useVerifyEmail = () => {
    const { toast } = useToast();
    const router = useRouter();
    const { setUser } = useAuthStore();

    return useMutation({
        mutationFn: async (token: string) => {
            const response = await authApi.verifyEmail(token); // Use the real API
            return response;
        },
        onSuccess: (data) => {
            if (data.message === "Email already verified") {
                toast({
                    title: "Already Verified",
                    description: "Your email was already verified. You can now log in.",
                });
            } else {
                toast({
                    title: "Email Verified",
                    description: "Your email has been successfully verified. You can now log in.",
                });
                setUser(data.user); // Uses your setUser
            }
            router.push('/auth/login');
        },
        onError: (error: Error) => {
            console.error('Verification error:', error);
            let description = 'An unexpected error occurred.';
            if (error instanceof AuthError) {
                description = error.message;
            }
            toast({
                title: "Verification Failed",
                description,
                variant: "destructive",
            });
            router.push('/auth/resend-verification');
        },
        retry: false,
    });
};

export function useRegister() {
    const router = useRouter();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (credentials: RegisterCredentials) => {
            const response = await authApi.register(credentials); // Use the real API
            return response;
        },
        onSuccess: (data) => {
            toast({
                title: 'Registration successful!',
                description: 'Please check your email for verification.',
            });
            router.push('/auth/verify-email-sent');
        },
        onError: (error: Error) => {
            console.error('Mutation error:', error);
            let description = 'An unexpected error occurred.';
            if (error instanceof AuthError) {
                description = error.message;
            }
            toast({
                title: 'Registration failed',
                description,
                variant: 'destructive',
            });
        }
    });
}

export const useResendVerification = () => {
    const { toast } = useToast();
    const router = useRouter();

    return useMutation({
        mutationFn: async (email: string) => {
            return await authApi.resendVerification(email); // Use the real API
        },
        onSuccess: () => {
            toast({
                title: "Verification email sent",
                description: "Please check your inbox for the verification link.",
            });
            router.push('/auth/verify-email-sent');
        },
        onError: (error: Error) => {
            let description = 'An unexpected error occurred.';
            if (error instanceof AuthError) {
                description = error.message;
            }
            toast({
                title: "Error",
                description,
                variant: "destructive",
            });
        },
    });
};

export function useForgotPassword() {
    const { toast } = useToast();
    const router = useRouter();

    return useMutation({
        mutationFn: async (data: { email: string }) => {
            return await authApi.forgotPassword(data); // Use the real API
        },
        onSuccess: () => {
            toast({
                title: 'Password Reset Email Sent',
                description: 'If an account with that email exists, a password reset link has been sent.',
            });
            router.push('/auth/login');
        },
        onError: (error: Error) => {
            let description = 'An unexpected error occurred.';
            if (error instanceof AuthError) {
                description = error.message;
            }
            toast({
                title: 'Error',
                description,
                variant: 'destructive',
            });
        },
    });
}

export function useResetPassword() {
    const { toast } = useToast();
    const router = useRouter();
    return useMutation({
        mutationFn: async (data: { token: string, password: string, confirmPassword: string }) => {
            return await authApi.resetPassword(data); // Use the real API
        },
        onSuccess: () => {
            toast({
                title: 'Password Reset Successful',
                description: 'Your password has been successfully reset. You can now log in.',
            });
            router.push('/auth/login');
        },
        onError: (error: Error) => {
            let description = 'An unexpected error occurred.';
            if (error instanceof AuthError) {
                description = error.message;
            }
            toast({
                title: 'Error',
                description,
                variant: "destructive",
            });
        },
    });
}
