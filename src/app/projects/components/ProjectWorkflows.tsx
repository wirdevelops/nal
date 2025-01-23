import React from 'react';

import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
// ProjectWorkflows.tsx
export function ProjectWorkflow({ project }) {
  const workflowSteps = {
    feature: [
      {
        id: 'development',
        label: 'Development',
        tasks: ['Script Development', 'Story Boarding', 'Location Scouting'],
        tools: ['script-editor', 'mood-board', 'location-manager']
      },
      {
        id: 'pre-production',
        label: 'Pre-Production',
        tasks: ['Casting', 'Crew Assembly', 'Budget Planning'],
        tools: ['cast-manager', 'crew-planner', 'budget-tool']
      },
      {
        id: 'production',
        label: 'Production',
        tasks: ['Shooting Schedule', 'Daily Reports', 'Asset Management'],
        tools: ['schedule-manager', 'report-generator', 'asset-manager']
      }
    ],
    series: [
      {
        id: 'writers-room',
        label: 'Writers Room',
        tasks: ['Episode Planning', 'Script Development', 'Series Bible'],
        tools: ['episode-planner', 'script-editor', 'bible-manager']
      },
      {
        id: 'season-planning',
        label: 'Season Planning',
        tasks: ['Cast Planning', 'Location Planning', 'Schedule Development'],
        tools: ['cast-planner', 'location-manager', 'schedule-tool']
      }
    ],
    // ... add workflows for other project types
  };

  const currentWorkflow = workflowSteps[project.type] || workflowSteps.feature;
  const currentStepIndex = currentWorkflow.findIndex(step => step.id === project.currentStep);

  return (
    <AnimatePresence>
      <div className="space-y-8">
        {/* Workflow Progress */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            {currentWorkflow.map((step, index) => (
              <React.Fragment key={step.id}>
                <motion.div 
                  className={cn(
                    "relative z-10 flex flex-col items-center",
                    index <= currentStepIndex ? "text-primary" : "text-muted-foreground"
                  )}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    "border-2",
                    index <= currentStepIndex ? "border-primary bg-primary/10" : "border-muted"
                  )}>
                    {index + 1}
                  </div>
                  <span className="mt-2 text-sm font-medium">{step.label}</span>
                </motion.div>
                {index < currentWorkflow.length - 1 && (
                  <div className={cn(
                    "flex-1 h-0.5",
                    index < currentStepIndex ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* Current Step Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-2 gap-6">
            {/* Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Current Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <motion.ul className="space-y-3">
                  {currentWorkflow[currentStepIndex]?.tasks.map((task, index) => (
                    <motion.li
                      key={task}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      {task}
                    </motion.li>
                  ))}
                </motion.ul>
              </CardContent>
            </Card>

            {/* Tools */}
            <Card>
              <CardHeader>
                <CardTitle>Available Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {currentWorkflow[currentStepIndex]?.tools.map((tool) => (
                    <Button
                      key={tool}
                      variant="outline"
                      className="h-auto py-4 flex flex-col items-center gap-2"
                    >
                      <tool.icon className="w-5 h-5" />
                      <span className="text-sm">{tool.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}