'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Upload,
  Users,
  MessageSquare,
  Calendar,
  FileText,
  Share2,
  Settings,
  Film,
  Video,
  Music,
  Boxes,
  Clapperboard,
} from 'lucide-react';
import { ProjectType } from '../../../stores/useProjectStore';

interface QuickAction {
  label: string;
  icon: React.ElementType;
  href: string;
  variant?: 'default' | 'secondary' | 'outline';
}

const commonActions: QuickAction[] = [
  {
    label: 'Add Team Member',
    icon: Users,
    href: '/team/invite',
    variant: 'outline',
  },
  {
    label: 'Upload Files',
    icon: Upload,
    href: '/files/upload',
    variant: 'outline',
  },
  {
    label: 'Schedule Meeting',
    icon: Calendar,
    href: '/schedule/meeting',
    variant: 'outline',
  },
];

const typeSpecificActions: Record<ProjectType, QuickAction[]> = {
  feature: [
    {
      label: 'Create Scene',
      icon: Film,
      href: '/script/scenes/new',
      variant: 'default',
    },
    {
      label: 'Add Shot List',
      icon: Video,
      href: '/shots/new',
      variant: 'outline',
    },
    {
      label: 'Schedule Shoot',
      icon: Calendar,
      href: '/schedule/shoot',
      variant: 'outline',
    },
  ],
  series: [
    {
      label: 'New Episode',
      icon: Video,
      href: '/episodes/new',
      variant: 'default',
    },
    {
      label: 'Writers Room',
      icon: FileText,
      href: '/writers-room',
      variant: 'outline',
    },
    {
      label: 'Season Planning',
      icon: Calendar,
      href: '/season-planning',
      variant: 'outline',
    },
  ],
  commercial: [
    {
      label: 'Create Brief',
      icon: FileText,
      href: '/brief/new',
      variant: 'default',
    },
    {
      label: 'Client Review',
      icon: Share2,
      href: '/review/client',
      variant: 'outline',
    },
    {
      label: 'Campaign Setup',
      icon: Settings,
      href: '/campaign/setup',
      variant: 'outline',
    },
  ],
  music_video: [
    {
      label: 'New Shot',
      icon: Video,
      href: '/shots/new',
      variant: 'default',
    },
    {
      label: 'Audio Sync',
      icon: Music,
      href: '/audio/sync',
      variant: 'outline',
    },
    {
      label: 'Performance',
      icon: Film,
      href: '/performance',
      variant: 'outline',
    },
  ],
  animation: [
    {
      label: 'Create Asset',
      icon: Boxes,
      href: '/assets/new',
      variant: 'default',
    },
    {
      label: 'Animation Scene',
      icon: Clapperboard,
      href: '/animation/new',
      variant: 'outline',
    },
    {
      label: 'Render Queue',
      icon: Settings,
      href: '/render/queue',
      variant: 'outline',
    },
  ],
  documentary: [
    {
      label: 'Add Interview',
      icon: Users,
      href: '/interviews/new',
      variant: 'default',
    },
    {
      label: 'Log Footage',
      icon: Video,
      href: '/footage/log',
      variant: 'outline',
    },
    {
      label: 'Research Note',
      icon: FileText,
      href: '/research/new',
      variant: 'outline',
    },
  ],
  web_series: [
    {
      label: 'New Episode',
      icon: Video,
      href: '/episodes/new',
      variant: 'default',
    },
    {
      label: 'Channel Setup',
      icon: Settings,
      href: '/channel/setup',
      variant: 'outline',
    },
    {
      label: 'Analytics',
      icon: Share2,
      href: '/analytics',
      variant: 'outline',
    },
  ],
};

interface QuickActionsProps {
  projectId: string;
  projectType: ProjectType;
}

export function QuickActions({ projectId, projectType }: QuickActionsProps) {
  const router = useRouter();

  const handleActionClick = (href: string) => {
    router.push(`/projects/${projectId}${href}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Type-specific actions */}
          {typeSpecificActions[projectType].map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              className="w-full justify-start text-left"
              onClick={() => handleActionClick(action.href)}
            >
              <action.icon className="w-4 h-4 mr-2" />
              {action.label}
            </Button>
          ))}

          {/* Divider */}
          <div className="my-4 border-t" />

          {/* Common actions */}
          {commonActions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              className="w-full justify-start text-left"
              onClick={() => handleActionClick(action.href)}
            >
              <action.icon className="w-4 h-4 mr-2" />
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}