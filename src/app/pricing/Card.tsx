// 'use client';

// import { motion } from 'framer-motion';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
// import { cn } from '@/lib/utils';

// interface Plan {
//   name: string;
//   price: number;
//   description: string;
//   features: string[];
//   limitations: string[];
//   cta: string;
//   popular: boolean;
// }

// interface PricingCardsProps {
//   billingCycle: 'monthly' | 'annual';
//   plans: Plan[];
// }

// export function PricingCards({ billingCycle, plans }: PricingCardsProps) {
//   return (
//     <div className="grid md:grid-cols-3 gap-8">
//       {plans.map((plan, index) => (
//         <motion.div
//           key={plan.name}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: index * 0.1 }}
//         >
//           <Card className={cn(
//             "relative h-full hover:shadow-lg transition-all duration-300",
//             plan.popular && "border-primary shadow-lg"
//           )}>
//             {plan.popular && (
//               <Badge 
//                 className="absolute -top-2 right-4"
//                 variant="default"
//               >
//                 Most Popular
//               </Badge>
//             )}
            
//             <CardHeader>
//               <CardTitle>
//                 <div className="space-y-2">
//                   <h3 className="text-2xl font-bold">{plan.name}</h3>
//                   <div className="text-3xl font-bold">
//                     ${plan.price}
//                     <span className="text-lg text-muted-foreground font-normal">
//                       /{billingCycle === 'monthly' ? 'mo' : 'mo annually'}
//                     </span>
//                   </div>
//                 </div>
//               </CardTitle>
//               <p className="text-sm text-muted-foreground">{plan.description}</p>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 {plan.features.map((feature) => (
//                   <div key={feature} className="flex items-center gap-2">
//                     <CheckCircle2 className="w-4 h-4 text-primary" />
//                     <span className="text-sm">{feature}</span>
//                   </div>
//                 ))}
//                 {plan.limitations.map((limitation) => (
//                   <div key={limitation} className="flex items-center gap-2">
//                     <XCircle className="w-4 h-4 text-muted-foreground" />
//                     <span className="text-sm text-muted-foreground">{limitation}</span>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//             <CardFooter>
//               <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
//                 {plan.cta}
//                 <ArrowRight className="w-4 h-4 ml-2" />
//               </Button>
//             </CardFooter>
//           </Card>
//         </motion.div>
//       ))}
//     </div>
//   );
// }