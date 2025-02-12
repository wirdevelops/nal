// src/lib/api.ts
import {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyEmailRequest,
} from '@/types/auth';
import {
    StartOnboardingRequest,
    SetBasicInfoRequest,
    SetRoleDetailsRequest,
    SetVerificationDataRequest,
    CompleteOnboardingRequest,
    GetOnboardingStatusResponse,
} from '@/types/onboarding';
import {
    CreateProfileRequest,
    GetProfileResponse,
    UpdateProfileRequest,
    ListProfilesResponse,
    ProfileFilters,
} from '@/types/profile';
import {
    GetUserResponse,
    UpdateUserRequest,
    UpdateEmailRequest,
} from '@/types/user';
import { VerificationData } from '@/types/onboarding';

// --- Helper Function for API Calls ---

const API_BASE_URL = '/api/v1'; // Consistent base URL

async function apiRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: any,
    customHeaders?: HeadersInit
): Promise<T> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...customHeaders, // Allow custom headers (e.g., for specific auth cases)
    };

    const config: RequestInit = {
        method,
        headers,
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        // Handle HTTP errors (4xx, 5xx)
        let errorData;
        try {
            errorData = await response.json();
        } catch (parseError) {
            // If JSON parsing fails, throw a generic error
            throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }

        // Throw a more specific error with details from the response
        throw new ApiError(response.status, errorData.message || 'Unknown error', errorData);
    }

    // Handle 204 No Content (don't try to parse JSON)
    if (response.status === 204) {
      return null as T; // Use type assertion here, as we know it's a successful "no content"
    }

    // Parse JSON response for successful requests
    return await response.json() as T;
}

// --- Custom Error Class ---

class ApiError extends Error {
    status: number;
    details: any;

    constructor(status: number, message: string, details: any = null) {
        super(message);
        this.status = status;
        this.details = details;
        this.name = 'ApiError'; // Set the name for better error handling
    }
}

// --- Authentication API Calls ---

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/login', 'POST', data);
}

export async function registerUser(data: RegisterRequest): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/register', 'POST', data);
}

export async function logoutUserAPI(): Promise<void> {
   return apiRequest<void>('/auth/logout', 'POST');
}

export async function refreshAccessToken(): Promise<void> {
    return apiRequest<void>('/auth/refresh', 'POST'); // Uses cookies, no data needed
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    return apiRequest<void>('/auth/forgot-password', 'POST', data);
}
export async function resetPassword(data: ResetPasswordRequest): Promise<void> {
    return apiRequest<void>('/auth/reset-password', 'POST', data);
}

export async function verifyEmail(data: VerifyEmailRequest): Promise<void> { //token
    return apiRequest<void>(`/auth/verify-email?token=${data.token}`, 'GET');
}


// --- Onboarding API Calls ---

export async function startOnboarding(data: StartOnboardingRequest): Promise<{ message: string; status: string }> {
    return apiRequest<{ message: string; status: string }>('/onboarding/start', 'POST', data);
}

export async function setBasicInfo(data: SetBasicInfoRequest): Promise<{ message: string; status: string }> {
    return apiRequest<{ message: string; status: string }>('/onboarding/basic-info', 'PUT', data);
}

export async function setRoleDetails(data: SetRoleDetailsRequest): Promise<{ message: string; status: string }> {
    return apiRequest<{ message: string; status: string }>('/onboarding/role-details', 'PUT', data);
}

export async function setVerificationData(data: SetVerificationDataRequest): Promise<{ message: string; status: string }> {
   return apiRequest<{ message: string; status: string }>('/onboarding/verification', 'PUT', data);
}

export async function completeOnboarding(data: CompleteOnboardingRequest): Promise<{message: string}> {
    return apiRequest<{message: string}>('/onboarding/complete', 'POST', data);
}

export async function getOnboardingStatus(): Promise<GetOnboardingStatusResponse> {
    return apiRequest<GetOnboardingStatusResponse>('/onboarding/status', 'GET');
}


// --- Profile API Calls ---

export async function createProfile(data: CreateProfileRequest): Promise<GetProfileResponse> {
    return apiRequest<GetProfileResponse>('/profiles', 'POST', data);
}

export async function getProfileById(profileId: string): Promise<GetProfileResponse> {
    return apiRequest<GetProfileResponse>(`/profiles/${profileId}`, 'GET');
}
export async function getProfilesByUserId(userId: string): Promise<ListProfilesResponse> {
  return apiRequest<ListProfilesResponse>(`/profiles/user/${userId}`, 'GET');
}


export async function updateProfile(profileId: string, data: UpdateProfileRequest): Promise<GetProfileResponse> {
    return apiRequest<GetProfileResponse>(`/profiles/${profileId}`, 'PUT', data);
}

export async function deleteProfile(profileId: string): Promise<void> {
    return apiRequest<void>(`/profiles/${profileId}`, 'DELETE');
}

export async function listProfiles(filters?: ProfileFilters): Promise<ListProfilesResponse> {
    const queryParams = new URLSearchParams();
    if (filters) {
        for (const [key, value] of Object.entries(filters)) {
            if (value !== undefined) { //  handle optional filters correctly
                queryParams.append(key, value.toString());
            }
        }
    }
    return apiRequest<ListProfilesResponse>(`/profiles?${queryParams.toString()}`, 'GET');
}



// --- User API Calls ---

export async function getUserById(userId: string): Promise<GetUserResponse> {
    return apiRequest<GetUserResponse>(`/users/${userId}`, 'GET');
}

export async function updateUser(userId: string, data: UpdateUserRequest): Promise<GetUserResponse> {
    return apiRequest<GetUserResponse>(`/users/${userId}`, 'PUT', data);
}

export async function deleteUser(userId: string): Promise<void> {
    return apiRequest<void>(`/users/${userId}`, 'DELETE');
}

export async function updateEmail(data: UpdateEmailRequest): Promise<void> {
    return apiRequest<void>(`/users/email`, 'PUT', data);
}