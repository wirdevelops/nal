"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { date: "2024-03-01", assignments: 45 },
  { date: "2024-03-02", assignments: 52 },
  { date: "2024-03-03", assignments: 49 },
  { date: "2024-03-04", assignments: 63 },
  { date: "2024-03-05", assignments: 58 },
  { date: "2024-03-06", assignments: 64 },
  { date: "2024-03-07", assignments: 69 }
]

export function RoleUsageChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Role Assignments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="assignments" stroke="#E31837" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}