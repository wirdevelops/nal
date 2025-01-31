import { useStoryStore } from '@/stores/useStoryStore';
import { StoryCategory } from '@/types/ngo/story';
import { useEffect, useState } from 'react';

export const useStories = () => {
  const {
    stories,
    isLoading,
    error,
    addStory,
    updateStory,
    deleteStory,
    setFeatured,
    fetchStories,
    getFeaturedStory,
    getFilteredStories
  } = useStoryStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<StoryCategory | 'all'>('all');

  // Load stories on mount
  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const filteredStories = getFilteredStories(selectedCategory, searchQuery);
  const featuredStory = getFeaturedStory();

  return {
    isLoading,
    error,
    stories: filteredStories,
    featuredStory,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    addStory,
    updateStory,
    deleteStory,
    setFeatured
  };
};