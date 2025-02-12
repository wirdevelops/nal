// src/app/dashboard/layout.tsx
'use client';
import { useAuthGuard } from '@/middleware/auth';

export default function DashboardLayout() {
  useAuthGuard(true); // Requires full authentication and onboarding
  // ... layout content
}