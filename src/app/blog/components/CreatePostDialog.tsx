// app/projects/[projectId]/blog/components/CreatePostDialog.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectBlog } from '@/hooks/blog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { generateSlug } from '@/utils/blog';
import type { PostVisibility } from '@/types/blog';

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export function CreatePostDialog({
  open,
  onOpenChange,
  projectId,
}: CreatePostDialogProps) {
  const router = useRouter();
  const { createPost } = useProjectBlog(projectId);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    visibility: 'public' as PostVisibility,
  });

  const handleSubmit = async () => {
    if (!formData.title) return;

    try {
      setIsSubmitting(true);
      const post = await createPost({
        projectId,
        title: formData.title,
        slug: generateSlug(formData.title),
        excerpt: formData.excerpt,
        content: [],
        status: 'draft',
        visibility: formData.visibility,
        categories: [],
        tags: [],
        author: {
          id: 'current-user', // This would come from auth
          name: 'Current User', // This would come from auth
        },
      });

      toast({
        title: 'Success',
        description: 'Post created successfully',
      });

      onOpenChange(false);
      // Navigate to the editor
      router.push(`/blog/editor/${post.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create post',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Create a new blog post. You can edit and publish it later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter post title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              placeholder="Brief description of your post"
              value={formData.excerpt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visibility">Visibility</Label>
            <Select
              value={formData.visibility}
              onValueChange={(value: PostVisibility) =>
                setFormData((prev) => ({ ...prev, visibility: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="team">Team Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.title || isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}