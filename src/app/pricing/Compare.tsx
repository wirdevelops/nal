// 'use client';

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
// import React from "react";

// interface Feature {
//   name: string;
//   starter: string | boolean;
//   professional: string | boolean;
//   enterprise: string | boolean;
// }

// interface FeatureCategory {
//   [key: string]: Feature[];
// }

// interface FeatureComparisonProps {
//   features: FeatureCategory;
// }

// export function FeatureComparison({ features }: FeatureComparisonProps) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Feature Comparison</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Feature</TableHead>
//               <TableHead>Starter</TableHead>
//               <TableHead>Professional</TableHead>
//               <TableHead>Enterprise</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {Object.entries(features).map(([category, categoryFeatures]) => (
//               <React.Fragment key={category}>
//                 <TableRow className="bg-muted/50">
//                   <TableCell colSpan={4} className="font-medium capitalize">
//                     {category}
//                   </TableCell>
//                 </TableRow>
//                 {categoryFeatures.map((feature) => (
//                   <TableRow key={feature.name}>
//                     <TableCell className="font-medium">
//                       <div className="flex items-center gap-2">
//                         {feature.name}
//                         <TooltipProvider>
//                           <Tooltip>
//                             <TooltipTrigger>
//                               <HelpCircle className="w-4 h-4 text-muted-foreground" />
//                             </TooltipTrigger>
//                             <TooltipContent>
//                               <p>Details about {feature.name}</p>
//                             </TooltipContent>
//                           </Tooltip>
//                         </TooltipProvider>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       {typeof feature.starter === 'boolean' ? (
//                         feature.starter ? (
//                           <CheckCircle2 className="w-4 h-4 text-primary" />
//                         ) : (
//                           <XCircle className="w-4 h-4 text-muted-foreground" />
//                         )
//                       ) : (
//                         feature.starter
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       {typeof feature.professional === 'boolean' ? (
//                         feature.professional ? (
//                           <CheckCircle2 className="w-4 h-4 text-primary" />
//                         ) : (
//                           <XCircle className="w-4 h-4 text-muted-foreground" />
//                         )
//                       ) : (
//                         feature.professional
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       {typeof feature.enterprise === 'boolean' ? (
//                         feature.enterprise ? (
//                           <CheckCircle2 className="w-4 h-4 text-primary" />
//                         ) : (
//                           <XCircle className="w-4 h-4 text-muted-foreground" />
//                         )
//                       ) : (
//                         feature.enterprise
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </React.Fragment>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// }