import {
    FileText, Users, Calendar, DollarSign, Film, Camera,
     Palette, Settings, BookOpen, Layout, PenTool, Box,
    AudioLines, Share2, BarChart, Megaphone, Clapperboard,
    MonitorPlay, Library, Cast, SplitSquareVertical, Folder,
    Brush, Layers, Database
  } from 'lucide-react';
  
  export interface ProjectTool {
    id: string;
    name: string;
    description: string;
    icon: any; // Lucide icon component
    path: string;
    requiredRole?: string[];
    availableInPhases?: string[];
  }
  
  export interface ProjectToolCategory {
    id: string;
    name: string;
    tools: ProjectTool[];
  }
  
  // Common tools available across all project types
  export const commonTools: ProjectTool[] = [
    {
        id: 'overview',
        name: 'Overview',
        description: 'Project dashboard and overview',
        icon: Layout,
        path: '',
    },
    {
        id: 'script',
        name: 'Script',
        description: 'Script writing and management',
        icon: FileText,
        path: '/script',
    },
    {
        id: 'schedule',
        name: 'Schedule',
        description: 'Production schedule and timeline',
        icon: Calendar,
        path: '/schedule',
    },
    {
        id: 'budget',
        name: 'Budget',
        description: 'Budget management and tracking',
        icon: DollarSign,
        path: '/budget',
    },
    {
        id: 'team',
        name: 'Team',
        description: 'Team management and roles',
        icon: Users,
        path: '/team',
    },
    {
        id: 'settings',
        name: 'Settings',
        description: 'Project settings and configuration',
        icon: Settings,
        path: '/settings',
    },
  ];
  
  // Type-specific tools configurations
  export const projectTypeTools: Record<string, ProjectToolCategory[]> = {
    feature: [
      {
        id: 'development',
        name: 'Development',
        tools: [
            {
                id: 'screenplay',
                name: 'Screenplay',
                description: 'Screenplay writing and versioning',
                icon: PenTool,
                path: '/screenplay',
                availableInPhases: ['Development'],
            },
            {
                id: 'storyboard',
                name: 'Storyboard',
                description: 'Visual planning and storyboarding',
                icon: SplitSquareVertical,
                path: '/storyboard',
            },
            {
                id: 'casting',
                name: 'Casting',
                description: 'Casting management and auditions',
                icon: Cast,
                path: '/casting',
            },
        ],
      },
      {
        id: 'production',
        name: 'Production',
        tools: [
            {
                id: 'shot-list',
                name: 'Shot List',
                description: 'Shot planning and management',
                icon: Camera,
                path: '/shots',
            },
            {
                id: 'dailies',
                name: 'Dailies',
                description: 'Daily footage review',
                icon: Film,
                path: '/dailies',
            },
            {
                id: 'assets',
                name: 'Assets',
                description: 'Production assets management',
                icon: Folder,
                path: '/assets',
            },
        ],
      },
    ],
  
    series: [
        {
            id: 'development',
            name: 'Development',
            tools: [
                {
                    id: 'writers-room',
                    name: 'Writers Room',
                    description: 'Collaborative script development',
                    icon: BookOpen,
                    path: '/writers-room',
                },
                {
                    id: 'series-bible',
                    name: 'Series Bible',
                    description: 'Series bible and documentation',
                    icon: Library,
                    path: '/series-bible',
                },
            ],
        },
        {
            id: 'episodes',
            name: 'Episodes',
            tools: [
                {
                    id: 'episode-manager',
                    name: 'Episode Manager',
                    description: 'Episode planning and tracking',
                    icon: MonitorPlay,
                    path: '/episodes',
                },
            ],
        },
    ],
  
    animation: [
        {
            id: 'pre-production',
            name: 'Pre-Production',
            tools: [
                {
                    id: 'character-design',
                    name: 'Character Design',
                    description: 'Character design and assets',
                    icon: Brush,
                    path: '/characters',
                },
                {
                    id: 'environment',
                    name: 'Environment',
                    description: 'Environment design and assets',
                    icon: Box,
                    path: '/environment',
                },
                {
                    id: 'asset-library',
                    name: 'Asset Library',
                    description: 'Animation asset management',
                    icon: Database,
                    path: '/assets',
                },
            ],
        },
        {
            id: 'production',
            name: 'Production',
            tools: [
                {
                    id: 'animation',
                    name: 'Animation',
                    description: 'Animation workspace',
                    icon: Clapperboard,
                    path: '/animation',
                },
                {
                    id: 'compositing',
                    name: 'Compositing',
                    description: 'Scene compositing',
                    icon: Layers,
                    path: '/compositing',
                },
            ],
        },
    ],
  
    commercial: [
      {
          id: 'pre-production',
          name: 'Pre-Production',
          tools: [
              {
                  id: 'creative-brief',
                  name: 'Creative Brief',
                  description: 'Campaign brief and planning',
                  icon: BookOpen,
                  path: '/brief',
              },
              {
                  id: 'moodboard',
                  name: 'Moodboard',
                  description: 'Visual reference and style',
                  icon: Palette,
                  path: '/moodboard',
              },
          ],
      },
      {
          id: 'delivery',
          name: 'Delivery',
          tools: [
              {
                  id: 'campaign',
                  name: 'Campaign',
                  description: 'Campaign management',
                  icon: Megaphone,
                  path: '/campaign',
              },
              {
                  id: 'distribution',
                  name: 'Distribution',
                  description: 'Media distribution',
                  icon: Share2,
                  path: '/distribution',
              },
              {
                  id: 'analytics',
                  name: 'Analytics',
                  description: 'Campaign performance',
                  icon: BarChart,
                  path: '/analytics',
              },
          ],
      },
    ],
  
    music_video: [
        {
            id: 'pre-production',
            name: 'Pre-Production',
            tools: [
                {
                    id: 'audio-sync',
                    name: 'Audio Sync',
                    description: 'Music sync and timing',
                    icon: AudioLines,
                    path: '/audio-sync',
                },
                {
                    id: 'visual-style',
                    name: 'Visual Style',
                    description: 'Visual style development',
                    icon: Palette,
                    path: '/style',
                },
            ],
        },
    ],
  };
  
  // Helper functions
  export function getToolsByType(type: string): ProjectToolCategory[] {
    return projectTypeTools[type] || [];
  }
  
  export function getAllToolsForType(type: string): ProjectTool[] {
    return [
        ...commonTools,
        ...getToolsByType(type).flatMap(category => category.tools),
    ];
  }
  
  export function getToolById(type: string, toolId: string): ProjectTool | undefined {
    const allTools = getAllToolsForType(type);
    return allTools.find(tool => tool.id === toolId);
  }
  
  export function getToolsByPhase(type: string, phase: string): ProjectTool[] {
    return getAllToolsForType(type).filter(tool => 
      !tool.availableInPhases || tool.availableInPhases.includes(phase)
    );
  }
  
  export function getRequiredToolsForPhase(type: string, phase: string): ProjectTool[] {
  return getAllToolsForType(type).filter(tool => 
    tool.availableInPhases?.includes(phase)
  );
  }