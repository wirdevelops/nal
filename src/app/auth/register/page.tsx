// app/auth/register/page.tsx
import { Metadata } from 'next';
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Card } from '@/components/ui';
// import Image from "next/image";

export const generateMetadata = (): Metadata => {
  return {
    title: 'Register | Nalevel Empire',
    description: 'Create your Nalevel Empire account to start your filmmaking journey.',
    // Add other metadata as needed (e.g., open graph tags)
  };
};

export default function RegisterPage() {
  return (
      
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          {/* <Image
            src="/logo.svg"
            alt="Logo"
            width={48}
            height={48}
            className="mx-auto"
          /> */}
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Join the Empire to start your filmmaking journey
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>

  );
}
