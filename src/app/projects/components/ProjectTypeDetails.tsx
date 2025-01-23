'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ProjectType, QuickOption } from '@/types/project-types';

interface ProjectTypeDetailsProps {
  selectedType: ProjectType;
  onMainCreate: () => void;
  onQuickStart: (option: QuickOption) => void;
}

export function ProjectTypeDetails({
  selectedType,
  onMainCreate,
  onQuickStart
}: ProjectTypeDetailsProps) {
  const Icon = selectedType.icon;

  return (
    <div className="flex-1 flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-6">
          {/* Project Type Details */}
          <div className="flex items-start gap-4 mb-8">
            <div className={cn(
              "p-3 rounded-lg bg-primary/10"
            )}>
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{selectedType.label}</h3>
              <p className="text-muted-foreground mt-1">
                {selectedType.description}
              </p>
            </div>
          </div>

          {/* Main Create Button */}
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white mb-8"
            onClick={onMainCreate}
          >
            Create {selectedType.label} Project
          </Button>

          {/* Quick Create Options */}
          {selectedType.quickOptions && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-4">
                Quick Start Options
              </h4>
              <div className="grid gap-4">
                {selectedType.quickOptions.map((option) => {
                  const OptionIcon = option.icon;
                  return (
                    <Card 
                      key={option.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => onQuickStart(option)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-md bg-muted">
                            <OptionIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="font-medium">{option.title}</h5>
                            <p className="text-sm text-muted-foreground">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}