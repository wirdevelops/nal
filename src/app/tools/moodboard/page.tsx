import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette } from 'lucide-react';

export default function MoodboardTool() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Palette className="w-6 h-6 text-purple-600" />
        <h1 className="text-3xl font-bold">Moodboard</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create Moodboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Moodboard creation tool implementation coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}