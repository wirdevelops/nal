'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";

interface Metric {
  label: string;
  value: string;
  description: string;
}

interface MetricsGridProps {
  metrics: Metric[];
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">{metric.value}</div>
                <div className="space-y-1">
                  <h4 className="font-medium">{metric.label}</h4>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}