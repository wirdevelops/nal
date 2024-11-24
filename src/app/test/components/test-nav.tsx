"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export function TestNav() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg mb-4">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="space-x-4">
            <Link
              href="/test/user"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
            >
              User Page
            </Link>
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/test/admin"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
              >
                Admin Page
              </Link>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-gray-700 dark:text-gray-200">
                  {session.user?.email} ({session.user?.role})
                </span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
