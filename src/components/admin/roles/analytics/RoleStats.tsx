"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Lock, Activity } from "lucide-react"

const stats = [
  {
    title: "Total Roles",
    value: "12",
    icon: Shield,
    description: "+2 from last month"
  },
  {
    title: "Users Assigned",
    value: "1,234",
    icon: Users,
    description: "+8.2% from last month"
  },
  {
    title: "Total Permissions",
    value: "48",
    icon: Lock,
    description: "+4 from last month"
  },
  {
    title: "Role Changes",
    value: "156",
    icon: Activity,
    description: "Last 30 days"
  }
]

export function RoleStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}