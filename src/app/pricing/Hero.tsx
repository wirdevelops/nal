'use client';

import { motion } from 'framer-motion';
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, CheckCircle, Sparkles } from 'lucide-react';

interface PricingHeroProps {
  billingCycle: 'monthly' | 'annual';
  onBillingCycleChange: (checked: boolean) => void;
}

const highlights = [
  { icon: Star, text: "No credit card required for trial" },
  { icon: CheckCircle, text: "14-day free trial on all plans" },
  { icon: Sparkles, text: "Cancel anytime, no commitments" }
];

export function PricingHero({ billingCycle, onBillingCycleChange }: PricingHeroProps) {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Background Elements */}
      <div 
        className="absolute left-[50%] top-0 -z-10 h-[1000px] w-[1000px] -translate-x-[50%] rounded-full bg-gradient-to-tr from-primary to-primary/20 opacity-10 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-16">
        <div className="mx-auto max-w-4xl lg:mx-0 lg:flex-shrink-0 lg:pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <div className="inline-flex space-x-1 rounded-full bg-primary/10 px-4 py-1.5">
                <Badge variant="secondary" className="rounded-full">New</Badge>
                <span className="text-sm text-primary">
                  Special launch pricing available
                </span>
              </div>
            </div>
            
            <motion.h1 
              className="mt-10 text-4xl font-bold tracking-tight sm:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Simple, transparent pricing for{' '}
              <span className="text-primary">everyone</span>
            </motion.h1>
            
            <motion.p
              className="mt-6 text-lg leading-8 text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Choose the perfect plan for your production needs. All plans include access to core features.
            </motion.p>

            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Button size="lg">
                  Start free trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Button variant="ghost" size="lg">
                  Compare plans
                </Button>
              </motion.div>
            </div>

            {/* Billing Toggle */}
            <motion.div 
              className="mt-10 flex items-center justify-center gap-8 lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center gap-4">
                <span className={billingCycle === 'monthly' ? 'text-primary font-medium' : 'text-muted-foreground'}>
                  Monthly billing
                </span>
                <Switch
                  checked={billingCycle === 'annual'}
                  onCheckedChange={(checked) => onBillingCycleChange(checked)}
                />
                <span className={billingCycle === 'annual' ? 'text-primary font-medium' : 'text-muted-foreground'}>
                  Annual billing
                  <Badge variant="secondary" className="ml-2 font-normal">
                    Save 20%
                  </Badge>
                </span>
              </div>
            </motion.div>

            {/* Highlights */}
            <motion.div
              className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {highlights.map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <span>{highlight.text}</span>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}