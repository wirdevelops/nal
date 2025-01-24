'use client'

import { Suspense } from 'react';
import { useNGOProject } from '@/hooks/useNGOProject';
import { ProjectHeader } from './../../components/Header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Share2, FileText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ProjectLayoutProps {
  params: { id: string };
  children: React.ReactNode;
}

export default function ProjectLayout({ params, children }: ProjectLayoutProps) {
  const { getProjectById, isLoading } = useNGOProject();
  const project = getProjectById(params.id);
  const pathname = usePathname();

  if (!project) {
    return <div>Project not found</div>;
  }

  const tabs = [
    { value: 'overview', label: 'Overview', href: `/ngo/projects/${params.id}` },
    { value: 'team', label: 'Team', href: `/ngo/projects/${params.id}/team` },
    { value: 'updates', label: 'Updates', href: `/ngo/projects/${params.id}/updates` },
    { value: 'impact', label: 'Impact', href: `/ngo/projects/${params.id}/impact` },
    { value: 'donors', label: 'Donors', href: `/ngo/projects/${params.id}/donors` },
    { value: 'gallery', label: 'Gallery', href: `/ngo/projects/${params.id}/gallery` },
  ];

  const currentTab = tabs.find(tab => pathname.includes(tab.value))?.value || 'overview';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Suspense fallback={<div>Loading header...</div>}>
          <ProjectHeader 
            projectId={params.id}
            onDonate={() => {}}
            onVolunteer={() => {}}
          />
        </Suspense>

        <div className="flex justify-end gap-4">
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>

        <Tabs value={currentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            {tabs.map(tab => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value}
                asChild
              >
                <Link href={tab.href}>{tab.label}</Link>
              </TabsTrigger>
            ))}
          </TabsList>

          <Suspense 
            fallback={
              <div className="w-full h-32 animate-pulse bg-muted rounded-lg" />
            }
          >
            {children}
          </Suspense>
        </Tabs>
      </div>
    </div>
  );
}