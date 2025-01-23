"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

type ProjectSubmission = {
  title: string
  description: string
  genre: string
  targetAudience: string
}

export default function SubmitProject() {
  const [project, setProject] = useState<ProjectSubmission>({
    title: '',
    description: '',
    genre: '',
    targetAudience: '',
  })
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProject({ ...project, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would send this data to your backend
    console.log('Submitting project:', project)
    // Simulating an API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast({
      title: "Project Submitted",
      description: "Your project has been submitted for review.",
    })
    router.push('/development')
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Submit a Development Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Project Title</label>
          <Input
            id="title"
            name="title"
            value={project.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Project Description</label>
          <Textarea
            id="description"
            name="description"
            value={project.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700">Genre</label>
          <Input
            id="genre"
            name="genre"
            value={project.genre}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">Target Audience</label>
          <Input
            id="targetAudience"
            name="targetAudience"
            value={project.targetAudience}
            onChange={handleInputChange}
            required
          />
        </div>
        <Button type="submit">Submit Project</Button>
      </form>
    </div>
  )
}