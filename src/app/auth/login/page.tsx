

// app/auth/login/page.tsx
'use client';

import { LoginForm } from "@/components/auth/LoginForm";
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  return (
    <div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Na Level Empire
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Na Level Empire has revolutionized how we manage our film projects."
            </p>
            <footer className="text-sm">Sofia Davis, Independent Filmmaker</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to continue
            </p>
          </div>
          <LoginForm redirect={redirect} />
        </div>
      </div>
    </div>
  );
}

// // app/auth/login/page.tsx
// import { Metadata } from 'next';
// import { LoginForm } from "@/components/auth/LoginForm";
// import Image from "next/image";

// export const metadata: Metadata = {
//   title: 'Login | CineVerse',
//   description: 'Login to your CineVerse account to access your filmmaking projects.',
// };

// export default function LoginPage() {
//   return (
//     <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
//       <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
//         <div className="absolute inset-0 bg-zinc-900" />
//         <div className="relative z-20 flex items-center text-lg font-medium">
//           <Image
//             src="/images/logo.png"
//             alt="CineVerse Logo"
//             width={150}
//             height={40}
//             priority
//           />
//         </div>
//         <div className="relative z-20 mt-auto">
//           <blockquote className="space-y-2">
//             <p className="text-lg">
//               "CineVerse has revolutionized how we manage our film projects."
//             </p>
//             <footer className="text-sm">Sofia Davis, Independent Filmmaker</footer>
//           </blockquote>
//         </div>
//       </div>
//       <div className="lg:p-8">
//         <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
//           <div className="flex flex-col space-y-2 text-center">
//             <h1 className="text-2xl font-semibold tracking-tight">
//               Welcome back
//             </h1>
//             <p className="text-sm text-muted-foreground">
//               Enter your credentials to continue
//             </p>
//           </div>
//           <LoginForm />
//         </div>
//       </div>
//     </div>
//   );
// }

// // app/auth/login/page.tsx
// import { Metadata } from 'next';
// import { LoginForm } from "@/components/auth/LoginForm";
// import Image from "next/image";

// export const generateMetadata = (): Metadata => {
//   return {
//     title: 'Login | CineVerse',
//     description: 'Login to your CineVerse account to access your filmmaking projects.',
//     // Add other metadata as needed (e.g., open graph tags)
//   };
// };

// export default function LoginPage() {
//   return (
//     <div className="container flex h-screen w-screen flex-col items-center justify-center">
//       <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
//         <div className="flex flex-col space-y-2 text-center">
//           <Image
//             src="/logo.svg"  // Make sure you have a logo.svg file
//             alt="Logo"
//             width={48}
//             height={48}
//             className="mx-auto"
//           />
//           <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
//           <p className="text-sm text-muted-foreground">
//             Enter your credentials to continue
//           </p>
//         </div>
//         <LoginForm />
//       </div>
//     </div>
//   );
// }