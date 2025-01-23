'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  FeatureFilmOverview,
  SeriesOverview,
  CommercialOverview,
  AnimationOverview,
  MusicVideoOverview,
} from './OverviewCards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TasksOverviewCard,
  TimelineOverviewCard,
  BudgetOverviewCard,
  IssuesOverviewCard,
} from './CommonCards';
import { useProject } from '@/hooks/useProjectHooks';
import {
  useFeatureFilm,
  useTVSeries,
  useDocumentary,
  useCommercial,
  useMusicVideo,
  useWebSeries,
  useAnimation,
} from '@/hooks/useProjectHooks';

import { Project } from '@/stores/useProjectStore';


interface ProjectOverviewProps {
  projectId: string;
}

export function ProjectOverview({ projectId }: ProjectOverviewProps) {
  const { project } = useProject(projectId);

  // Use type-specific hooks based on project type
  const featureFilm = useFeatureFilm(projectId);
  const series = useTVSeries(projectId);
  const commercial = useCommercial(projectId);
  const musicVideo = useMusicVideo(projectId);
  const animation = useAnimation(projectId);


  if (!project) return null;


  const renderTypeSpecificOverview = () => {
    switch (project.type) {
      case 'feature':
        return (
          <FeatureFilmOverview
            projectId={projectId}
            data={featureFilm.featureData}
          />
        );
      case 'series':
        return (
          <SeriesOverview
            projectId={projectId}
            data={series.seriesData}
          />
        );
      case 'commercial':
        return (
          <CommercialOverview
            projectId={projectId}
            data={commercial.commercialData}
          />
        );
      case 'music_video':
        return (
          <MusicVideoOverview
            projectId={projectId}
            data={musicVideo.musicVideoData}
          />
        );
      case 'animation':
        return (
          <AnimationOverview
            projectId={projectId}
            data={animation.animationData}
          />
        );
      default:
        return null;
    }
  };


  return (
    <div className="space-y-6">
      {/* Project Header Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
        </div>
        <p className="text-muted-foreground">{project.description}</p>
      </div>

      {/* Main Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Type-specific overview card (spans 2 columns) */}
        {renderTypeSpecificOverview()}

        {/* Common overview cards */}
        <TasksOverviewCard
          projectId={projectId}
          team={project.team}
        />

        <TimelineOverviewCard
          startDate={project.startDate}
          targetDate={project.targetDate}
          phase={project.phase}
          progress={project.progress}
        />

         {/* Conditional rendering for BudgetOverviewCard */}
         {project.typeData && (
          <BudgetOverviewCard
            budget={
              typeof project.typeData === 'object' &&
              'budget' in project.typeData
                ? project.typeData.budget
                : undefined
            }
            expenses={
              typeof project.typeData === 'object' &&
              'expenses' in project.typeData
                ? project.typeData.expenses
                : undefined
            }
          />
        )}

          {/* Conditional rendering for TasksOverviewCard */}
        {project.typeData && (
          <TasksOverviewCard
            tasks={
              typeof project.typeData === 'object' &&
              'tasks' in project.typeData
                ? project.typeData.tasks
                : undefined
            }
          />
        )}

        {/* Conditional rendering for IssuesOverviewCard */}
        {project.typeData && (
          <IssuesOverviewCard
            issues={
              typeof project.typeData === 'object' &&
              'issues' in project.typeData
                ? project.typeData.issues
                : undefined
            }
          />
        )}
      </div>

      {/* Activity Feed or Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Activity feed implementation */}
          </CardContent>
        </Card>

        {/* Quick Actions or Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Quick action buttons based on project type */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}