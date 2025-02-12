// components/auth/ForgotPasswordForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowLeft } from 'lucide-react';
import { useForgotPassword } from '@/lib/auth/hooks';
import Link from 'next/link';

const schema = z.object({
  email: z.string().email('Please enter a valid email address')
});

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // Track if request was sent
  const { toast } = useToast();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: ''
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      setIsLoading(true);
      await useForgotPassword().mutateAsync(values);
      setIsSubmitted(true); // Set submitted state
      toast({
        title: "Reset link sent",
        description: "Check your email for password reset instructions",
      });
    } catch (error: any) {
      toast({
        title: "Request failed",
        description: error?.response?.data?.error || "Failed to send reset link. Please check your email and try again.", // Improved error message
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
          <p className="text-muted-foreground">
            We've sent a password reset link to your email address.
          </p>
        </div>
         <Button asChild className="w-full">
          <Link href="/auth/login">Return to login</Link>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@example.com" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send reset link
        </Button>
      </form>
      <Button variant="ghost" className="w-full" asChild>
        <Link href="/auth/login">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>
      </Button>
    </Form>
  );
}