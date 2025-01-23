import { useState } from 'react';
import { PlusCircle, Calendar } from 'lucide-react';
import { TimelinePhase, Milestone, TeamMember } from '@/types/timeline';
import { MilestoneItem } from './MilestoneItem';
import { MilestoneDetails } from './MilestoneDetails';
import { projectColors } from '../../constants/projectColors';

interface PhaseDetailsProps {
  selectedPhase: TimelinePhase;
  onMilestoneToggle: (milestoneId: string) => void;
  onAddMilestone: (milestone: Milestone) => void;
  onEditMilestone: (milestone: Milestone) => void;
  onDeleteMilestone: (milestoneId: string) => void;
  teamMembers: TeamMember[]; 
}

export const PhaseDetails = ({
  selectedPhase,
  onMilestoneToggle,
  onAddMilestone,
  onEditMilestone,
  onDeleteMilestone,
  teamMembers
}: PhaseDetailsProps) => {
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  const color = projectColors[selectedPhase.projectType]?.primary || 'blue';

  const handleAddNewMilestone = () => {
    const newMilestone: Milestone = {
      id: crypto.randomUUID(),
      title: '',
      date: new Date().toISOString().split('T')[0],
      completed: false,
      subTasks: [],
      teamMembers: []
    };
    setSelectedMilestone(newMilestone);
    setShowMilestoneModal(true);
  };

  const handleEditMilestone = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setShowMilestoneModal(true);
  };

  const handleMilestoneSave = (milestone: Milestone) => {
    if (milestone.id === selectedMilestone?.id) {
      if (selectedMilestone.title === '') {
        onAddMilestone(milestone);
      } else {
        onEditMilestone(milestone);
      }
    }
    setShowMilestoneModal(false);
    setSelectedMilestone(null);
  };

  const getPhaseProgress = () => {
    const total = selectedPhase.milestones.length;
    if (total === 0) return 0;
    const completed = selectedPhase.milestones.filter(m => m.completed).length;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">{selectedPhase.name}</h2>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              {new Date(selectedPhase.startDate).toLocaleDateString()} - 
              {new Date(selectedPhase.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
            Progress
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div
                className="h-2 rounded-full bg-blue-500"
                style={{ 
                  width: `${getPhaseProgress()}%`,
                  backgroundColor: `var(--${color}-500)`
                }}
              />
            </div>
            <span className="text-sm font-medium">{getPhaseProgress()}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {selectedPhase.milestones.map((milestone) => (
          <MilestoneItem
            key={milestone.id}
            milestone={milestone}
            onToggle={onMilestoneToggle}
            onEdit={handleEditMilestone}
            onDelete={onDeleteMilestone}
            teamMembers={teamMembers}
          />
        ))}

        <button
          onClick={handleAddNewMilestone}
          className="flex items-center px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Milestone
        </button>
      </div>

      {showMilestoneModal && selectedMilestone && (
        <MilestoneDetails
          milestone={selectedMilestone}
          teamMembers={teamMembers}
          onUpdate={handleMilestoneSave}
          onClose={() => {
            setShowMilestoneModal(false);
            setSelectedMilestone(null);
          }}
        />
      )}
    </div>
  );
};