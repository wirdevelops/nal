"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const seriesTabs = [
  { id: "overview", label: "Series Overview" },
  { id: "seasons", label: "Season Management" },
  { id: "episodes", label: "Episode Tracker" },
  { id: "production", label: "Production Status" },
  { id: "assets", label: "Asset Management" },
]

export default function SeriesDetail({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data - replace with actual data fetching in a real application
  const series = {
    title: "Cosmic Explorers",
    status: "In Production",
    description: "Follow the adventures of a diverse crew as they explore the far reaches of the galaxy.",
    seasons: 3,
    episodes: 24,
    progress: 75,
    team: [
      { name: "Alice Johnson", role: "Showrunner", avatar: "/placeholder.svg" },
      { name: "Bob Williams", role: "Lead Writer", avatar: "/placeholder.svg" },
      // Add more team members
    ],
    seasonData: [
      { number: 1, episodes: 10, status: "Completed" },
      { number: 2, episodes: 12, status: "Post-production" },
      { number: 3, episodes: 2, status: "In Production" },
    ],
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-4">{series.title}</h1>
      <div className="flex items-center space-x-4 mb-8">
        <span className="text-lg font-semibold">{series.status}</span>
        <Progress value={series.progress} className="w-64" />
        <span>{series.progress}% Complete</span>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
          {seriesTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Series Overview</CardTitle>
              <CardDescription>{series.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Key Information</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Genre: Science Fiction</li>
                    <li>Total Seasons: {series.seasons}</li>
                    <li>Total Episodes: {series.episodes}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Key Personnel</h3>
                  <ul className="space-y-2">
                    {series.team.map((member) => (
                      <li key={member.name} className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span>{member.name} - {member.role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="seasons">
          <Card>
            <CardHeader>
              <CardTitle>Season Management</CardTitle>
              <CardDescription>Overview of all seasons.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {series.seasonData.map((season) => (
                  <li key={season.number} className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold">Season {season.number}</span>
                      <span className="ml-4 text-muted-foreground">{season.episodes} episodes</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      season.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      season.status === 'Post-production' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {season.status}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="episodes">
          <Card>
            <CardHeader>
              <CardTitle>Episode Tracker</CardTitle>
              <CardDescription>Manage and track individual episodes.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Episode tracker content goes here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="production">
          <Card>
            <CardHeader>
              <CardTitle>Production Status</CardTitle>
              <CardDescription>Current production status and progress.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Production status dashboard content goes here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="assets">
          <Card>
            <CardHeader>
              <CardTitle>Asset Management</CardTitle>
              <CardDescription>Track and manage series assets.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Asset management content goes here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}