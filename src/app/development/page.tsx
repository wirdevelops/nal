"use client"

import { useState } from 'react'
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

type DevelopmentProject = {
  id: string
  title: string
  status: 'concept' | 'script' | 'pre-production'
  image: string
  description: string
  submittedBy: string
}

const initialProjects: DevelopmentProject[] = [
  {
    id: '1',
    title: "Underwater Kingdom",
    status: "concept",
    image: "/placeholder.svg",
    description: "A fantasy adventure set in a hidden underwater civilization.",
    submittedBy: "John Doe"
  },
  {
    id: '2',
    title: "AI Revolution",
    status: "script",
    image: "/placeholder.svg",
    description: "A thought-provoking series about the impact of artificial intelligence on society.",
    submittedBy: "Jane Smith"
  },
  {
    id: '3',
    title: "Cosmic Horror",
    status: "pre-production",
    image: "/placeholder.svg",
    description: "A psychological horror film inspired by the works of H.P. Lovecraft.",
    submittedBy: "Alex Johnson"
  },
]

export default function Development() {
  const [projects, setProjects] = useState<DevelopmentProject[]>(initialProjects)
  const [newProject, setNewProject] = useState<Partial<DevelopmentProject>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewProject({ ...newProject, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newProject.title && newProject.description) {
      const project: DevelopmentProject = {
        id: Date.now().toString(),
        title: newProject.title,
        status: 'concept',
        image: "/placeholder.svg",
        description: newProject.description,
        submittedBy: "Current User", // In a real app, this would be the logged-in user
      }
      setProjects([...projects, project])
      setNewProject({})
      toast({
        title: "Project Submitted",
        description: "Your project has been submitted for review.",
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container py-12"
    >
      <h1 className="text-4xl font-bold mb-8">Development Projects</h1>
      <Tabs defaultValue="all" className="w-full mb-8">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="concept">Concept</TabsTrigger>
          <TabsTrigger value="script">Script</TabsTrigger>
          <TabsTrigger value="pre-production">Pre-production</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>
        {["concept", "script", "pre-production"].map((status) => (
          <TabsContent key={status} value={status}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects
                .filter((project) => project.status === status)
                .map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Submit a New Project Idea</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              name="title"
              value={newProject.title || ''}
              onChange={handleInputChange}
              placeholder="Enter project title"
            />
          </div>
          <div>
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              name="description"
              value={newProject.description || ''}
              onChange={handleInputChange}
              placeholder="Enter project description"
            />
          </div>
          <Button type="submit">Submit Idea</Button>
        </form>
      </div>
    </motion.div>
  )
}

