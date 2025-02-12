// src/app/ngo/dashboard/ProjectsSummary.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Project {
    id: string;
    name: string;
    description: string;
}

interface ProjectsSummaryProps {
    projects: Project[];
}

export const ProjectsSummary: React.FC<ProjectsSummaryProps> = ({ projects }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Projects Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[400px] overflow-y-auto">
                <ul className="space-y-4 p-4">
                        {projects.length > 0 ? (
                            projects.map((project) => (
                                <li key={project.id} className="border rounded-md p-4 hover:shadow-md transition-shadow">
                                    <h4 className="font-medium">{project.name}</h4>
                                    <p className="text-sm text-muted-foreground">{project.description}</p>
                                </li>
                            ))
                        ) : (
                           <div className="text-muted-foreground text-center p-6">
                            No active projects.
                            </div>
                        )}
                    </ul>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};