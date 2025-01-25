// src/components/auth/login-form.tsx
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
import { Chrome as GoogleIcon, Facebook as FacebookIcon, Loader2 } from 'lucide-react';
import { AuthService } from '@/lib/auth-service';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
});

type LoginFormValues = z.infer<typeof loginSchema>;

  export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
  
    const form = useForm<LoginFormValues>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
        email: '',
        password: '',
        rememberMe: false
      },
    });
  
    const onSubmit = async (values: LoginFormValues) => {
      console.log('Attempting login with:', { ...values, password: '[REDACTED]' });
      try {
        setIsLoading(true);
        const { email, password, rememberMe } = values;
        
        const user = await AuthService.login({ email, password });
        console.log('Login successful:', { userId: user.id, email: user.email });
        
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
          console.log('Email saved for remember me:', email);
        }
  
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name.first}!`,
        });
  
        const redirectPath = user.onboarding.stage === 'completed' ? '/dashboard' : '/onboarding';
        console.log('Redirecting to:', redirectPath);
        router.push(redirectPath);
      } catch (error) {
        console.error('Login failed:', error);
        toast({
          title: "Login failed",
          description: error instanceof Error ? error.message : "Invalid credentials",
          variant: "destructive",
        });
        if (error.message === 'User not found') {
          toast({
            title: "Account not found",
            description: "Please register first",
          });
          router.push('/auth/register');
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground mt-2">
          Enter your credentials to access your account
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="john.doe@example.com" 
                    type="email" 
                    autoComplete="username"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder="********"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-primary"
                  >
                    {showPassword ? '👁️' : '👁️🗨️'}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 accent-primary rounded border-primary"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">Remember me</FormLabel>
                </FormItem>
              )}
            />

            <Link
              href="/auth/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  Sign In
</Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
  <Button 
  variant="outline" 
  type="button"
  onClick={async () => {
    try {
      await AuthService.socialLogin('google');
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Social login failed",
        variant: "destructive"
      });
    }
  }}
>
  <GoogleIcon className="mr-2 h-4 w-4" />
  Google
</Button>
  <Button 
    variant="outline" 
    type="button"
    onClick={async () => {
      try {
        await AuthService.socialLogin('facebook');
        router.push('/dashboard');
      } catch (error) {
        toast({
          title: "Login failed",
          description: error instanceof Error ? error.message : "Social login failed",
          variant: "destructive"
        });
      }
    }}
  >
    <FacebookIcon className="mr-2 h-4 w-4" />
    Facebook
  </Button>
</div>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/auth/register" className="font-semibold text-primary hover:underline">
          Create one now
        </Link>
      </p>
    </div>
  );
}

// "use client";

// import * as React from "react";
// import { useSearchParams } from "next/navigation";
// import { signIn } from "next-auth/react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Icons } from "@/components/ui/Icons";
// import { cn } from "@/lib/utils";

// interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

// export function LoginForm({ className, ...props }: LoginFormProps) {
//   const [isLoading, setIsLoading] = React.useState<boolean>(false);
//   const [error, setError] = React.useState<string>("");
//   const searchParams = useSearchParams();

//   async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     setIsLoading(true);
//     setError("");

//     const formData = new FormData(event.currentTarget);
//     const email = formData.get("email") as string;
//     const password = formData.get("password") as string;

//     try {
//       const result = await signIn("credentials", {
//         email,
//         password,
//         redirect: false,
//       });

//       if (result?.error) {
//         setError("Invalid email or password");
//         return;
//       }

//       // Redirect to the callback URL or dashboard
//       window.location.href = searchParams.get("from") || "/dashboard";
//     } catch (error) {
//       setError("An error occurred. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <div className={cn("grid gap-6", className)} {...props}>
//       <form onSubmit={onSubmit}>
//         <div className="grid gap-4">
//           <div className="grid gap-1">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               placeholder="name@example.com"
//               type="email"
//               autoCapitalize="none"
//               autoComplete="email"
//               autoCorrect="off"
//               disabled={isLoading}
//               name="email"
//               required
//             />
//           </div>
//           <div className="grid gap-1">
//             <Label htmlFor="password">Password</Label>
//             <Input
//               id="password"
//               type="password"
//               autoComplete="current-password"
//               disabled={isLoading}
//               name="password"
//               required
//             />
//           </div>
//           {error && (
//             <p className="text-sm text-red-500">
//               {error}
//             </p>
//           )}
//           <Button disabled={isLoading}>
//             {isLoading && (
//               <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
//             )}
//             Sign In
//           </Button>
//         </div>
//       </form>
//       <div className="relative">
//         <div className="absolute inset-0 flex items-center">
//           <span className="w-full border-t" />
//         </div>
//         <div className="relative flex justify-center text-xs uppercase">
//           <span className="bg-background px-2 text-muted-foreground">
//             Or continue with
//           </span>
//         </div>
//       </div>
//       <Button
//         variant="outline"
//         type="button"
//         disabled={isLoading}
//         onClick={() => signIn("google", { callbackUrl: searchParams.get("from") || "/dashboard" })}
//       >
//         {isLoading ? (
//           <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
//         ) : (
//           <Icons.google className="mr-2 h-4 w-4" />
//         )}{" "}
//         Google
//       </Button>
//     </div>
//   );
// }
