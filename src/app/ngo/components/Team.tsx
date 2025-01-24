import { useNGOProject } from '@/hooks/useNGOProject';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TeamProps {
  projectId: string;
  onAddMember?: () => void;
}

export function Team({ projectId, onAddMember }: TeamProps) {
  const { getProjectById, isLoading } = useNGOProject();
  const project = getProjectById(projectId);
  const members = project?.team || [];

  if (isLoading) return <Team.Skeleton />;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Project Team</CardTitle>
        {onAddMember && (
          <Button size="sm" onClick={onAddMember}>
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No team members yet. Add your first volunteer!
            </div>
          ) : (
            members.map((member) => (
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
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        {member.role}
                      </p>
                      {member.department && (
                        <span className="text-xs bg-muted px-2 py-1 rounded-full">
                          {member.department}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {member.hoursContributed}h contributed
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    member.trainingCompleted 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {member.trainingCompleted ? 'Trained' : 'Training Required'}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Joined {formatDate(member.joinDate)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

Team.Skeleton = function TeamSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-6 w-[140px]" />
        <Skeleton className="h-9 w-[140px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-3 w-[80px] mt-1" />
                </div>
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-[100px]" />
                <Skeleton className="h-3 w-[80px]" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};