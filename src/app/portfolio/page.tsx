"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

type PortfolioItem = {
  id: string
  title: string
  category: string
  image: string
  description: string
  year: number
}

const initialPortfolioItems: PortfolioItem[] = [
  { id: '1', title: "The Quantum Paradox", category: "Film", image: "/placeholder.svg", description: "A mind-bending sci-fi thriller exploring the consequences of time travel.", year: 2023 },
  { id: '2', title: "Echoes of Eternity", category: "Film", image: "/placeholder.svg", description: "An epic fantasy saga set in a world where magic and technology coexist.", year: 2022 },
  { id: '3', title: "Cosmic Explorers", category: "TV Series", image: "/placeholder.svg", description: "Follow the adventures of a diverse crew as they explore the far reaches of the galaxy.", year: 2021 },
  { id: '4', title: "Neon Nights", category: "Film", image: "/placeholder.svg", description: "A cyberpunk noir detective story set in a dystopian megacity.", year: 2023 },
  { id: '5', title: "Temporal Detectives", category: "TV Series", image: "/placeholder.svg", description: "A team of detectives solves crimes by traveling through different historical periods.", year: 2022 },
]

const mediaGallery = [
  { id: 1, title: "Behind the scenes", image: "/placeholder.svg" },
  { id: 2, title: "Red carpet premiere", image: "/placeholder.svg" },
  { id: 3, title: "Cast interview", image: "/placeholder.svg" },
  { id: 4, title: "Location scouting", image: "/placeholder.svg" },
]

const credits = [
  { id: 1, title: "Best Director", project: "The Quantum Paradox", year: 2023 },
  { id: 2, title: "Best Visual Effects", project: "Echoes of Eternity", year: 2022 },
  { id: 3, title: "Best TV Series", project: "Cosmic Explorers", year: 2021 },
  { id: 4, title: "Best Cinematography", project: "Neon Nights", year: 2023 },
]

export default function Portfolio() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(initialPortfolioItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("title")

  const filteredAndSortedItems = portfolioItems
    .filter(item => 
      (categoryFilter === "all" || item.category === categoryFilter) &&
      (item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title)
      if (sortBy === "year") return b.year - a.year
      return 0
    })

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Portfolio</h1>
      <Tabs defaultValue="showcase" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="showcase">Project Showcase</TabsTrigger>
          <TabsTrigger value="gallery">Media Gallery</TabsTrigger>
          <TabsTrigger value="credits">Credits & Recognition</TabsTrigger>
        </TabsList>
        <TabsContent value="showcase">
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <Input 
              placeholder="Search projects..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sm:w-1/3"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="sm:w-1/4">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Film">Film</SelectItem>
                <SelectItem value="TV Series">TV Series</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="sm:w-1/4">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Sort by Title</SelectItem>
                <SelectItem value="year">Sort by Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAndSortedItems.map((project) => (
              <Card key={project.id}>
                <Image
                  src={project.image}
                  alt={project.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{project.category} | {project.year}</p>
                  <p>{project.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="gallery">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mediaGallery.map((item) => (
              <div key={item.id} className="relative aspect-square">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="credits">
          <ul className="space-y-4">
            {credits.map((credit) => (
              <li key={credit.id} className="bg-muted p-4 rounded-lg">
                <h3 className="font-bold">{credit.title}</h3>
                <p>{credit.project} - {credit.year}</p>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  )
}