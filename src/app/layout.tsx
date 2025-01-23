//layout.tsx
import './globals.css'
import { GeistSans } from 'geist/font/sans'
import { ThemeProvider } from "@/components/theme-provider"
import {StoreProvider} from '@/components/providers/StoreProvider';
import AppProvider from '@/components/providers/AppProvider';

export const metadata = {
  title: 'Nalevel Empire',
  description: 'Modern filmmaking and TV series management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={GeistSans.className}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#E31837" />
      </head>
      <body>
      <StoreProvider>
      <AppProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </AppProvider>
        </StoreProvider>
      </body>
    </html>
  )
}