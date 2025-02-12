// // src/utils/auth.ts
// import { cookies } from 'next/headers';
// import { jwtDecode } from 'jwt-decode'; // Corrected import
// import { User } from '@/types/user';
// import { redirect } from 'next/navigation';

// interface DecodedToken {
//   userId: string;
//   roles: string[];
//   exp: number; // Expiration timestamp
//   // Add other claims *if needed and used*, but keep it minimal
// }

// /**
//  * Gets the current user from the access token cookie.
//  * This function *only* decodes the token to get the user ID and roles.
//  * It does *not* perform authentication; the server handles that.
//  *
//  * @returns The user object if a valid token is found, otherwise null.
//  */
// export async function getCurrentUser(): Promise<Pick<User, 'id' | 'roles' | 'onboardingStatus'> | null> {
//   const cookieStore = cookies();
//   const accessToken = cookieStore.get('accessToken')?.value;

//   if (!accessToken) {
//     return null;
//   }

//   try {
//     const decoded = jwtDecode<DecodedToken>(accessToken);

//     // Check for token expiration (important!)
//     if (Date.now() >= decoded.exp * 1000) {
//       console.warn('Access token has expired.'); // Log for debugging
//       return null; // Treat expired tokens as no user
//     }

//     return {
//       id: decoded.userId,
//       roles: decoded.roles,
//       onboardingStatus: decoded.onboardingStatus, // Include the onboarding status
//     };
//   } catch (error) {
//     console.error('Error decoding access token:', error);
//     return null; // Invalid token
//   }
// }

// /**
//  * Redirects to the login page if the user is not authenticated.
//  * @param pathname Optional pathname to redirect to after login.
//  */

// export function requireAuth(pathname?: string): void {
//     const user =  getCurrentUser();

//     if (!user) {
//       const redirectUrl = pathname ? `/login?redirect=${pathname}`: '/login';
//       redirect(redirectUrl);
//     }
// }
// /**
//  *  Checks if a user has a specific role
//  * @roles roles to check
//  * returns boolean
//  */

// export function hasRoles(roles: string[]): boolean {
//     const user =  getCurrentUser();
//     if (!user) return false;

//     return user.roles.some(userRole => roles.includes(userRole))
// }

// /**
//  * Redirect to give path,
//  * @path to redirect to
//  */
// export function redirectTo(path: string): void {
//     redirect(path)
// }