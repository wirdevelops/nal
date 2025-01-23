'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

const performanceData = [
  { month: 'Jan', hours: 65 },
  { month: 'Feb', hours: 85 },
  { month: 'Mar', hours: 45 },
  { month: 'Apr', hours: 95 },
  { month: 'May', hours: 75 },
];

export function VolunteerPerformanceDashboard() {
  const [timeRange, setTimeRange] = useState('6M');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Performance Overview</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {timeRange} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTimeRange('1M')}>1 Month</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeRange('3M')}>3 Months</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeRange('6M')}>6 Months</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeRange('1Y')}>1 Year</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="hours" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}