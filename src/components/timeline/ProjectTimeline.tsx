import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { TimelinePhase, Milestone } from '../../types/timeline';
import { TimelineNavigation } from './TimelineNavigation';
import { PhaseDetails } from './PhaseDetails';
import { CalendarView } from './CalendarView';
import { MilestoneDetails } from './MilestoneDetails';
import { TeamMember } from '../../types/timeline';

interface ProjectTimelineProps {
  phases: TimelinePhase[];
  onPhaseChange?: (phases: TimelinePhase[]) => void;
  teamMembers: TeamMember[];
}

export const ProjectTimeline = ({
  phases,
  onPhaseChange,
  teamMembers
}: ProjectTimelineProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPhase, setSelectedPhase] = useState<TimelinePhase>(
    phases.find(phase => phase.status === 'current') || phases[0]
  );
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);

  const handlePhaseSelect = (phase: TimelinePhase) => {
    setSelectedPhase(phase);
  };

  const handleMilestoneToggle = (milestoneId: string) => {
    const updatedPhases = phases.map(phase => ({
      ...phase,
      milestones: phase.milestones.map(milestone =>
        milestone.id === milestoneId 
          ? { ...milestone, completed: !milestone.completed }
          : milestone
      )
    }));
    onPhaseChange?.(updatedPhases);
  };

  const handleAddMilestone = (milestone: Milestone) => {
    const updatedPhases = phases.map(phase =>
      phase.id === selectedPhase.id 
        ? { ...phase, milestones: [...phase.milestones, milestone] }
        : phase
    );
    onPhaseChange?.(updatedPhases);
  };

  const handleEditMilestone = (updatedMilestone: Milestone) => {
    const updatedPhases = phases.map(phase => ({
      ...phase,
      milestones: phase.milestones.map(milestone =>
        milestone.id === updatedMilestone.id ? updatedMilestone : milestone
      )
    }));
    onPhaseChange?.(updatedPhases);
  };

  const handleDeleteMilestone = (milestoneId: string) => {
    const updatedPhases = phases.map(phase => ({
      ...phase,
      milestones: phase.milestones.filter(milestone => milestone.id !== milestoneId)
    }));
    onPhaseChange?.(updatedPhases);
  };

  const handleMilestoneClick = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setShowMilestoneModal(true);
  };

  const handleMilestoneSave = (updatedMilestone: Milestone) => {
    handleEditMilestone(updatedMilestone);
    setShowMilestoneModal(false);
    setSelectedMilestone(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Project Timeline</h2>
        <button 
          onClick={() => setShowCalendarView(!showCalendarView)}
          className="flex items-center px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 
            text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 
            transition-colors"
        >
          {showCalendarView ? 'Show Timeline' : 'Show Calendar'}
          <CalendarIcon className="w-4 h-4 ml-2" />
        </button>
      </div>

      {showCalendarView ? (
        <CalendarView
          phases={phases}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onMilestoneClick={handleMilestoneClick}
          teamMembers={teamMembers}       
           />
      ) : (
        <>
          <TimelineNavigation
            phases={phases}
            selectedPhase={selectedPhase}
            onPhaseSelect={handlePhaseSelect}
          />

          <PhaseDetails
            selectedPhase={selectedPhase}
            onMilestoneToggle={handleMilestoneToggle}
            onAddMilestone={handleAddMilestone}
            onEditMilestone={handleEditMilestone}
            onDeleteMilestone={handleDeleteMilestone}
            teamMembers={teamMembers}
          />
        </>
      )}

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