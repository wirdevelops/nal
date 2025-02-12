// src/components/auth/MFAForm.tsx
'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from 'lucide-react';

export function MFAForm({ onSubmit }: { onSubmit: (code: string) => Promise<void> }) {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(code);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">
          Enter your 6-digit authentication code
        </label>
        <Input
          placeholder="123456"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          pattern="\d{6}"
          required
        />
      </div>
      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Verify
      </Button>
    </form>
  );
}