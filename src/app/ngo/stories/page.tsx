'use client';

import { useStories } from 'others/useStories';
import { StoryCategory } from '@/types/ngo/story';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { StoryCard } from './components/StoryCard';
import { SubmitStoryModal } from './components/SubmitStoryModal';
import { Pagination } from './components/Pagination';
import { SocialShare } from './components/SocialShare';
import { useEffect, useState, useMemo } from 'react';
import { useToast } from '@/components/ui/use-toast';

export default function StoriesPage() {
  const { toast } = useToast();
  const {
    stories,
    featuredStory,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setFeatured,
    addStory,
    isLoading,
    error,
  } = useStories();

  const [currentPage, setCurrentPage] = useState(1);
  const storiesPerPage = 9;

  // Memoized filtered stories
  const filteredStories = useMemo(() => 
    stories.filter(story => !story.isFeatured),
    [stories]
  );

  const pageCount = Math.ceil(filteredStories.length / storiesPerPage);

  // Improved debounce implementation
  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on search/category change
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery, selectedCategory]);

  const handleFeatureStory = (storyId: string) => {
    setFeatured(storyId);
    toast({
      title: 'Story Updated',
      description: featuredStory?.id === storyId 
        ? 'Story unfeatured successfully' 
        : 'Story featured successfully',
    });
  };

  if (error) {
    return (
        <div className="container max-w-6xl mx-auto px-4 py-8 text-center text-red-500">
            Error loading stories:  {'An error has occurred. Please try again.'}
        </div>
    );
}

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* Header  */}
      <div className="text-center mb-12 space-y-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Impact Stories
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Witness the transformative power of community action through these inspiring stories.
        </p>
        <SocialShare 
          url={typeof window !== 'undefined' ? window.location.href : ''} 
          title="Check out these inspiring stories!" 
          className="justify-center mt-4"
        />
      </div>

      {/* Featured Story */}
      {featuredStory && (
        <div className="mb-12 relative group">
          <StoryCard 
            story={featuredStory} 
            onFeature={() => handleFeatureStory(featuredStory.id)}
            className="border-2 border-primary/20 hover:border-primary/40 transition-colors"
          />
          <div className="absolute top-4 right-4">
            <Badge variant="default" className="px-3 py-1 text-sm bg-primary/90">
              Featured Story
            </Badge>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-0 bg-background/95 backdrop-blur z-20 py-4 border-b">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search stories..."
            className="pl-10 pr-4 h-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search stories"
          />
        </div>
        <div className="flex gap-4 flex-col md:flex-row w-full md:w-auto">
          <Select
            value={selectedCategory}
            onValueChange={(value: StoryCategory | 'all') => setSelectedCategory(value)}
          >
            <SelectTrigger className="w-full md:w-[200px] h-12">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.values(StoryCategory).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <SubmitStoryModal onStorySubmit={addStory} />
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[420px] w-full rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories
              .slice((currentPage - 1) * storiesPerPage, currentPage * storiesPerPage)
              .map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onFeature={() => handleFeatureStory(story.id)}
                />
              ))}
          </div>

          {/* Empty State */}
          {filteredStories.length === 0 && (
            <div className="text-center py-12 space-y-6">
              <div className="text-6xl">🔍</div>
              <p className="text-xl text-muted-foreground">
                No stories found matching your criteria
              </p>
              <SubmitStoryModal onStorySubmit={addStory} />
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pageCount}
          onPageChange={setCurrentPage}
          className="mt-12"
        />
      )}
    </div>
  );
}