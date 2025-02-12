// src/components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/auth/validations';
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
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { useLogin } from '@/lib/auth/hooks';
import type { LoginInput } from '@/lib/auth/validations';
import { useRouter } from 'next/navigation';
import { LoginResponse } from '@/lib/auth/types';  //Import LoginResponse

interface LoginFormProps {
  redirect?: string;
}

export function LoginForm({ redirect = '/dashboard' }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();
  const router = useRouter();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    },
  });

  const onSubmit = async (values: LoginInput) => {
    console.log("LoginForm: onSubmit called"); // Add this log
    login({
      email: values.email,
      password: values.password
    }, {
      onSuccess: (data: LoginResponse) => { // Type data as LoginResponse
        console.log("LoginForm: onSuccess called"); // Add this log
        console.log("LoginForm: data:", data); // Add this log

        // Handle MFA if required
        if (data?.requiresMFA) {
          console.log("LoginForm: Requires MFA, redirecting to /auth/mfa-verification"); // Add this log
          router.push('/auth/mfa-verification');
          return;
        }

        // Check if profile is complete
        if (!data.user?.hasCompletedOnboarding) {
          console.log("LoginForm: Onboarding not complete, redirecting to /auth/onboarding"); // Add this log
          router.push('/auth/onboarding');
          return;
        }

        console.log("LoginForm: Onboarding complete, redirecting to:", redirect); // Add this log
        // Handle redirect
        router.push(redirect);
      },
      onError: (error) => {
        console.error("LoginForm: Login error:", error);
      }
    });

    if (values.rememberMe) {
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberMe');
    }
  };

  return (
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
                  placeholder="email@example.com"
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
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">
                  Remember me
                </FormLabel>
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

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign in
        </Button>

        <p className="px-8 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/auth/register"
            className="hover:text-primary text-primary underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </form>
    </Form>
  );
}



// 'use client';

// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { loginSchema } from '@/lib/auth/validation';
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Eye, EyeOff, Loader2 } from 'lucide-react';
// import Link from 'next/link';
// import { Checkbox } from '@/components/ui/checkbox';
// import { useLogin } from '@/lib/auth/hooks';
// import type { LoginInput } from '@/lib/auth/validation';

// export function LoginForm() {
//   const [showPassword, setShowPassword] = useState(false);
//   const { mutate: login, isPending } = useLogin();

//   const form = useForm<LoginInput>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: '',
//       password: '',
//       rememberMe: false
//     },
//   });

//   const onSubmit = async (values: LoginInput) => {
//     login({
//       email: values.email,
//       password: values.password
//     });
    
//     if (values.rememberMe) {
//       localStorage.setItem('rememberMe', 'true');
//     } else {
//       localStorage.removeItem('rememberMe');
//     }
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <FormControl>
//                 <Input
//                   placeholder="john.doe@example.com"
//                   type="email"
//                   autoComplete="username"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="password"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Password</FormLabel>
//               <div className="relative">
//                 <FormControl>
//                   <Input
//                     placeholder="********"
//                     type={showPassword ? 'text' : 'password'}
//                     autoComplete="current-password"
//                     {...field}
//                   />
//                 </FormControl>
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-3 text-muted-foreground hover:text-primary"
//                 >
//                   {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </button>
//               </div>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className="flex items-center justify-between">
//           <FormField
//             control={form.control}
//             name="rememberMe"
//             render={({ field }) => (
//               <FormItem className="flex flex-row items-center space-x-2 space-y-0">
//                 <FormControl>
//                   <Checkbox
//                     checked={field.value}
//                     onCheckedChange={field.onChange}
//                   />
//                 </FormControl>
//                 <FormLabel className="text-sm font-normal">
//                   Remember me
//                 </FormLabel>
//               </FormItem>
//             )}
//           />

//           <Link
//             href="/auth/forgot-password"
//             className="text-sm text-primary hover:underline"
//           >
//             Forgot password?
//           </Link>
//         </div>

//         <Button type="submit" className="w-full" disabled={isPending}>
//           {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//           Sign in
//         </Button>

//         <p className="px-8 text-center text-sm text-muted-foreground">
//           Don't have an account?{" "}
//           <Link
//             href="/auth/register"
//             className="hover:text-primary text-primary underline underline-offset-4"
//           >
//             Sign up
//           </Link>
//         </p>
//       </form>
//     </Form>
//   );
// }
