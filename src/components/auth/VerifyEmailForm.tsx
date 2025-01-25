// components/auth/verify-email-form.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';
import { AuthService } from '@/lib/auth-service';
import Link from 'next/link';

const schema = z.object({
  token: z.string().min(6, 'Verification code must be at least 6 characters')
});

export function VerifyEmailForm({ email }: { email: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { token: '' }
  });

  const handleSubmit = async (values: z.infer<typeof schema>) => {
    try {
      setIsLoading(true);
      await AuthService.verifyEmail(values.token, email);
      setIsVerified(true);
      toast({ title: "Email verified!", description: "Your email has been successfully verified" });
    } catch (error) {
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Invalid verification code",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      await AuthService.sendVerificationEmail(email);
      toast({ title: "New code sent", description: "Check your email for a new verification code" });
    } catch (error) {
      toast({
        title: "Resend failed",
        description: error instanceof Error ? error.message : "Failed to resend code",
        variant: "destructive"
      });
    } finally {
      setIsResending(false);
    }
  };

  if (isVerified) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Email Verified!</h1>
        <Button asChild className="w-full">
          <Link href="/dashboard">Continue to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Verify Your Email</h1>
        <p className="text-muted-foreground">
          Enter the verification code sent to {email}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input placeholder="123456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify Email
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        Didn't receive the code?{' '}
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="text-primary underline hover:text-primary/80"
        >
          {isResending ? 'Sending...' : 'Resend Code'}
        </button>
      </div>
    </div>
  );
}