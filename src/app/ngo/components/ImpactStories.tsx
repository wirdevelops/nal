import React, { useCallback } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Share2, MessageSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Story } from '@/types/ngo/story';


interface ImpactStoriesProps {
  stories: Story[];
  onLike?: (storyId: string) => void;
  onComment?: (storyId: string) => void;
  onShare?: (storyId: string) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

const StoryCard = React.memo(({ 
  story,
  onLike,
  onComment,
  onShare
}: {
  story: Story;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}) => (
  <Card 
    className="overflow-hidden transition-all hover:scale-[101%] hover:shadow-lg group"
    data-testid="story-card"
  >
    <div className="relative h-48 transition-transform duration-300 hover:brightness-110">
      <Image
        src={story.image}
        alt={story.title}
        layout="fill"
        objectFit="cover"
        className="transition-transform duration-300 group-hover:scale-105"
        priority={false}
        loading="lazy"
      />
      <Badge className="absolute top-4 right-4 backdrop-blur-sm bg-background/80">
        {story.category}
      </Badge>
    </div>

    <CardHeader>
      <CardTitle className="text-lg">{story.title}</CardTitle>
      <p className="text-sm text-muted-foreground">{story.location}</p>
    </CardHeader>

    <CardContent className="space-y-4">
      <p className="text-sm line-clamp-3" title={story.description}>
        {story.description}
      </p>

      <div className="grid grid-cols-3 gap-4 py-4 border-y">
        {Object.entries(story.stats).map(([key, value]) => (
          <div key={key} className="text-center">
            <p className="text-2xl font-bold tabular-nums">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-4 bg-muted p-4 rounded-lg">
        <Avatar className="flex-shrink-0">
          <AvatarImage src={story.beneficiary.avatar} />
          <AvatarFallback>
            {story.beneficiary.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <blockquote className="text-sm italic">
            "{story.beneficiary.quote}"
          </blockquote>
          <p className="text-sm font-medium mt-2">
            - {story.beneficiary.name}
          </p>
        </div>
      </div>
    </CardContent>

    <CardFooter className="border-t pt-4">
      <div className="flex justify-between w-full">
        <EngagementButton
          icon={<Heart className="w-4 h-4 mr-2" />}
          count={story.engagement.likes}
          onClick={onLike}
          ariaLabel={`Like ${story.title}`}
        />
        <EngagementButton
          icon={<MessageSquare className="w-4 h-4 mr-2" />}
          count={story.engagement.comments}
          onClick={onComment}
          ariaLabel={`Comment on ${story.title}`}
        />
        <EngagementButton
          icon={<Share2 className="w-4 h-4 mr-2" />}
          count={story.engagement.shares}
          onClick={onShare}
          ariaLabel={`Share ${story.title}`}
        />
      </div>
    </CardFooter>
  </Card>
));

const EngagementButton = ({
  icon,
  count,
  onClick,
  ariaLabel
}: {
  icon: React.ReactNode;
  count: number;
  onClick?: () => void;
  ariaLabel: string;
}) => (
  <Button
    variant="ghost"
    size="sm"
    onClick={onClick}
    aria-label={ariaLabel}
    className="hover:bg-accent/50 transition-colors"
  >
    {icon}
    <span className="tabular-nums">{count}</span>
  </Button>
);

export function ImpactStories({ 
  stories, 
  onLike, 
  onComment, 
  onShare,
  isLoading = false,
  hasMore = false,
  onLoadMore 
}: ImpactStoriesProps) {
  const handleAction = useCallback((action: Function | undefined, id: string) => {
    action?.(id);
    // Add analytics tracking here
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonStory key={`skeleton-${index}`} />
          ))
        ) : (
          stories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onLike={() => handleAction(onLike, story.id)}
              onComment={() => handleAction(onComment, story.id)}
              onShare={() => handleAction(onShare, story.id)}
            />
          ))
        )}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={onLoadMore}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More Stories'}
          </Button>
        </div>
      )}
    </div>
  );
}

const SkeletonStory = () => (
  <Card className="overflow-hidden">
    <Skeleton className="h-48 w-full rounded-none" />
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-2/3" />
      <div className="grid grid-cols-3 gap-4 py-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </CardContent>
  </Card>
);