import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {DialogFooter} from "@/components/ui/dialog";
import {
  PencilLine,
  Camera,
  Scissors,
  Megaphone,
  Plus,
  Lightbulb,
  Map,
  Calendar,
  FileVideo,
  Palette,
  Trophy,
  ArrowRight
} from 'lucide-react';

export const ProjectInitiation = ({ onOpenChange }) => {
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);

  const phases = [
    {
      id: 'development',
      title: 'Development & Ideation',
      icon: PencilLine,
      description: 'Start from scratch or develop your story idea',
      tools: [
        {
          id: 'script',
          title: 'Script Writing',
          icon: Lightbulb,
          description: 'Create and collaborate on your script',
          creates: 'screenplay'
        },
        {
          id: 'moodboard',
          title: 'Mood Board',
          icon: Palette,
          description: 'Collect visual references and inspiration',
          creates: 'visualGuide'
        },
        {
          id: 'pitch',
          title: 'Pitch Deck',
          icon: Trophy,
          description: 'Create a compelling pitch presentation',
          creates: 'presentation'
        }
      ]
    },
    {
      id: 'preproduction',
      title: 'Pre-Production',
      icon: Camera,
      description: 'Plan your production in detail',
      tools: [
        {
          id: 'casting',
          title: 'Casting Manager',
          icon: Users,
          description: 'Organize auditions and manage talent',
          creates: 'castingProject'
        },
        {
          id: 'locations',
          title: 'Location Scout',
          icon: Map,
          description: 'Track and manage shooting locations',
          creates: 'locationProject'
        },
        {
          id: 'schedule',
          title: 'Production Schedule',
          icon: Calendar,
          description: 'Create detailed shooting schedules',
          creates: 'scheduleProject'
        }
      ]
    },
    {
      id: 'production',
      title: 'Production',
      icon: Film,
      description: 'Manage active production',
      tools: [
        {
          id: 'dailies',
          title: 'Dailies Tracker',
          icon: FileVideo,
          description: 'Track and review daily footage',
          creates: 'productionTracker'
        },
        {
          id: 'callsheets',
          title: 'Call Sheets',
          icon: Calendar,
          description: 'Manage daily call sheets',
          creates: 'callsheetSystem'
        }
      ]
    },
    {
      id: 'postproduction',
      title: 'Post-Production',
      icon: Scissors,
      description: 'Edit and finish your project',
      tools: [
        {
          id: 'editing',
          title: 'Edit Timeline',
          icon: Scissors,
          description: 'Manage editing workflow',
          creates: 'editingProject'
        },
        {
          id: 'vfx',
          title: 'VFX Pipeline',
          icon: Palette,
          description: 'Track visual effects shots',
          creates: 'vfxTracker'
        }
      ]
    },
    {
      id: 'distribution',
      title: 'Distribution',
      icon: Megaphone,
      description: 'Share your work with the world',
      tools: [
        {
          id: 'festivals',
          title: 'Festival Manager',
          icon: Trophy,
          description: 'Track festival submissions',
          creates: 'festivalManager'
        },
        {
          id: 'marketing',
          title: 'Marketing Hub',
          icon: Megaphone,
          description: 'Create and manage marketing materials',
          creates: 'marketingProject'
        }
      ]
    }
  ];

  const renderPhaseSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {phases.map((phase) => (
        <Card 
          key={phase.id}
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedPhase?.id === phase.id ? 'border-primary ring-2 ring-primary' : ''
          }`}
          onClick={() => setSelectedPhase(phase)}
        >
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <phase.icon className="w-5 h-5" />
              {phase.title}
            </CardTitle>
            <CardDescription>{phase.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );

  const renderToolSelection = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" onClick={() => setSelectedPhase(null)}>
          Back
        </Button>
        <h3 className="text-lg font-semibold">{selectedPhase.title} Tools</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedPhase.tools.map((tool) => (
          <Card 
            key={tool.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedTool?.id === tool.id ? 'border-primary ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedTool(tool)}
          >
            <CardContent className="flex items-start gap-4 pt-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <tool.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium leading-none">{tool.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {tool.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedTool && (
        <div className="flex justify-end mt-6">
          <Button 
            className="flex items-center gap-2"
            onClick={() => {
              console.log('Creating project with tool:', selectedTool);
              onOpenChange(false);
            }}
          >
            Continue to {selectedTool.title}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Start a New Project</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {selectedPhase ? renderToolSelection() : renderPhaseSelection()}
        </div>
      </DialogContent>
    </Dialog>
  );
};




import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, CheckCircle2, Clock,  Film, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const projectTypes = [
  { id: 'feature', label: 'Feature Film', icon: Film },
  { id: 'short', label: 'Short Film', icon: Film },
  { id: 'series', label: 'TV Series', icon: Film },
  { id: 'commercial', label: 'Commercial', icon: Film },
  { id: 'documentary', label: 'Documentary', icon: Film },
  { id: 'music_video', label: 'Music Video', icon: Film },
];

export const ProjectCreationDialog = ({ open, onOpenChange }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    startDate: null,
    endDate: null,
    budget: '',
    location: '',
    team: [],
    genre: '',
  });

  const steps = [
    { number: 1, title: 'Project Type', icon: Film },
    { number: 2, title: 'Basic Info', icon: CheckCircle2 },
    { number: 3, title: 'Schedule', icon: Clock },
    { number: 4, title: 'Team', icon: Users },
  ];

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    onOpenChange(false);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid grid-cols-2 gap-4">
            {projectTypes.map((type) => (
              <Button
                key={type.id}
                variant={formData.type === type.id ? "default" : "outline"}
                className={cn(
                  "h-24 flex flex-col items-center justify-center gap-2",
                  formData.type === type.id && "border-2 border-primary"
                )}
                onClick={() => updateForm('type', type.id)}
              >
                <type.icon className="w-6 h-6" />
                <span>{type.label}</span>
              </Button>
            ))}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateForm('title', e.target.value)}
                placeholder="Enter project title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateForm('description', e.target.value)}
                placeholder="Brief description of your project"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Select
                value={formData.genre}
                onValueChange={(value) => updateForm('genre', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="action">Action</SelectItem>
                  <SelectItem value="drama">Drama</SelectItem>
                  <SelectItem value="comedy">Comedy</SelectItem>
                  <SelectItem value="documentary">Documentary</SelectItem>
                  <SelectItem value="horror">Horror</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? (
                        format(formData.startDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => updateForm('startDate', date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? (
                        format(formData.endDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => updateForm('endDate', date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => updateForm('budget', e.target.value)}
                placeholder="Enter project budget"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Primary Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => updateForm('location', e.target.value)}
                placeholder="Enter primary shooting location"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Add key team members to your project. You can add more team members later.
            </p>
            {/* Team selection implementation */}
            <div className="space-y-2">
              <Label>Key Roles</Label>
              {/* Add team member selection UI here */}
              <p className="text-sm text-muted-foreground">
                Team member selection will be implemented in the next phase
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex justify-between mb-8">
          {steps.map((s, i) => (
            <div
              key={s.number}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  step >= s.number
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted",
                )}
              >
                <s.icon className="w-5 h-5" />
              </div>
              <span className="text-xs text-muted-foreground">{s.title}</span>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute w-[calc(100%-4rem)] h-[2px] top-5 -z-10 left-0 translate-x-16",
                    step > s.number ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="py-4">
          {renderStep()}
        </div>

        {/* Navigation */}
        <DialogFooter className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            Back
          </Button>
          <Button onClick={handleNext}>
            {step === steps.length ? 'Create Project' : 'Next'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
