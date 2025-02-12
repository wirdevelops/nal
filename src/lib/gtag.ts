// src/lib/gtag.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url: string) => {
  window.gtag?.('config', GA_TRACKING_ID as string, { // Use optional chaining
    page_path: url,
  });
};