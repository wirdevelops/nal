import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Define the layout keys
type LayoutId = 'dashboard' | 'toolCentric' | 'communication' | 'hub' | 'workspace' | 'portal';

// Layout store type definition
interface LayoutStore {
  globalLayout: LayoutId;
  sectionLayouts: Record<string, LayoutId>;
  setGlobalLayout: (layout: LayoutId) => void;
  setSectionLayout: (section: string, layout: LayoutId) => void;
  resetSectionLayout: (section: string) => void;
}

// Create the layout store
export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set) => ({
      globalLayout: 'dashboard',
      sectionLayouts: {},
      setGlobalLayout: (layout) => set({ globalLayout: layout }),
      setSectionLayout: (section, layout) =>
        set((state) => ({
          sectionLayouts: {
            ...state.sectionLayouts,
            [section]: layout,
          },
        })),
      resetSectionLayout: (section) =>
        set((state) => {
          const sectionLayouts = { ...state.sectionLayouts };
          delete sectionLayouts[section];
          return { sectionLayouts };
        }),
    }),
    {
      name: 'layout-preferences',
    }
  )
);