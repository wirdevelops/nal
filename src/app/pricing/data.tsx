// // lib/pricing-data.ts
// import { Shield, Cloud, Users, Zap } from 'lucide-react';

// export const plans = {
//   monthly: [
//     {
//       name: "Starter",
//       price: 49,
//       description: "Perfect for indie creators and small teams",
//       features: [
//         "5 Active Projects",
//         "10 Team Members",
//         "Basic Analytics",
//         "20GB Storage",
//         "Email Support"
//       ],
//       limitations: [
//         "Advanced Collaboration",
//         "Custom Branding",
//         "Priority Support",
//         "API Access"
//       ],
//       cta: "Start Free Trial",
//       popular: false
//     },
//     {
//       name: "Professional",
//       price: 99,
//       description: "For professional creators and growing studios",
//       features: [
//         "20 Active Projects",
//         "Unlimited Team Members",
//         "Advanced Analytics",
//         "100GB Storage",
//         "Priority Support",
//         "Custom Branding",
//         "API Access",
//         "Advanced Collaboration"
//       ],
//       limitations: [],
//       cta: "Get Started",
//       popular: true
//     },
//     {
//       name: "Enterprise",
//       price: 299,
//       description: "For large studios and production houses",
//       features: [
//         "Unlimited Projects",
//         "Unlimited Team Members",
//         "Custom Analytics",
//         "Unlimited Storage",
//         "24/7 Premium Support",
//         "Custom Branding",
//         "API Access",
//         "Advanced Collaboration",
//         "Custom Integrations",
//         "Dedicated Account Manager"
//       ],
//       limitations: [],
//       cta: "Contact Sales",
//       popular: false
//     }
//   ],
//   annual: [
//     {
//       name: "Starter",
//       price: 39,
//       description: "Perfect for indie creators and small teams",
//       features: [
//         "5 Active Projects",
//         "10 Team Members",
//         "Basic Analytics",
//         "20GB Storage",
//         "Email Support"
//       ],
//       limitations: [
//         "Advanced Collaboration",
//         "Custom Branding",
//         "Priority Support",
//         "API Access"
//       ],
//       cta: "Start Free Trial",
//       popular: false
//     },
//     {
//       name: "Professional",
//       price: 79,
//       description: "For professional creators and growing studios",
//       features: [
//         "20 Active Projects",
//         "Unlimited Team Members",
//         "Advanced Analytics",
//         "100GB Storage",
//         "Priority Support",
//         "Custom Branding",
//         "API Access",
//         "Advanced Collaboration"
//       ],
//       limitations: [],
//       cta: "Get Started",
//       popular: true
//     },
//     {
//       name: "Enterprise",
//       price: 249,
//       description: "For large studios and production houses",
//       features: [
//         "Unlimited Projects",
//         "Unlimited Team Members",
//         "Custom Analytics",
//         "Unlimited Storage",
//         "24/7 Premium Support",
//         "Custom Branding",
//         "API Access",
//         "Advanced Collaboration",
//         "Custom Integrations",
//         "Dedicated Account Manager"
//       ],
//       limitations: [],
//       cta: "Contact Sales",
//       popular: false
//     }
//   ]
// };

// export const features = {
//   collaboration: [
//     {
//       name: "Team Members",
//       starter: "10 members",
//       professional: "Unlimited",
//       enterprise: "Unlimited"
//     },
//     {
//       name: "Role-Based Access",
//       starter: "Basic",
//       professional: "Advanced",
//       enterprise: "Custom"
//     },
//     {
//       name: "Project Sharing",
//       starter: "Limited",
//       professional: "Full Access",
//       enterprise: "Full Access"
//     }
//   ],
//   storage: [
//     {
//       name: "Storage Space",
//       starter: "20GB",
//       professional: "100GB",
//       enterprise: "Unlimited"
//     },
//     {
//       name: "File Versioning",
//       starter: "30 days",
//       professional: "90 days",
//       enterprise: "Unlimited"
//     },
//     {
//       name: "Asset Library",
//       starter: false,
//       professional: true,
//       enterprise: true
//     }
//   ],
//   support: [
//     {
//       name: "Support Level",
//       starter: "Email",
//       professional: "Priority",
//       enterprise: "24/7 Premium"
//     },
//     {
//       name: "Response Time",
//       starter: "48 hours",
//       professional: "24 hours",
//       enterprise: "1 hour"
//     },
//     {
//       name: "Training Sessions",
//       starter: false,
//       professional: "2/month",
//       enterprise: "Unlimited"
//     }
//   ]
// };

// export const metrics = [
//   {
//     label: "Average Cost Savings",
//     value: "45%",
//     description: "Reduction in production costs"
//   },
//   {
//     label: "Time Saved",
//     value: "20hrs",
//     description: "Per project on average"
//   },
//   {
//     label: "Team Efficiency",
//     value: "85%",
//     description: "Increase in workflow efficiency"
//   },
//   {
//     label: "Client Satisfaction",
//     value: "98%",
//     description: "Based on user feedback"
//   }
// ];

// export const additionalFeatures = [
//   {
//     icon: Shield,
//     title: "Enterprise-Grade Security",
//     description: "Advanced security features including SSO, 2FA, and custom security policies"
//   },
//   {
//     icon: Cloud,
//     title: "Cloud Infrastructure",
//     description: "Powered by state-of-the-art cloud infrastructure for maximum reliability"
//   },
//   {
//     icon: Users,
//     title: "Team Collaboration",
//     description: "Built-in tools for seamless team collaboration and project management"
//   },
//   {
//     icon: Zap,
//     title: "API Access",
//     description: "Full API access for custom integrations and automation workflows"
//   }
// ];

// export const faqs = [
//   {
//     question: "Can I switch between plans?",
//     answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
//   },
//   {
//     question: "Is there a free trial available?",
//     answer: "Yes, we offer a 14-day free trial on all our plans. No credit card required."
//   },
//   {
//     question: "What payment methods do you accept?",
//     answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise clients."
//   },
//   {
//     question: "Can I cancel my subscription?",
//     answer: "Yes, you can cancel your subscription at any time. No long-term contracts required."
//   },
//   {
//     question: "Do you offer discounts for non-profits?",
//     answer: "Yes, we offer special pricing for non-profit organizations. Please contact our sales team for more information."
//   },
//   {
//     question: "What kind of support do you provide?",
//     answer: "We offer various levels of support depending on your plan, ranging from email support to 24/7 premium support with a dedicated account manager."
//   }
// ];