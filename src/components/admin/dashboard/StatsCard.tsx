import { ArrowUp, ArrowDown, LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change: number;
}

export default function StatsCard({ title, value, icon: Icon, change }: StatsCardProps) {
  const isPositive = change > 0
  
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <div className="p-3 mr-4 text-primary-red bg-primary-red bg-opacity-10 rounded-full">
        <Icon size={24} />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </p>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          {value}
        </p>
        <p className={`text-sm font-medium ${
          isPositive ? 'text-green-500' : 'text-red-500'
        }`}>
          {isPositive ? <ArrowUp size={16} className="inline" /> : <ArrowDown size={16} className="inline" />}
          {Math.abs(change)}%
        </p>
      </div>
    </div>
  )
}