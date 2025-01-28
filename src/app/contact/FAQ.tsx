'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

export function FAQCTA() {
  return (
    <div className="text-center space-y-6">
      <h2 className="text-2xl font-semibold">Have more questions?</h2>
      <p className="text-muted-foreground">
        Check out our frequently asked questions or schedule a call with our team.
      </p>
      <div className="flex justify-center gap-4">
        <Button variant="outline">
          View FAQ
        </Button>
        <Button>
          Schedule Call
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}