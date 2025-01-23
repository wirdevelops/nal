'use client';

import React, { useRef, useEffect, PropsWithChildren } from 'react';
import { useProjectStore } from '@/stores/useProjectStore';

interface StoreProviderProps extends PropsWithChildren {}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const initialized = useRef(false);
  const { persist } = useProjectStore;

  useEffect(() => {
    if (!initialized.current && persist) {
      persist.rehydrate();
      initialized.current = true;
    }
  }, [persist]);


  return <>{children}</>;
};