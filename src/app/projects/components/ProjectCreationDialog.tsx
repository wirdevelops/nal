'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProjectStore } from '@/stores/useProjectStore';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  PencilLine,
  Users,
  Palette,
  DollarSign,
  ChevronRight,
  CircleDot,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {Separator} from '@/components/ui/separator';
import {Badge} from "@/components/ui/badge";
import { format } from 'date-fns';

interface ProjectCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialType?: string | null;
  projectType?: string | null;
}

type ProjectPhase = {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  primaryTool: string;
};

const projectPhases: ProjectPhase[] = [
  {
    id: 'script',
    title: 'Script First',
    icon: PencilLine,
    description: 'Start with writing and story development',
    primaryTool: 'script',
  },
  {
    id: 'casting',
    title: 'Cast & Crew',
    icon: Users,
    description: 'Begin with team planning and casting',
    primaryTool: 'casting',
  },
  {
    id: 'visual',
    title: 'Visual Development',
    icon: Palette,
    description: 'Start with mood boards and visual planning',
    primaryTool: 'moodboard',
  },
  {
    id: 'budget',
    title: 'Budget Planning',
    icon: DollarSign,
    description: 'Begin with financial planning and budgeting',
    primaryTool: 'budget',
  },
];

const PreviewStep = ({ formData, selectedPhase, onBack, onConfirm }) => (
    <div className="space-y-6">
      <div className="bg-muted rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{formData.title}</h3>
            <p className="text-sm text-muted-foreground">{formData.type}</p>
          </div>
          <Badge>{selectedPhase.title}</Badge>
        </div>
  
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Starting Date</span>
            <span>{formData.startDate ? format(formData.startDate, "PPP") : 'Not set'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Target Completion</span>
            <span>{formData.targetDate ? format(formData.targetDate, "PPP") : 'Not set'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Initial Phase</span>
            <span>{selectedPhase.title}</span>
          </div>
        </div>
  
        <Separator className="my-4" />
  
        <div className="space-y-2">
          <h4 className="font-medium">Description</h4>
          <p className="text-sm text-muted-foreground">{formData.description || 'No description provided'}</p>
        </div>
  
        <div className="space-y-2">
          <h4 className="font-medium">Next Steps</h4>
          <p className="text-sm text-muted-foreground">
            After creation, you'll be directed to the {selectedPhase.title} section 
            to begin working on your project.
          </p>
        </div>
      </div>
  
      <DialogFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onConfirm}>
          Create Project
        </Button>
      </DialogFooter>
    </div>
  );

const projectTypes = [
  { id: 'feature', label: 'Feature Film' },
  { id: 'short', label: 'Short Film' },
  { id: 'series', label: 'TV Series' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'documentary', label: 'Documentary' },
  { id: 'music_video', label: 'Music Video' },
];

export function ProjectCreateDialog({
  open,
  onOpenChange,
  initialType = null,
}: ProjectCreateDialogProps) {
  const router = useRouter();
  const { addProject } = useProjectStore();
  const [step, setStep] = useState(1);
  const [selectedPhase, setSelectedPhase] = useState<ProjectPhase | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    description: '',
    startDate: null as Date | null,
    targetDate: null as Date | null,
  });

  useEffect(() => {
    if (initialType) {
      const phase = projectPhases.find(p => p.id === initialType);
      if (phase) {
        setSelectedPhase(phase);
        setStep(2);
      }
    }
  }, [initialType]);

  const handleClose = () => {
    setStep(1);
    setSelectedPhase(null);
    setFormData({
      title: '',
      type: '',
      description: '',
      startDate: null,
      targetDate: null,
    });
    onOpenChange(false);
  };

  const handleSubmit = () => {
    if (!selectedPhase || !formData.title || !formData.type) return;

    const newProject = {
      title: formData.title,
      type: formData.type,
      description: formData.description,
      phase: 'Development',
      status: 'active' as const,
      team: 0,
      progress: 0,
      startDate: formData.startDate?.toISOString() || new Date().toISOString(),
      targetDate: formData.targetDate?.toISOString(),
      primaryTool: selectedPhase.primaryTool,
    };

    const project = addProject(newProject);
    handleClose();
    router.push(`/projects/${project.id}/${selectedPhase.primaryTool}`);
  };

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderPhaseSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {projectPhases.map((phase) => (
        <Card
          key={phase.id}
          className={cn(
            "cursor-pointer transition-all hover:shadow-md",
            selectedPhase?.id === phase.id && "border-primary ring-2 ring-primary"
          )}
          onClick={() => {
            setSelectedPhase(phase);
            setStep(2);
          }}
        >
          <CardHeader>
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

  const renderProjectDetails = () => (
    <div className="space-y-6 mt-4">
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
        <Label htmlFor="type">Project Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => updateForm('type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select project type" />
          </SelectTrigger>
          <SelectContent>
            {projectTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateForm('description', e.target.value)}
          placeholder="Brief description of your project"
          rows={3}
        />
      </div>

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
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => updateForm('startDate', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Target Completion</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.targetDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.targetDate ? (
                  format(formData.targetDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.targetDate}
                onSelect={(date) => updateForm('targetDate', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>

        {/* Steps Indicator */}
        <div className="flex items-center justify-center mt-4">
          <div className="flex items-center">
            <CircleDot className={cn(
              "w-4 h-4",
              step === 1 ? "text-primary" : "text-muted-foreground"
            )} />
            <div className={cn(
              "w-20 h-0.5 mx-2",
              step > 1 ? "bg-primary" : "bg-muted"
            )} />
            <CircleDot className={cn(
              "w-4 h-4",
              step === 2 ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
        </div>

        {step === 1 ? renderPhaseSelection() : renderProjectDetails()}

        <DialogFooter className="flex justify-between mt-6">
          {step === 2 && (
            <Button
              variant="outline"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
          )}
          <Button
            onClick={step === 1 ? () => {} : handleSubmit}
            disabled={step === 1 || !formData.title || !formData.type}
          >
            {step === 1 ? (
              <span className="opacity-50">Next</span>
            ) : (
              <>Create Project</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}