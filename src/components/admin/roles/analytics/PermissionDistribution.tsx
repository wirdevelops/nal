"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { name: 'Admin', permissions: 48 },
  { name: 'Editor', permissions: 32 },
  { name: 'Moderator', permissions: 24 },
  { name: 'User', permissions: 12 },
]

export function PermissionDistribution() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Permission Distribution by Role</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="permissions" fill="#E31837" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}