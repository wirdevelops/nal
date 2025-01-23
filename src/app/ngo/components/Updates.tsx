
// src/ngo/projects/ProjectDetails/Updates.tsx
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDistance } from 'date-fns';
import type { ProjectUpdate } from '@/types/ngo';

interface UpdatesProps {
  updates: ProjectUpdate[];
  onAddUpdate?: () => void;
}

export function Updates({ updates, onAddUpdate }: UpdatesProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Project Updates</CardTitle>
        {onAddUpdate && (
          <Button size="sm" onClick={onAddUpdate}>
            Add Update
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {updates.map((update) => (
            <div key={update.id} className="space-y-2">
              <div className="flex items-start gap-4">
                <Avatar>
                  {update.author.avatar ? (
                    <AvatarImage src={update.author.avatar} alt={update.author.name} />
                  ) : (
                    <AvatarFallback>
                      {update.author.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{update.author.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDistance(new Date(update.timestamp), new Date(), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2">{update.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}