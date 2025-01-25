import './globals.css'
import { GeistSans } from 'geist/font/sans'
import { ThemeProvider } from "@/components/theme-provider"
import { StoreProvider } from '@/components/providers/StoreProvider';
import AppProvider from '@/components/providers/AppProvider';
// import { DynamicHeader } from '@/components/layout/DynamicHeader';
import { HeaderWrapper } from '@/components/layout/HeaderWrapper'

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
              <div className="relative min-h-screen">
              <HeaderWrapper />
              <main className="container py-6">
                {children}
              </main>
                <div className="pb-16 md:pb-0" />
                </div>
            </ThemeProvider>
          </AppProvider>
        </StoreProvider>
      </body>
    </html>
  )
}