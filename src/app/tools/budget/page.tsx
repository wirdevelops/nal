import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

export default function BudgetTool() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <DollarSign className="w-6 h-6 text-red-600" />
        <h1 className="text-3xl font-bold">Budget Planning</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Budget planning tool implementation coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}