// @/contexts/AuthContext.tsx
'use client';

import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import { User, UserRole, UserStatus } from '@/lib/user/types';
import { useRouter } from 'next/router';

// Authentication Context Interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  setActiveRole: (role: UserRole) => void;
}

// Create the context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  setActiveRole: () => {}
});

// Auth Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from local storage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user', error);
      }
    }
  }, []);

  // Login method
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout method
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Optionally: clear other storage, redirect to login, etc.
  };

  // Update user method
  const updateUser = (updatedUser: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    }
  };

  // Set active role method
  const setActiveRole = (role: UserRole) => {
    if (user && user.roles.includes(role)) {
      updateUser({ activeRole: role });
    }
  };

  // Computed properties
  const isAuthenticated = !!user && user.status === 'active';

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        login, 
        logout, 
        updateUser, 
        setActiveRole 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Protected Route Component
export const ProtectedRoute: React.FC<{ 
  children: ReactNode, 
  allowedRoles?: UserRole[], 
  requiredStatus?: UserStatus[] 
}> = ({ 
  children, 
  allowedRoles, 
  requiredStatus = ['active'] 
}) => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter(); // Assuming Next.js router

  useEffect(() => {
    // Not authenticated
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Check role restrictions
    if (allowedRoles && user) {
      const hasAllowedRole = allowedRoles.some(role => 
        user.roles.includes(role)
      );
      
      if (!hasAllowedRole) {
        router.push('/unauthorized');
        return;
      }
    }

    // Check status restrictions
    if (requiredStatus && !requiredStatus.includes(user.status)) {
      router.push('/account-suspended');
      return;
    }
  }, [user, isAuthenticated, allowedRoles, requiredStatus]);

  return isAuthenticated ? <>{children}</> : null;
};

// Navigation Utility Function
export const getNavigation = (user: User | null) => {
  if (!user) {
    return {
      mainNav: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' },
      ],
      authNav: [
        { label: 'Login', href: '/auth/login' },
        { label: 'Register', href: '/auth/register' }
      ]
    };
  }

  // Role-based navigation
  const navigationByRole: Record<UserRole, { mainNav: any[], secondaryNav: any[] }> = {
    'admin': {
      mainNav: [
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Users', href: '/admin/users' },
        { label: 'Projects', href: '/projects' }
      ],
      secondaryNav: [
        { label: 'System Settings', href: '/admin/settings' }
      ]
    },
    'actor': {
      mainNav: [
        { label: 'My Projects', href: '/projects' },
        { label: 'Auditions', href: '/auditions' }
      ],
      secondaryNav: [
        { label: 'Profile', href: '/profile' }
      ]
    },
    // Add more role-specific navigations
    'producer': {
      mainNav: [
        { label: 'Projects', href: '/projects' },
        { label: 'Talent', href: '/talent' }
      ],
      secondaryNav: [
        { label: 'Dashboard', href: '/dashboard' }
      ]
    },
    // Default fallback for other roles
    'project-owner': {
      mainNav: [
        { label: 'My Projects', href: '/projects' }
      ],
      secondaryNav: []
    },
    // Add other roles as needed
    'volunteer': {
      mainNav: [
        { label: 'Opportunities', href: '/opportunities' }
      ],
      secondaryNav: []
    },
    crew: {
      mainNav: [],
      secondaryNav: []
    },
    vendor: {
      mainNav: [],
      secondaryNav: []
    },
    ngo: {
      mainNav: [],
      secondaryNav: []
    },
    beneficiary: {
      mainNav: [],
      secondaryNav: []
    },
    donor: {
      mainNav: [],
      secondaryNav: []
    },
    partner: {
      mainNav: [],
      secondaryNav: []
    },
    seller: {
      mainNav: [],
      secondaryNav: []
    },
    employee: {
      mainNav: [],
      secondaryNav: []
    }
  };

  // Default navigation if role not found
  const activeRole = user.activeRole || user.roles[0];
  return navigationByRole[activeRole] || {
    mainNav: [{ label: 'Dashboard', href: '/dashboard' }],
    secondaryNav: []
  };
};


// // src/contexts/AuthContext.tsx
// 'use client'
// import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
// import { useRouter } from 'next/navigation';
// import { AuthService, User } from '@/lib/auth-service'; // Import User

// interface AuthContextProps {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   login: (data: any) => Promise<void>;
//   register: (data: any) => Promise<void>;
//   logout: () => Promise<void>;
//   loading: boolean;
// }

// const AuthContext = createContext<AuthContextProps>({
//   user: null,
//   token: null,
//   isAuthenticated: false,
//   login: async () => {},
//   register: async () => {},
//   logout: async () => {},
//   loading: true,
// });

// interface AuthProviderProps {
//     children: ReactNode
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const verifyToken = async () => {
//       const storedToken = localStorage.getItem('token');
//       if (storedToken) {
//         try {
//           const { user } = await AuthService.verify(storedToken); // Verify token
//           setUser(user);
//           setToken(storedToken);
//           setIsAuthenticated(true);
//         } catch (error) {
//           // If verification fails, remove the token and treat as unauthenticated
//           localStorage.removeItem('token');
//           console.error("Token verification failed:", error);
//         }
//       }
//       setLoading(false);
//     };

//     verifyToken();
//   }, []);


//   const login = async (data: any) => {
//     try {
//       const { user, message } = await AuthService.login(data.email, data.password);
//       setUser(user);
//       setToken(token);
//       setIsAuthenticated(true);
//       localStorage.setItem('token', token);
//       router.push('/dashboard');
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   };

//   const register = async (data: any) => {
//     try {
//       //Remove ip
//       const { message, user_id } = await AuthService.signUp(
//         { email: data.email, password: data.password },
//         { first: data.firstName, last: data.lastName },
//       );
//       setUser(user);
//       setToken(token);
//       setIsAuthenticated(true);
//       localStorage.setItem('token', token);
//       router.push('/dashboard');
//     } catch (error) {
//       console.error('Registration error:', error);
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try{
//         await AuthService.logout() //call the logout function
//         setUser(null);
//         setToken(null);
//         setIsAuthenticated(false);
//         localStorage.removeItem('token');
//         router.push('/login'); // Redirect to login page

//     }catch(error){
//         console.error("Logout error", error)
//         throw error;
//     }

//   };


//   return (
//     <AuthContext.Provider value={{ user, token, isAuthenticated, login, register, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Correctly export useAuth *outside* the component
// export const useAuth = () => useContext(AuthContext);

// export default AuthContext;