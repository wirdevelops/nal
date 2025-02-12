// src/app/layout.tsx
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from 'sonner'
import { cn } from '@/lib/utils'
import './globals.css'
import { BaseLayout } from '@/components/layout/BaseLayout'
import { Analytics } from '@/components/shared/Analytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: {
    default: 'Nalevel Empire - Connect, Create, Share',
    template: '%s | Nalevel Empire'
  },
  description: 'A platform for filmmakers, NGOs, and creative communities',
  keywords: ['filmmaking', 'creative', 'NGO', 'marketplace', 'community'],
  authors: [{ name: 'De Dadies' }],
  creator: 'Nalevel Empire',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        'min-h-screen bg-background antialiased',
        inter.className
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <BaseLayout>
            {children}
          </BaseLayout>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

// // app/layout.tsx (TEMPORARY - for debugging ONLY)
// "use client";

// import { Inter } from 'next/font/google';
// import './globals.css';
// import { ThemeProvider } from "@/components/theme-provider"
// import { HeaderWrapper } from '@/components/layout/HeaderWrapper';
// import { Toaster } from 'sonner';
// import { QueryProvider } from '@/providers/query-provider';
// // import { useAuthStore } from '@/lib/auth/store';  // COMMENT OUT
// // import { useEffect } from 'react';              // COMMENT OUT
// import AuthRedirectManager from '@/components/auth/AuthRedirectManager';
// // import { LoadingSpinner } from '@/components/loading-spinner'; // COMMENT OUT

// const inter = Inter({ subsets: ['latin'] });

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   // const { initialize, isLoading, isInitialized } = useAuthStore(); // COMMENT OUT

//   // useEffect(() => {
//   //   if (!isInitialized) {
//   //     initialize();
//   //   }
//   // }, [initialize, isInitialized]); // COMMENT OUT

//   // // Show loading indicator while initializing or loading
//   // if (isLoading || !isInitialized) {
//   //   return (
//   //     <div className="flex items-center justify-center min-h-screen">
//   //       <LoadingSpinner />
//   //     </div>
//   //   );
//   // } // COMMENT OUT

//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={inter.className}>
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="system"
//           enableSystem
//           disableTransitionOnChange>
//             <QueryProvider>
//               <HeaderWrapper />
//               <AuthRedirectManager />
//               <main className="container py-6">
//                 {children}
//               </main>
//               <Toaster />
//             </QueryProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }

// // app/layout.tsx
// "use client";

// import { Inter } from 'next/font/google';
// import './globals.css';
// import { ThemeProvider } from "@/components/theme-provider"
// import { HeaderWrapper } from '@/components/layout/HeaderWrapper';
// import { Toaster } from 'sonner';
// import { QueryProvider } from '@/providers/query-provider';
// import { useAuthInitialize } from '@/lib/auth/hooks'; // Correct import!
// // No need for useEffect anymore
// import AuthRedirectManager from '@/components/auth/AuthRedirectManager';
// import { LoadingSpinner } from '@/components/loading-spinner';
// import { useAuthStore } from '@/lib/auth/store'; // Import useAuthStore

// const inter = Inter({ subsets: ['latin'] });

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   // Use the *correct* custom hook from hooks.ts
//   const { isInitialized } = useAuthInitialize(); // Only need isInitialized

//   // Get isLoading using a selector, for optimal performance
//   const { isLoading } = useAuthStore((state) => ({ isLoading: state.isLoading }));

//   // Show loading indicator while initializing or loading
//   if (isLoading || !isInitialized) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={inter.className}>
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="system"
//           enableSystem
//           disableTransitionOnChange>
//             <QueryProvider>
//               <HeaderWrapper />
//               <AuthRedirectManager />
//               <main className="container py-6">
//                 {children}
//               </main>
//               <Toaster />
//             </QueryProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }
// // app/layout.tsx
// import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
// import './globals.css';
// import { AuthProvider } from '@/contexts/AuthContext';
// import { Toaster } from '@/components/ui/toaster';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'CineVerse', // Default title
//   description: 'Your all-in-one filmmaking platform.',
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <AuthProvider>
//           {children}
//           <Toaster/>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }


// // app/layout.tsx
// 'use client'

// import './globals.css'
// import { GeistSans } from 'geist/font/sans'
// import { ThemeProvider } from "@/components/theme-provider"
// import { StoreProvider } from '@/components/providers/StoreProvider'
// import AppProvider from '@/components/providers/AppProvider'
// //import { HeaderWrapper } from '@/components/layout/HeaderWrapper'
// import { useEffect } from 'react'
// import { initializeAuth } from '@/lib/init-auth'
// import { format, toZonedTime } from 'date-fns-tz'

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   useEffect(() => {
//     initializeAuth()
//   }, [])

//   // Get launch time in Cameroon time
//   const getLaunchTime = () => {
//     const now = new Date()
//     const cameroonTime = toZonedTime(now, 'Africa/Douala')
//     const launchDate = new Date(cameroonTime)
    
//     launchDate.setDate(cameroonTime.getDate() + (6 - cameroonTime.getDay() + 1) % 7)
//     launchDate.setHours(8, 0, 0, 0)
    
//     if (launchDate < cameroonTime) {
//       launchDate.setDate(launchDate.getDate() + 7)
//     }
    
//     return format(launchDate, 'MMM d, yyyy', {
//       timeZone: 'Africa/Douala'
//     })
//   }

//   return (
//     <html lang="en" suppressHydrationWarning className={GeistSans.className}>
//       <head>
//         <link rel="manifest" href="/manifest.json" />
//         <meta name="theme-color" content="#E31837" />
//       </head>
//       <body>
//         <StoreProvider>
//           <AppProvider>
//             <ThemeProvider
//               attribute="class"
//               defaultTheme="system"
//               enableSystem
//               disableTransitionOnChange
//             >
//               {/* Persistent construction banner */}
//               <div className="sticky top-0 z-50 bg-primary text-primary-foreground text-center p-2 text-sm">
//                 🚧 Launching {getLaunchTime()} - Follow our progress 🚧
//               </div>
              
//               <div className="relative min-h-screen">
//                 {/* <HeaderWrapper /> */}
//                 <main className="container py-6">
//                   {children}
//                 </main>
//                 <div className="pb-16 md:pb-0" />
//               </div>
//             </ThemeProvider>
//           </AppProvider>
//         </StoreProvider>
//       </body>
//     </html>
//   )
// }

// // app/layout.tsx
// 'use client'

// import './globals.css'
// import { GeistSans } from 'geist/font/sans'
// import { ThemeProvider } from "@/components/theme-provider"
// //import { StoreProvider } from '@/components/providers/StoreProvider'
// import AppProvider from '@/components/providers/AppProvider'
// //import { HeaderWrapper } from '@/components/layout/HeaderWrapper'

// import { useEffect } from 'react';
// import { initializeAuth } from '@/lib/init-auth';

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) 
// {
//   useEffect(() => {
//     initializeAuth();
//   }, []);

//   return (
//     <html lang="en" suppressHydrationWarning className={GeistSans.className}>
//       <head>
//         <link rel="manifest" href="/manifest.json" />
//         <meta name="theme-color" content="#E31837" />
//       </head>
//       <body>
//         {/* <StoreProvider> */}
//           <AppProvider>
//             <ThemeProvider
//               attribute="class"
//               defaultTheme="system"
//               enableSystem
//               disableTransitionOnChange
//             >
//               <div className="relative min-h-screen">
//                 <div className="bg-primary text-primary-foreground text-center p-2 text-sm">
//                   🚧 Site Under Construction - Launching December 31st, 2024 🚧
//                 </div>
//                 {/* <HeaderWrapper /> */}
//                 <main className="container py-6">
//                   {children}
//                 </main>
//                 <div className="pb-16 md:pb-0" />
//               </div>
//             </ThemeProvider>
//           </AppProvider>
//         {/* </StoreProvider> */}
//       </body>
//     </html>
//   )
// }

// 'use client'

// import './globals.css'
// import { GeistSans } from 'geist/font/sans'
// import { ThemeProvider } from "@/components/theme-provider"
// import { StoreProvider } from '@/components/providers/StoreProvider'
// import AppProvider from '@/components/providers/AppProvider'
// import { HeaderWrapper } from '@/components/layout/HeaderWrapper'

// import { useEffect } from 'react';
// import { initializeAuth } from '@/lib/init-auth';

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) 

// {
//   useEffect(() => {
//     initializeAuth();
//   }, []);

//   return (
//     <html lang="en" suppressHydrationWarning className={GeistSans.className}>
//       <head>
//         <link rel="manifest" href="/manifest.json" />
//         <meta name="theme-color" content="#E31837" />
//       </head>
//       <body>
//         <StoreProvider>
//           <AppProvider>
//             <ThemeProvider
//               attribute="class"
//               defaultTheme="system"
//               enableSystem
//               disableTransitionOnChange
//             >
//               <div className="relative min-h-screen">
//                 <HeaderWrapper />
//                 <main className="container py-6">
//                   {children}
//                 </main>
//                 <div className="pb-16 md:pb-0" />
//               </div>
//             </ThemeProvider>
//           </AppProvider>
//         </StoreProvider>
//       </body>
//     </html>
//   )
// }