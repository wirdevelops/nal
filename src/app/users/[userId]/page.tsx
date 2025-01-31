'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useVolunteer } from '@/hooks/useVolunteer';
import { useNGOProject } from '@/hooks/useNGOProject';
import { ArrowLeft, Edit2, Archive, Type } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
// import { VolunteerProfile } from '@/types/user/volunteer';

export default function VolunteerDetailsPage({ params }: { params: { volunteerId: string } }) {
  const router = useRouter();
  const { volunteer, isLoading: isVolunteerLoading } = useVolunteer(params.volunteerId);
  const { projects: allProjects, isLoading: areProjectsLoading } = useNGOProject();

  // Get volunteer's associated projects
  const volunteerProjects = volunteer 
    ? allProjects.filter(project => volunteer.projects.includes(project.id))
    : [];

  if (isVolunteerLoading || areProjectsLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!volunteer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Volunteers
        </Button>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-2">Volunteer Not Found</h1>
          <p className="text-muted-foreground">
            The volunteer you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const handleEditProfile = () => {
    router.push(`/volunteers/${volunteer.id}/edit`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Volunteers
        </Button>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={handleEditProfile}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button variant="outline">
            <Archive className="w-4 h-4 mr-2" />
            Archive
          </Button>
        </div>
      </div>

      {/* <VolunteerProfile
        volunteer={volunteer}
        projects={volunteerProjects.map(p => ({
          id: p.id,
          name: p.name
        }))}
        onEditProfile={handleEditProfile}
      /> */}
    </div>
  );
}

