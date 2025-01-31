export const trackEvent = (eventName: string, metadata: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, metadata);
  }
  console.log('Analytics Event:', eventName, metadata);
};