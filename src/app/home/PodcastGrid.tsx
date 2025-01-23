import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, Pause, Clock, Calendar, 
  Share2, Bookmark, BookmarkCheck 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface Episode {
  id: string;
  title: string;
  description: string;
  duration: string;
  publishDate: string;
  thumbnail: string;
  audioUrl: string;
  category: string;
  isFeatured?: boolean;
  listens: number;
}

interface PodcastSectionProps {
  episodes: Episode[];
  className?: string;
}

export function PodcastSection({ 
  episodes = [],
  className 
}: PodcastSectionProps) {
  const [playingId, setPlayingId] = React.useState<string | null>(null);
  const [savedEpisodes, setSavedEpisodes] = React.useState<string[]>([]);
  const featuredEpisode = episodes.find(ep => ep.isFeatured);
  const regularEpisodes = episodes.filter(ep => !ep.isFeatured);

  const togglePlay = (id: string) => setPlayingId(playingId === id ? null : id);

  const toggleSave = (id: string) => {
    setSavedEpisodes(prev => 
      prev.includes(id) 
        ? prev.filter(epId => epId !== id)
        : [...prev, id]
    );
  };

  return (
    <section className={cn("py-16 bg-muted/30", className)}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Episodes</h2>
            <p className="text-muted-foreground">
              Inside stories from the film industry's finest
            </p>
          </div>
          <Button variant="outline">View All Episodes</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Episode */}
          {featuredEpisode && (
            <Card className="lg:col-span-2 overflow-hidden group">
              <div className="aspect-[2/1] relative">
                <img 
                  src={featuredEpisode.thumbnail} 
                  alt={featuredEpisode.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <Button 
                  size="lg"
                  variant="secondary"
                  className="absolute bottom-4 left-4"
                  onClick={() => togglePlay(featuredEpisode.id)}
                >
                  {playingId === featuredEpisode.id ? (
                    <><Pause className="mr-2 h-5 w-5" /> Pause</>
                  ) : (
                    <><Play className="mr-2 h-5 w-5" /> Play Episode</>
                  )}
                </Button>
              </div>
              <CardContent className="p-6">
                <Badge className="mb-4">{featuredEpisode.category}</Badge>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {featuredEpisode.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {featuredEpisode.description}
                </p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {featuredEpisode.duration}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDistanceToNow(new Date(featuredEpisode.publishDate), { addSuffix: true })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Regular Episodes List */}
          <div className="lg:col-span-1 space-y-6">
            {regularEpisodes.map(episode => (
              <Card key={episode.id} className="group relative overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <img 
                        src={episode.thumbnail} 
                        alt={episode.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => togglePlay(episode.id)}
                      >
                        {playingId === episode.id ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6" />
                        )}
                      </Button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <Badge variant="outline" className="mb-2">
                          {episode.category}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => toggleSave(episode.id)}
                          >
                            {savedEpisodes.includes(episode.id) ? (
                              <BookmarkCheck className="h-4 w-4" />
                            ) : (
                              <Bookmark className="h-4 w-4" />
                            )}
                          </Button>
                          <Button size="icon" variant="ghost">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <h4 className="font-semibold mb-1 truncate group-hover:text-primary transition-colors">
                        {episode.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {episode.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {episode.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(new Date(episode.publishDate), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}