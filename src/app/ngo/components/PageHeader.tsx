'use client'
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export const PageHeader = ({ title, subtitle }) => {
  const router = useRouter();
  
  return (
    <div className="border-b sticky top-10 z-40 bg-background">
      <div className="container mx-auto px-6 pb-3 flex items-center justify-left"> {/* Changed to flex */}

          <Button
            variant="ghost"
            size="sm"
             className="flex items-center"  // added flex to back button
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2 text-primary" />
            Back
          </Button>


          <div className="text-left"> {/* Moved title and subtitle into a div and aligned right */}
            <h1 className="text-2xl font-bold">{title}</h1>
              {subtitle && (
                <p className="text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
      </div>
    </div>
  );
};