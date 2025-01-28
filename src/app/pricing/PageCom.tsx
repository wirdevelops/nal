'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PricingHero } from './Hero';
import { PricingCards } from './Card';
import { FeatureComparison } from './Compare';
import { MetricsGrid } from './Grid';
import { AdditionalFeatures } from './Add';
import { FAQSection } from './FAQs';
import { EnterpriseCTA } from './CTA';
import { 
  plans, 
  features, 
  metrics, 
  additionalFeatures, 
  faqs 
} from './data';

// export default function PricingPage() {
//   const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

//   const handleBillingCycleChange = (checked: boolean) => {
//     setBillingCycle(checked ? 'annual' : 'monthly');
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto px-4 py-16 space-y-16">
//         {/* Pricing Hero */}
//         <div className="mb-16">
//           <PricingHero 
//             billingCycle={billingCycle} 
//             onBillingCycleChange={handleBillingCycleChange} 
//           />
//         </div>

//         {/* Pricing Cards */}
//         <div className="mb-16">
//           <PricingCards 
//             billingCycle={billingCycle} 
//             plans={plans[billingCycle]} 
//           />
//         </div>

//         {/* Metrics Grid */}
//         <div className="mb-16">
//           <MetricsGrid metrics={metrics} />
//         </div>

//         {/* Feature Comparison */}
//         <div className="mb-16">
//           <FeatureComparison features={features} />
//         </div>

//         {/* Additional Features */}
//         <div className="mb-16">
//           <AdditionalFeatures features={additionalFeatures} />
//         </div>

//         {/* FAQ Section */}
//         <div className="mb-16">
//           <FAQSection faqs={faqs} />
//         </div>

//         {/* Enterprise CTA */}
//         <div>
//           <EnterpriseCTA />
//         </div>
//       </div>
//     </div>
//   );
// }
export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const handleBillingCycleChange = (checked: boolean) => {
    setBillingCycle(checked ? 'annual' : 'monthly');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-16 space-y-16">
        {/* Pricing Hero */}
        <PricingHero 
          billingCycle={billingCycle} 
          onBillingCycleChange={handleBillingCycleChange} 
        />

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <PricingCards 
            billingCycle={billingCycle} 
            plans={plans[billingCycle]} 
          />
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <MetricsGrid metrics={metrics} />
        </motion.div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <FeatureComparison features={features} />
        </motion.div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <AdditionalFeatures features={additionalFeatures} />
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <FAQSection faqs={faqs} />
        </motion.div>

        {/* Enterprise CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <EnterpriseCTA />
        </motion.div>
      </div>
    </div>
  );
}