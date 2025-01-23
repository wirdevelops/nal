'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VolunteerSignupForm } from '../volunteer/VolunteerSignupForm';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function VolunteerSignupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSuccess = () => {
    toast({
      title: 'Application Submitted',
      description: 'Thank you for your interest! We\'ll be in touch soon.',
    });
    router.push('/volunteers/confirmation');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={handleCancel}
        className="mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Volunteers
      </Button>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Volunteer Application</h1>
          <p className="text-muted-foreground">
            Join our community and help create meaningful change
          </p>
        </div>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Requirements Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <h3 className="font-medium">Time Commitment</h3>
                <p className="text-sm text-muted-foreground">
                  Minimum 6 hours per month
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">Age Requirement</h3>
                <p className="text-sm text-muted-foreground">
                  16+ (18+ for certain roles)
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">Screening Process</h3>
                <p className="text-sm text-muted-foreground">
                  Background check & references
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">Training</h3>
                <p className="text-sm text-muted-foreground">
                  Orientation + role-specific training
                </p>
              </div>
            </CardContent>
          </Card>

          <VolunteerSignupForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-3 text-sm">
                <li className="font-medium">
                  Application Review
                  <p className="text-muted-foreground font-normal mt-1">
                    Our team will review your application within 3 business days
                  </p>
                </li>
                <li className="font-medium">
                  Initial Interview
                  <p className="text-muted-foreground font-normal mt-1">
                    Short phone/video call to discuss opportunities
                  </p>
                </li>
                <li className="font-medium">
                  Onboarding Process
                  <p className="text-muted-foreground font-normal mt-1">
                    Orientation, training, and background checks
                  </p>
                </li>
                <li className="font-medium">
                  Start Volunteering!
                  <p className="text-muted-foreground font-normal mt-1">
                    Begin making an impact in your community
                  </p>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}