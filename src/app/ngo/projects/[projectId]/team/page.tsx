import { Team } from '../../../components/Team';
import { Button } from '@/components/ui/button';
import { useNGOProject } from '@/hooks/useNGOProject';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';

export default function ProjectTeamPage({ params }: { params: { projectId: string } }) {
  const [showAddMember, setShowAddMember] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Team</h2>
        <Button onClick={() => setShowAddMember(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      <Team 
        projectId={params.projectId}
        onAddMember={() => setShowAddMember(true)}
      />
    </div>
  );
}