// config/navigation.ts
export const HIDDEN_HEADER_PATHS = [
    /^\/auth\/.*/,
    /^\/projects\/[^/]+/,
    /^\/onboarding\/.*/,
    /^\/verify-email/,
  ] as const