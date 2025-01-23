import { useState } from 'react';
import { BarChart, CreditCard, FileText, PieChart, Wallet } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface Expense {
  id: string;
  department: string;
  category: string;
  amount: number;
  date: string;
}

const initialExpenses: Expense[] = [
  { id: '1', department: 'Production', category: 'Equipment Rental', amount: 1500, date: '2024-07-01' },
  { id: '2', department: 'Art', category: 'Set Design', amount: 800, date: '2024-07-03' },
  { id: '3', department: 'Creative', category: 'Script Development', amount: 500, date: '2024-07-05' },
  { id: '4', department: 'Production', category: 'Crew Salaries', amount: 3000, date: '2024-07-08' },
  { id: '5', department: 'Art', category: 'Costumes', amount: 1200, date: '2024-07-10' },
  { id: '6', department: 'Creative', category: 'Location Scouting', amount: 300, date: '2024-07-12' },
  { id: '7', department: 'Production', category: 'Post-Production', amount: 2000, date: '2024-07-15' },
  { id: '8', department: 'Art', category: 'Props', amount: 700, date: '2024-07-18' },
  { id: '9', department: 'Creative', category: 'Story Editing', amount: 400, date: '2024-07-20' },
  { id: '10', department: 'Production', category: 'Catering', amount: 1000, date: '2024-07-22' },
];

const budgetData = {
  totalBudget: 2500000,
  spent: initialExpenses.reduce((sum, expense) => sum + expense.amount, 0),
  departments: [
    { name: 'Production', allocation: 1000000 },
    { name: 'Art', allocation: 700000 },
    { name: 'Creative', allocation: 500000 },
    { name: 'Marketing', allocation: 300000 },
  ],
};

interface BudgetSummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
}

function BudgetSummaryCard({ title, value, icon: Icon, color }: BudgetSummaryCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center space-x-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${color}-100 dark:bg-${color}-900`}>
        <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400">{value}</p>
      </div>
    </div>
  );
}

function ExpenseItem({ expense }: { expense: Expense }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
      <div>
        <h4 className="font-medium text-gray-900 dark:text-gray-100">{expense.category}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{expense.department}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-900 dark:text-gray-100">${expense.amount}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(expense.date).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

export function BudgetOverview() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  const departmentOptions = ['All', ...new Set(initialExpenses.map(expense => expense.department))];

  const filteredExpenses = selectedDepartment === 'All'
    ? expenses
    : expenses.filter(expense => expense.department === selectedDepartment);

  const departmentAllocations = budgetData.departments.map(dept => ({
    label: dept.name,
    value: dept.allocation,
  }));

  const pieChartData = {
    labels: departmentAllocations.map(dept => dept.label),
    datasets: [
      {
        data: departmentAllocations.map(dept => dept.value),
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#e11d48',
        ],
      },
    ],
  };

  const barChartData = {
    labels: filteredExpenses.map(expense => expense.category),
    datasets: [
      {
        label: 'Expenses',
        data: filteredExpenses.map(expense => expense.amount),
        backgroundColor: '#60a5fa',
      },
    ],
  };

  return (
    <div className="p-6 space-y-8">
      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BudgetSummaryCard
          title="Total Budget"
          value={budgetData.totalBudget.toLocaleString()}
          icon={Wallet}
          color="blue"
        />
        <BudgetSummaryCard
          title="Total Spent"
          value={`$${budgetData.spent.toLocaleString()}`}
          icon={CreditCard}
          color="green"
        />
        <BudgetSummaryCard
          title="Remaining Budget"
          value={`$${(budgetData.totalBudget - budgetData.spent).toLocaleString()}`}
          icon={FileText}
          color="red"
        />
      </div>

      {/* Charts and Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Department Allocations</h2>
          <div className="h-64">
            <Pie data={pieChartData} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Expense Breakdown</h2>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Expenses</h3>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-primary focus:border-primary"
            >
              {departmentOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="h-64">
            <Bar data={barChartData} />
          </div>
        </div>
      </div>

      {/* Expense Tracking */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Expense Tracking</h2>
        <div className="space-y-2">
          {filteredExpenses.map(expense => (
            <ExpenseItem key={expense.id} expense={expense} />
          ))}
        </div>
      </div>
    </div>
  );
}