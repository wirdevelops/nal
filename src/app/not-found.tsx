import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Home, 
  Search, 
  ArrowLeft, 
  Mail,
  Film,
  HelpCircle,
  LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';

// Quick links for navigation
const quickLinks = [
  {
    title: "Home",
    href: "/",
    icon: Home,
    description: "Return to the homepage"
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Go to your dashboard"
  },
  {
    title: "Features",
    href: "/features",
    icon: Film,
    description: "Explore our features"
  },
  {
    title: "Help Center",
    href: "/help",
    icon: HelpCircle,
    description: "Find answers to common questions"
  }
];

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-8">
        {/* Main Error Message */}
        <div className="text-center space-y-4">
          <div className="text-8xl font-bold text-primary">404</div>
          <h1 className="text-2xl font-semibold">Page Not Found</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. Here are some helpful links:
          </p>
        </div>

        {/* Quick Links Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link href={link.href} key={link.title}>
                <Card className="p-4 hover:shadow-md transition-all flex items-start gap-4 h-full">
                  <div className="rounded-full p-2 bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-medium">{link.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Additional Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/search">
              <Search className="h-4 w-4" />
              Search Site
            </Link>
          </Button>
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/contact">
              <Mail className="h-4 w-4" />
              Contact Support
            </Link>
          </Button>
        </div>

        {/* Support Text */}
        <p className="text-center text-sm text-muted-foreground">
          If you believe this is a mistake, please{' '}
          <Link href="/contact" className="text-primary hover:underline">
            contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
}

// // app/not-found.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import {
//   Film,
//   Clapperboard,
//   Home,
//   Search,
//   Rewind,
//   FastForward,
//   Play,
//   Pause,
// } from 'lucide-react';
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

// export const dynamic = 'force-dynamic';

// export default function NotFound() {
//   const [isMounted, setIsMounted] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [currentFrame, setCurrentFrame] = useState(0);
//   const frames = ["🎬", "📽️", "🎥", "🎦"];

//   useEffect(() => {
//     setIsMounted(true);
//     let interval: NodeJS.Timeout;
    
//     if (isPlaying) {
//       interval = setInterval(() => {
//         setCurrentFrame(prev => (prev + 1) % frames.length);
//       }, 500);
//     }
    
//     return () => clearInterval(interval);
//   }, [isPlaying]);

//   if (!isMounted) return null;

//   return (
//     <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
//       <div className="max-w-2xl w-full space-y-8 text-center">
//         <motion.div
//           initial={{ opacity: 0, y: -50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="relative"
//         >
//           {/* Top film strip */}
//           <div className="absolute inset-x-0 top-0 flex justify-between">
//             {[...Array(8)].map((_, i) => (
//               <div key={i} className="w-4 h-8 bg-primary/20 rounded-sm" />
//             ))}
//           </div>

//           <Card className="relative mt-4">
//             <CardContent className="p-8">
//               <div className="text-9xl font-bold mb-4 font-mono tracking-tighter">
//                 4{frames[currentFrame]}4
//               </div>
//               <CardHeader className="text-2xl font-semibold mb-2 px-0">
//                 Scene Not Found
//               </CardHeader>
//               <p className="text-muted-foreground mb-8">
//                 Looks like this scene didn't make the final cut
//               </p>

//               {/* Playback controls */}
//               <div className="flex justify-center gap-4 mb-8">
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setCurrentFrame((prev) =>
//                     prev === 0 ? frames.length - 1 : prev - 1
//                   )}
//                 >
//                   <Rewind className="w-4 h-4" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setIsPlaying(!isPlaying)}
//                 >
//                   {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setCurrentFrame((prev) =>
//                     (prev + 1) % frames.length
//                   )}
//                 >
//                   <FastForward className="w-4 h-4" />
//                 </Button>
//               </div>

//               {/* Navigation buttons */}
//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <Button asChild>
//                   <Link href="/" className="gap-2">
//                     <Home className="w-4 h-4" />
//                     Back to Home
//                   </Link>
//                 </Button>
//                 <Button variant="outline" asChild>
//                   <Link href="/projects" className="gap-2">
//                     <Film className="w-4 h-4" />
//                     Browse Projects
//                   </Link>
//                 </Button>
//                 <Button variant="ghost" asChild>
//                   <Link href="/search" className="gap-2">
//                     <Search className="w-4 h-4" />
//                     Search Site
//                   </Link>
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Bottom film strip */}
//           <div className="absolute inset-x-0 bottom-0 flex justify-between">
//             {[...Array(8)].map((_, i) => (
//               <div key={i} className="w-4 h-8 bg-primary/20 rounded-sm" />
//             ))}
//           </div>
//         </motion.div>

//         {/* Additional links */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.5 }}
//           className="text-sm text-muted-foreground space-y-2"
//         >
//           <p>While you're here, why not:</p>
//           <div className="flex flex-wrap justify-center gap-4">
//             <Button variant="link" asChild>
//               <Link href="/latest" className="gap-1">
//                 <Clapperboard className="w-3 h-3" />
//                 Check out our latest releases
//               </Link>
//             </Button>
//             <Button variant="link" asChild>
//               <Link href="/behind-scenes" className="gap-1">
//                 <Film className="w-3 h-3" />
//                 Go behind the scenes
//               </Link>
//             </Button>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// // app/not-found.js
// import Link from 'next/link';

// export default function NotFound() {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-4">
//       <h2 className="text-4xl font-bold mb-4">404 - Page Not Found</h2>
//       <p className="text-lg text-gray-600 mb-8">
//         Could not find the requested resource
//       </p>
//       <Link
//         href="/"
//         className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
//       >
//         Return to Homepage
//       </Link>
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import {
//   Film,
//   Clapperboard,
//   Home,
//   Search,
//   Rewind,
//   FastForward,
//   Play,
//   Pause
// } from 'lucide-react';

// const Button = ({ children, onClick, variant, asChild, href, className }: any) => {
//   const baseStyles = 'flex items-center justify-center gap-2 transition-colors';
//   const variantStyles = {
//     outline: 'border border-primary/40 rounded px-4 py-2 hover:bg-accent',
//     ghost: 'hover:bg-accent/20 p-2 rounded',
//     default: 'px-4 py-2 rounded',
//     link: 'underline-offset-4 hover:underline'
//   };

//   if (asChild) {
//     return (
//       <Link href={href} className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
//         {children}
//       </Link>
//     );
//   }

//   return (
//     <button
//       onClick={onClick}
//       className={`${baseStyles} ${variantStyles[variant]} ${className}`}
//     >
//       {children}
//     </button>
//   );
// };

// export default function NotFound() {
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [currentFrame, setCurrentFrame] = useState(0);
//   const frames = ["🎬", "📽️", "🎥", "🎦"];

//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (isPlaying) {
//       interval = setInterval(() => {
//         setCurrentFrame((prev) => (prev + 1) % frames.length);
//       }, 500);
//     }
//     return () => clearInterval(interval);
//   }, [isPlaying]);

//   return (
//     <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
//       <div className="max-w-2xl w-full space-y-8 text-center">
//         <motion.div
//           initial={{ opacity: 0, y: -50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="relative"
//         >
//           {/* Top film strip */}
//           <div className="absolute inset-x-0 top-0 flex justify-between">
//             {[...Array(8)].map((_, i) => (
//               <div key={i} className="w-4 h-8 bg-primary/20 rounded-sm" />
//             ))}
//           </div>

//           {/* Main content */}
//           <div className="border-4 border-primary/20 rounded-lg p-12 mt-4 bg-card">
//             <div className="text-9xl font-bold mb-4 font-mono tracking-tighter">
//               4{frames[currentFrame]}4
//             </div>
//             <h1 className="text-2xl font-semibold mb-2">Scene Not Found</h1>
//             <p className="text-muted-foreground mb-8">
//               Looks like this scene didn't make the final cut
//             </p>

//             {/* Playback controls */}
//             <div className="flex justify-center gap-4 mb-8">
//               <Button
//                 variant="ghost"
//                 onClick={() => setCurrentFrame((prev) =>
//                   prev === 0 ? frames.length - 1 : prev - 1
//                 )}
//               >
//                 <Rewind className="w-4 h-4" />
//               </Button>
//               <Button
//                 variant="ghost"
//                 onClick={() => setIsPlaying(!isPlaying)}
//               >
//                 {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
//               </Button>
//               <Button
//                 variant="ghost"
//                 onClick={() => setCurrentFrame((prev) =>
//                   (prev + 1) % frames.length
//                 )}
//               >
//                 <FastForward className="w-4 h-4" />
//               </Button>
//             </div>

//             {/* Navigation buttons */}
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Button asChild href="/" variant="default" className="px-6">
//                 <div className="flex items-center gap-2">
//                   <Home className="w-4 h-4" />
//                   Back to Home
//                 </div>
//               </Button>
//               <Button asChild href="/projects" variant="outline">
//                 <div className="flex items-center gap-2">
//                   <Film className="w-4 h-4" />
//                   Browse Projects
//                 </div>
//               </Button>
//               <Button asChild href="/search" variant="ghost">
//                 <div className="flex items-center gap-2">
//                   <Search className="w-4 h-4" />
//                   Search Site
//                 </div>
//               </Button>
//             </div>
//           </div>

//           {/* Bottom film strip */}
//           <div className="absolute inset-x-0 bottom-0 flex justify-between">
//             {[...Array(8)].map((_, i) => (
//               <div key={i} className="w-4 h-8 bg-primary/20 rounded-sm" />
//             ))}
//           </div>
//         </motion.div>

//         {/* Additional links */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.5 }}
//           className="text-sm text-muted-foreground space-y-2"
//         >
//           <p>While you're here, why not:</p>
//           <div className="flex flex-wrap justify-center gap-4">
//             <Button asChild href="/latest" variant="link">
//               <div className="flex items-center gap-1">
//                 <Clapperboard className="w-3 h-3" />
//                 Check out our latest releases
//               </div>
//             </Button>
//             <Button asChild href="/behind-scenes" variant="link">
//               <div className="flex items-center gap-1">
//                 <Film className="w-3 h-3" />
//                 Go behind the scenes
//               </div>
//             </Button>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// 'use client';

// import Link from 'next/link';

// export default function NotFound() {

//   return (
//     <div style={{ textAlign: 'center', padding: '2rem' }}>
//       <h1>404 - Not Found</h1>
//       <p>The page you're looking for doesn't exist.</p>
//       <Link href="/" style={{ textDecoration: 'underline' }}>
//         Go back home
//       </Link>
//     </div>
//   );
// }

// 'use client'
// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Button } from "@/components/ui/button";
// import { 
//   Film, 
//   Clapperboard, 
//   Home, 
//   Search, 
//   Rewind, 
//   FastForward,
//   Play,
//   Pause
// } from 'lucide-react';
// import Link from 'next/link';

// export default function NotFound() {
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [currentFrame, setCurrentFrame] = useState(0);
  
//   // Film strip frames - these could be actual images in a production environment
//   const frames = [
//     "🎬", "📽️", "🎥", "🎦"
//   ];

//   // Auto-play animation
//   useEffect(() => {
//     let interval;
//     if (isPlaying) {
//       interval = setInterval(() => {
//         setCurrentFrame((prev) => (prev + 1) % frames.length);
//       }, 500);
//     }
//     return () => clearInterval(interval);
//   }, [isPlaying]);

//   return (
//     <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
//       {/* Main content container */}
//       <div className="max-w-2xl w-full space-y-8 text-center">
//         {/* Animated film strip */}
//         <motion.div
//           initial={{ opacity: 0, y: -50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="relative"
//         >
//           {/* Film strip decoration */}
//           <div className="absolute inset-x-0 top-0 flex justify-between">
//             {[...Array(8)].map((_, i) => (
//               <div 
//                 key={i} 
//                 className="w-4 h-8 bg-primary/20 rounded-sm"
//               />
//             ))}
//           </div>

//           {/* Main 404 display */}
//           <div className="border-4 border-primary/20 rounded-lg p-12 mt-4 bg-card">
//             <div className="text-9xl font-bold mb-4 font-mono tracking-tighter">
//               4{frames[currentFrame]}4
//             </div>
//             <h1 className="text-2xl font-semibold mb-2">
//               Scene Not Found
//             </h1>
//             <p className="text-muted-foreground mb-8">
//               Looks like this scene didn't make the final cut
//             </p>

//             {/* Playback controls */}
//             <div className="flex justify-center gap-4 mb-8">
//               <Button 
//                 variant="ghost" 
//                 size="icon"
//                 onClick={() => setCurrentFrame((prev) => 
//                   prev === 0 ? frames.length - 1 : prev - 1
//                 )}
//               >
//                 <Rewind className="w-4 h-4" />
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => setIsPlaying(!isPlaying)}
//               >
//                 {isPlaying ? 
//                   <Pause className="w-4 h-4" /> : 
//                   <Play className="w-4 h-4" />
//                 }
//               </Button>
//               <Button 
//                 variant="ghost" 
//                 size="icon"
//                 onClick={() => setCurrentFrame((prev) => 
//                   (prev + 1) % frames.length
//                 )}
//               >
//                 <FastForward className="w-4 h-4" />
//               </Button>
//             </div>

//             {/* Navigation options */}
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Button asChild className="gap-2">
//                 <Link href="/">
//                   <Home className="w-4 h-4" />
//                   Back to Home
//                 </Link>
//               </Button>
//               <Button variant="outline" asChild className="gap-2">
//                 <Link href="/projects">
//                   <Film className="w-4 h-4" />
//                   Browse Projects
//                 </Link>
//               </Button>
//               <Button variant="ghost" asChild className="gap-2">
//                 <Link href="/search">
//                   <Search className="w-4 h-4" />
//                   Search Site
//                 </Link>
//               </Button>
//             </div>
//           </div>

//           {/* Bottom film strip decoration */}
//           <div className="absolute inset-x-0 bottom-0 flex justify-between">
//             {[...Array(8)].map((_, i) => (
//               <div 
//                 key={i} 
//                 className="w-4 h-8 bg-primary/20 rounded-sm"
//               />
//             ))}
//           </div>
//         </motion.div>

//         {/* Fun suggestions */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.5 }}
//           className="text-sm text-muted-foreground space-y-2"
//         >
//           <p>While you're here, why not:</p>
//           <div className="flex flex-wrap justify-center gap-4">
//             <Button variant="link" asChild className="gap-1">
//               <Link href="/latest">
//                 <Clapperboard className="w-3 h-3" />
//                 Check out our latest releases
//               </Link>
//             </Button>
//             <Button variant="link" asChild className="gap-1">
//               <Link href="/behind-scenes">
//                 <Film className="w-3 h-3" />
//                 Go behind the scenes
//               </Link>
//             </Button>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }