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

import type { WebSeriesData } from '@/types/project-types';

interface WebSeriesFieldsProps {
  data: WebSeriesData;
  onChange: (data: Partial<WebSeriesData>) => void;
}

export function WebSeriesFields({ data, onChange }: WebSeriesFieldsProps) {
  const handleNumberInput = (field: string, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      onChange({ [field]: numValue });
    }
  };

  return (
    <div className="grid gap-4 grid-cols-2">
      {/* Basic Information */}
      <div className="space-y-2">
        <Label>Number of Episodes</Label>
        <Input
          type="number"
          min={1}
          value={data.episodeCount || ''}
          onChange={(e) => handleNumberInput('episodeCount', e.target.value)}
          placeholder="Enter episode count"
        />
      </div>

      <div className="space-y-2">
        <Label>Episode Duration (minutes)</Label>
        <Input
          type="number"
          min={1}
          value={data.episodeDuration || ''}
          onChange={(e) => handleNumberInput('episodeDuration', e.target.value)}
          placeholder="Enter duration"
        />
      </div>

      {/* Release Schedule */}
      <div className="space-y-2">
        <Label>Release Schedule</Label>
        <Select
          value={data.releaseSchedule || ''}
          onValueChange={(value) => onChange({ releaseSchedule: value as WebSeriesData['releaseSchedule'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select release schedule" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-at-once">All at Once</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Format */}
      <div className="space-y-2">
        <Label>Content Format</Label>
        <Select
          value={data.format || ''}
          onValueChange={(value) => onChange({ format: value as WebSeriesData['format'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scripted">Scripted</SelectItem>
            <SelectItem value="vlog">Vlog</SelectItem>
            <SelectItem value="educational">Educational</SelectItem>
            <SelectItem value="entertainment">Entertainment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Genre */}
      <div className="space-y-2">
        <Label>Genre</Label>
        <Input
          value={data.genre || ''}
          onChange={(e) => onChange({ genre: e.target.value })}
          placeholder="Enter genre"
        />
      </div>

      {/* Target Demographic */}
      <div className="space-y-2">
        <Label>Target Demographic</Label>
        <Input
          value={data.targetDemographic || ''}
          onChange={(e) => onChange({ targetDemographic: e.target.value })}
          placeholder="Enter target demographic"
        />
      </div>

      {/* Monetization */}
      <div className="space-y-2">
        <Label>Monetization Strategy</Label>
        <Select
          value={data.monetizationStrategy || ''}
          onValueChange={(value) => onChange({ monetizationStrategy: value as WebSeriesData['monetizationStrategy'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select strategy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ads">Advertising</SelectItem>
            <SelectItem value="sponsorship">Sponsorship</SelectItem>
            <SelectItem value="subscription">Subscription</SelectItem>
            <SelectItem value="mixed">Mixed Revenue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content Rating */}
      <div className="space-y-2">
        <Label>Content Rating</Label>
        <Input
          value={data.contentRating || ''}
          onChange={(e) => onChange({ contentRating: e.target.value })}
          placeholder="Enter content rating"
        />
      </div>

      {/* Interactive Elements */}
      <div className="space-y-2">
        <Label>Interactive Elements</Label>
        <Select
          value={data.interactiveElements ? 'yes' : 'no'}
          onValueChange={(value) => onChange({ interactiveElements: value === 'yes' })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Interactive elements?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Seasons Planned */}
      <div className="space-y-2">
        <Label>Planned Seasons</Label>
        <Input
          type="number"
          min={1}
          value={data.seasonPlanned || ''}
          onChange={(e) => handleNumberInput('seasonPlanned', e.target.value)}
          placeholder="Enter planned seasons"
        />
      </div>

      {/* Social Media Strategy */}
      <div className="col-span-2 space-y-2">
        <Label>Social Media Strategy</Label>
        <Textarea
          value={data.socialMediaStrategy || ''}
          onChange={(e) => onChange({ socialMediaStrategy: e.target.value })}
          placeholder="Describe your social media strategy"
          rows={3}
        />
      </div>

      {/* Distribution Platforms */}
      <div className="col-span-2 space-y-2">
        <Label>Primary Platform</Label>
        <Input
          value={data.platform?.join(', ') || ''}
          onChange={(e) => onChange({ platform: e.target.value.split(',').map(p => p.trim()) })}
          placeholder="Enter primary platform(s), separated by commas"
        />
      </div>
    </div>
  );
}