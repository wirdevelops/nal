// src/global.d.ts
declare global {
    interface Window {
      gtag: (
        event: string,
        measurementId: string,
        config: { page_path: string }
      ) => void;
    }
  }
  
  export {};