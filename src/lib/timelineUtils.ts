import { TimelinePhase, Milestone } from '../types/timeline';

export const calculatePhaseProgress = (phase: TimelinePhase): number => {
  const totalMilestones = phase.milestones.length;
  if (totalMilestones === 0) return 0;
  
  const completedMilestones = phase.milestones.filter(m => m.completed).length;
  return Math.round((completedMilestones / totalMilestones) * 100);
};

export const getMilestonesForDate = (phases: TimelinePhase[], date: Date): Milestone[] => {
  const milestones: Milestone[] = [];
  const dateString = date.toDateString();

  phases.forEach(phase => {
    phase.milestones.forEach(milestone => {
      if (new Date(milestone.date).toDateString() === dateString) {
        milestones.push(milestone);
      }
    });
  });

  return milestones;
};

export const getPhaseForDate = (phases: TimelinePhase[], date: Date): TimelinePhase | undefined => {
  return phases.find(phase => {
    const startDate = new Date(phase.startDate);
    const endDate = new Date(phase.endDate);
    return date >= startDate && date <= endDate;
  });
};

export const sortMilestones = (milestones: Milestone[]): Milestone[] => {
  return [...milestones].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const calculateMilestoneProgress = (milestone: Milestone): number => {
  if (!milestone.subTasks || milestone.subTasks.length === 0) {
    return milestone.completed ? 100 : 0;
  }

  const completedTasks = milestone.subTasks.filter(task => task.completed).length;
  return Math.round((completedTasks / milestone.subTasks.length) * 100);
};

export const getDependencyChain = (
  milestoneId: string,
  phases: TimelinePhase[]
): Milestone[] => {
  const allMilestones = phases.flatMap(phase => phase.milestones);
  const result: Milestone[] = [];
  
  const findDependencies = (id: string) => {
    const milestone = allMilestones.find(m => m.id === id);
    if (milestone && !result.includes(milestone)) {
      result.push(milestone);
      milestone.dependencies?.forEach(depId => findDependencies(depId));
    }
  };

  findDependencies(milestoneId);
  return result;
};

export const validateMilestoneDates = (
  milestone: Milestone,
  phase: TimelinePhase
): boolean => {
  const milestoneDate = new Date(milestone.date);
  const phaseStart = new Date(phase.startDate);
  const phaseEnd = new Date(phase.endDate);

  return milestoneDate >= phaseStart && milestoneDate <= phaseEnd;
};