import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Construction, WorkflowIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const UnderConstructioN = () => {
  return (
    <div className="container py-20 flex justify-center items-center">
      <Card className="max-w-xl w-full text-center">
        <CardHeader className="items-center">
          <Construction className="h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-2xl">Page Under Construction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            We're working hard to bring you an amazing new feature. 
            Check back soon or contact our team for more information.
          </p>
          
          <div className="flex justify-center gap-4">
            <Link href="/">
              <Button variant="outline">
                <WorkflowIcon className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Link href="/contact">
              <Button>
                Contact Support
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnderConstructioN;

// // components/under-construction.tsx
// 'use client'

// import { Button } from "@/components/ui/button"
// import { Clock, Mail, Twitter, Github } from 'lucide-react'
// import { useEffect, useState } from 'react'
// import Link from 'next/link'
// import { format, toZonedTime } from 'date-fns-tz'

// export function UnderConstruction() {
//   const [timeLeft, setTimeLeft] = useState({ 
//     days: 0, 
//     hours: 0, 
//     minutes: 0, 
//     seconds: 0,
//     cameroonTime: '',
//     etTime: '',
//     ptTime: ''
//   })

//   // Get next Saturday 8am Cameroon time (WAT - UTC+1)
//   const getNextLaunchDate = () => {
//     const now = new Date()
//     const cameroonTime = toZonedTime(now, 'Africa/Douala')
//     const nextSaturday = new Date(cameroonTime)
    
//     // Set to next Saturday
//     nextSaturday.setDate(cameroonTime.getDate() + (6 - cameroonTime.getDay() + 1) % 7)
//     nextSaturday.setHours(8, 0, 0, 0)
    
//     // If we've already passed Saturday 8am this week, go to next week
//     if (nextSaturday < cameroonTime) {
//       nextSaturday.setDate(nextSaturday.getDate() + 7)
//     }
    
//     return toZonedTime(nextSaturday, 'Africa/Douala')
//   }

//   const [launchDate] = useState(() => getNextLaunchDate())

//   useEffect(() => {
//     const timer = setInterval(() => {
//       const now = new Date()
//       const diff = launchDate.getTime() - now.getTime()

//       if (diff <= 0) {
//         clearInterval(timer)
//         return
//       }

//       const days = Math.floor(diff / (1000 * 60 * 60 * 24))
//       const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
//       const minutes = Math.floor((diff / 1000 / 60) % 60)
//       const seconds = Math.floor((diff / 1000) % 60)

//       setTimeLeft({
//         days,
//         hours,
//         minutes,
//         seconds,
//         cameroonTime: format(launchDate, 'EEE, MMM d, yyyy h:mm a', {
//           timeZone: 'Africa/Douala'
//         }),
//         etTime: format(launchDate, 'EEE, MMM d, yyyy h:mm a', {
//           timeZone: 'America/New_York'
//         }),
//         ptTime: format(launchDate, 'EEE, MMM d, yyyy h:mm a', {
//           timeZone: 'America/Los_Angeles'
//         })
//       })
//     }, 1000)

//     return () => clearInterval(timer)
//   }, [launchDate])

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
//       <div className="max-w-2xl space-y-8">
//         <div className="space-y-4">
//           <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary">
//             <Clock className="h-5 w-5" />
//             <span className="font-medium">Under Construction</span>
//           </div>

//           <h1 className="text-4xl font-bold tracking-tight">
//             Revolutionizing Film Production Collaboration
//           </h1>

//           <p className="text-xl text-muted-foreground">
//             Launching our integrated production platform and NGO marketplace soon!
//           </p>
//         </div>

//         <div className="bg-muted rounded-lg p-6 space-y-6">
//           <div className="space-y-4">
//             <div className="flex justify-center gap-4 flex-wrap">
//               <div className="text-center p-4 rounded-lg bg-background">
//                 <div className="text-2xl font-bold">{timeLeft.days}</div>
//                 <div className="text-sm text-muted-foreground">Days</div>
//               </div>
//               <div className="text-center p-4 rounded-lg bg-background">
//                 <div className="text-2xl font-bold">{timeLeft.hours}</div>
//                 <div className="text-sm text-muted-foreground">Hours</div>
//               </div>
//               <div className="text-center p-4 rounded-lg bg-background">
//                 <div className="text-2xl font-bold">{timeLeft.minutes}</div>
//                 <div className="text-sm text-muted-foreground">Minutes</div>
//               </div>
//               <div className="text-center p-4 rounded-lg bg-background">
//                 <div className="text-2xl font-bold">{timeLeft.seconds}</div>
//                 <div className="text-sm text-muted-foreground">Seconds</div>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <p className="text-sm text-muted-foreground">
//                 Launching at:<br />
//                 <span className="font-medium">{timeLeft.cameroonTime} WAT (Cameroon)</span><br />
//                 {timeLeft.etTime} ET (New York)<br />
//                 {timeLeft.ptTime} PT (Los Angeles)
//               </p>
//             </div>
//           </div>

//           <div className="space-y-4">
//             <p className="text-muted-foreground">
//               Get early access:
//             </p>
            
//             <form className="flex gap-2 max-w-md mx-auto">
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="flex-1 px-4 py-2 rounded-lg border"
//                 required
//               />
//               <Button type="submit" className="gap-2">
//                 <Mail className="h-4 w-4" />
//                 Notify Me
//               </Button>
//             </form>
//           </div>
//         </div>

//         {/* Social links */}
//         <div className="flex justify-center gap-4">
//           <Button variant="outline" size="icon" asChild>
//             <Link href="https://twitter.com/yourhandle" target="_blank">
//               <Twitter className="h-5 w-5" />
//             </Link>
//           </Button>
//           <Button variant="outline" size="icon" asChild>
//             <Link href="https://github.com/yourrepo" target="_blank">
//               <Github className="h-5 w-5" />
//             </Link>
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }

// 'use client'

// import { Button } from "@/components/ui/button"
// import { Clock, Mail, Twitter, Github } from 'lucide-react'
// import UnderConstructionCountdown from "./under-construction-countdown"
// import { useEffect, useState } from 'react'
// import Link from 'next/link'

// export function UnderConstruction() {
//   // Calculate the next Saturday at 8 AM Toronto time
//   const calculateNextSaturday = () => {
//     const now = new Date();
//     const daysUntilSaturday = (6 - now.getDay() + 7) % 7;
//     const nextSaturday = new Date(now);
//     nextSaturday.setDate(now.getDate() + daysUntilSaturday);
//     nextSaturday.setHours(8, 0, 0, 0);
//     return nextSaturday;
//   };

//   const launchTime = calculateNextSaturday();
//   const launchTimeUTC = launchTime.getTime();

//   const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

//   useEffect(() => {
//     const calculateTimeLeft = () => {
//       const now = new Date().getTime();
//       const diff = launchTimeUTC - now;

//       if (diff <= 0) {
//         return { days: 0, hours: 0, minutes: 0, seconds: 0 };
//       }

//       const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//       const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//       const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//       const seconds = Math.floor((diff % (1000 * 60)) / 1000);

//       return { days, hours, minutes, seconds };
//     };

//     const timer = setInterval(() => {
//       setTimeLeft(calculateTimeLeft());
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [launchTimeUTC]);

//   // Format the launch date for display in Toronto time
//   const formatLaunchDate = () => {
//     const options: Intl.DateTimeFormatOptions = {
//       timeZone: 'America/Toronto',
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: 'numeric',
//       minute: 'numeric',
//       timeZoneName: 'short'
//     };
//     return launchTime.toLocaleDateString('en-CA', options);
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
//       <div className="max-w-2xl space-y-8">
//         <div className="space-y-4">
//           <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary">
//             <Clock className="h-5 w-5" />
//             <span className="font-medium">Under Construction</span>
//           </div>

//           <h1 className="text-4xl font-bold tracking-tight">
//             Crafting Something Amazing for Filmmakers
//           </h1>

//           <p className="text-xl text-muted-foreground">
//             We're building a revolutionary platform for film production collaboration. Stay tuned!
//           </p>
//         </div>

//         <div className="bg-muted rounded-lg p-6 space-y-4">
//           <UnderConstructionCountdown />

//           <div className="space-y-4">
//             <p className="text-muted-foreground">Get notified when we launch:</p>
//             <form className="flex gap-2 max-w-md mx-auto">
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="flex-1 px-4 py-2 rounded-lg border"
//                 required
//               />
//               <Button type="submit" className="gap-2">
//                 <Mail className="h-4 w-4" />
//                 Notify Me
//               </Button>
//             </form>
//           </div>
//         </div>

//         <p className="text-sm text-muted-foreground">
//           Launching on: {formatLaunchDate()} (Toronto Time)
//         </p>

//         <div className="flex justify-center gap-4">
//           <Button variant="outline" size="icon" asChild>
//             <Link href="https://twitter.com/yourhandle" target="_blank">
//               <Twitter className="h-5 w-5" />
//             </Link>
//           </Button>
//           <Button variant="outline" size="icon" asChild>
//             <Link href="https://github.com/yourrepo" target="_blank">
//               <Github className="h-5 w-5" />
//             </Link>
//           </Button>
//         </div>

//         <div className="flex justify-center gap-4 pt-8 border-t border-muted">
//           <Button variant="ghost" disabled>
//             NGO Hub
//           </Button>
//           <Button variant="ghost" disabled>
//             Production Marketplace
//           </Button>
//           <Button variant="ghost" disabled>
//             Video Library
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
// 'use client';
// import React from 'react';
// import { ArrowRight, Construction } from 'lucide-react';
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";

// const UnderConstruction: React.FC = () => {
//   const handleContactUs = () => {
//     window.open(`https://wa.me/14375513155?text=${encodeURIComponent('Hello, I\'m interested in your film/video production platform.')}`, '_blank');
//   };

//   const handleFollowUpdates = () => {
//     window.open('https://twitter.com/your_platform', '_blank');
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-muted p-4">
//       <Card className="max-w-md w-full p-8 text-center space-y-6">
//         <div className="flex justify-center">
//           <Construction className="h-16 w-16 text-primary" />
//         </div>
//         <h1 className="text-3xl font-bold">Coming Soon</h1>
//         <p className="text-muted-foreground">
//           We're working hard to bring you an amazing film and video production platform. 
//           Stay tuned for exciting updates!
//         </p>
//         <div className="flex justify-center space-x-4">
//           <Button 
//             variant="default" 
//             onClick={handleContactUs}
//           >
//             Contact Us
//             <ArrowRight className="ml-2 h-4 w-4" />
//           </Button>
//           <Button 
//             variant="outline"
//             onClick={handleFollowUpdates}
//           >
//             Follow Updates
//           </Button>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default UnderConstruction;

// // components/under-construction.tsx
// 'use client'

// import { Button } from "@/components/ui/button"
// import { Clock, Mail, Twitter, Github } from 'lucide-react'
// import { useEffect, useState } from 'react'
// import Link from 'next/link'

// export function UnderConstruction() {
//   // Set the launch date/time in UTC (Saturday, Dec 31, 2024, 7:00 AM UTC)
//   const launchTimeUTC = Date.UTC(2024, 11, 31, 7, 0, 0);
//   const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

//   useEffect(() => {
//     const calculateTimeLeft = () => {
//       const now = new Date().getTime();
//       const diff = launchTimeUTC - now;

//       if (diff <= 0) {
//         return { days: 0, hours: 0, minutes: 0, seconds: 0 };
//       }

//       const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//       const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//       const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//       const seconds = Math.floor((diff % (1000 * 60)) / 1000);

//       return { days, hours, minutes, seconds };
//     };

//     const timer = setInterval(() => {
//       setTimeLeft(calculateTimeLeft());
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [launchTimeUTC]);

//   // Format the launch date for display in Toronto time
//   const formatLaunchDate = () => {
//     const launchDate = new Date(launchTimeUTC);
//     const options: Intl.DateTimeFormatOptions = {
//       timeZone: 'America/Toronto',
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: 'numeric',
//       minute: 'numeric',
//       timeZoneName: 'short'
//     };
//     return launchDate.toLocaleDateString('en-CA', options);
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
//       <div className="max-w-2xl space-y-8">
//         <div className="space-y-4">
//           <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary">
//             <Clock className="h-5 w-5" />
//             <span className="font-medium">Under Construction</span>
//           </div>

//           <h1 className="text-4xl font-bold tracking-tight">
//             Crafting Something Amazing for Filmmakers
//           </h1>

//           <p className="text-xl text-muted-foreground">
//             We're building a revolutionary platform for film production collaboration. Stay tuned!
//           </p>
//         </div>

//         <div className="bg-muted rounded-lg p-6 space-y-4">
//           <div className="flex justify-center gap-4">
//             <div className="text-center p-4 rounded-lg bg-background w-24">
//               <div className="text-2xl font-bold">{String(timeLeft.days).padStart(2, '0')}</div>
//               <div className="text-sm text-muted-foreground">Days</div>
//             </div>
//             <div className="text-center p-4 rounded-lg bg-background w-24">
//               <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
//               <div className="text-sm text-muted-foreground">Hours</div>
//             </div>
//             <div className="text-center p-4 rounded-lg bg-background w-24">
//               <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
//               <div className="text-sm text-muted-foreground">Minutes</div>
//             </div>
//             <div className="text-center p-4 rounded-lg bg-background w-24">
//               <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
//               <div className="text-sm text-muted-foreground">Seconds</div>
//             </div>
//           </div>

//           <div className="space-y-4">
//             <p className="text-muted-foreground">Get notified when we launch:</p>
//             <form className="flex gap-2 max-w-md mx-auto">
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="flex-1 px-4 py-2 rounded-lg border"
//                 required
//               />
//               <Button type="submit" className="gap-2">
//                 <Mail className="h-4 w-4" />
//                 Notify Me
//               </Button>
//             </form>
//           </div>
//         </div>

//         <p className="text-sm text-muted-foreground">
//           Launching on: {formatLaunchDate()} (Toronto Time)
//         </p>

//         <div className="flex justify-center gap-4">
//           <Button variant="outline" size="icon" asChild>
//             <Link href="https://twitter.com/yourhandle" target="_blank">
//               <Twitter className="h-5 w-5" />
//             </Link>
//           </Button>
//           <Button variant="outline" size="icon" asChild>
//             <Link href="https://github.com/yourrepo" target="_blank">
//               <Github className="h-5 w-5" />
//             </Link>
//           </Button>
//         </div>

//         <div className="flex justify-center gap-4 pt-8 border-t border-muted">
//           <Button variant="ghost" disabled>
//             NGO Hub
//           </Button>
//           <Button variant="ghost" disabled>
//             Production Marketplace
//           </Button>
//           <Button variant="ghost" disabled>
//             Video Library
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
