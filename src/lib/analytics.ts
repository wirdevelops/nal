// 
export const trackEvent = (eventName: string, metadata: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, metadata);
    }
    console.log('Analytics Event:', eventName, metadata);
  };
  
