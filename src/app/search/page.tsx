"use client"

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

type SearchResult = {
  id: string
  title: string
  type: 'Film' | 'TV Series' | 'Development Project'
  description: string
  status?: string
}

const allResults: SearchResult[] = [
  { id: '1', title: "The Quantum Paradox", type: "Film", description: "A mind-bending sci-fi thriller exploring the consequences of time travel.", status: "In Production" },
  { id: '2', title: "Echoes of Eternity", type: "Film", description: "An epic fantasy saga set in a world where magic and technology coexist.", status: "Completed" },
  { id: '3', title: "Cosmic Explorers", type: "TV Series", description: "Follow the adventures of a diverse crew as they explore the far reaches of the galaxy.", status: "Active" },
  { id: '4', title: "Neon Nights", type: "Film", description: "A cyberpunk noir detective story set in a dystopian megacity.", status: "In Development" },
  { id: '5', title: "Temporal Detectives", type: "TV Series", description: "A team of detectives solves crimes by traveling through different historical periods.", status: "In Development" },
  { id: '6', title: "AI Revolution", type: "Development Project", description: "A thought-provoking series about the impact of artificial intelligence on society." },
]

export default function UnifiedSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredResults = allResults.filter(result => 
    result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getTabResults = (tab: string) => {
    if (tab === "all") return filteredResults
    return filteredResults.filter(result => result.type.toLowerCase() === tab)
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Search</h1>
      <Input 
        placeholder="Search for projects, series, or development ideas..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6"
      />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="film">Films</TabsTrigger>
          <TabsTrigger value="tv series">TV Series</TabsTrigger>
          <TabsTrigger value="development project">Development</TabsTrigger>
        </TabsList>
        {["all", "film", "tv series", "development project"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="grid gap-6">
              {getTabResults(tab).map((result) => (
                <Card key={result.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{result.title}</CardTitle>
                      <Badge>{result.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">{result.description}</p>
                    {result.status && <p className="font-semibold">Status: {result.status}</p>}
                    <Link href={`/${result.type.toLowerCase().replace(' ', '-')}/${result.id}`} className="text-primary hover:underline mt-2 inline-block">
                      View Details
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

