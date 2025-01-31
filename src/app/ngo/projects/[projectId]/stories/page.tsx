'use client'

import { ImpactStories } from '../../../components/ImpactStories';
import { Button } from '@/components/ui/button';
import { useStories } from 'others/useStories';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function ProjectStoriesPage({ params }: { params: { projectId: string } }) {
  const { stories, addStory } = useStories();
  const [showCreateStory, setShowCreateStory] = useState(false);

  const projectStories = stories.filter(story => 
    story.metadata.tags.includes(`project:${params.projectId}`)
  );

  const handleStoryAction = (action: 'like' | 'comment' | 'share', storyId: string) => {
    // Implement story interactions
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Impact Stories</h2>
        <Button onClick={() => setShowCreateStory(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Story
        </Button>
      </div>

      <ImpactStories
        stories={projectStories}
        onLike={(id) => handleStoryAction('like', id)}
        onComment={(id) => handleStoryAction('comment', id)}
        onShare={(id) => handleStoryAction('share', id)}
      />
    </div>
  );
}