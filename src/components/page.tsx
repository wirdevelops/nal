'use client';

import { useState } from 'react';
import { ThemeContext } from '@/lib/theme';
import { Layout } from '@/components/layout/Layout';
import { useThemeProvider } from '@/lib/theme';
import { ProjectHeader } from '@/components/project/ProjectHeader';
import { ProjectTabs } from '@/components/navigation/ProjectTabs';
import { ProjectOverview } from '@/components/overview/ProjectOverview';
import { ProjectTimeline } from '@/components/timeline/ProjectTimeline';
import { TeamOrgChart } from '@/components/team/TeamOrgChart';
import { AssetManagement } from '@/components/assets/AssetList';
import { BudgetOverview } from '@/components/budget/BudgetOverview';
import { AnalyticsDashboard } from '@/components/reports/AnalyticsDashboard';
import { PhasePanels } from '@/components/phases/PhasePanels';
import { TimelinePhase, TeamMember } from '@/types/timeline';
import { v4 as uuidv4 } from 'uuid';

const projectData = {
title: "The Last Horizon",
type: "Feature Film",
stats: {
daysInProduction: 45,
budget: "$2.5M",
teamSize: 124,
phase: "Production" as const,
progress: 65,
},
posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2069",
};

// Mock team members data
const initialTeamMembers: TeamMember[] = [
{
id: '1',
name: 'Sarah Director',
role: 'Director',
department: 'Production',
avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
},
{
id: '2',
name: 'Mike Producer',
role: 'Producer',
department: 'Production',
avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100'
},
{
id: '3',
name: 'Alex Writer',
role: 'Lead Writer',
department: 'Creative',
avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
}
];

// Mock timeline phases data
const initialPhases: TimelinePhase[] = [
{
id: 'pre-production',
name: 'Pre-Production',
status: 'completed',
startDate: '2024-01-15',
endDate: '2024-02-28',
projectType: 'Feature Film',
milestones: [
{
id: uuidv4(),
title: 'Script Finalization',
date: '2024-01-20',
completed: true,
subTasks: [],
teamMembers: ['1', '3'],
description: 'Complete final draft of screenplay'
},
{
id: uuidv4(),
title: 'Location Scouting',
date: '2024-02-10',
completed: true,
subTasks: [],
teamMembers: ['2'],
description: 'Find and secure filming locations'
}
]
},
{
id: 'production',
name: 'Production',
status: 'current',
startDate: '2024-03-01',
endDate: '2024-05-30',
projectType: 'Feature Film',
milestones: [
{
id: uuidv4(),
title: 'Principal Photography Start',
date: '2024-03-01',
completed: true,
subTasks: [],
teamMembers: ['1', '2'],
description: 'Begin main filming'
}
]
},
{
id: 'post-production',
name: 'Post-Production',
status: 'upcoming',
startDate: '2024-06-01',
endDate: '2024-08-30',
projectType: 'Feature Film',
milestones: [
{
id: uuidv4(),
title: 'Initial Edit',
date: '2024-06-15',
completed: false,
subTasks: [],
teamMembers: [],
description: 'First cut assembly'
}
]
}
];

function App() {
const themeValue = useThemeProvider();
const [activeTab, setActiveTab] = useState('overview');
const [timelinePhases, setTimelinePhases] = useState<TimelinePhase[]>(initialPhases);
const [teamMembers] = useState<TeamMember[]>(initialTeamMembers);

const handlePhaseChange = (updatedPhases: TimelinePhase[]) => {
setTimelinePhases(updatedPhases);
// Here you could also sync with backend
// updateProjectPhases(updatedPhases);
};

return (
<ThemeContext.Provider value={themeValue}>
<Layout>
<div className="space-y-6">
<ProjectHeader {...projectData} />
<ProjectTabs activeTab={activeTab} onTabChange={setActiveTab} />

<div className="mt-6">
        {activeTab === 'overview' && <ProjectOverview />}
        {activeTab === 'timeline' && (
          <ProjectTimeline 
            phases={timelinePhases} 
            onPhaseChange={handlePhaseChange}
            teamMembers={teamMembers}
          />
        )}
        {activeTab === 'team' && <TeamOrgChart />}
        {activeTab === 'assets' && <AssetManagement />}
        {activeTab === 'budget' && <BudgetOverview />}
        {activeTab === 'reports' && <AnalyticsDashboard />}
        {!['overview', 'timeline', 'team', 'assets', 'budget', 'reports'].includes(activeTab) && (
          <PhasePanels phase={projectData.stats.phase} />
        )}
      </div>
    </div>
  </Layout>
</ThemeContext.Provider>
);
}

export default App;