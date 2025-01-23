// src/components/providers/AppProvider.jsx
'use client'
import React, { useState, useEffect } from 'react';
import { AppContext } from './AppContext';
import { useLayoutStore } from '@/stores/useLayoutStore'; 

const AppProvider = ({ children }) => {
  const { globalLayout, sectionLayouts } = useLayoutStore();
  const [appState, setAppState] = useState({
    theme: 'light', // Default theme (can use zustand for this)
    user: null, // Current user (can use zustand for this)
    layout: null, // The active layout (global or section), will be updated in the useEffect
    layoutSettings: {}, // Layout specific settings
    data: null // Application data
  });

  // Set active layout on mount and layout preference change
  useEffect(() => {
     setAppState(prev => ({
       ...prev,
      layout: sectionLayouts[Object.keys(sectionLayouts)[0]] || globalLayout
    }));
  }, [globalLayout, sectionLayouts]);

   // Provide update methods
   const updateAppState = (newState) => {
     setAppState((prev) => ({ ...prev, ...newState }));
   };

  return (
    <AppContext.Provider value={{
      ...appState,
      updateAppState
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;