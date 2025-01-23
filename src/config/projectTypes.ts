import {
    Film, 
    Tv, 
    Video, 
    Music, 
    Camera, 
    Play,
    Clapperboard, 
    PencilLine, 
    Clock, 
    Users,
    DollarSign, 
    Briefcase, 
    Palette
  } from 'lucide-react';
  import type { ProjectType, ProjectTypeId, QuickStartOption } from '@/types/project-types/projectTypes';
  
  export const PROJECT_TYPES: ProjectType[] = [
    {
      id: 'feature',
      label: 'Feature Film',
      icon: Film,
      description: 'Full-length narrative film for theatrical or streaming release',
      quickOptions: [
        {
          id: 'storytelling',
          icon: PencilLine,
          title: 'Start with Long format storytelling',
          description: 'Begin project focusing on long format storytelling',
          primaryTool: 'script'
        },
        {
          id: 'budgeting',
          icon: DollarSign,
          title: 'Start with Complex budgeting',
          description: 'Begin with financial planning and budget management',
          primaryTool: 'budget'
        },
        {
          id: 'production',
          icon: Clock,
          title: 'Start with Production planning',
          description: 'Begin with scheduling and resource management',
          primaryTool: 'schedule'
        }
      ]
    },
    {
      id: 'series',
      label: 'TV Series',
      icon: Tv,
      description: 'Multi-episode content for television or streaming platforms',
      quickOptions: [
        {
          id: 'writers-room',
          icon: PencilLine,
          title: 'Start with Writers Room',
          description: 'Begin with episode scripting and series bible',
          primaryTool: 'script'
        },
        {
          id: 'season-planning',
          icon: Clock,
          title: 'Start with Season Planning',
          description: 'Begin with season structure and timeline',
          primaryTool: 'schedule'
        }
      ]
    },
    {
      id: 'commercial',
      label: 'Commercial',
      icon: Video,
      description: 'Advertising content for brands and businesses',
      quickOptions: [
        {
          id: 'brief',
          icon: Briefcase,
          title: 'Start with Creative Brief',
          description: 'Begin with client requirements and objectives',
          primaryTool: 'brief'
        },
        {
          id: 'storyboard',
          icon: Palette,
          title: 'Start with Storyboarding',
          description: 'Begin with visual planning and concepts',
          primaryTool: 'storyboard'
        }
      ]
    },
    {
      id: 'music_video',
      label: 'Music Video',
      icon: Music,
      description: 'Visual content for musical artists',
      quickOptions: [
        {
          id: 'concept',
          icon: Palette,
          title: 'Start with Visual Concept',
          description: 'Begin with creative direction and mood boards',
          primaryTool: 'concept'
        },
        {
          id: 'timing',
          icon: Clock,
          title: 'Start with Music Timing',
          description: 'Begin with music analysis and shot timing',
          primaryTool: 'timing'
        }
      ]
    },
    {
      id: 'documentary',
      label: 'Documentary',
      icon: Camera,
      description: 'Non-fiction storytelling and research-based content',
      quickOptions: [
        {
          id: 'research',
          icon: PencilLine,
          title: 'Start with Research',
          description: 'Begin with subject research and planning',
          primaryTool: 'research'
        },
        {
          id: 'interviews',
          icon: Users,
          title: 'Start with Interview Planning',
          description: 'Begin with subject interviews and scheduling',
          primaryTool: 'interviews'
        }
      ]
    },
    {
      id: 'web_series',
      label: 'Web Series',
      icon: Play,
      description: 'Short-form episodic content for online platforms',
      quickOptions: [
        {
          id: 'episodes',
          icon: PencilLine,
          title: 'Start with Episode Planning',
          description: 'Begin with episode structure and content',
          primaryTool: 'script'
        },
        {
          id: 'distribution',
          icon: Play,
          title: 'Start with Platform Planning',
          description: 'Begin with distribution and platform strategy',
          primaryTool: 'distribution'
        }
      ]
    },
    {
      id: 'animation',
      label: 'Animation',
      icon: Clapperboard,
      description: 'Animated content across various formats',
      quickOptions: [
        {
          id: 'storyboard',
          icon: Palette,
          title: 'Start with Storyboarding',
          description: 'Begin with visual development and boards',
          primaryTool: 'storyboard'
        },
        {
          id: 'assets',
          icon: Briefcase,
          title: 'Start with Asset Planning',
          description: 'Begin with character and environment design',
          primaryTool: 'assets'
        }
      ]
    }
  ];
  
  // Helper functions for working with project types
  export function getProjectType(id: ProjectTypeId): ProjectType | undefined {
    return PROJECT_TYPES.find(type => type.id === id);
  }
  
  export function getQuickStartOption(
    typeId: ProjectTypeId, 
    optionId: string
  ): QuickStartOption | undefined {
    const projectType = getProjectType(typeId);
    return projectType?.quickOptions?.find(option => option.id === optionId);
  }
  
  export function validateProjectType(type: string): type is ProjectTypeId {
    return PROJECT_TYPES.some(pt => pt.id === type);
  }
  
  // Constants for project configuration
  export const PROJECT_DEFAULTS = {
    primaryTool: 'overview',
    initialPhase: 'Development',
    initialStatus: 'active',
  } as const;
  
  // Type-specific tool configurations
  export const PROJECT_TOOLS = {
    feature: ['script', 'casting', 'budget', 'schedule', 'moodboard'],
    series: ['writers-room', 'episodes', 'casting', 'schedule'],
    commercial: ['brief', 'storyboard', 'budget', 'schedule'],
    music_video: ['concept', 'timing', 'performance', 'edit'],
    documentary: ['research', 'interviews', 'footage', 'schedule'],
    web_series: ['episodes', 'distribution', 'analytics'],
    animation: ['storyboard', 'assets', 'animation', 'render']
  } as const;