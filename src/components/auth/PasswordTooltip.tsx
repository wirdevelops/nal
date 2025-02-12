// src/components/auth/PasswordTooltip.tsx
'use client';
import { Info } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

export function PasswordTooltip() {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Info className="h-4 w-4 ml-2 text-muted-foreground hover:text-primary" />
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <h4 className="font-medium mb-2">Password Requirements</h4>
        <ul className="text-sm space-y-1">
          <li className="flex items-center">
            <span className="mr-2">•</span>Minimum 12 characters
          </li>
          <li className="flex items-center">
            <span className="mr-2">•</span>At least 1 uppercase letter
          </li>
          <li className="flex items-center">
            <span className="mr-2">•</span>At least 1 number
          </li>
          <li className="flex items-center">
            <span className="mr-2">•</span>At least 1 special character
          </li>
        </ul>
      </HoverCardContent>
    </HoverCard>
  );
}