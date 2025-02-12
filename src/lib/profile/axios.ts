// /lib/profile/axios.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { getAccessToken } from '../auth/utils'; //  get token (localStorage, etc.)

const baseURL = '/api/v1'; //  API base URL

const axiosConfig: AxiosRequestConfig = {
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
};

const profileAxiosInstance: AxiosInstance = axios.create(axiosConfig);

// Request Interceptor to add the auth token
profileAxiosInstance.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response Interceptor (optional, for global error handling, refreshing tokens)
profileAxiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // Could add token refresh logic here if needed.
        return Promise.reject(error);  //  handled in the API service
    }
);

export default profileAxiosInstance;