// src/components/DonorWall.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistance } from 'date-fns';
import  { Donor } from '@/types/ngo';

interface DonorWallProps {
  donors: Donor[];
  projectId: string;
}

const TIER_COLORS = {
  platinum: 'bg-gradient-to-r from-zinc-300 to-zinc-100',
  gold: 'bg-gradient-to-r from-yellow-300 to-yellow-100',
  silver: 'bg-gradient-to-r from-gray-300 to-gray-100',
  bronze: 'bg-gradient-to-r from-amber-700 to-amber-500',
};

export function DonorWall({ donors, projectId }: DonorWallProps) {
    return (
        <Card>
        <CardHeader>
            <CardTitle>Our Generous Donors</CardTitle>
        </CardHeader>
         <CardContent>
            <ScrollArea className="h-[600px] pr-4">
               <div className="space-y-6">
                {donors.map((donor) => (
                   <div
                      key={donor.id}
                      className="flex items-start gap-4 p-4 rounded-lg bg-muted/50"
                    >
                      <Avatar className="w-12 h-12">
                          {donor.avatar ? (
                            <AvatarImage src={donor.avatar} alt={`${donor.name}'s Avatar`} />
                        ) : (
                            <AvatarFallback>
                            {donor.isAnonymous
                                ? 'AN'
                                : donor.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                            </AvatarFallback>
                            )}
                        </Avatar>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                           <h4 className="font-medium">
                              {donor.isAnonymous ? 'Anonymous Donor' : donor.name}
                            </h4>
                           <Badge variant="outline" className={TIER_COLORS[donor.tier]}>
                             {donor.tier}
                            </Badge>
                        </div>

                      <p className="text-sm text-muted-foreground">
                       Donated ${donor.amount.toLocaleString()}
                      </p>

                         {donor.message && (
                          <p className="text-sm italic mt-2">{donor.message}</p>
                           )}

                      <p className="text-xs text-muted-foreground">
                         {formatDistance(new Date(donor.donatedAt), new Date(), {
                           addSuffix: true,
                         })}
                         </p>
                    </div>
                  </div>
                 ))}
               </div>
            </ScrollArea>
          </CardContent>
        </Card>
    );
}