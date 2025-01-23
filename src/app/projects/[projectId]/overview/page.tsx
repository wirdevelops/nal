'use client';

import { useParams } from 'next/navigation';
import { ProjectOverview } from '@/app/projects/components/ProjectOverview';

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const tool = params.tool?.[0] || 'overview';

  // Render different components based on the tool
  switch (tool) {
    case 'overview':
    default:
      return <ProjectOverview projectId={projectId} />;
  }
}