// types/env.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
      RESEND_API_KEY: string;
      NEXT_PUBLIC_APP_URL: string;
      UPSTASH_REDIS_REST_URL: string;
      UPSTASH_REDIS_REST_TOKEN: string;
      JWT_SECRET: string;
      EMAIL_FROM: string;
      NODE_ENV: 'development' | 'production';
    }
  }