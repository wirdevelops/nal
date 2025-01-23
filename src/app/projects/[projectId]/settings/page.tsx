'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/stores/useProjectStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ThumbnailSelector } from '../../components/ThumbnailSelector';
import { useProjectMedia } from '@/hooks/useProjectMedia';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { projectTypes } from '../../config/projectTypes';
import { toast } from '@/components/ui/use-toast';
import { Project } from '@/stores/useProjectStorer';

export default function ProjectSettings({ params }) {
  const router = useRouter();
  const { projects, updateProject, deleteProject } = useProjectStore();
  const project = projects.find(p => p.id === params.projectId);
  const { thumbnail } = useProjectMedia(params.projectId);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);

  if (!project) {
    router.push('/projects');
    return null;
  }

  const handleUpdateProject = async (data: Partial<typeof project>) => {
    try {
      updateProject(project.id, data);
      toast({
        title: "Settings updated",
        description: "Your project settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project settings.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async () => {
    try {
      deleteProject(project.id);
      router.push('/projects');
      toast({
        title: "Project deleted",
        description: "The project has been permanently deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the project.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Project Settings</h2>
        <p className="text-muted-foreground">
          Manage
    Manage your project settings and configurations.
  </p>
</div>

<Tabs defaultValue="general" className="space-y-4">
  <TabsList>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="team">Team</TabsTrigger>
    <TabsTrigger value="notifications">Notifications</TabsTrigger>
    <TabsTrigger value="danger">Danger Zone</TabsTrigger>
  </TabsList>

  <TabsContent value="general">
     {/* Thumbnail Card */}
     <Card>
          <CardHeader>
            <CardTitle>Project Thumbnail</CardTitle>
            <CardDescription>
              Update your project's thumbnail image
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ThumbnailSelector
              projectId={params.projectId}
              onSelect={(url) => handleUpdateProject({ thumbnailUrl: url })}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        {/* General Settings Card */}
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>
          Basic project information and settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Project Title</Label>
          <Input
            id="title"
            defaultValue={project.title}
            onChange={(e) => handleUpdateProject({ title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Project Type</Label>
          <Select 
            defaultValue={project.type}
            onValueChange={(value) => handleUpdateProject({ type: value as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              {projectTypes.map(type => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            defaultValue={project.description}
            onChange={(e) => handleUpdateProject({ description: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Project Status</Label>
          <Select 
            defaultValue={project.status}
            onValueChange={(value) => handleUpdateProject({ status: value as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  </TabsContent>

  <TabsContent value="team">
    <Card>
      <CardHeader>
        <CardTitle>Team Settings</CardTitle>
        <CardDescription>
          Manage team access and permissions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Allow Team Invites</Label>
              <p className="text-sm text-muted-foreground">
                Let team members invite others
              </p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto Accept Members</Label>
              <p className="text-sm text-muted-foreground">
                Automatically accept team join requests
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </CardContent>
    </Card>
  </TabsContent>

  <TabsContent value="notifications">
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Configure how you receive project notifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive project updates via email
              </p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive push notifications for important updates
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </CardContent>
    </Card>
  </TabsContent>

  <TabsContent value="danger">
    <Card>
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription>
          Irreversible actions that affect your project.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Archive Project</Label>
              <p className="text-sm text-muted-foreground">
                Archive this project and all its data
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setArchiveDialogOpen(true)}
            >
              Archive Project
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Delete Project</Label>
              <p className="text-sm text-muted-foreground">
                Permanently delete this project and all its data
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Project
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </TabsContent>
</Tabs>

{/* Delete Confirmation Dialog */}
<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your
        project and remove all data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        onClick={handleDeleteProject}
        className="bg-destructive text-destructive-foreground"
      >
        Delete Project
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

{/* Archive Confirmation Dialog */}
<AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Archive this project?</AlertDialogTitle>
      <AlertDialogDescription>
        This will archive the project and make it read-only. You can unarchive it later.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        onClick={() => {
          handleUpdateProject({ status: 'archived' });
          setArchiveDialogOpen(false);
        }}
      >
        Archive Project
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
</div>
);
}