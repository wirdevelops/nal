'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VolunteerConfirmationPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Application Received!
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Thank you for applying to become a volunteer. We'll review your 
          application and be in touch within 3 business days.
        </p>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Next Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>Check your email for a confirmation message</li>
            <li>Complete any required background checks</li>
            <li>Attend an orientation session</li>
          </ol>
        </div>

        <Button 
          onClick={() => router.push('/')}
          className="mt-8"
        >
          Return to Home Page
        </Button>
      </div>
    </div>
  );
}