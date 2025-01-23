import { useState } from 'react';
import { LayoutDashboard, Code, Camera, Film } from 'lucide-react';

interface PhasePanelProps {
  phase: 'Development' | 'Pre-Production' | 'Production' | 'Post-Production';
}

function DevelopmentPanel() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Development Phase</h2>
      <p className="text-gray-600 dark:text-gray-300">
        During the development phase, the focus is on script writing, storyboarding, and initial concept art.
      </p>
      <ul className="list-disc list-inside mt-4 text-gray-600 dark:text-gray-300">
        <li>Script Finalization</li>
        <li>Storyboarding</li>
        <li>Concept Art</li>
        <li>Initial Budget Planning</li>
      </ul>
    </div>
  );
}

function ProductionPanel() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Production Phase</h2>
      <p className="text-gray-600 dark:text-gray-300">
        The production phase involves filming, set construction, and managing the crew.
      </p>
      <ul className="list-disc list-inside mt-4 text-gray-600 dark:text-gray-300">
        <li>Principal Photography</li>
        <li>Set Construction</li>
        <li>Crew Management</li>
        <li>Daily Filming Schedule</li>
      </ul>
    </div>
  );
}

function PostProductionPanel() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Post-Production Phase</h2>
      <p className="text-gray-600 dark:text-gray-300">
        Post-production includes editing, sound design, visual effects, and color grading.
      </p>
      <ul className="list-disc list-inside mt-4 text-gray-600 dark:text-gray-300">
        <li>Video Editing</li>
        <li>Sound Design</li>
        <li>Visual Effects</li>
        <li>Color Grading</li>
      </ul>
    </div>
  );
}

export function PhasePanels({ phase }: PhasePanelProps) {
  return (
    <div className="space-y-6">
      {phase === 'Development' && <DevelopmentPanel />}
      {phase === 'Production' && <ProductionPanel />}
      {phase === 'Post-Production' && <PostProductionPanel />}
      {phase === 'Pre-Production' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Pre-Production Phase</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Pre-production involves planning, location scouting, casting, and budget finalization.
          </p>
          <ul className="list-disc list-inside mt-4 text-gray-600 dark:text-gray-300">
            <li>Location Scouting</li>
            <li>Casting</li>
            <li>Budget Finalization</li>
            <li>Scheduling</li>
          </ul>
        </div>
      )}
    </div>
  );
}
