'use client';

import { useState } from 'react';
import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import useProjectStore from '@/zustand/projectStore';
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

function ProjectDetailPage() {
    const params = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [timelinePhases, setTimelinePhases] = useState<TimelinePhase[]>(initialPhases);
  const [teamMembers] = useState<TeamMember[]>(initialTeamMembers);

  const handlePhaseChange = (updatedPhases: TimelinePhase[]) => {
    setTimelinePhases(updatedPhases);
    // Here you could also sync with backend
    // updateProjectPhases(updatedPhases);
  };


  const router = useRouter();
  const id = params.id as string; // Correct way to get id
  const createProject = useProjectStore(state => state.createProject)
    useEffect(() => {
    if(id){
          return
      }

      createProject({
        name: "The Last Horizon",
        description: `"The Last Horizon" is an ambitious sci-fi feature film that explores humanity's first contact with an advanced alien civilization. 
            Set in the year 2157, the story follows a team of international scientists and explorers as they embark on humanity's most 
            daring mission yet.`,
        type: "Feature Film",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        status: "Idea",
        members: [
          {
            name: 'John Doe', role: 'Director', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
            id: uuidv4()
          },
          {
            name: 'Jane Doe', role: 'Producer', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100',
            id: uuidv4()
          }
        ]
      })
    }, [id, createProject]) // Added id to the dependency array


  if (!id) {
    return <div>Loading...</div>;
  }
  

  return (
    <div className="space-y-6">
      <ProjectHeader {...projectData} />
      <ProjectTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'overview' && <ProjectOverview  />}  
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
  );
}

export default ProjectDetailPage;

// "use client"

// import { useState } from "react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Progress } from "@/components/ui/progress"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { AssetManagement } from "@/components/assets/AssetManager"

// const projectTabs = [
//   { id: "overview", label: "Overview" }, 
//   { id: "team", label: "Team Management" },
//   { id: "schedule", label: "Project Schedule" },
//   { id: "budget", label: "Budget Tracking" },
//   { id: "assets", label: "Asset Management" },
//   { id: "documents", label: "Document Repository" },
// ]

// export default function ProjectDetail({ params }: { params: { id: string } }) {
//   const [activeTab, setActiveTab] = useState("overview")

//   // Mock data - replace with actual data fetching in a real application
//   const project = {
//     title: "The Quantum Paradox",
//     status: "In Production",
//     description: "A mind-bending sci-fi thriller exploring the consequences of time travel.",
//     progress: 65,
//     team: [
//       { name: "John Doe", role: "Director", avatar: "/placeholder.svg" },
//       { name: "Jane Smith", role: "Producer", avatar: "/placeholder.svg" },
//       // Add more team members
//     ],
//     schedule: [
//       { phase: "Pre-production", startDate: "2023-01-01", endDate: "2023-03-31" },
//       { phase: "Production", startDate: "2023-04-01", endDate: "2023-07-31" },
//       { phase: "Post-production", startDate: "2023-08-01", endDate: "2023-11-30" },
//     ],
//     budget: {
//       total: 10000000,
//       spent: 6500000,
//     },
//   }

//   return (
//     <div className="container py-12">
//       <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
//       <div className="flex items-center space-x-4 mb-8">
//         <span className="text-lg font-semibold">{project.status}</span>
//         <Progress value={project.progress} className="w-64" />
//         <span>{project.progress}% Complete</span>
//       </div>
//       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//         <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
//           {projectTabs.map((tab) => (
//             <TabsTrigger key={tab.id} value={tab.id}>
//               {tab.label}
//             </TabsTrigger>
//           ))}
//         </TabsList>
//         <TabsContent value="overview">
//           <Card>
//             <CardHeader>
//               <CardTitle>Project Overview</CardTitle>
//               <CardDescription>{project.description}</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <h3 className="text-lg font-semibold mb-2">Key Information</h3>
//               <ul className="list-disc pl-5 space-y-1">
//                 <li>Genre: Science Fiction</li>
//                 <li>Estimated Release: Q4 2024</li>
//                 <li>Target Audience: 18-45</li>
//               </ul>
//             </CardContent>
//           </Card>
//         </TabsContent>
//         <TabsContent value="team">
//           <Card>
//             <CardHeader>
//               <CardTitle>Team Management</CardTitle>
//               <CardDescription>Key personnel involved in the project.</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {project.team.map((member) => (
//                   <div key={member.name} className="flex items-center space-x-4">
//                     <Avatar>
//                       <AvatarImage src={member.avatar} alt={member.name} />
//                       <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <p className="font-semibold">{member.name}</p>
//                       <p className="text-sm text-muted-foreground">{member.role}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//         <TabsContent value="schedule">
//           <Card>
//             <CardHeader>
//               <CardTitle>Project Schedule</CardTitle>
//               <CardDescription>Timeline of key project phases.</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ul className="space-y-4">
//                 {project.schedule.map((phase) => (
//                   <li key={phase.phase} className="flex justify-between items-center">
//                     <span className="font-semibold">{phase.phase}</span>
//                     <span>{phase.startDate} - {phase.endDate}</span>
//                   </li>
//                 ))}
//               </ul>
//             </CardContent>
//           </Card>
//         </TabsContent>
//         <TabsContent value="budget">
//           <Card>
//             <CardHeader>
//               <CardTitle>Budget Tracking</CardTitle>
//               <CardDescription>Financial overview of the project.</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div>
//                   <p className="font-semibold">Total Budget</p>
//                   <p className="text-2xl">${project.budget.total.toLocaleString()}</p>
//                 </div>
//                 <div>
//                   <p className="font-semibold">Spent</p>
//                   <p className="text-2xl">${project.budget.spent.toLocaleString()}</p>
//                 </div>
//                 <Progress value={(project.budget.spent / project.budget.total) * 100} className="w-full" />
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//         <TabsContent value="assets">
//          <AssetManagement isAdmin={false} projectStatus="active" />
//         </TabsContent>
//         <TabsContent value="documents">
//           <Card>
//             <CardHeader>
//               <CardTitle>Document Repository</CardTitle>
//               <CardDescription>Access and manage project documents.</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <p>Document repository content goes here.</p>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

