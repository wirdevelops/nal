// src/lib/axios.ts
import axios from 'axios';
import { useAuthStore } from '@/lib/auth/store';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true
});

// Add request interceptor for auth headers
api.interceptors.request.use(config => {
  const { user } = useAuthStore.getState();
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Add response interceptor for onboarding-specific errors
api.interceptors.response.use(response => response, error => {
  if (error.response?.data?.code === 'ONBOARDING_REQUIRED') {
    window.location.href = '/onboarding';
  }
  return Promise.reject(error);
});

export default api;