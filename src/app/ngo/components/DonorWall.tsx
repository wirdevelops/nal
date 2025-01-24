// src/components/DonorWall.tsx
import { useNGOProjectStore } from '@/stores/useNGOProjectStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistance } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const TIER_COLORS = {
  platinum: 'bg-gradient-to-r from-zinc-300 to-zinc-100',
  gold: 'bg-gradient-to-r from-yellow-300 to-yellow-100',
  silver: 'bg-gradient-to-r from-gray-300 to-gray-100',
  bronze: 'bg-gradient-to-r from-amber-700 to-amber-500',
};

interface DonorWallProps {
  projectId: string;
}

export function DonorWall({ projectId }: DonorWallProps) {
  const { getProjectById, isLoading } = useNGOProjectStore();
  const project = getProjectById(projectId);
  
  if (isLoading) return <DonorWall.Skeleton />;

  if (!project?.donations?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Our Generous Donors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            No donations yet – be the first to support this project!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Our Generous Donors</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {project.donations.map((donation) => {
              const donor = donation.donor;
              const isAnonymous = !donor || donation.anonymous;
              
              return (
                <div
                  key={donation.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-muted/50"
                >
                  <Avatar className="w-12 h-12">
                    {!isAnonymous && donor?.avatar ? (
                      <AvatarImage src={donor.avatar} alt={`${donor.name}'s Avatar`} />
                    ) : (
                      <AvatarFallback>
                        {isAnonymous ? 'AN' : donor?.name?.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">
                        {isAnonymous ? 'Anonymous Donor' : donor?.name}
                      </h4>
                      <Badge variant="outline" className={TIER_COLORS[donation.tier]}>
                        {donation.tier}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Donated ${donation.amount.toLocaleString()}
                      {donation.frequency && ` (${donation.frequency})`}
                    </p>

                    {donation.message && (
                      <p className="text-sm italic mt-2">"{donation.message}"</p>
                    )}

                    <p className="text-xs text-muted-foreground">
                      {formatDistance(new Date(donation.date), new Date(), {
                        addSuffix: true
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

DonorWall.Skeleton = function DonorWallSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[200px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4 p-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-3 w-[80px]" />
                <Skeleton className="h-3 w-[160px]" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};