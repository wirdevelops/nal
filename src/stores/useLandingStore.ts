// stores/useLandingStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LandingState {
  heroContent: {
    title: string;
    subtitle: string;
    backgroundImages: { url: string; alt: string; }[];
    ctaButtons: { text: string; link: string; variant: 'primary' | 'secondary'; }[];
  };
  projects: any[];
  impactStats: any[];
  opportunities: any[];
  episodes: any[];
  products: any[];
  isLoading: boolean;
  error: string | null;

  // Actions
  updateHeroContent: (content: Partial<LandingState['heroContent']>) => void;
  setProjects: (projects: any[]) => void;
  setOpportunities: (opportunities: any[]) => void;
  setEpisodes: (episodes: any[]) => void;
  setProducts: (products: any[]) => void;
  fetchLandingData: () => Promise<void>;
}

export const useLandingStore = create<LandingState>()(
  persist(
    (set, get) => ({
      heroContent: {
        title: "Building Tomorrow's Stories Today",
        subtitle: "Join the creative revolution in film and television",
        backgroundImages: [],
        ctaButtons: [
          {
            text: "Explore Projects",
            link: "/projects",
            variant: "primary"
          },
          {
            text: "Join Community",
            link: "/join",
            variant: "secondary"
          }
        ]
      },
      projects: [],
      impactStats: [],
      opportunities: [],
      episodes: [],
      products: [],
      isLoading: false,
      error: null,

      updateHeroContent: (content) => 
        set(state => ({
          heroContent: { ...state.heroContent, ...content }
        })),

      setProjects: (projects) => set({ projects }),
      setOpportunities: (opportunities) => set({ opportunities }),
      setEpisodes: (episodes) => set({ episodes }),
      setProducts: (products) => set({ products }),

      fetchLandingData: async () => {
        set({ isLoading: true, error: null });
        try {
          // Fetch data from your API
          const data = await fetch('/api/landing').then(res => res.json());
          set({
            projects: data.projects,
            impactStats: data.stats,
            opportunities: data.opportunities,
            episodes: data.episodes,
            products: data.products
          });
        } catch (error) {
          set({ error: 'Failed to load landing page data' });
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'landing-storage'
    }
  )
);