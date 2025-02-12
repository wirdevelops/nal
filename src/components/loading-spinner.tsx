// src/components/loading-spinner.tsx

import { cn } from "@/lib/utils"; // Assuming you have this utility

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-4",
  };

  const currentSize = sizeClasses[size] || sizeClasses.md; // Default to md

  return (
    <div
      className={cn(
        "rounded-full animate-spin",
        currentSize,
        "border-t-primary", // Use your primary color
        className
      )}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}