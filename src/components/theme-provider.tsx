"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { Attribute } from "next-themes";

type ThemeProviderProps = {
  children: React.ReactNode;
  attribute?: Attribute | Attribute[]; //Change the type
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}