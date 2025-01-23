// app/projects/[projectId]/casting/components/ApplicantDetails.tsx
'use client';

import React from 'react';
import { Applicant } from '@/stores/useCastingStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { File, Star } from 'lucide-react';
import { Rating } from './Rating';

interface ApplicantDetailsProps {
    applicant: Applicant;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ApplicantDetails({ applicant, open, onOpenChange }: ApplicantDetailsProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-[450px]">
            <SheetHeader>
                <SheetTitle>Applicant Details</SheetTitle>
            </SheetHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                    Applicant ID: {applicant.id}
                </h3>
                {applicant.rating && 
                  <Rating rating={applicant.rating} size={20} />
                }
            </div>
              <Card>
                  <CardHeader>
                        <CardTitle>Files</CardTitle>
                  </CardHeader>
                    <CardContent className='flex flex-col gap-2'>
                            {applicant.resume && (
                            <div className="flex items-center gap-2">
                                <File className="h-4 w-4 text-muted-foreground" />
                                <a href={applicant.resume} target="_blank" rel="noopener noreferrer">
                                    Resume
                                </a>
                            </div>
                            )}
                        {applicant.demoReel && (
                            <div className="flex items-center gap-2">
                                <File className="h-4 w-4 text-muted-foreground" />
                                <a href={applicant.demoReel} target="_blank" rel="noopener noreferrer">
                                    Demo Reel
                                </a>
                            </div>
                        )}
                        {applicant.video && (
                            <div className="flex items-center gap-2">
                                <File className="h-4 w-4 text-muted-foreground" />
                                <a href={applicant.video} target="_blank" rel="noopener noreferrer">
                                    Video
                                </a>
                            </div>
                        )}
                        {applicant.audio && (
                            <div className="flex items-center gap-2">
                                <File className="h-4 w-4 text-muted-foreground" />
                                <a href={applicant.audio} target="_blank" rel="noopener noreferrer">
                                    Audio
                                </a>
                            </div>
                            )}
                        {!applicant.resume && !applicant.demoReel && !applicant.video && !applicant.audio && (
                            <p className="text-sm text-muted-foreground">
                                No files uploaded for this applicant
                            </p>
                        )}
                    </CardContent>
              </Card>
              <Card>
                  <CardHeader>
                        <CardTitle>Notes</CardTitle>
                  </CardHeader>
                    <CardContent>
                            {applicant.notes ? (
                                <p>{applicant.notes}</p>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                No notes for this applicant
                                </p>
                            )}
                    </CardContent>
              </Card>
            </div>
        </SheetContent>
    </Sheet>
  );
}