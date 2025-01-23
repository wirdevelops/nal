// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useProjects } from '@/hooks/useNGOProject';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { FileUpload } from '@/components/shared/FileUpload';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { ProjectStatus } from '@/types/ngo';

// export default function ProjectUpdatePage({ params }: { params: { projectId: string } }) {
//   const router = useRouter();
//   const { project, updateProject } = useProjects(params.projectId);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData, setFormData] = useState({
//     title: project?.title || '',
//     description: project?.description || '',
//     status: project?.status || 'ongoing',
//     progress: project?.progress || 0,
//     budget: {
//       total: project?.budget.total || 0,
//       allocated: project?.budget.allocated || 0,
//     },
//     thumbnail: null as File | null,
//   });

//   if (!project) {
//     return null;
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       await updateProject({
//         ...formData,
//         updatedAt: new Date().toISOString(),
//       });
      
//       router.push(`/ngo/projects/${params.projectId}`);
//     } catch (error) {
//       console.error('Failed to update project:', error);
//       // TODO: Show error toast
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-2xl">
//       <Card>
//         <CardHeader>
//           <CardTitle>Update Project</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="space-y-2">
//               <Label htmlFor="title">Project Title</Label>
//               <Input
//                 id="title"
//                 value={formData.title}
//                 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="description">Description</Label>
//               <Textarea
//                 id="description"
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 rows={4}
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="status">Status</Label>
//                 <Select
//                   value={formData.status}
//                   onValueChange={(value) => setFormData({ ...formData, status: value as ProjectStatus })}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="ongoing">Ongoing</SelectItem>
//                     <SelectItem value="completed">Completed</SelectItem>
//                     <SelectItem value="planned">Planned</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="progress">Progress (%)</Label>
//                 <Input
//                   id="progress"
//                   type="number"
//                   min="0"
//                   max="100"
//                   value={formData.progress}
//                   onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="totalBudget">Total Budget ($)</Label>
//                 <Input
//                   id="totalBudget"
//                   type="number"
//                   value={formData.budget.total}
//                   onChange={(e) => setFormData({
//                     ...formData,
//                     budget: { ...formData.budget, total: Number(e.target.value) }
//                   })}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="allocatedBudget">Allocated Budget ($)</Label>
