'use client';

import React, { useState } from 'react';
import { useProjectStore } from '@/zustand/p';
import ProjectCard from '@/components/project/ProjectCard';
import { Input } from "@/components/ui/input";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';


const ProjectsPage: React.FC = () => {
    const projects = useProjectStore((state) => state.projects);
    const addProject = useProjectStore(state => state.addProject)
	const router = useRouter();
	const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newProject, setNewProject] = useState({
		name: '',
		type: '',
		description: '',
		startDate: new Date().toISOString().split('T')[0],
		endDate: new Date().toISOString().split('T')[0],
		status: 'active'
    })


	const handleCreateProject = () => {
		addProject({
            ...newProject,
            id: uuidv4(),
            budget: {
                planned: 0,
                actual: 0
            },
            members: [],
            tasks: [],
            milestones: []
        });
		setIsDialogOpen(false);
		setNewProject({
			name: '',
			type: '',
			description: '',
			startDate: new Date().toISOString().split('T')[0],
			endDate: new Date().toISOString().split('T')[0],
			status: 'active'
		})
	}

  return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
			  <h1 className="text-2xl font-bold">Projects</h1>
				 <div>
					 <AlertDialog>
						 <AlertDialogTrigger asChild>
							 <button className="p-2 bg-primary rounded-md text-white hover:bg-primary-dark">Add Project</button>
						 </AlertDialogTrigger>
						 <AlertDialogContent>
							 <AlertDialogHeader>
								 <AlertDialogTitle>Create a New Project</AlertDialogTitle>
								 <AlertDialogDescription>
									 Create a new project for this platform
								 </AlertDialogDescription>
							 </AlertDialogHeader>
							 <div className="grid gap-4 py-4">
								 <div className="grid gap-2">
									 <Label htmlFor="name">Name</Label>
									 <Input
										 id="name"
										 placeholder="Project name"
										 value={newProject.name}
										 onChange={(e) => setNewProject({...newProject, name: e.target.value})}
									 />
								 </div>
								 <div className="grid gap-2">
									 <Label htmlFor="type">Type</Label>
									 <Input
										 id="type"
										 placeholder="Project type"
										 value={newProject.type}
										 onChange={(e) => setNewProject({...newProject, type: e.target.value})}
									 />
								 </div>
								 <div className="grid gap-2">
									 <Label htmlFor="description">Description</Label>
									 <Input
										 id="description"
										 placeholder="Project Description"
										 value={newProject.description}
										 onChange={(e) => setNewProject({...newProject, description: e.target.value})}
									 />
								 </div>
								 <div className="grid gap-2">
									 <Label htmlFor="startDate">Start Date</Label>
									 <Input
										 type='date'
										 id="startDate"
										 value={newProject.startDate}
										 onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
									 />
								 </div>
								 <div className="grid gap-2">
									 <Label htmlFor="endDate">End Date</Label>
									 <Input
										 type='date'
										 id="endDate"
										 value={newProject.endDate}
										 onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
									 />
								 </div>

							 </div>
							 <AlertDialogFooter>
								 <AlertDialogCancel>Cancel</AlertDialogCancel>
								 <AlertDialogAction onClick={handleCreateProject}>Continue</AlertDialogAction>
							 </AlertDialogFooter>
						 </AlertDialogContent>
					 </AlertDialog>
				 </div>
			</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            name={project.name}
            type={project.type}
            status={project.status}
			description={project.description}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;

// "use client"

// import { useState } from "react"
// import { ProjectCard } from "@/components/project-card"
// import { AnimatedCard } from "@/components/animated-card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import Link from "next/link"

// const projects = [
//   {
//     id: 1,
//     title: "The Quantum Paradox",
//     status: "active",
//     image: "/placeholder.svg",
//     description: "A mind-bending sci-fi thriller exploring the consequences of time travel.",
//   },
//   {
//     id: 2,
//     title: "Echoes of Eternity",
//     status: "completed",
//     image: "/placeholder.svg",
//     description: "An epic fantasy saga set in a world where magic and technology coexist.",
//   },
//   {
//     id: 3,
//     title: "Neon Nights",
//     status: "in-development",
//     image: "/placeholder.svg",
//     description: "A cyberpunk noir detective story set in a dystopian megacity.",
//   },
//   // Add more projects as needed
// ]

// export default function FilmProjects() {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")

//   const filteredProjects = projects.filter((project) => {
//     const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           project.description.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesStatus = statusFilter === "all" || project.status === statusFilter
//     return matchesSearch && matchesStatus
//   })

//   return (
//     <div className="container py-12">
//       <h1 className="text-4xl font-bold mb-8">Film Projects</h1>
//       <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
//         <Input
//           type="text"
//           placeholder="Search projects..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full md:w-64"
//         />
//         <div className="flex space-x-4">
//           <Button
//             variant={statusFilter === "all" ? "default" : "outline"}
//             onClick={() => setStatusFilter("all")}
//           >
//             All
//           </Button>
//           <Button
//             variant={statusFilter === "active" ? "default" : "outline"}
//             onClick={() => setStatusFilter("active")}
//           >
//             Active
//           </Button>
//           <Button
//             variant={statusFilter === "completed" ? "default" : "outline"}
//             onClick={() => setStatusFilter("completed")}
//           >
//             Completed
//           </Button>
//           <Button
//             variant={statusFilter === "in-development" ? "default" : "outline"}
//             onClick={() => setStatusFilter("in-development")}
//           >
//             In Development
//           </Button>
//         </div>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredProjects.map((project) => (
//           <AnimatedCard
//             key={project.id}
//             title={project.title}
//             description={project.status}
//           >
//             <ProjectCard project={project} />
//           </AnimatedCard>
//         ))}
//       </div>
//     </div>
//   )
// }
