'use client';

import { useAuthStore } from "@/lib/auth/store";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useProtectedRoute = () => {
    const router = useRouter();
    const { user, isLoading } = useAuthStore();
    const { status } = useOnboardingStore();
  
    useEffect(() => {
      if (!isLoading) {
        // Unauthenticated users
        if (!user) {
          router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
          return;
        }
  
        // Onboarding checks
        if (!user.hasCompletedOnboarding) {
          const allowedRoutes = ['/auth/onboarding', '/auth/logout'];
          if (!allowedRoutes.some(route => window.location.pathname.startsWith(route))) {
            router.push('/auth/onboarding');
          }
        }
      }
    }, [user, isLoading, router, status]);
  };