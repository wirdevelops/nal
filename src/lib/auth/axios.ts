// src/lib/auth/axios.ts
import axios from 'axios';
import { useAuthStore } from './store';

export const axiosInstance = axios.create({
    baseURL: '/api', // This will be proxied to your Go backend
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Modify the response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only retry once and only on 401 errors
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            // Try to refresh the token
            await axiosInstance.post('/v1/auth/refresh'); // Use axiosInstance

            // Retry the original request
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            // Clear auth state and redirect to login
            useAuthStore.getState().clearAuth();
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
            }
            return Promise.reject(refreshError);
        }
    }
);
