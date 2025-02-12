import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Upload, UserCircle, Briefcase, Shield } from 'lucide-react';

// Welcome Screen Component
const WelcomeScreen = () => {
  return (
    <Card className="max-w-lg mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Welcome to Our Platform</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center text-muted-foreground">
          Let's get you set up in just a few steps
        </div>
        
        <div className="grid grid-cols-1 gap-4 mt-6">
          {[
            { icon: UserCircle, text: "Complete your profile" },
            { icon: Briefcase, text: "Select your role" },
            { icon: Shield, text: "Verify your account" }
          ].map((step, index) => (
            <div key={index} className="flex items-center gap-3 p-4 border rounded-lg">
              <step.icon className="w-6 h-6 text-primary" />
              <span>{step.text}</span>
            </div>
          ))}
        </div>

        <Button className="w-full mt-6">
          Get Started
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};