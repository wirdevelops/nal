"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function AdminTestPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  // Check if user has admin role
  if (status === "authenticated" && session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Test Page</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-2">Session Information</h2>
        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}
