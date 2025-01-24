import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useNGOProject } from '@/hooks/useNGOProject';
import { User } from '@/types/user';
import { v4 as uuidv4 } from 'uuid';

interface DonationFormProps {
  projectId: string; // Made required since donations need a project
  currentUser: User; // Added user prop from your auth system
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function DonationForm({ projectId, currentUser, onSuccess, onCancel }: DonationFormProps) {
  const { updateProject, getProjectById, isLoading } = useNGOProject();
  const [amount, setAmount] = useState<number>();
  const [frequency, setFrequency] = useState<'one-time' | 'monthly' | 'annual'>('one-time');
  const [anonymous, setAnonymous] = useState(false);
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!amount) {
      setFormError('Please enter a donation amount');
      return;
    }

    try {
      const project = getProjectById(projectId);
      if (!project) {
        throw new Error('Project not found');
      }

      // Create donation payload matching your types
      const donation = {
        id: uuidv4(),
        amount,
        currency: 'USD',
        date: new Date().toISOString(),
        donor: anonymous ? null : currentUser,
        message,
        status: 'completed' as const,
        paymentMethod: 'card',
        frequency
      };

      // Update project state
      updateProject(projectId, {
        metrics: {
          ...project.metrics,
          donations: project.metrics.donations + amount,
          fundingUtilization: calculateFundingUtilization(
            project.metrics.donations + amount,
            project.budget.total
          )
        },
        donors: anonymous ? project.donors : [...project.donors, currentUser],
        impact: [
          ...project.impact,
          {
            id: uuidv4(),
            type: 'donation',
            value: amount,
            date: donation.date,
            description: message || 'New donation received'
          }
        ]
      });

      onSuccess?.();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Donation processing failed');
      console.error('Donation error:', error);
    }
  }, [amount, projectId, anonymous, message, frequency, currentUser, getProjectById, updateProject, onSuccess]);

  const calculateFundingUtilization = (donations: number, totalBudget: number): number => {
    return totalBudget > 0 ? Math.min((donations / totalBudget) * 100, 100) : 0;
  };

  const presetAmounts = [10, 25, 50, 100, 250, 500];

  return (
    <Card className="w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Support the Project</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {formError && (
            <div className="text-destructive text-sm p-2 border border-destructive rounded-lg">
              {formError}
            </div>
          )}

          {/* Amount Selection */}
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
                placeholder="Other amount"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="[&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          {/* Frequency Selection */}
          <div className="space-y-2">
            <Label>Donation Frequency</Label>
            <RadioGroup 
              value={frequency} 
              onValueChange={(value: 'one-time' | 'monthly' | 'annual') => setFrequency(value)}
            >
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="one-time" id="one-time" />
                  <Label htmlFor="one-time">One-time</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly">Monthly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="annual" id="annual" />
                  <Label htmlFor="annual">Annual</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Anonymity Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <Label htmlFor="anonymous">Anonymous Donation</Label>
            <Switch
              id="anonymous"
              checked={anonymous}
              onCheckedChange={setAnonymous}
            />
          </div>

          {/* Personal Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Optional Message</Label>
            <Textarea
              id="message"
              placeholder="Share your support message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none"
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
            disabled={!amount || isLoading} 
            className="flex-1"
          >
            {isLoading ? 'Processing...' : `Donate $${amount?.toLocaleString() || 0}`}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}