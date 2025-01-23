import React from 'react';
import { Activity, Flag, MessageSquare, Calendar, Users, FileText, DollarSign } from 'lucide-react';
import { useProjectStore } from '../../zustand/p';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ProjectOverview() {
  const { currentProject } = useProjectStore();

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">No project selected</p>
      </div>
    );
  }

  const projectProgress = calculateProjectProgress(currentProject);

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">{currentProject.name}</h1>
        <p className="text-gray-500 dark:text-gray-400">{currentProject.description}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Timeline"
          icon={<Calendar className="w-4 h-4" />}
          value={`${new Date(currentProject.startDate).toLocaleDateString()} - ${new Date(currentProject.endDate).toLocaleDateString()}`}
        />
        <MetricCard
          title="Team Members"
          icon={<Users className="w-4 h-4" />}
          value={`${currentProject.members.length} members`}
        />
        <MetricCard
          title="Tasks"
          icon={<FileText className="w-4 h-4" />}
          value={`${currentProject.tasks.length} total`}
        />
        <MetricCard
          title="Budget"
          icon={<DollarSign className="w-4 h-4" />}
          value={`$${currentProject.budget.actual.toLocaleString()} / $${currentProject.budget.planned.toLocaleString()}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Progress</span>
                  <span className="font-medium">{projectProgress}%</span>
                </div>
                <Progress value={projectProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentProject.tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-start space-x-4">
                    <ActivityIcon status={task.status} />
                    <div>
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-sm text-gray-500">
                        Assigned to: {getAssigneeNames(task.assignees, currentProject.members)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentProject.members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <span className="text-sm font-medium">
                          {member.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Milestones */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentProject.milestones
                  .filter((milestone) => milestone.status !== 'completed')
                  .slice(0, 3)
                  .map((milestone) => (
                    <div key={milestone.id} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium text-sm">{milestone.title}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(milestone.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{milestone.description}</p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, icon, value }: { title: string; icon: React.ReactNode; value: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center space-x-2">
          {icon}
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        </div>
        <p className="text-2xl font-bold mt-2">{value}</p>
      </CardContent>
    </Card>
  );
}

function ActivityIcon({ status }: { status: string }) {
  switch (status) {
    case 'completed':
      return <Flag className="w-5 h-5 text-green-500" />;
    case 'in-progress':
      return <Activity className="w-5 h-5 text-blue-500" />;
    default:
      return <MessageSquare className="w-5 h-5 text-gray-500" />;
  }
}

function calculateProjectProgress(project: any): number {
  const completedTasks = project.tasks.filter((task: any) => task.status === 'completed').length;
  return Math.round((completedTasks / project.tasks.length) * 100) || 0;
}

function getAssigneeNames(assigneeIds: string[], members: any[]): string {
  return assigneeIds
    .map((id) => members.find((member) => member.id === id)?.name)
    .filter(Boolean)
    .join(', ');
}

// import React from 'react';
// import { Activity, Flag, MessageSquare, UserPlusIcon, UserMinusIcon } from 'lucide-react';
// import useProjectStore from '@/zustand/projectStore';
// import { useParams } from 'next/navigation';
// import Link from "next/link";
// import { useState } from "react";
// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
//     AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// interface ActivityItem {
//   id: string;
//   type: 'update' | 'milestone' | 'comment';
//   content: string;
//   timestamp: string;
//   user: {
//     name: string;
//     avatar: string;
//   };
// }

// interface ProjectMember {
//     id: string
//     name: string,
//     role: string,
//     avatar?: string
// }

// const recentActivity: ActivityItem[] = [
//   {
//     id: '1',
//     type: 'milestone',
//     content: 'Principal photography completed for Act 1',
//     timestamp: '2h ago',
//     user: {
//       name: 'Sarah Director',
//       avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
//     }
//   },
//   {
//     id: '2',
//     type: 'update',
//     content: 'VFX team completed initial concept renders',
//     timestamp: '4h ago',
//     user: {
//       name: 'Mike Effects',
//       avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100'
//     }
//   },
//   {
//     id: '3',
//     type: 'comment',
//     content: 'Sound design for opening sequence approved',
//     timestamp: '6h ago',
//     user: {
//       name: 'Alex Audio',
//       avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
//     }
//   }
// ];

// const departments = [
//   { name: 'Production', status: 'On Track', progress: 65 },
//   { name: 'Post-Production', status: 'Pending', progress: 0 },
//   { name: 'VFX', status: 'In Progress', progress: 30 },
//   { name: 'Sound', status: 'In Progress', progress: 45 }
// ];

// interface ProjectOverviewProps {
// 	projectId: string
// }

// export function ProjectOverview({projectId}: ProjectOverviewProps) {
//     const project = useProjectStore(state => state.getProject(projectId))
//     const addProjectMember = useProjectStore(state => state.addProjectMember)
// 	const removeProjectMember = useProjectStore(state => state.removeProjectMember)
//     const [isDialogOpen, setIsDialogOpen] = useState(false);
//     const [member, setMember] = useState({ name: '', role: '' })

//     if (!project) return <div>Loading project...</div>;


//     const handleAddMember = () => {
//       addProjectMember(projectId, member)
//       setIsDialogOpen(false)
// 	  setMember({ name: '', role: '' })
//     }
// 	const handleRemoveMember = (memberId: string) => {
//       removeProjectMember(projectId, memberId)
// 	}

//     return (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Main Content - Synopsis and Activity */}
//             <div className="lg:col-span-2 space-y-6">
//                 {/* Synopsis */}
//                 <section className="bg-secondary border-base border shadow-base rounded-lg p-6">
//                     <h2 className="text-xl font-semibold mb-4">Project Synopsis</h2>
//                     <p className="text-gray-600 dark:text-gray-300">
//                          {project.description}
//                     </p>
//                 </section>

//                 {/* Activity Feed */}
//                 <section className="bg-secondary border-base border shadow-base rounded-lg p-6">
//                     <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
//                     <div className="space-y-4">
//                         {recentActivity.map((item) => (
//                             <div key={item.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
//                                 <img
//                                     src={item.user.avatar}
//                                     alt={item.user.name}
//                                     className="w-10 h-10 rounded-full"
//                                 />
//                                 <div className="flex-1 min-w-0">
//                                     <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                                         {item.user.name}
//                                     </p>
//                                     <p className="text-sm text-gray-600 dark:text-gray-300">
//                                         {item.content}
//                                     </p>
//                                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                                         {item.timestamp}
//                                     </p>
//                                 </div>
//                                 {item.type === 'milestone' && <Flag className="w-5 h-5 text-green-500" />}
//                                 {item.type === 'update' && <Activity className="w-5 h-5 text-blue-500" />}
//                                 {item.type === 'comment' && <MessageSquare className="w-5 h-5 text-purple-500" />}
//                             </div>
//                         ))}
//                     </div>
//                 </section>
//             </div>

//             {/* Sidebar - Department Updates */}
//             <div className="space-y-6">
//                 {/* Project Details */}
//                 <section className="bg-secondary border-base border shadow-base rounded-lg p-6">
//                     <h2 className="text-xl font-semibold mb-4">Project Details</h2>
//                     <div className="space-y-4">
//                         <div>
//                             <span className="font-medium">Project Type: </span>
//                             <span>{project.type}</span>
//                         </div>
//                          <div>
//                             <span className="font-medium">Start Date: </span>
//                             <span>{project.startDate}</span>
//                         </div>
//                          <div>
//                             <span className="font-medium">End Date: </span>
//                             <span>{project.endDate}</span>
//                         </div>
//                          <div>
//                             <span className="font-medium">Status: </span>
//                             <span>{project.status}</span>
//                         </div>
//                     </div>
//                 </section>


//                 {/* Project Members */}
//                  <section className="bg-secondary border-base border shadow-base rounded-lg p-6">
//                    <div className="flex items-center justify-between mb-4">
//                          <h2 className="text-xl font-semibold">Project Members</h2>
//                          <div>
//                             <AlertDialog>
//                                 <AlertDialogTrigger asChild>
//                                      <button className="p-2 bg-primary rounded-md text-white hover:bg-primary-dark">Add Member</button>
//                                 </AlertDialogTrigger>
//                                 <AlertDialogContent>
//                                   <AlertDialogHeader>
//                                         <AlertDialogTitle>Add a Project Member</AlertDialogTitle>
//                                             <AlertDialogDescription>
//                                                 Add new project member to this project.
//                                           </AlertDialogDescription>
//                                   </AlertDialogHeader>
//                                    <div className="grid gap-4 py-4">
//                                             <div className="grid gap-2">
//                                               <Label htmlFor="name">Name</Label>
//                                               <Input
//                                                 id="name"
//                                                 placeholder="Project member name"
//                                                   value={member.name}
//                                                 onChange={(e) => setMember({...member, name: e.target.value})}
//                                               />
//                                             </div>
//                                              <div className="grid gap-2">
//                                               <Label htmlFor="role">Role</Label>
//                                               <Input
//                                                 id="role"
//                                                 placeholder="Project member role"
//                                                     value={member.role}
//                                                   onChange={(e) => setMember({...member, role: e.target.value})}
//                                               />
//                                             </div>
//                                         </div>
//                                       <AlertDialogFooter>
//                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                          <AlertDialogAction onClick={handleAddMember}>Continue</AlertDialogAction>
//                                        </AlertDialogFooter>
//                                 </AlertDialogContent>
//                             </AlertDialog>
//                          </div>
//                    </div>
//                      <div className="space-y-2">
//                         {project.members && project.members.map((member) => (
//                            <div key={member.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
//                                 <div className="flex items-center space-x-2">
//                                  <img src={member.avatar || 'https://placekitten.com/100/100'} alt={member.name} className="h-8 w-8 rounded-full"/>
//                                  <div>
//                                        <p className="font-medium">{member.name}</p>
//                                       <p className="text-sm text-gray-500">{member.role}</p>
//                                  </div>
//                                  </div>
//                                  <button onClick={()=> handleRemoveMember(member.id)}>
//                                   <UserMinusIcon className="w-5 h-5 text-red-500"/>
//                                  </button>
//                             </div>
//                         ))}
//                          </div>
//                  </section>


//                 {/* Department Status */}
//                 <section className="bg-secondary border-base border shadow-base rounded-lg p-6">
//                     <h2 className="text-xl font-semibold mb-4">Department Status</h2>
//                     <div className="space-y-4">
//                         {departments.map((dept) => (
//                             <div key={dept.name} className="space-y-2">
//                                 <div className="flex justify-between items-center">
//                                     <span className="font-medium">{dept.name}</span>
//                                     <span className={`text-sm px-2 py-1 rounded-full ${
//                                         dept.status === 'On Track' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
//                                             dept.status === 'Pending' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100' :
//                                                 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
//                                     }`}>
//                                         {dept.status}
//                                     </span>
//                                 </div>
//                                 <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
//                                     <div
//                                         className="bg-primary h-2 rounded-full transition-all duration-300"
//                                         style={{ width: `${dept.progress}%` }}
//                                     />
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </section>

//                 {/* Next Milestones */}
//                 <section className="bg-secondary border-base border shadow-base rounded-lg p-6">
//                     <h2 className="text-xl font-semibold mb-4">Upcoming Milestones</h2>
//                     <div className="space-y-3">
//                         <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
//                             <div className="flex items-center justify-between">
//                                 <span className="font-medium">Complete Act 2 Filming</span>
//                                 <span className="text-sm text-gray-500">In 5 days</span>
//                             </div>
//                             <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//                                 Principal photography for Act 2 scenes
//                             </p>
//                         </div>
//                         <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
//                             <div className="flex items-center justify-between">
//                                 <span className="font-medium">VFX Preview</span>
//                                 <span className="text-sm text-gray-500">In 2 weeks</span>
//                             </div>
//                             <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//                                 First look at key visual effects sequences
//                             </p>
//                         </div>
//                     </div>
//                 </section>
//             </div>
//         </div>
//     );
// }

// import { Activity, Flag, MessageSquare } from 'lucide-react';

// interface ActivityItem {
//   id: string;
//   type: 'update' | 'milestone' | 'comment';
//   content: string;
//   timestamp: string;
//   user: {
//     name: string;
//     avatar: string;
//   };
// }

// const recentActivity: ActivityItem[] = [
//   {
//     id: '1',
//     type: 'milestone',
//     content: 'Principal photography completed for Act 1',
//     timestamp: '2h ago',
//     user: {
//       name: 'Sarah Director',
//       avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
//     }
//   },
//   {
//     id: '2',
//     type: 'update',
//     content: 'VFX team completed initial concept renders',
//     timestamp: '4h ago',
//     user: {
//       name: 'Mike Effects',
//       avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100'
//     }
//   },
//   {
//     id: '3',
//     type: 'comment',
//     content: 'Sound design for opening sequence approved',
//     timestamp: '6h ago',
//     user: {
//       name: 'Alex Audio',
//       avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
//     }
//   }
// ];

// const departments = [
//   { name: 'Production', status: 'On Track', progress: 65 },
//   { name: 'Post-Production', status: 'Pending', progress: 0 },
//   { name: 'VFX', status: 'In Progress', progress: 30 },
//   { name: 'Sound', status: 'In Progress', progress: 45 }
// ];

// export function ProjectOverview() {
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//       {/* Main Content - Synopsis and Activity */}
//       <div className="lg:col-span-2 space-y-6">
//         {/* Synopsis */}
//         <section className="bg-white dark:bg-gray-800 rounded-lg p-6">
//           <h2 className="text-xl font-semibold mb-4">Project Synopsis</h2>
//           <p className="text-gray-600 dark:text-gray-300">
//             "The Last Horizon" is an ambitious sci-fi feature film that explores humanity's first contact with an advanced alien civilization. 
//             Set in the year 2157, the story follows a team of international scientists and explorers as they embark on humanity's most 
//             daring mission yet.
//           </p>
//         </section>

//         {/* Activity Feed */}
//         <section className="bg-white dark:bg-gray-800 rounded-lg p-6">
//           <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
//           <div className="space-y-4">
//             {recentActivity.map((item) => (
//               <div key={item.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
//                 <img 
//                   src={item.user.avatar} 
//                   alt={item.user.name}
//                   className="w-10 h-10 rounded-full"
//                 />
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                     {item.user.name}
//                   </p>
//                   <p className="text-sm text-gray-600 dark:text-gray-300">
//                     {item.content}
//                   </p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                     {item.timestamp}
//                   </p>
//                 </div>
//                 {item.type === 'milestone' && <Flag className="w-5 h-5 text-green-500" />}
//                 {item.type === 'update' && <Activity className="w-5 h-5 text-blue-500" />}
//                 {item.type === 'comment' && <MessageSquare className="w-5 h-5 text-purple-500" />}
//               </div>
//             ))}
//           </div>
//         </section>
//       </div>

//       {/* Sidebar - Department Updates */}
//       <div className="space-y-6">
//         {/* Department Status */}
//         <section className="bg-white dark:bg-gray-800 rounded-lg p-6">
//           <h2 className="text-xl font-semibold mb-4">Department Status</h2>
//           <div className="space-y-4">
//             {departments.map((dept) => (
//               <div key={dept.name} className="space-y-2">
//                 <div className="flex justify-between items-center">
//                   <span className="font-medium">{dept.name}</span>
//                   <span className={`text-sm px-2 py-1 rounded-full ${
//                     dept.status === 'On Track' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
//                     dept.status === 'Pending' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100' :
//                     'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
//                   }`}>
//                     {dept.status}
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
//                   <div 
//                     className="bg-primary h-2 rounded-full transition-all duration-300"
//                     style={{ width: `${dept.progress}%` }}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Next Milestones */}
//         <section className="bg-white dark:bg-gray-800 rounded-lg p-6">
//           <h2 className="text-xl font-semibold mb-4">Upcoming Milestones</h2>
//           <div className="space-y-3">
//             <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
//               <div className="flex items-center justify-between">
//                 <span className="font-medium">Complete Act 2 Filming</span>
//                 <span className="text-sm text-gray-500">In 5 days</span>
//               </div>
//               <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//                 Principal photography for Act 2 scenes
//               </p>
//             </div>
//             <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
//               <div className="flex items-center justify-between">
//                 <span className="font-medium">VFX Preview</span>
//                 <span className="text-sm text-gray-500">In 2 weeks</span>
//               </div>
//               <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//                 First look at key visual effects sequences
//               </p>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }
