'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Calendar,
  Users,
  Film,
  Cloud,
  Shield,
  Zap,
  HelpCircle,
  MessageCircle
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Can I switch between plans?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes, we offer a 14-day free trial on all our plans. No credit card required."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise clients."
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes, you can cancel your subscription at any time. No long-term contracts required."
  },
  {
    question: "Do you offer discounts for non-profits?",
    answer: "Yes, we offer special pricing for non-profit organizations. Please contact our sales team for more information."
  },
  {
    question: "What kind of support do you provide?",
    answer: "We offer various levels of support depending on your plan, ranging from email support to 24/7 premium support with a dedicated account manager."
  }
];

const additionalFeatures = [
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    description: "Advanced security features including SSO, 2FA, and custom security policies"
  },
  {
    icon: Cloud,
    title: "Cloud Infrastructure",
    description: "Powered by state-of-the-art cloud infrastructure for maximum reliability"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Built-in tools for seamless team collaboration and project management"
  },
  {
    icon: Zap,
    title: "API Access",
    description: "Full API access for custom integrations and automation workflows"
  }
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-16 space-y-16">
        {/* Previous sections remain the same... */}

        {/* Additional Features */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Everything You Need</h2>
            <p className="text-muted-foreground mt-2">
              Powerful features to supercharge your production workflow
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-muted-foreground mt-2">
              Find answers to common questions about our pricing and plans
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible>
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Enterprise CTA */}
        <div className="relative rounded-lg overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/20 mix-blend-multiply" />
            <img 
              src="/api/placeholder/1600/400" 
              alt="Enterprise solutions"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="relative p-8 md:p-12 text-white">
            <div className="max-w-3xl space-y-6">
              <h2 className="text-3xl font-bold">Need a Custom Solution?</h2>
              <p className="text-lg opacity-90">
                Get in touch with our enterprise team to discuss custom pricing, dedicated support, and tailored solutions for your organization.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="secondary" size="lg">
                  Contact Sales
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/20">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}