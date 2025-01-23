// app/projects/[projectId]/casting/components/AuditionDetailsDialog.tsx
'use client';

import React, { useState } from 'react';
import { Audition, useCastingStore, Applicant } from '@/stores/useCastingStore';
import { format } from 'date-fns';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ApplicantDetails } from './ApplicantDetails';
import { AddApplicantDialog } from './AddApplicantDialog';

interface AuditionDetailsDialogProps {
    audition: Audition;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AuditionDetailsDialog({ audition, open, onOpenChange }: AuditionDetailsDialogProps) {
    const { applicants } = useCastingStore();
    const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
    const [addApplicantOpen, setAddApplicantOpen] = useState(false);

    const auditionApplicants = applicants.filter(applicant => applicant.auditionId === audition.id);


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                    <DialogTitle>Audition Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">{audition.role}</h2>
                      <Badge variant={audition.status === 'Scheduled' ? 'default' : 'secondary'}>
                           {audition.status}
                      </Badge>
                  </div>
                    <p className="text-muted-foreground">
                         {audition.date && format(audition.date, 'yyyy-MM-dd')} at {audition.startTime} - {audition.endTime}
                    </p>
                     <div className="flex flex-col gap-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Location</span>
                        <span className="text-sm">{audition.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Slot Duration</span>
                        <span className="text-sm">{audition.slotDuration} minutes</span>
                      </div>
                     {audition.requirements &&
                        <div className="flex justify-between">
                         <span className="text-sm text-muted-foreground">Requirements</span>
                         <span className="text-sm">{audition.requirements}</span>
                        </div>
                     }
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">Applicants</h3>
                      <Button onClick={() => setAddApplicantOpen(true)} size='sm'>
                        Add Applicant
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {auditionApplicants.length > 0 ? (
                            auditionApplicants.map(applicant => (
                                <Card
                                    key={applicant.id}
                                    className="hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => setSelectedApplicant(applicant)}
                                >
                                    <CardContent className="p-4 flex flex-col gap-1">
                                            <h3 className="font-medium">Applicant ID: {applicant.id}</h3>
                                          {applicant.rating && 
                                                <div className="flex justify-end">
                                                    <Badge variant="secondary">
                                                        Rated: {applicant.rating}
                                                    </Badge>
                                                 </div>
                                            }
                                        </CardContent>
                                </Card>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No applicants yet for this audition.</p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                      <Button type="button" variant='outline' onClick={() => onOpenChange(false)}>
                          Close
                      </Button>
                </DialogFooter>
                {selectedApplicant && (
                    <ApplicantDetails 
                    applicant={selectedApplicant}
                    open={!!selectedApplicant}
                    onOpenChange={setSelectedApplicant}
                     />
                )}
                <AddApplicantDialog
                    open={addApplicantOpen}
                    onOpenChange={setAddApplicantOpen}
                    auditionId={audition.id}
                />
            </DialogContent>
        </Dialog>
    );
}