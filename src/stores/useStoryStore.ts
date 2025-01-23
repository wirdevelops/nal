import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Story, StoryCategory, StoryCreateDTO, StoryUpdateDTO } from '@/types/ngo/story';

interface StoryState {
  stories: Story[];
  isLoading: boolean;
  error: string | null;
  
  // Local actions
  addStory: (story: StoryCreateDTO) => void;
  updateStory: (id: string, updates: StoryUpdateDTO) => void;
  deleteStory: (id: string) => void;
  setFeatured: (id: string) => void;
  
  // API actions (commented out)
  fetchStories: () => Promise<void>;
  searchStories: (query: string) => Promise<Story[]>;
  
  // Selectors
  getFeaturedStory: () => Story | undefined;
  getFilteredStories: (category: StoryCategory | 'all', searchQuery: string) => Story[];
}

export const useStoryStore = create<StoryState>()(
  persist(
    (set, get) => ({
      stories: [
        {
          id: uuidv4(),
          title: 'Transforming Lives Through Education',
          excerpt: 'How our literacy program is making a difference in rural communities.',
          content: '...',
          imageUrl: '/stories/education.jpg',
          category: StoryCategory.EDUCATION,
          author: {
            id: uuidv4(),
            name: 'Sarah Wilson',
            avatar: '/team/sarah.jpg',
            role: 'Program Director',
            organization: 'Education For All'
          },
          date: '2024-01-15',
          readTimeMinutes: 5,
          likesCount: 128,
          commentsCount: 24,
          sharesCount: 45,
          isFeatured: true,
          beneficiary: {
            name: 'Mary Johnson',
            quote: 'This program changed my life and opened new opportunities for my family.',
            location: 'Rural Cameroon'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      isLoading: false,
      error: null,

      // Local actions
      addStory: (story) => set((state) => ({
        stories: [{
          ...story,
          id: uuidv4(),
          likesCount: 0,
          commentsCount: 0,
          sharesCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, ...state.stories]
      })),

      updateStory: (id, updates) => set((state) => ({
        stories: state.stories.map(story => 
          story.id === id ? { ...story, ...updates, updatedAt: new Date().toISOString() } : story
        )
      })),

      deleteStory: (id) => set((state) => ({
        stories: state.stories.filter(story => story.id !== id)
      })),

      setFeatured: (id) => set((state) => ({
        stories: state.stories.map(story => ({
          ...story,
          isFeatured: story.id === id
        }))
      })),

      // API actions (skeletons)
      fetchStories: async () => {
        /* 
        try {
          set({ isLoading: true });
          const response = await fetch('/api/stories');
          const data = await response.json();
          set({ stories: data, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch stories', isLoading: false });
        }
        */
      },

      searchStories: async (query) => {
        /*
        // API implementation would go here
        return [];
        */
        return get().stories.filter(story => 
          story.title.toLowerCase().includes(query.toLowerCase())
        );
      },

      // Selectors
      getFeaturedStory: () => get().stories.find(story => story.isFeatured),
      
      getFilteredStories: (category, searchQuery) => {
        return get().stories.filter(story => {
          const matchesCategory = category === 'all' || story.category === category;
          const matchesSearch = searchQuery 
            ? story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              story.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
          return matchesCategory && matchesSearch;
        });
      }
    }),
    {
      name: 'story-storage',
    }
  )
);