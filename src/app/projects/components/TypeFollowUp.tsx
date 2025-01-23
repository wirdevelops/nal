import React, { useState } from 'react';
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
  CardContent,
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useProjectStore } from '@/stores/useProjectStore';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Check } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const projectTypeConfigs = {
    feature: {
      title: "Feature Film Setup",
      description: "Set up a full-length narrative film project",
      fields: [
        {
          type: 'select',
          name: 'subType',
          label: 'Film Category',
          options: [
            { value: 'indie', label: 'Independent Film' },
            { value: 'studio', label: 'Studio Film' },
            { value: 'coproduction', label: 'Co-Production' }
          ]
        },
        {
          type: 'radio',
          name: 'scriptStatus',
          label: 'Script Status',
          options: [
            { value: 'development', label: 'In Development' },
            { value: 'completed', label: 'Completed Script' },
            { value: 'acquisition', label: 'Rights Acquisition' }
          ]
        },
        {
          type: 'select',
          name: 'targetMarket',
          label: 'Target Market',
          options: [
            { value: 'theatrical', label: 'Theatrical Release' },
            { value: 'streaming', label: 'Streaming Platforms' },
            { value: 'festival', label: 'Film Festival Circuit' }
          ]
        },
        {
          type: 'select',
          name: 'budget_range',
          label: 'Budget Range',
          options: [
            { value: 'micro', label: 'Micro Budget (Under $100K)' },
            { value: 'low', label: 'Low Budget ($100K - $1M)' },
            { value: 'mid', label: 'Mid Budget ($1M - $10M)' },
            { value: 'high', label: 'High Budget ($10M+)' }
          ]
        },
        {
          type: 'radio',
          name: 'preproduction_status',
          label: 'Pre-production Status',
          options: [
            { value: 'not_started', label: 'Not Started' },
            { value: 'location_scouting', label: 'Location Scouting' },
            { value: 'casting', label: 'Casting in Progress' },
            { value: 'ready', label: 'Ready for Production' }
          ]
        }
      ]
    },
    series: {
      title: "TV Series Setup",
      description: "Create a multi-episode narrative series project",
      fields: [
        {
          type: 'select',
          name: 'subType',
          label: 'Series Type',
          options: [
            { value: 'drama', label: 'Drama Series' },
            { value: 'mini', label: 'Mini Series' },
            { value: 'web', label: 'Web Series' },
            { value: 'documentary', label: 'Documentary Series' }
          ]
        },
        {
          type: 'number',
          name: 'num_seasons',
          label: 'Number of Seasons'
        },
        {
          type: 'number',
          name: 'episodes_per_season',
          label: 'Episodes per Season'
        },
        {
          type: 'radio',
          name: 'format',
          label: 'Episode Format',
          options: [
            { value: '30min', label: '30 Minutes' },
            { value: '60min', label: '60 Minutes' },
            { value: 'variable', label: 'Variable Length' }
          ]
        },
        {
          type: 'select',
          name: 'distribution',
          label: 'Distribution Platform',
          options: [
            { value: 'broadcast', label: 'Broadcast TV' },
            { value: 'cable', label: 'Cable Network' },
            { value: 'streaming', label: 'Streaming Platform' },
            { value: 'web', label: 'Web Release' }
          ]
        }
      ]
    },
    animation: {
      title: "Animation Project Setup",
      description: "Start a new animation project",
      fields: [
        {
          type: 'select',
          name: 'animation_type',
          label: 'Animation Style',
          options: [
            { value: '2d', label: '2D Animation' },
            { value: '3d', label: '3D Animation' },
            { value: 'stop_motion', label: 'Stop Motion' },
            { value: 'mixed_media', label: 'Mixed Media' }
          ]
        },
        {
          type: 'radio',
          name: 'target_audience',
          label: 'Target Audience',
          options: [
            { value: 'children', label: 'Children' },
            { value: 'young_adult', label: 'Young Adult' },
            { value: 'adult', label: 'Adult' },
            { value: 'all_ages', label: 'All Ages' }
          ]
        },
        {
          type: 'select',
          name: 'production_pipeline',
          label: 'Production Pipeline',
          options: [
            { value: 'traditional', label: 'Traditional Pipeline' },
            { value: 'digital', label: 'Digital Pipeline' },
            { value: 'hybrid', label: 'Hybrid Workflow' }
          ]
        }
      ]
    },
    commercial: {
      title: "Commercial Project Setup",
      description: "Set up an advertising or promotional project",
      fields: [
        {
          type: 'select',
          name: 'subType',
          label: 'Commercial Type',
          options: [
            { value: 'tv', label: 'TV Commercial' },
            { value: 'digital', label: 'Digital/Web' },
            { value: 'branded', label: 'Branded Content' },
            { value: 'social', label: 'Social Media Ad' }
          ]
        },
        {
          type: 'radio',
          name: 'duration',
          label: 'Duration',
          options: [
            { value: '15', label: '15 Seconds' },
            { value: '30', label: '30 Seconds' },
            { value: '60', label: '60 Seconds' },
            { value: 'custom', label: 'Custom Length' }
          ]
        },
        {
          type: 'text',
          name: 'brand',
          label: 'Brand/Client Name'
        },
        {
          type: 'radio',
          name: 'delivery_format',
          label: 'Delivery Format',
          options: [
            { value: 'broadcast', label: 'Broadcast Ready' },
            { value: 'digital', label: 'Digital Platforms' },
            { value: 'multiple', label: 'Multiple Formats' }
          ]
        }
      ]
    },
    documentary: {
      title: "Documentary Setup",
      description: "Begin a documentary film project",
      fields: [
        {
          type: 'select',
          name: 'subType',
          label: 'Documentary Type',
          options: [
            { value: 'feature', label: 'Feature Documentary' },
            { value: 'series', label: 'Documentary Series' },
            { value: 'short', label: 'Short Documentary' },
            { value: 'educational', label: 'Educational Documentary' }
          ]
        },
        {
          type: 'radio',
          name: 'researchStatus',
          label: 'Research Status',
          options: [
            { value: 'start', label: 'Starting Research' },
            { value: 'ongoing', label: 'Research in Progress' },
            { value: 'complete', label: 'Research Complete' }
          ]
        },
        {
          type: 'radio',
          name: 'accessStatus',
          label: 'Subject Access',
          options: [
            { value: 'secured', label: 'Access Secured' },
            { value: 'negotiating', label: 'In Negotiations' },
            { value: 'pending', label: 'Yet to Contact' }
          ]
        },
        {
          type: 'select',
          name: 'shooting_style',
          label: 'Shooting Style',
          options: [
            { value: 'observational', label: 'Observational' },
            { value: 'participatory', label: 'Participatory' },
            { value: 'archival', label: 'Archival Based' },
            { value: 'mixed', label: 'Mixed Approach' }
          ]
        }
      ]
    },
    music_video: {
      title: "Music Video Setup",
      description: "Create a music video project",
      fields: [
        {
          type: 'select',
          name: 'subType',
          label: 'Video Style',
          options: [
            { value: 'performance', label: 'Performance Based' },
            { value: 'narrative', label: 'Narrative Driven' },
            { value: 'concept', label: 'Conceptual' },
            { value: 'animation', label: 'Animated' }
          ]
        },
        {
          type: 'text',
          name: 'artist',
          label: 'Artist/Band Name'
        },
        {
          type: 'text',
          name: 'song',
          label: 'Song Title'
        },
        {
          type: 'radio',
          name: 'music_status',
          label: 'Music Status',
          options: [
            { value: 'received', label: 'Final Track Received' },
            { value: 'pending', label: 'Awaiting Final Mix' },
            { value: 'in_progress', label: 'Track in Production' }
          ]
        }
      ]
    },
    corporate: {
      title: "Corporate Video Setup",
      description: "Start a corporate or business video project",
      fields: [
        {
          type: 'select',
          name: 'video_type',
          label: 'Video Type',
          options: [
            { value: 'training', label: 'Training Video' },
            { value: 'promotional', label: 'Promotional Content' },
            { value: 'internal', label: 'Internal Communications' },
            { value: 'event', label: 'Event Coverage' }
          ]
        },
        {
          type: 'text',
          name: 'company',
          label: 'Company Name'
        },
        {
          type: 'select',
          name: 'delivery_format',
          label: 'Delivery Format',
          options: [
            { value: 'internal_platform', label: 'Internal Platform' },
            { value: 'web', label: 'Web Distribution' },
            { value: 'presentation', label: 'Presentation Format' },
            { value: 'multiple', label: 'Multiple Formats' }
          ]
        },
        {
          type: 'radio',
          name: 'confidentiality',
          label: 'Confidentiality Level',
          options: [
            { value: 'public', label: 'Public Content' },
            { value: 'internal', label: 'Internal Only' },
            { value: 'confidential', label: 'Confidential' }
          ]
        }
      ]
    }
  };

export function TypeSpecificProjectDialog({ open, onOpenChange, selectedType }) {
  const router = useRouter();
  const { addProject } = useProjectStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: null,
    targetDate: null
  });
  const [typeSpecificData, setTypeSpecificData] = useState({});

  const config = projectTypeConfigs[selectedType];

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
      progress: 0
    };

    const project = addProject(newProject);
    onOpenChange(false);
    router.push(`/projects/${project.id}`);
  };

  if (!config) return null;

  const renderField = (field) => {
    switch (field.type) {
      case 'select':
        return (
          <div className="space-y-2" key={field.name}>
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

      case 'radio':
        return (
          <div className="space-y-2" key={field.name}>
            <Label>{field.label}</Label>
            <RadioGroup
              value={typeSpecificData[field.name] || ''}
              onValueChange={(value) => handleInputChange(field.name, value)}
            >
              {field.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'text':
      case 'number':
        return (
          <div className="space-y-2" key={field.name}>
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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Project Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter project title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
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
            </div>
          </div>

          {/* Type Specific Fields */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.fields.map(renderField)}
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
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