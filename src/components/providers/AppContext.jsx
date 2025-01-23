// src/components/providers/AppContext.jsx
import React, { createContext, useContext, useState } from 'react';

// Create a context
const AppContext = createContext(null);

// Custom hook to consume context
const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within a AppProvider');
  }
  return context;
};

export { AppContext, useAppContext };