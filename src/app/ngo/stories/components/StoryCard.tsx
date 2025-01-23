import { Story } from '@/types/ngo/story';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

interface StoryCardProps {
  story: Story;
  onFeature?: () => void;
  className?: string;
}

export const StoryCard = ({ story, onFeature, className }: StoryCardProps) => (
  <div className={`bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${className || ''}`}>
    <div className="relative aspect-video">
      <img
        src={story.imageUrl}
        alt={story.title}
        className="object-cover w-full h-full"
      />
      {story.isFeatured && (
        <Badge className="absolute top-2 left-2">Featured</Badge>
      )}
    </div>
    
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Badge variant="secondary">{story.category}</Badge>
        <span className="text-sm text-muted-foreground">
          {new Date(story.date).toLocaleDateString()}
        </span>
      </div>

      <h3 className="font-semibold text-xl mb-2">{story.title}</h3>
      <p className="text-muted-foreground mb-4 line-clamp-3">{story.excerpt}</p>

      <div className="flex items-center gap-4 mb-4">
        <Avatar>
          {story.author.avatar ? (
            <AvatarImage src={story.author.avatar} alt={story.author.name} />
          ) : (
            <AvatarFallback>
              {story.author.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <p className="font-medium">{story.author.name}</p>
          <p className="text-sm text-muted-foreground">
            {story.author.role} • {story.author.organization}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-4 text-muted-foreground">
          <Button variant="ghost" className="gap-2">
            <Heart className="w-4 h-4" />
            <span>{story.likesCount}</span>
          </Button>
          <Button variant="ghost" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            <span>{story.commentsCount}</span>
          </Button>
          <Button variant="ghost" className="gap-2">
            <Share2 className="w-4 h-4" />
            <span>{story.sharesCount}</span>
          </Button>
        </div>
        <div className="flex gap-2">
          {onFeature && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onFeature}
            >
              {story.isFeatured ? 'Unfeature' : 'Feature'}
            </Button>
          )}
          <Button variant="outline" size="sm">
            {story.readTimeMinutes} min read
          </Button>
        </div>
      </div>
    </div>
  </div>
);