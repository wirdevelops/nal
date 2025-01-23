import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { TeamMember } from '@/types/ngo';

interface TeamProps {
  members: TeamMember[];
  onAddMember?: () => void;
}

export function Team({ members, onAddMember }: TeamProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Team Members</CardTitle>
        {onAddMember && (
          <Button size="sm" onClick={onAddMember}>
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member.userId}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  {member.avatar ? (
                    <AvatarImage src={member.avatar} alt={member.name} />
                  ) : (
                    <AvatarFallback>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.role}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {member.department}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
