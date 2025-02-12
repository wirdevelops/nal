// @/lib/user/axios.ts

import axios, { AxiosInstance, AxiosError } from 'axios';
import { toast } from 'react-toastify'; // Or your preferred notification library

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'; // Adjust as needed

const apiInstance: AxiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for sending cookies
});

// Request Interceptor (add Authorization header)
apiInstance.interceptors.request.use(
    (config) => {
        // Get the token from wherever you store it (localStorage, cookies, etc.)
        const token = localStorage.getItem('accessToken'); // Example - adjust as needed
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor (handle errors globally)
apiInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Server Error:", error.response.status, error.response.data);
            if(error.response.status === 400){
              toast.error("Invalid data")
            } else if (error.response.status === 401) {
                // Handle unauthorized access (e.g., redirect to login)
                toast.error("Unauthorized: Please log in.");
                // Consider redirecting to login:  window.location.href = '/login';
            } else if (error.response.status === 403) {
               toast.error("Forbidden: You don't have access");
            } else if(error.response.status === 404){
               toast.error("Resource not found");
            }
             else {
                toast.error("An unexpected error occurred.");
            }

        } else if (error.request) {
            // The request was made but no response was received
            console.error("Network Error:", error.request);
            toast.error("Network error.  Please check your connection.");
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Request Error:", error.message);
            toast.error("An error occurred while processing your request.");
        }
        return Promise.reject(error);
    }
);

export default apiInstance;