import { 
    Home, PenTool, Users, Palette, DollarSign, 
    Settings, Film, Camera, Music, Video, Boxes,
    Calendar, MessageSquare, BarChart, Share2, 
    FolderOpen, BookOpen, ArrowUpDown, PlaySquare,
    MonitorPlay, Megaphone, Database
  } from 'lucide-react';
  import { ProjectType } from '../../../stores/useProjectStore';
  
  export interface NavItem {
    id: string;
    label: string;
    icon: any; // Lucide icon
    href: string;
    badge?: string;
    requiredRole?: string[];
    availableInPhases?: string[];
    children?: Omit<NavItem, 'children'>[];
  }
  
  export interface NavSection {
    id: string;
    label: string;
    items: NavItem[];
  }
  
  // Common navigation items available for all project types
  const commonNavigation: NavSection[] = [
    {
      id: 'main',
      label: 'Main',
      items: [
        {
          id: 'overview',
          label: 'Overview',
          icon: Home,
          href: '',
        },
        {
          id: 'files',
          label: 'Files',
          icon: FolderOpen,
          href: '/files',
        },
        {
          id: 'team',
          label: 'Team',
          icon: Users,
          href: '/team',
        },
        {
          id: 'schedule',
          label: 'Schedule',
          icon: Calendar,
          href: '/schedule',
        },
        {
          id: 'budget',
          label: 'Budget',
          icon: DollarSign,
          href: '/budget',
        },
      ],
    },
    {
      id: 'communication',
      label: 'Communication',
      items: [
        {
          id: 'messages',
          label: 'Messages',
          icon: MessageSquare,
          href: '/messages',
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: BarChart,
          href: '/analytics',
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: Settings,
          href: '/settings',
        },
      ],
    },
  ];
  
  // Type-specific navigation configurations
  export const projectTypeNavigation: Record<ProjectType, NavSection[]> = {
    feature: [
      {
        id: 'production',
        label: 'Production',
        items: [
          {
            id: 'script',
            label: 'Script',
            icon: PenTool,
            href: '/script',
            children: [
              {
                id: 'screenplay',
                label: 'Screenplay',
                icon: BookOpen,
                href: '/script/screenplay',
              },
              {
                id: 'scenes',
                label: 'Scenes',
                icon: Film,
                href: '/script/scenes',
              },
            ],
          },
          {
            id: 'casting',
            label: 'Casting',
            icon: Users,
            href: '/casting',
            availableInPhases: ['Development', 'Pre-Production'],
          },
          {
            id: 'storyboard',
            label: 'Storyboard',
            icon: Palette,
            href: '/storyboard',
          },
          {
            id: 'shots',
            label: 'Shot List',
            icon: Camera,
            href: '/shots',
          },
        ],
      }
    ],
  
    series: [
      {
        id: 'production',
        label: 'Production',
        items: [
          {
            id: 'writers-room',
            label: "Writers' Room",
            icon: PenTool,
            href: '/writers-room',
          },
          {
            id: 'episodes',
            label: 'Episodes',
            icon: PlaySquare,
            href: '/episodes',
          },
          {
            id: 'casting',
            label: 'Casting',
            icon: Users,
            href: '/casting',
          },
          {
            id: 'continuity',
            label: 'Continuity',
            icon: ArrowUpDown,
            href: '/continuity',
          },
        ],
      }
    ],
  
    commercial: [
      {
        id: 'campaign',
        label: 'Campaign',
        items: [
          {
            id: 'brief',
            label: 'Creative Brief',
            icon: BookOpen,
            href: '/brief',
          },
          {
            id: 'storyboard',
            label: 'Storyboard',
            icon: Palette,
            href: '/storyboard',
          },
          {
            id: 'production',
            label: 'Production',
            icon: Video,
            href: '/production',
          },
          {
            id: 'distribution',
            label: 'Distribution',
            icon: Share2,
            href: '/distribution',
          },
          {
            id: 'campaign',
            label: 'Campaign',
            icon: Megaphone,
            href: '/campaign',
          },
        ],
      }
    ],
  
    music_video: [
      {
        id: 'production',
        label: 'Production',
        items: [
          {
            id: 'concept',
            label: 'Concept',
            icon: Palette,
            href: '/concept',
          },
          {
            id: 'audio',
            label: 'Audio',
            icon: Music,
            href: '/audio',
          },
          {
            id: 'shots',
            label: 'Shot List',
            icon: Camera,
            href: '/shots',
          },
          {
            id: 'performance',
            label: 'Performance',
            icon: Video,
            href: '/performance',
          },
        ],
      }
    ],
  
    animation: [
      {
        id: 'production',
        label: 'Production',
        items: [
          {
            id: 'assets',
            label: 'Assets',
            icon: Boxes,
            href: '/assets',
            children: [
              {
                id: 'characters',
                label: 'Characters',
                icon: Users,
                href: '/assets/characters',
              },
              {
                id: 'environments',
                label: 'Environments',
                icon: Palette,
                href: '/assets/environments',
              },
            ],
          },
          {
            id: 'animation',
            label: 'Animation',
            icon: MonitorPlay,
            href: '/animation',
          },
          {
            id: 'rendering',
            label: 'Rendering',
            icon: Database,
            href: '/rendering',
          },
        ],
      }
    ],
  
    documentary: [
      {
        id: 'production',
        label: 'Production',
        items: [
          {
            id: 'research',
            label: 'Research',
            icon: BookOpen,
            href: '/research',
          },
          {
            id: 'interviews',
            label: 'Interviews',
            icon: Users,
            href: '/interviews',
          },
          {
            id: 'footage',
            label: 'Footage',
            icon: Video,
            href: '/footage',
          },
          {
            id: 'archive',
            label: 'Archive',
            icon: Database,
            href: '/archive',
          },
        ],
      }
    ],
  
    web_series: [
      {
        id: 'production',
        label: 'Production',
        items: [
          {
            id: 'episodes',
            label: 'Episodes',
            icon: PlaySquare,
            href: '/episodes',
          },
          {
            id: 'content',
            label: 'Content',
            icon: Video,
            href: '/content',
          },
          {
            id: 'distribution',
            label: 'Distribution',
            icon: Share2,
            href: '/distribution',
          },
        ],
      }
    ],
  };
  
  // Function to get navigation for a specific project type
  export function getProjectNavigation(type: ProjectType): NavSection[] {
    const typeSpecificNav = projectTypeNavigation[type] || [];
    return [...typeSpecificNav, ...commonNavigation];
  }