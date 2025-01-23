"use client"

import { useState } from "react"
import { SeriesCard } from "@/components/series-card"
import { AnimatedCard } from "@/components/animated-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const series = [
  {
    id: 1,
    title: "Cosmic Explorers",
    status: "active",
    image: "/placeholder.svg",
    description: "Follow the adventures of a diverse crew as they explore the far reaches of the galaxy.",
    seasons: 3,
  },
  {
    id: 2,
    title: "Temporal Detectives",
    status: "in-development",
    image: "/placeholder.svg",
    description: "A team of detectives solves crimes by traveling through different historical periods.",
    seasons: 1,
  },
  {
    id: 3,
    title: "Mystic Falls",
    status: "completed",
    image: "/placeholder.svg",
    description: "A supernatural drama set in a small town where nothing is as it seems.",
    seasons: 5,
  },
  // Add more series as needed
]

export default function TVSeries() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredSeries = series.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || s.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">TV Series</h1>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
        <Input
          type="text"
          placeholder="Search TV series..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-64"
        />
        <div className="flex space-x-4">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
          >
            All
          </Button>
          <Button
            variant={statusFilter === "active" ? "default" : "outline"}
            onClick={() => setStatusFilter("active")}
          >
            Active
          </Button>
          <Button
            variant={statusFilter === "completed" ? "default" : "outline"}
            onClick={() => setStatusFilter("completed")}
          >
            Completed
          </Button>
          <Button
            variant={statusFilter === "in-development" ? "default" : "outline"}
            onClick={() => setStatusFilter("in-development")}
          >
            In Development
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSeries.map((s) => (
          <AnimatedCard
            key={s.id}
            title={s.title}
            description={s.status}
          >
            <SeriesCard series={s} />
          </AnimatedCard>
        ))}
      </div>
    </div>
  )
}

