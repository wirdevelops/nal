// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Check, Star } from 'lucide-react';

// // Collaboration Tools Data
// export const collaborationData = {
//   title: "Collaboration Tools",
//   subtitle: "Seamless team collaboration features",
//   keyFeatures: [
//     {
//       title: "Real-time Collaboration",
//       description: "Work together in real-time",
//       features: [
//         "Live document editing with multiple users",
//         "Real-time cursor tracking",
//         "Instant changes synchronization",
//         "Conflict resolution",
//         "Presence indicators"
//       ],
//       highlighted: true
//     },
//     {
//       title: "Communication Hub",
//       description: "Centralized team communication",
//       features: [
//         "Team chat rooms",
//         "Direct messaging",
//         "Video conferencing",
//         "Screen sharing",
//         "File sharing in chats"
//       ],
//       highlighted: false
//     },
//     {
//       title: "Review & Approval",
//       description: "Streamlined review processes",
//       features: [
//         "Visual feedback tools",
//         "Approval workflows",
//         "Version comparison",
//         "Annotation tools",
//         "Review tracking"
//       ],
//       highlighted: false
//     },
//     {
//       title: "Team Management",
//       description: "Efficient team organization",
//       features: [
//         "Role-based permissions",
//         "Team grouping",
//         "Resource allocation",
//         "Availability tracking",
//         "Team performance metrics"
//       ],
//       highlighted: false
//     }
//   ],
//   metrics: [
//     { label: "Average time saved", value: "32%", description: "In project completion" },
//     { label: "Team efficiency", value: "45%", description: "Increase in productivity" },
//     { label: "Communication", value: "60%", description: "More streamlined" }
//   ]
// };

// // Analytics Data
// export const analyticsData = {
//   title: "Analytics & Insights",
//   subtitle: "Data-driven decision making",
//   keyFeatures: [
//     {
//       title: "Project Analytics",
//       description: "Comprehensive project tracking",
//       features: [
//         "Real-time project progress tracking",
//         "Resource utilization analytics",
//         "Budget vs actual analysis",
//         "Timeline performance metrics",
//         "Risk assessment analytics"
//       ],
//       highlighted: true
//     },
//     {
//       title: "Performance Dashboards",
//       description: "Customizable data visualization",
//       features: [
//         "Custom dashboard creation",
//         "Interactive data visualizations",
//         "KPI tracking",
//         "Trend analysis",
//         "Export capabilities"
//       ],
//       highlighted: false
//     },
//     {
//       title: "AI-Powered Insights",
//       description: "Advanced data analysis",
//       features: [
//         "Predictive analytics",
//         "Anomaly detection",
//         "Pattern recognition",
//         "Automated reporting",
//         "Performance forecasting"
//       ],
//       highlighted: false
//     },
//     {
//       title: "Resource Analytics",
//       description: "Resource optimization tools",
//       features: [
//         "Team productivity metrics",
//         "Equipment utilization tracking",
//         "Cost optimization analysis",
//         "Capacity planning",
//         "Efficiency recommendations"
//       ],
//       highlighted: false
//     }
//   ],
//   metrics: [
//     { label: "Data Processing", value: "10TB+", description: "Daily data processed" },
//     { label: "Accuracy", value: "99.9%", description: "In predictions" },
//     { label: "Insights", value: "24/7", description: "Real-time analytics" }
//   ]
// };

// // Security Data
// export const securityData = {
//   title: "Security & Compliance",
//   subtitle: "Enterprise-grade security features",
//   keyFeatures: [
//     {
//       title: "Data Protection",
//       description: "Advanced security measures",
//       features: [
//         "End-to-end encryption",
//         "Multi-factor authentication",
//         "Regular security audits",
//         "Data backup & recovery",
//         "Access control logs"
//       ],
//       highlighted: true
//     },
//     {
//       title: "Compliance",
//       description: "Industry standards compliance",
//       features: [
//         "GDPR compliance",
//         "HIPAA compliance",
//         "SOC 2 Type II certified",
//         "ISO 27001 certified",
//         "Custom compliance frameworks"
//       ],
//       highlighted: false
//     },
//     {
//       title: "Access Control",
//       description: "Granular permission management",
//       features: [
//         "Role-based access control",
//         "IP whitelisting",
//         "Single sign-on (SSO)",
//         "Session management",
//         "Authentication logs"
//       ],
//       highlighted: false
//     },
//     {
//       title: "Security Operations",
//       description: "24/7 security monitoring",
//       features: [
//         "Real-time threat detection",
//         "Incident response",
//         "Vulnerability scanning",
//         "Security patching",
//         "DDoS protection"
//       ],
//       highlighted: false
//     }
//   ],
//   metrics: [
//     { label: "Uptime", value: "99.99%", description: "Service availability" },
//     { label: "Security", value: "24/7", description: "Active monitoring" },
//     { label: "Compliance", value: "100%", description: "Standards met" }
//   ]
// };

// interface FeatureProps {
//   title: string;
//   description: string;
//   features: string[];
//   highlighted?: boolean;
// }

// interface MetricProps {
//   label: string;
//   value: string;
//   description: string;
// }

// const FeatureCard = ({ title, description, features, highlighted }: FeatureProps) => (
//   <Card className={highlighted ? "border-primary" : ""}>
//     <CardHeader>
//       <div className="flex justify-between items-start">
//         <div>
//           <CardTitle>{title}</CardTitle>
//           <p className="text-sm text-muted-foreground mt-1">{description}</p>
//         </div>
//         {highlighted && (
//           <Badge className="bg-primary">
//             <Star className="w-3 h-3 mr-1" />
//             Popular
//           </Badge>
//         )}
//       </div>
//     </CardHeader>
//     <CardContent>
//       <ul className="space-y-2">
//         {features.map((feature, index) => (
//           <li key={index} className="flex items-center gap-2 text-sm">
//             <Check className="h-4 w-4 text-primary" />
//             {feature}
//           </li>
//         ))}
//       </ul>
//     </CardContent>
//   </Card>
// );

// const MetricsRow = ({ metrics }: { metrics: MetricProps[] }) => (
//   <div className="grid md:grid-cols-3 gap-6 mb-8">
//     {metrics.map((metric, index) => (
//       <Card key={index}>
//         <CardContent className="pt-6">
//           <div className="text-3xl font-bold text-primary mb-2">{metric.value}</div>
//           <div className="space-y-1">
//             <h4 className="font-medium">{metric.label}</h4>
//             <p className="text-sm text-muted-foreground">{metric.description}</p>
//           </div>
//         </CardContent>
//       </Card>
//     ))}
//   </div>
// );

// interface FeatureSectionProps {
//   data: {
//     title: string;
//     subtitle: string;
//     keyFeatures: FeatureProps[];
//     metrics: MetricProps[];
//   };
// }

// export const FeatureSection: React.FC<FeatureSectionProps> = ({ data }) => {
//   return (
//     <div className="space-y-8">
//       <div className="text-center">
//         <h2 className="text-3xl font-bold mb-2">{data.title}</h2>
//         <p className="text-muted-foreground">{data.subtitle}</p>
//       </div>

//       <MetricsRow metrics={data.metrics} />

//       <div className="grid md:grid-cols-2 gap-6">
//         {data.keyFeatures.map((feature, index) => (
//           <FeatureCard key={index} {...feature} />
//         ))}
//       </div>
//     </div>
//   );
// };