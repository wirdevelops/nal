'use client'

import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useNGOProjectStore } from '@/stores/useNGOProjectStore';
import { useDonationStore } from '@/stores/useDonationStore';
import { User } from '@/types/user';
import { Donation, DonationFrequency, PaymentStatus } from '@/types/ngo/donation';
import { v4 as uuidv4 } from 'uuid';

interface DonationFormProps {
  projectId?: string;
  currentUser?: User; // Make currentUser optional
  onSuccess: (donation: Donation) => void;
  onCancel?: () => void;
}

export function DonationForm({ projectId, currentUser, onSuccess, onCancel }: DonationFormProps) {
  const { updateProject, getProjectById } = useNGOProjectStore();
  const { addDonation } = useDonationStore();
  const [amount, setAmount] = useState<number>();
  const [frequency, setFrequency] = useState<DonationFrequency>('one_time');
  const [anonymous, setAnonymous] = useState(false);
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      if (!amount || amount <= 0) {
        throw new Error('Please enter a valid donation amount');
      }

      let donorName = 'Anonymous';
      let donorEmail = '';

      if (currentUser && currentUser.name) {
          donorName = `${currentUser.name.first} ${currentUser.name.last}`;
          donorEmail = currentUser.email
      }

      const donationData: Donation = {
        id: uuidv4(),
        donorId: currentUser?.id,  //use optional chaining here
        projectId,
        amount,
        frequency,
        status: 'completed' as PaymentStatus,
        donationDate: new Date().toISOString(),
        paymentMethod: 'card',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currency: 'USD',
        allocation: projectId ? [{ projectId, percentage: 100 }] : [],
        donor: {
          name: donorName,
          email: donorEmail,
          anonymous,
        },
        message,
        anonymous,
        date: new Date().toISOString()
      };

      await addDonation(donationData);

      if (projectId) {
        const project = getProjectById(projectId);
        if (project) {
          updateProject(projectId, {
            metrics: {
              ...project.metrics,
              donations: project.metrics.donations + amount,
              fundingUtilization: ((project.metrics.donations + amount) / project.budget.total) * 100
            }
          });
        }
      }

      onSuccess?.(donationData);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Donation processing failed');
      console.error('Donation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [amount, projectId, anonymous, message, frequency, currentUser, addDonation, getProjectById, updateProject, onSuccess]);

  const presetAmounts = [10, 25, 50, 100, 250, 500];

  return (
    <Card className="w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Make a Donation</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {formError && (
            <div className="text-destructive text-sm p-2 border border-destructive rounded-lg">
              {formError}
            </div>
          )}

          <div className="space-y-4">
            <Label>Select Amount (USD)</Label>
            <div className="grid grid-cols-3 gap-2">
              {presetAmounts.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant={amount === preset ? 'default' : 'outline'}
                  onClick={() => setAmount(preset)}
                >
                  ${preset}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span>$</span>
              <Input
                type="number"
                min={1}
                step="0.01"
                placeholder="Other amount"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Donation Frequency</Label>
            <RadioGroup 
              value={frequency} 
              onValueChange={(value: DonationFrequency) => setFrequency(value)}
            >
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="one_time" id="one_time" />
                  <Label htmlFor="one_time">One-time</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly">Monthly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="annually" id="annually" />
                  <Label htmlFor="annually">Annual</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <Label htmlFor="anonymous">Anonymous Donation</Label>
            <Switch
              id="anonymous"
              checked={anonymous}
              onCheckedChange={setAnonymous}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Optional Message</Label>
            <Textarea
              id="message"
              placeholder="Share your support message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none"
              maxLength={500}
            />
          </div>
        </CardContent>

        <CardFooter className="gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={!amount || isSubmitting} 
            className="flex-1"
          >
            {isSubmitting ? 'Processing...' : `Donate $${amount?.toLocaleString() || 0}`}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}