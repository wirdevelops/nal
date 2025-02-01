// 'use client';
// import { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useToast } from "@/components/ui/use-toast";
// import {
//   Film,
//   Users,
//   BarChart,
//   Shield,
//   Cloud,
//   Zap,
//   Lock,
//   GitBranch,
//   Globe,
//   MessageSquare,
//   Calendar,
//   FileText,
//   ArrowRight,
//   Play,
//   Download,
//   Check
// } from 'lucide-react';

// // Feature categories and their details
// const featureCategories = [
//   {
//     id: "production",
//     title: "Production Tools",
//     description: "Complete suite of tools for managing your production workflow",
//     icon: Film,
//     features: [
//       {
//         title: "Project Management",
//         description: "Comprehensive project tracking and management",
//         details: [
//           "Gantt charts and timeline views",
//           "Resource allocation",
//           "Budget tracking",
//           "Task dependencies",
//           "Milestone management"
//         ]
//       },
//       {
//         title: "Asset Management",
//         description: "Centralized asset organization and version control",
//         details: [
//           "Version history",
//           "Asset categorization",
//           "Quick preview",
//           "Metadata management",
//           "File sharing controls"
//         ]
//       },
//       {
//         title: "Scheduling",
//         description: "Advanced scheduling and calendar management",
//         details: [
//           "Team availability tracking",
//           "Automated scheduling",
//           "Conflict detection",
//           "Resource booking",
//           "Calendar integration"
//         ]
//       }
//     ]
//   },
//   {
//     id: "collaboration",
//     title: "Collaboration",
//     description: "Tools for seamless team collaboration",
//     icon: Users,
//     features: [
//       {
//         title: "Real-time Editing",
//         description: "Collaborate on projects in real-time",
//         details: [
//           "Live document editing",
//           "Change tracking",
//           "Comments and annotations",
//           "Review workflows",
//           "Version comparison"
//         ]
//       },
//       {
//         title: "Team Communication",
//         description: "Integrated communication tools",
//         details: [
//           "Team chat",
//           "Video conferencing",
//           "File sharing",
//           "Thread discussions",
//           "@mentions"
//         ]
//       },
//       {
//         title: "Workflows",
//         description: "Customizable workflow management",
//         details: [
//           "Approval processes",
//           "Task automation",
//           "Status tracking",
//           "Role-based access",
//           "Audit trails"
//         ]
//       }
//     ]
//   },
//   {
//     id: "analytics",
//     title: "Analytics",
//     description: "Powerful insights and reporting tools",
//     icon: BarChart,
//     features: [
//       {
//         title: "Performance Tracking",
//         description: "Comprehensive performance metrics",
//         details: [
//           "Project analytics",
//           "Team productivity",
//           "Resource utilization",
//           "Cost analysis",
//           "Time tracking"
//         ]
//       },
//       {
//         title: "Custom Reports",
//         description: "Flexible reporting capabilities",
//         details: [
//           "Report builder",
//           "Data visualization",
//           "Export options",
//           "Scheduled reports",
//           "Dashboard customization"
//         ]
//       },
//       {
//         title: "Insights",
//         description: "AI-powered insights and recommendations",
//         details: [
//           "Trend analysis",
//           "Predictive analytics",
//           "Risk assessment",
//           "Resource optimization",
//           "Performance forecasting"
//         ]
//       }
//     ]
//   },
//   {
//     id: "security",
//     title: "Security",
//     description: "Enterprise-grade security features",
//     icon: Shield,
//     features: [
//       {
//         title: "Access Control",
//         description: "Advanced access management",
//         details: [
//           "Role-based access",
//           "Two-factor authentication",
//           "Single sign-on",
//           "IP restrictions",
//           "Session management"
//         ]
//       },
//       {
//         title: "Data Protection",
//         description: "Comprehensive data security",
//         details: [
//           "End-to-end encryption",
//           "Regular backups",
//           "Data retention policies",
//           "Compliance tools",
//           "Audit logging"
//         ]
//       },
//       {
//         title: "Compliance",
//         description: "Industry standard compliance",
//         details: [
//           "GDPR compliance",
//           "ISO certification",
//           "SOC 2 Type II",
//           "HIPAA compliance",
//           "Custom compliance"
//         ]
//       }
//     ]
//   }
// ];

// // Technical specifications
// const technicalSpecs = {
//   "Cloud Infrastructure": {
//     icon: Cloud,
//     specs: [
//       "AWS/Azure/GCP hosting options",
//       "99.99% uptime SLA",
//       "Global CDN distribution",
//       "Automatic scaling",
//       "Disaster recovery"
//     ]
//   },
//   "Performance": {
//     icon: Zap,
//     specs: [
//       "Sub-second response times",
//       "Real-time updates",
//       "Optimized file handling",
//       "Background processing",
//       "Cache management"
//     ]
//   },
//   "Security": {
//     icon: Lock,
//     specs: [
//       "SOC 2 Type II certified",
//       "End-to-end encryption",
//       "Regular security audits",
//       "Penetration testing",
//       "24/7 monitoring"
//     ]
//   },
//   "Integration": {
//     icon: GitBranch,
//     specs: [
//       "RESTful API",
//       "Webhook support",
//       "OAuth 2.0",
//       "Custom integrations",
//       "API rate limiting"
//     ]
//   }
// };

// // Integration partners
// const integrations = [
//   { name: "Adobe Creative Cloud", category: "Creative Tools" },
//   { name: "Autodesk", category: "3D & Animation" },
//   { name: "Slack", category: "Communication" },
//   { name: "Zoom", category: "Video Conferencing" },
//   { name: "Google Workspace", category: "Productivity" },
//   { name: "Dropbox", category: "Storage" },
//   { name: "Jira", category: "Project Management" },
//   { name: "QuickBooks", category: "Finance" }
// ];

// export default function FeaturesPage() {
//   const [selectedCategory, setSelectedCategory] = useState(featureCategories[0].id);
//   const { toast } = useToast();

//   const handleDemoRequest = () => {
//     toast({
//       title: "Demo Request Received",
//       description: "Our team will contact you to schedule a demo.",
//     });
//   };

//   return (
//     <div className="container py-16 space-y-16">
//       {/* Hero Section */}
//       <div className="text-center space-y-4">
//         <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full">
//           <Badge variant="default">New</Badge>
//           <span className="text-sm font-medium">Enhanced Production Tools</span>
//         </div>
//         <h1 className="text-4xl font-bold">Features that power your creativity</h1>
//         <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//           Everything you need to manage your production workflow from start to finish
//         </p>
//         <div className="flex justify-center gap-4 pt-4">
//           <Button size="lg">
//             Start Free Trial
//             <ArrowRight className="ml-2 h-4 w-4" />
//           </Button>
//           <Dialog>
//             <DialogTrigger asChild>
//               <Button variant="outline" size="lg">
//                 <Play className="mr-2 h-4 w-4" />
//                 Watch Demo
//               </Button>
//             </DialogTrigger>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>Product Demo</DialogTitle>
//                 <DialogDescription>
//                   See our features in action
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
//                 <Play className="h-12 w-12 text-muted-foreground" />
//               </div>
//             </DialogContent>
//           </Dialog>
//         </div>
//       </div>

//       {/* Key Benefits */}
//       <div className="grid md:grid-cols-4 gap-6">
//         {[
//           { icon: Globe, title: "Global Access", description: "Work from anywhere with cloud-based tools" },
//           { icon: MessageSquare, title: "Collaboration", description: "Real-time team collaboration features" },
//           { icon: Calendar, title: "Scheduling", description: "Advanced production scheduling tools" },
//           { icon: FileText, title: "Documentation", description: "Comprehensive project documentation" }
//         ].map((benefit) => {
//           const Icon = benefit.icon;
//           return (
//             <Card key={benefit.title}>
//               <CardContent className="pt-6">
//                 <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
//                   <Icon className="h-6 w-6 text-primary" />
//                 </div>
//                 <h3 className="font-semibold mb-2">{benefit.title}</h3>
//                 <p className="text-sm text-muted-foreground">{benefit.description}</p>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       {/* Feature Categories */}
//       <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
//         <TabsList className="w-full justify-start border-b">
//           {featureCategories.map((category) => (
//             <TabsTrigger key={category.id} value={category.id} className="gap-2">
//               <category.icon className="h-4 w-4" />
//               {category.title}
//             </TabsTrigger>
//           ))}
//         </TabsList>

//         {featureCategories.map((category) => (
//           <TabsContent key={category.id} value={category.id} className="pt-6">
//             <div className="grid lg:grid-cols-3 gap-6">
//               {category.features.map((feature) => (
//                 <Card key={feature.title}>
//                   <CardHeader>
//                     <CardTitle>{feature.title}</CardTitle>
//                     <p className="text-sm text-muted-foreground">{feature.description}</p>
//                   </CardHeader>
//                   <CardContent>
//                     <ul className="space-y-2">
//                       {feature.details.map((detail) => (
//                         <li key={detail} className="flex items-center gap-2 text-sm">
//                           <Check className="h-4 w-4 text-primary" />
//                           {detail}
//                         </li>
//                       ))}
//                     </ul>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </TabsContent>
//         ))}
//       </Tabs>

//       {/* Technical Specifications */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Technical Specifications</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {Object.entries(technicalSpecs).map(([title, { icon: Icon, specs }]) => (
//               <div key={title} className="space-y-4">
//                 <div className="flex items-center gap-2">
//                   <Icon className="h-5 w-5 text-primary" />
//                   <h3 className="font-medium">{title}</h3>
//                 </div>
//                 <ul className="space-y-2">
//                   {specs.map((spec) => (
//                     <li key={spec} className="flex items-center gap-2 text-sm text-muted-foreground">
//                       <Check className="h-4 w-4" />
//                       {spec}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Integrations */}
//       <div className="space-y-6">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold mb-2">Integrations</h2>
//           <p className="text-muted-foreground">
//             Connect with your favorite tools and services
//           </p>
//         </div>

//         <Card>
//           <CardContent className="pt-6">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Integration</TableHead>
//                   <TableHead>Category</TableHead>
//                   <TableHead className="text-right">Status</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {integrations.map((integration) => (
//                   <TableRow key={integration.name}>
//                     <TableCell className="font-medium">{integration.name}</TableCell>
//                     <TableCell>{integration.category}</TableCell>
//                     <TableCell className="text-right">
//                       <Badge variant="secondary">Available</Badge>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       </div>

//       {/* CTA Section */}
//       <div className="relative rounded-lg overflow-hidden">
//         <div className="absolute inset-0">
//           <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/20 mix-blend-multiply" />
//           <img 
//             src="/api/placeholder/1600/400" 
//             alt="Features CTA"
//             className="w-full h-full object-cover"
//           />
//         </div>
        
//         <div className="relative p-8 md:p-12 text-white">
//           <div className="max-w-3xl space-y-6">
//             <h2 className="text-3xl font-bold">Ready to get started?</h2>
//             <p className="text-lg opacity-90">
//               Transform your production workflow with our comprehensive suite of tools.
//             </p>
//             <div className="flex flex-wrap gap-4">
//               <Button variant="secondary" size="lg" onClick={handleDemoRequest}>
//                 Request Demo
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Button>
//               <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/20">
//                 <Download className="mr-2 h-4 w-4" />
//                 Download Specs
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // 'use client'
// // import React, { useState } from 'react';
// // import { motion } from 'framer-motion';
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Badge } from "@/components/ui/badge";
// // import { 
// //   Tabs, TabsContent, TabsList, TabsTrigger 
// // } from "@/components/ui/tabs";
// // import {
// //   Film,
// //   Layers,
// //   Wand2,
// //   Brain,
// //   Globe2,
// //   Users,
// //   Sparkles,
// //   ArrowRight,
// //   Play,
// //   Code,
// //   Lightbulb,
// //   Presentation,
// //   Network,
// //   TrendingUp,
// //   Shield,
// //   Cpu
// // } from 'lucide-react';

// // const features = {
// //   production: [
// //     {
// //       icon: Wand2,
// //       title: "AI-Enhanced Production",
// //       description: "Streamline workflows with intelligent automation and creative assistance",
// //       capabilities: [
// //         "Real-time scene optimization",
// //         "Automated color grading",
// //         "Smart asset management"
// //       ]
// //     },
// //     {
// //       icon: Layers,
// //       title: "Virtual Production Suite",
// //       description: "Next-generation tools for seamless virtual production workflows",
// //       capabilities: [
// //         "Real-time rendering",
// //         "Virtual set design",
// //         "Motion capture integration"
// //       ]
// //     },
// //     {
// //       icon: Brain,
// //       title: "Creative AI Tools",
// //       description: "Enhance creativity with AI-powered assistance and suggestions",
// //       capabilities: [
// //         "Script analysis",
// //         "Storyboard generation",
// //         "Character development"
// //       ]
// //     }
// //   ],
// //   collaboration: [
// //     {
// //       icon: Globe2,
// //       title: "Global Collaboration",
// //       description: "Connect teams across the world with real-time collaboration tools",
// //       capabilities: [
// //         "Real-time project sync",
// //         "Multi-user editing",
// //         "Asset sharing"
// //       ]
// //     },
// //     {
// //       icon: Users,
// //       title: "Team Management",
// //       description: "Comprehensive tools for managing production teams and resources",
// //       capabilities: [
// //         "Role-based access",
// //         "Task assignment",
// //         "Progress tracking"
// //       ]
// //     },
// //     {
// //       icon: Network,
// //       title: "Resource Optimization",
// //       description: "Efficiently manage and allocate production resources",
// //       capabilities: [
// //         "Resource scheduling",
// //         "Budget tracking",
// //         "Equipment management"
// //       ]
// //     }
// //   ],
// //   technology: [
// //     {
// //       icon: Code,
// //       title: "Advanced APIs",
// //       description: "Powerful APIs for custom integration and workflow automation",
// //       capabilities: [
// //         "RESTful endpoints",
// //         "WebSocket support",
// //         "Custom webhooks"
// //       ]
// //     },
// //     {
// //       icon: Shield,
// //       title: "Enterprise Security",
// //       description: "Industry-leading security measures for content protection",
// //       capabilities: [
// //         "End-to-end encryption",
// //         "Access control",
// //         "Audit logging"
// //       ]
// //     },
// //     {
// //       icon: Cpu,
// //       title: "Cloud Infrastructure",
// //       description: "Scalable cloud infrastructure for demanding production needs",
// //       capabilities: [
// //         "Auto-scaling",
// //         "Global CDN",
// //         "High availability"
// //       ]
// //     }
// //   ]
// // };

// // const metrics = [
// //   {
// //     label: "Processing Power",
// //     value: "500K",
// //     unit: "GPU hours/day",
// //     trend: "+45%",
// //     description: "Dedicated to AI and rendering"
// //   },
// //   {
// //     label: "Active Projects",
// //     value: "10K+",
// //     unit: "globally",
// //     trend: "+60%",
// //     description: "Across all production stages"
// //   },
// //   {
// //     label: "Data Processed",
// //     value: "50PB",
// //     unit: "monthly",
// //     trend: "+75%",
// //     description: "Of creative assets and analytics"
// //   },
// //   {
// //     label: "Team Members",
// //     value: "100K+",
// //     unit: "users",
// //     trend: "+40%",
// //     description: "Collaborating worldwide"
// //   }
// // ];

// // export default function Features() {
// //   const [selectedTab, setSelectedTab] = useState('production');

// //   return (
// //     <div className="min-h-screen bg-background py-16">
// //       <div className="container space-y-16">
// //         {/* Hero Section */}
// //         <div className="text-center space-y-6">
// //           <motion.h1 
// //             className="text-4xl md:text-6xl font-bold"
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.6 }}
// //           >
// //             Powerful Features for Modern Production
// //           </motion.h1>
// //           <motion.p 
// //             className="text-xl text-muted-foreground max-w-3xl mx-auto"
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.6, delay: 0.2 }}
// //           >
// //             Revolutionize your production workflow with cutting-edge tools and AI-powered innovations
// //           </motion.p>
// //         </div>

// //         {/* Metrics Grid */}
// //         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
// //           {metrics.map((metric, index) => (
// //             <motion.div
// //               key={metric.label}
// //               initial={{ opacity: 0, y: 20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ duration: 0.6, delay: index * 0.1 }}
// //             >
// //               <Card className="h-full">
// //                 <CardContent className="pt-6">
// //                   <div className="space-y-2">
// //                     <div className="flex justify-between items-start">
// //                       <span className="text-sm text-muted-foreground">{metric.label}</span>
// //                       <Badge variant="secondary" className="font-mono">
// //                         {metric.trend}
// //                       </Badge>
// //                     </div>
// //                     <div className="space-y-1">
// //                       <h3 className="text-3xl font-bold">{metric.value}</h3>
// //                       <p className="text-sm text-muted-foreground">{metric.unit}</p>
// //                     </div>
// //                     <p className="text-sm text-muted-foreground">{metric.description}</p>
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //             </motion.div>
// //           ))}
// //         </div>

// //         {/* Features Tabs */}
// //         <Card className="border-none bg-card">
// //           <CardHeader>
// //             <CardTitle>Platform Capabilities</CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <Tabs defaultValue="production" className="space-y-8">
// //               <TabsList className="w-full justify-start">
// //                 <TabsTrigger value="production" className="flex items-center gap-2">
// //                   <Film className="w-4 h-4" />
// //                   Production
// //                 </TabsTrigger>
// //                 <TabsTrigger value="collaboration" className="flex items-center gap-2">
// //                   <Users className="w-4 h-4" />
// //                   Collaboration
// //                 </TabsTrigger>
// //                 <TabsTrigger value="technology" className="flex items-center gap-2">
// //                   <Code className="w-4 h-4" />
// //                   Technology
// //                 </TabsTrigger>
// //               </TabsList>

// //               {Object.entries(features).map(([key, featureList]) => (
// //                 <TabsContent key={key} value={key} className="space-y-8">
// //                   <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                     {featureList.map((feature, index) => {
// //                       const Icon = feature.icon;
// //                       return (
// //                         <motion.div
// //                           key={feature.title}
// //                           initial={{ opacity: 0, y: 20 }}
// //                           animate={{ opacity: 1, y: 0 }}
// //                           transition={{ duration: 0.4, delay: index * 0.1 }}
// //                         >
// //                           <Card className="h-full hover:shadow-lg transition-all duration-300">
// //                             <CardContent className="pt-6">
// //                               <div className="space-y-4">
// //                                 <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center">
// //                                   <Icon className="w-6 h-6 text-primary" />
// //                                 </div>
// //                                 <h3 className="text-xl font-semibold">{feature.title}</h3>
// //                                 <p className="text-muted-foreground">{feature.description}</p>
// //                                 <ul className="space-y-2">
// //                                   {feature.capabilities.map((capability) => (
// //                                     <li key={capability} className="flex items-center gap-2 text-sm">
// //                                       <Sparkles className="w-4 h-4 text-primary" />
// //                                       {capability}
// //                                     </li>
// //                                   ))}
// //                                 </ul>
// //                               </div>
// //                             </CardContent>
// //                           </Card>
// //                         </motion.div>
// //                       );
// //                     })}
// //                   </div>
// //                 </TabsContent>
// //               ))}
// //             </Tabs>
// //           </CardContent>
// //         </Card>

// //         {/* Demo CTA */}
// //         <motion.div
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.6, delay: 0.4 }}
// //           className="relative h-[400px] rounded-xl overflow-hidden"
// //         >
// //           <img
// //             src="/api/placeholder/1600/800"
// //             alt="Platform demo"
// //             className="w-full h-full object-cover"
// //           />
// //           <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent">
// //             <div className="relative h-full flex items-center p-12">
// //               <div className="max-w-2xl space-y-6">
// //                 <h3 className="text-3xl font-bold text-white">Experience the Future</h3>
// //                 <p className="text-lg text-gray-200">
// //                   See how our platform transforms production workflows and empowers creative teams.
// //                 </p>
// //                 <div className="flex gap-4">
// //                   <Button size="lg">
// //                     <Play className="w-4 h-4 mr-2" />
// //                     Watch Demo
// //                   </Button>
// //                   <Button variant="outline" className="text-white border-white hover:bg-white/20">
// //                     Schedule Tour
// //                     <ArrowRight className="w-4 h-4 ml-2" />
// //                   </Button>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </motion.div>
// //       </div>
// //     </div>
// //   );
// // }