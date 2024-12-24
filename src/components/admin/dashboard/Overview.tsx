import { BarChart, Users, Film, Calendar } from 'lucide-react'
import StatsCard from './StatsCard'

const stats = [
  { title: 'Total Users', value: '10,483', icon: Users, change: 12.5 },
  { title: 'Active Projects', value: '23', icon: Film, change: -2.4 },
  { title: 'Upcoming Events', value: '8', icon: Calendar, change: 8.2 },
  { title: 'Revenue', value: '$284,392', icon: BarChart, change: 15.3 },
]

export default function Overview() {
  return (
    <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  )
}