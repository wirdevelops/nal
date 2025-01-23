'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { AnimationData } from '@/types/project-types';

interface AnimationFieldsProps {
  data: AnimationData;
  onChange: (data: Partial<AnimationData>) => void;
}

export function AnimationFields({ data, onChange }: AnimationFieldsProps) {
  const handleNumberInput = (field: string, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      onChange({ [field]: numValue });
    }
  };

  return (
    <div className="grid gap-4 grid-cols-2">
      {/* Animation Style */}
      <div className="space-y-2">
        <Label>Animation Style</Label>
        <Select
          value={data.style || ''}
          onValueChange={(value) => onChange({ style: value as AnimationData['style'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select animation style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2d">2D Animation</SelectItem>
            <SelectItem value="3d">3D Animation</SelectItem>
            <SelectItem value="stop-motion">Stop Motion</SelectItem>
            <SelectItem value="mixed-media">Mixed Media</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Animation Technique */}
      <div className="space-y-2">
        <Label>Animation Technique</Label>
        <Input
          value={data.technique || ''}
          onChange={(e) => onChange({ technique: e.target.value })}
          placeholder="Enter animation technique"
        />
      </div>

      {/* Technical Specifications */}
      <div className="space-y-2">
        <Label>Duration (minutes)</Label>
        <Input
          type="number"
          min={0}
          value={data.duration || ''}
          onChange={(e) => handleNumberInput('duration', e.target.value)}
          placeholder="Enter duration"
        />
      </div>

      <div className="space-y-2">
        <Label>Frame Rate (fps)</Label>
        <Input
          type="number"
          min={12}
          max={60}
          value={data.frameRate || ''}
          onChange={(e) => handleNumberInput('frameRate', e.target.value)}
          placeholder="Enter frame rate"
        />
      </div>

      <div className="space-y-2">
        <Label>Resolution</Label>
        <Input
          value={data.resolution || ''}
          onChange={(e) => onChange({ resolution: e.target.value })}
          placeholder="e.g., 1920x1080"
        />
      </div>

      {/* Render Engine Selection */}
      <div className="space-y-2">
        <Label>Render Engine</Label>
        <Input
          value={data.renderEngine || ''}
          onChange={(e) => onChange({ renderEngine: e.target.value })}
          placeholder="Enter render engine"
        />
      </div>

      {/* Character and Asset Count */}
      <div className="space-y-2">
        <Label>Number of Characters</Label>
        <Input
          type="number"
          min={0}
          value={data.characterCount || ''}
          onChange={(e) => handleNumberInput('characterCount', e.target.value)}
          placeholder="Enter character count"
        />
      </div>

      <div className="space-y-2">
        <Label>Number of Backgrounds</Label>
        <Input
          type="number"
          min={0}
          value={data.backgroundCount || ''}
          onChange={(e) => handleNumberInput('backgroundCount', e.target.value)}
          placeholder="Enter background count"
        />
      </div>

      {/* Target Audience */}
      <div className="space-y-2">
        <Label>Target Audience</Label>
        <Input
          value={data.targetAudience || ''}
          onChange={(e) => onChange({ targetAudience: e.target.value })}
          placeholder="Enter target audience"
        />
      </div>

      {/* Asset Library */}
      <div className="space-y-2">
        <Label>Asset Library Required</Label>
        <Select
          value={data.assetLibrary ? 'yes' : 'no'}
          onValueChange={(value) => onChange({ assetLibrary: value === 'yes' })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Asset library needed?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Production Tools and Requirements */}
      <div className="col-span-2 space-y-2">
        <Label>Software Tools</Label>
        <Input
          value={data.softwareTools?.join(', ') || ''}
          onChange={(e) => onChange({ softwareTools: e.target.value.split(',').map(tool => tool.trim()) })}
          placeholder="Enter software tools, separated by commas"
        />
      </div>

      <div className="space-y-2">
        <Label>Storyboard Status</Label>
        <Select
          value={data.storyboardStatus || ''}
          onValueChange={(value) => onChange({ storyboardStatus: value as AnimationData['storyboardStatus'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not-started">Not Started</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Rigging Required</Label>
        <Select
          value={data.riggingRequired ? 'yes' : 'no'}
          onValueChange={(value) => onChange({ riggingRequired: value === 'yes' })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Rigging required?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Visual Style */}
      <div className="col-span-2 space-y-2">
        <Label>Color Palette</Label>
        <Textarea
          value={data.colorPalette || ''}
          onChange={(e) => onChange({ colorPalette: e.target.value })}
          placeholder="Describe the color palette"
          rows={2}
        />
      </div>

      <div className="col-span-2 space-y-2">
        <Label>Style Guide Notes</Label>
        <Textarea
          value={data.styleGuide || ''}
          onChange={(e) => onChange({ styleGuide: e.target.value })}
          placeholder="Enter style guide details"
          rows={2}
        />
      </div>

      {/* Technical Requirements */}
      <div className="col-span-2 space-y-2">
        <Label>Rendering Requirements</Label>
        <Textarea
          value={data.renderingRequirements || ''}
          onChange={(e) => onChange({ renderingRequirements: e.target.value })}
          placeholder="Describe rendering requirements"
          rows={2}
        />
      </div>

      <div className="col-span-2 space-y-2">
        <Label>Audio Requirements</Label>
        <Textarea
          value={data.audioRequirements || ''}
          onChange={(e) => onChange({ audioRequirements: e.target.value })}
          placeholder="Describe audio requirements"
          rows={2}
        />
      </div>

      <div className="col-span-2 space-y-2">
        <Label>Special Effects</Label>
        <Textarea
          value={data.specialEffects || ''}
          onChange={(e) => onChange({ specialEffects: e.target.value })}
          placeholder="Describe special effects requirements"
          rows={2}
        />
      </div>
    </div>
  );
}