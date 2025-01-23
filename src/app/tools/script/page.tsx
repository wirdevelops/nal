import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PencilLine } from 'lucide-react';

export default function ScriptTool() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <PencilLine className="w-6 h-6 text-blue-600" />
        <h1 className="text-3xl font-bold">Script Writing</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Start Writing</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Script writing tool implementation coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}