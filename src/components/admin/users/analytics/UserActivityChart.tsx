"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { date: "2024-03-01", users: 145 },
  { date: "2024-03-02", users: 162 },
  { date: "2024-03-03", users: 156 },
  { date: "2024-03-04", users: 178 },
  { date: "2024-03-05", users: 184 },
  { date: "2024-03-06", users: 191 },
  { date: "2024-03-07", users: 182 }
]

export function UserActivityChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>User Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#E31837" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}