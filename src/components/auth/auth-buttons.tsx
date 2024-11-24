"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Icons } from "@/components/ui/Icons";

export function AuthButtons() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-primary rounded-full hover:bg-primary/90 transition-colors"
        >
          Dashboard
          <Icons.arrowRight className="ml-2 h-4 w-4" />
        </Link>
        <button
          onClick={() => signOut()}
          className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-sm transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <Link
        href="/register"
        className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-primary rounded-full hover:bg-primary/90 transition-colors"
      >
        Get Started
        <Icons.arrowRight className="ml-2 h-4 w-4" />
      </Link>
      <Link
        href="/login"
        className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-sm transition-colors"
      >
        Sign In
      </Link>
    </div>
  );
}
