import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useDonation } from '@/hooks/useDonation';

interface DonationFormProps {
  projectId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function DonationForm({ projectId, onSuccess, onCancel }: DonationFormProps) {
  const { processDonation, isLoading } = useDonation();
  const [amount, setAmount] = useState<number>();
  const [frequency, setFrequency] = useState<'one-time' | 'monthly' | 'annual'>('one-time');
  const [anonymous, setAnonymous] = useState(false);
  const [message, setMessage] = useState('');

    /**
     * Handles the form submission for donation.
     */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
      e.preventDefault();
      if (!amount) return; // if there is no amount return
    try {
      await processDonation({
        donorId: 'current-user-id', // Replace with actual user ID
        projectId,
        amount,
        currency: 'USD',
        frequency,
        status: 'pending',
        paymentMethod: 'card',
        anonymous,
        message,
      });
      onSuccess?.(); // Call the onSuccess callback
    } catch (error) {
      console.error('Donation failed:', error);
    }
  },[amount, frequency, anonymous, message, projectId, processDonation, onSuccess]);

  // Array of preset donation amounts
  const presetAmounts = [10, 25, 50, 100, 250, 500];

  return (
    <Card className="w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Make a Donation</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Amount Selection */}
          <div className="space-y-4">
            <Label>Select Amount</Label>
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
              />
            </div>
          </div>

          {/* Frequency Selection */}
          <div className="space-y-2">
            <Label>Frequency</Label>
            <RadioGroup value={frequency} onValueChange={(value: any) => setFrequency(value)}>
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

          {/* Anonymity Selection */}
          <div className="flex items-center justify-between">
            <Label htmlFor="anonymous">Make donation anonymous</Label>
            <Switch
              id="anonymous"
              checked={anonymous}
              onCheckedChange={setAnonymous}
            />
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Share why you're making this donation..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </CardContent>

        <CardFooter className="gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={!amount || isLoading} className="flex-1">
            {isLoading ? 'Processing...' : `Donate $${amount || 0}`}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}