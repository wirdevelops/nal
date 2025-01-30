'use client';

import * as React from "react";
import { createContext, useContext } from 'react';
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes"; // Corrected import path for next-themes v0.2.x


// Create the theme context
type ThemeContextType = {
  theme: string | null;
  setTheme: (theme: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            {...props}
        >
            <ThemeContext.Provider value={{ theme: null, setTheme: () => { } }}>
              {children}
            </ThemeContext.Provider>
        </NextThemesProvider>
    );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}