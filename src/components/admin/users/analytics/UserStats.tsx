"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserX, Activity } from "lucide-react"

const stats = [
  {
    title: "Total Users",
    value: "10,483",
    icon: Users,
    description: "+12.3% from last month"
  },
  {
    title: "Active Users",
    value: "8,234",
    icon: UserCheck,
    description: "+4.5% from last month"
  },
  {
    title: "Banned Users",
    value: "23",
    icon: UserX,
    description: "-2.1% from last month"
  },
  {
    title: "Average Session",
    value: "24m",
    icon: Activity,
    description: "+8.4% from last month"
  }
]

export function UserStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}