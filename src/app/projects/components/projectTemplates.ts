import { ProjectType } from '../../../stores/useProjectStore';

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  type: ProjectType;
  defaultData: Record<string, any>;
  workflows: string[];
  tools: string[];
  phases: {
    name: string;
    tasks: string[];
    deliverables: string[];
  }[];
}

export const featureFilmTemplates: ProjectTemplate[] = [
  {
    id: 'indie-feature',
    name: 'Independent Feature Film',
    description: 'Template for independent feature film production with lean budget focus',
    type: 'feature',
    defaultData: {
      scriptStage: 'treatment',
      distributionStrategy: 'festival',
      targetMarket: 'both',
    },
    workflows: ['script-first', 'budget-conscious', 'festival-oriented'],
    tools: ['script', 'budget', 'schedule', 'casting'],
    phases: [
      {
        name: 'Development',
        tasks: ['Script Development', 'Initial Budget Planning', 'Key Crew Assembly'],
        deliverables: ['Final Script', 'Budget Breakdown', 'Production Schedule'],
      },
      {
        name: 'Pre-Production',
        tasks: ['Location Scouting', 'Casting', 'Equipment Rental'],
        deliverables: ['Location Agreements', 'Cast Contracts', 'Shot Lists'],
      },
    ],
  },
  {
    id: 'studio-feature',
    name: 'Studio Feature Film',
    description: 'Template for studio-backed feature film production',
    type: 'feature',
    defaultData: {
      scriptStage: 'final-draft',
      distributionStrategy: 'theatrical',
      targetMarket: 'international',
    },
    workflows: ['studio-standard', 'multi-department'],
    tools: ['script', 'budget', 'schedule', 'casting', 'vfx'],
    phases: [
      {
        name: 'Development',
        tasks: ['Script Finalization', 'Budget Approval', 'Department Heads Hiring'],
        deliverables: ['Production Budget', 'Shooting Script', 'Production Schedule'],
      },
    ],
  },
];

export const seriesTemplates: ProjectTemplate[] = [
  {
    id: 'streaming-series',
    name: 'Streaming Series',
    description: 'Template for streaming platform series production',
    type: 'series',
    defaultData: {
      numberOfSeasons: 1,
      episodesPerSeason: 8,
      format: 'scripted',
    },
    workflows: ['writers-room', 'episode-block'],
    tools: ['script', 'writers-room', 'schedule', 'casting'],
    phases: [
      {
        name: 'Development',
        tasks: ['Series Bible Creation', 'Season Arc Planning', 'Episode Outlines'],
        deliverables: ['Series Bible', 'Season Outline', 'Pilot Script'],
      },
    ],
  },
];

export const documentaryTemplates: ProjectTemplate[] = [
  {
    id: 'feature-doc',
    name: 'Feature Documentary',
    description: 'Template for feature-length documentary production',
    type: 'documentary',
    defaultData: {
      style: 'observational',
      archivalFootage: true,
    },
    workflows: ['research-first', 'interview-based'],
    tools: ['research', 'interviews', 'archive'],
    phases: [
      {
        name: 'Research',
        tasks: ['Subject Research', 'Interview Planning', 'Archive Search'],
        deliverables: ['Research Document', 'Interview List', 'Archive Log'],
      },
    ],
  },
];

export const commercialTemplates: ProjectTemplate[] = [
  {
    id: 'brand-commercial',
    name: 'Brand Commercial',
    description: 'Template for brand commercial production',
    type: 'commercial',
    defaultData: {
      format: 'tv',
      duration: 30,
    },
    workflows: ['client-approval', 'multi-platform'],
    tools: ['storyboard', 'client-portal', 'budget'],
    phases: [
      {
        name: 'Pre-Production',
        tasks: ['Creative Brief', 'Storyboard', 'Client Approval'],
        deliverables: ['Approved Creative', 'Production Schedule', 'Budget'],
      },
    ],
  },
];

export const musicVideoTemplates: ProjectTemplate[] = [
  {
    id: 'performance-mv',
    name: 'Performance Music Video',
    description: 'Template for performance-based music video production',
    type: 'music_video',
    defaultData: {
      performanceType: 'lip-sync',
      specialEffects: true,
    },
    workflows: ['performance-focused', 'quick-turnaround'],
    tools: ['schedule', 'visual-ref', 'edit'],
    phases: [
      {
        name: 'Pre-Production',
        tasks: ['Performance Planning', 'Location Scouting', 'Shot Design'],
        deliverables: ['Shot List', 'Location Agreement', 'Performance Schedule'],
      },
    ],
  },
];

export const webSeriesTemplates: ProjectTemplate[] = [
  {
    id: 'youtube-series',
    name: 'YouTube Series',
    description: 'Template for YouTube series production',
    type: 'web_series',
    defaultData: {
      format: 'entertainment',
      releaseSchedule: 'weekly',
    },
    workflows: ['quick-production', 'social-media'],
    tools: ['schedule', 'social', 'analytics'],
    phases: [
      {
        name: 'Planning',
        tasks: ['Content Calendar', 'Episode Planning', 'SEO Research'],
        deliverables: ['Content Schedule', 'Episode Outlines', 'SEO Strategy'],
      },
    ],
  },
];

export const animationTemplates: ProjectTemplate[] = [
  {
    id: '3d-animation',
    name: '3D Animation Project',
    description: 'Template for 3D animation production',
    type: 'animation',
    defaultData: {
      style: '3d',
      frameRate: 24,
    },
    workflows: ['asset-pipeline', '3d-production'],
    tools: ['3d-assets', 'render', 'composite'],
    phases: [
      {
        name: 'Pre-Production',
        tasks: ['Character Design', 'Environment Design', 'Storyboard'],
        deliverables: ['Character Models', 'Environment Assets', 'Animatic'],
      },
    ],
  },
];

// Combine all templates
export const projectTemplates = {
  feature: featureFilmTemplates,
  series: seriesTemplates,
  documentary: documentaryTemplates,
  commercial: commercialTemplates,
  music_video: musicVideoTemplates,
  web_series: webSeriesTemplates,
  animation: animationTemplates,
};

// Helper function to get templates by project type
export function getTemplatesByType(type: ProjectType): ProjectTemplate[] {
  return projectTemplates[type] || [];
}

// Helper function to get a specific template
export function getTemplateById(id: string): ProjectTemplate | undefined {
  return Object.values(projectTemplates)
    .flat()
    .find(template => template.id === id);
}