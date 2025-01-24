import { Updates } from '../../../components/Updates';
import { useNGOProject } from '@/hooks/useNGOProject';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function ProjectUpdatesPage({ params }: { params: { projectId: string } }) {
  const { getProjectById } = useNGOProject();
  const [showAddUpdate, setShowAddUpdate] = useState(false);
  const project = getProjectById(params.projectId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Updates</h2>
        <Button onClick={() => setShowAddUpdate(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Update
        </Button>
      </div>

      <Updates
        updates={project?.updates || []}
        onAddUpdate={() => setShowAddUpdate(true)}
      />
    </div>
  );
}