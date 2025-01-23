import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { PROJECT_TYPES } from '@/config/projectTypes';
import { X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ProjectTypeDialog } from './ProjectTypeDialog'; 
import type { ProjectType, QuickOption } from '@/types/project-types';
import { TypeSpecificProjectDialog } from './TypeSpecificProjectDialog';

interface CreativeProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreativeProjectDialog({ 
  open, 
  onOpenChange 
}: CreativeProjectDialogProps) {
  const [selectedType, setSelectedType] = useState<ProjectType>(PROJECT_TYPES[0]);
  const [typeDialogOpen, setTypeDialogOpen] = useState(false);
  const [quickStartOption, setQuickStartOption] = useState<QuickOption | null>(null);

  const handleQuickStart = (option: QuickOption) => {
    setQuickStartOption(option);
    setTypeDialogOpen(true);
    onOpenChange(false); // Close the main dialog
  };

  const handleMainCreate = () => {
    setQuickStartOption(null);
    setTypeDialogOpen(true);
    onOpenChange(false); // Close the main dialog
  };

  const handleTypeDialogClose = () => {
    setTypeDialogOpen(false);
    setQuickStartOption(null);
  };

  // Get the current selected type object
  const currentType = PROJECT_TYPES.find(type => type.id === selectedType?.id);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl p-0 gap-0 h-[80vh]">
          <div className="flex h-full">
            {/* Left Sidebar */}
            <div className="w-64 border-r flex flex-col">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Create New Project</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onOpenChange(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="flex-1">
                <div className="py-2">
                  {PROJECT_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type)}
                        className={cn(
                          "w-full px-4 py-2 flex items-center gap-3 hover:bg-muted transition-colors",
                          selectedType?.id === type.id && "bg-muted"
                        )}
                      >
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="font-medium">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            {/* Right Content */}
            <div className="flex-1 flex flex-col">
              <ScrollArea className="flex-1">
                <div className="p-6">
                  {currentType && (
                    <>
                      {/* Project Type Details */}
                      <div className="flex items-start gap-4 mb-8">
                        <div className={cn("p-3 rounded-lg bg-primary/10")}>
                          {React.createElement(currentType.icon, {
                            className: "w-6 h-6 text-primary"
                          })}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{currentType.label}</h3>
                          <p className="text-muted-foreground mt-1">
                            {currentType.description}
                          </p>
                        </div>
                      </div>

                      {/* Main Create Button */}
                      <Button 
  className="w-full bg-primary hover:bg-primary/90 text-white mb-8"
  onClick={handleMainCreate} // Use the handler function instead
>
  Create {currentType.label} Project
</Button>

                      {/* Quick Start Options */}
                      {currentType.quickOptions && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-4">
                            Quick Start Options
                          </h4>
                          <div className="grid gap-4">
                            {currentType.quickOptions.map((option) => (
                              <Card 
                                key={option.id}
                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => handleQuickStart(option)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-3">
                                    {React.createElement(option.icon, {
                                      className: "w-5 h-5 text-muted-foreground"
                                    })}
                                    <div>
                                      <h5 className="font-medium">{option.title}</h5>
                                      <p className="text-sm text-muted-foreground">
                                        {option.description}
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TypeSpecificProjectDialog
        open={typeDialogOpen}
        onOpenChange={handleTypeDialogClose}
        PROJECT_TYPE={selectedType.id}
        quickStartOption={quickStartOption}
      />
    </>
  );
}
