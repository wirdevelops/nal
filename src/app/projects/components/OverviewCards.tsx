import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { 
  Film, PenTool, Users, Clock, Clapperboard, 
  Camera, Music, Video, BarChart, Share2, 
  PlaySquare, Box 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Feature Film Overview Card
export function FeatureFilmOverview({ projectId, data }: any) {
  const router = useRouter();

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-primary" />
            <CardTitle>Production Overview</CardTitle>
          </div>
          <Badge variant={data.scriptStage === 'final-draft' ? 'default' : 'secondary'}>
            {data.scriptStage}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {/* Script Status */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Script Progress</p>
            <div className="flex justify-between">
              <span className="font-medium">{data.scriptStage}</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push(`/projects/${projectId}/script`)}
              >
                <PenTool className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Cast & Crew */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Cast & Crew</p>
            <div className="flex justify-between">
              <span className="font-medium">{data.team?.members?.length || 0} members</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push(`/projects/${projectId}/team`)}
              >
                <Users className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Production Timeline */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Timeline</p>
            <div className="flex justify-between">
              <span className="font-medium">{data.duration || 0} days</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push(`/projects/${projectId}/schedule`)}
              >
                <Clock className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Series Overview Card
export function SeriesOverview({ projectId, data }: any) {
  const router = useRouter();

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlaySquare className="w-5 h-5 text-primary" />
            <CardTitle>Series Overview</CardTitle>
          </div>
          <Badge>
            {data.numberOfSeasons} Season{data.numberOfSeasons > 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Episodes</p>
            <div className="flex justify-between">
              <span className="font-medium">{data.episodesPerSeason} per season</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push(`/projects/${projectId}/episodes`)}
              >
                <Video className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Duration</p>
            <div className="flex justify-between">
              <span className="font-medium">{data.episodeDuration} min</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push(`/projects/${projectId}/schedule`)}
              >
                <Clock className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Platform</p>
            <div className="flex justify-between">
              <span className="font-medium">{data.platform}</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push(`/projects/${projectId}/distribution`)}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Commercial Overview Card
export function CommercialOverview({ projectId, data }: any) {
  const router = useRouter();

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            <CardTitle>Campaign Overview</CardTitle>
          </div>
          <Badge>{data.format}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Duration</p>
            <div className="flex justify-between">
              <span className="font-medium">{data.duration}s</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push(`/projects/${projectId}/brief`)}
              >
                <Clock className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Platform</p>
            <div className="flex justify-between">
              <span className="font-medium">{data.platform}</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push(`/projects/${projectId}/distribution`)}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Analytics</p>
            <div className="flex justify-between">
              <span className="font-medium">View Stats</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push(`/projects/${projectId}/analytics`)}
              >
                <BarChart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Animation Overview Card
export function AnimationOverview({ projectId, data }: any) {
  const router = useRouter();

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-primary" />
            <CardTitle>Animation Overview</CardTitle>
          </div>
          <Badge>{data.style}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Assets</p>
            <div className="flex justify-between">
              <span className="font-medium">{data.characterCount} characters</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push(`/projects/${projectId}/assets`)}
              >
                <Box className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Frame Rate</p>
            <div className="flex justify-between">
              <span className="font-medium">{data.frameRate} fps</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push(`/projects/${projectId}/animation`)}
              >
                <Clapperboard className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Resolution</p>
            <div className="flex justify-between">
              <span className="font-medium">{data.resolution}</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push(`/projects/${projectId}/render`)}
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Music Video Overview Card
export function MusicVideoOverview({ projectId, data }: any) {
  const router = useRouter();

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-primary" />
            <CardTitle>Music Video Overview</CardTitle>
          </div>
          <Badge>{data.performanceType}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Artist</p>
            <div className="flex justify-between">
              <span className="font-medium">{data.artist}</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push(`/projects/${projectId}/brief`)}
              >
                <Users className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Duration</p>
            <div className="flex justify-between">
              <span className="font-medium">{data.duration}</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push(`/projects/${projectId}/timeline`)}
              >
                <Clock className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Special Effects</p>
            <div className="flex justify-between">
              <span className="font-medium">{data.specialEffects ? 'Yes' : 'No'}</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push(`/projects/${projectId}/effects`)}
              >
                <Clapperboard className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}