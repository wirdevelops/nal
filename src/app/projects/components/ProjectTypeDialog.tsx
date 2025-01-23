import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useProjectStore } from '@/stores/useProjectStore';
import { projectTypes } from './projectTypes';

export function ProjectTypeDialog({ open, onOpenChange, selectedType }) {
  const router = useRouter();
  const { addProject } = useProjectStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: null,
    targetDate: null
  });
  const [typeSpecificData, setTypeSpecificData] = useState({});

  const config = projectTypes[selectedType];

  const handleInputChange = (field, value) => {
    if (field === 'title' || field === 'description' || field === 'startDate' || field === 'targetDate') {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else {
      setTypeSpecificData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = () => {
    const newProject = {
      ...formData,
      type: selectedType,
      typeSpecificData,
      phase: 'Development',
      status: 'active',
      team: 0,
      progress: 0,
      startDate: formData.startDate?.toISOString() || new Date().toISOString(),
      targetDate: formData.targetDate?.toISOString()
    };

    const project = addProject(newProject);
    onOpenChange(false);
    router.push(`/projects/${project.id}`);
  };

  if (!config) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto py-4">
          <div className="space-y-6">
            <div className="grid gap-6 grid-cols-2">
              {/* Basic Info */}
              <div className="col-span-2 space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter project title"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of your project"
                  rows={3}
                />
              </div>

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
                      onSelect={(date) => handleInputChange('startDate', date)}
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
                      onSelect={(date) => handleInputChange('targetDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Type Specific Fields */}
              {config.fields.map((field) => {
                switch (field.type) {
                  case 'select':
                    return (
                      <div key={field.name} className="space-y-2">
                        <Label>{field.label}</Label>
                        <Select
                          value={typeSpecificData[field.name] || ''}
                          onValueChange={(value) => handleInputChange(field.name, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${field.label}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    );

                  case 'text':
                  case 'number':
                    return (
                      <div key={field.name} className="space-y-2">
                        <Label>{field.label}</Label>
                        <Input
                          type={field.type}
                          value={typeSpecificData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      </div>
                    );

                  default:
                    return null;
                }
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.title}
          >
            Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}