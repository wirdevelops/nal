import { useState } from 'react';
import { BarChart, Download, FileText, PieChart, TrendingUp } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface Report {
  id: string;
  title: string;
  description: string;
  data: any;
  type: 'pie' | 'bar' | 'table';
}

const initialReports: Report[] = [
  {
    id: '1',
    title: 'Department Budget Allocation',
    description: 'A pie chart showing the budget allocation across different departments.',
    type: 'pie',
    data: {
      labels: ['Production', 'Art', 'Creative', 'Marketing'],
      datasets: [
        {
          data: [1000000, 700000, 500000, 300000],
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#e11d48'],
        },
      ],
    },
  },
  {
    id: '2',
    title: 'Monthly Expenses',
    description: 'A bar chart showing the monthly expenses for the project.',
    type: 'bar',
    data: {
      labels: ['July', 'August', 'September', 'October', 'November'],
      datasets: [
        {
          label: 'Expenses',
          data: [50000, 75000, 60000, 80000, 90000],
          backgroundColor: '#60a5fa',
        },
      ],
    },
  },
  {
    id: '3',
    title: 'Team Progress',
    description: 'A table showing the progress of each team member.',
    type: 'table',
    data: {
      headers: ['Team Member', 'Tasks Completed', 'Progress'],
      rows: [
        ['Sarah Director', 10, '100%'],
        ['Mike Producer', 15, '75%'],
        ['Alex Writer', 12, '80%'],
        ['Emily Art', 8, '60%'],
      ],
    },
  },
];

interface Metric {
  id: string;
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
}

const initialMetrics: Metric[] = [
  {
    id: '1',
    title: 'Total Budget',
    value: '$2,500,000',
    icon: FileText,
    color: 'blue',
  },
  {
    id: '2',
    title: 'Days in Production',
    value: 45,
    icon: BarChart,
    color: 'green',
  },
  {
    id: '3',
    title: 'Overall Progress',
    value: '65%',
    icon: TrendingUp,
    color: 'purple',
  },
];

interface MetricCardProps {
  metric: Metric;
}

function MetricCard({ metric }: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center space-x-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${metric.color}-100 dark:bg-${metric.color}-900`}>
        <metric.icon className={`w-6 h-6 text-${metric.color}-600 dark:text-${metric.color}-400`} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{metric.title}</h3>
        <p className="text-gray-500 dark:text-gray-400">{metric.value}</p>
      </div>
    </div>
  );
}

function ReportItem({ report }: { report: Report }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{report.title}</h3>
        <button className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
          <Download className="w-4 h-4" />
        </button>
      </div>
      <p className="text-gray-600 dark:text-gray-400">{report.description}</p>
      {report.type === 'pie' && <div className="h-64"><Pie data={report.data} /></div>}
      {report.type === 'bar' && <div className="h-64"><Bar data={report.data} /></div>}
      {report.type === 'table' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                {report.data.headers.map((header: string) => (
                  <th key={header} className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 font-medium text-gray-800 dark:text-gray-200">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {report.data.rows.map((row: string[], index: number) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function AnalyticsDashboard() {
  const [reports] = useState(initialReports);
  const [metrics] = useState(initialMetrics);

  return (
    <div className="p-6 space-y-8">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map(metric => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Reports */}
      <div className="space-y-6">
        {reports.map(report => (
          <ReportItem key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}