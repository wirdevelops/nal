'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useProjectBlog } from 'others/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { PostsList } from './components/PostsList';
import { PostFilters } from './components/Filters';
import { BlogAnalytics } from './components/BlogAnalytics';
import { CreatePostDialog } from './components/CreatePostDialog';

export default function BlogPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { posts, drafts, published, scheduled, isLoading } = useProjectBlog(projectId);
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-sm text-muted-foreground">
            Manage and create blog posts for your project.
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      {/* Analytics Overview */}
      <BlogAnalytics 
        posts={posts}
        published={published}
        drafts={drafts}
        scheduled={scheduled}
      />

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <PostFilters />
      </div>

      {/* Posts List */}
      <PostsList
        posts={posts}
        isLoading={isLoading}
        searchQuery={searchQuery}
      />

      {/* Create Post Dialog */}
      <CreatePostDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
        projectId={projectId}
      />
    </div>
  );
}