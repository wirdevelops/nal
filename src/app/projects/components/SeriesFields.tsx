'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { projectTypeFields } from './project-fields';

import type { SeriesData } from '@/types/project-types';

interface SeriesFieldsProps {
  data: SeriesData;
  onChange: (data: Partial<SeriesData>) => void;
}

export function SeriesFields({ data, onChange }: SeriesFieldsProps) {
  const fields = projectTypeFields.series;

  const handleNumberInput = (field: string, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      onChange({ [field]: numValue });
    }
  };

  return (
    <div className="grid gap-4 grid-cols-2">
      {/* Number of Seasons */}
      <div className="space-y-2">
        <Label>Number of Seasons</Label>
        <Input
          type="number"
          min={1}
          value={data.numberOfSeasons || ''}
          onChange={(e) => handleNumberInput('numberOfSeasons', e.target.value)}
          placeholder="Enter number of seasons"
        />
      </div>

      {/* Episodes per Season */}
      <div className="space-y-2">
        <Label>Episodes per Season</Label>
        <Input
          type="number"
          min={1}
          value={data.episodesPerSeason || ''}
          onChange={(e) => handleNumberInput('episodesPerSeason', e.target.value)}
          placeholder="Enter episodes per season"
        />
      </div>

      {/* Episode Duration */}
      <div className="space-y-2">
        <Label>Episode Duration (minutes)</Label>
        <Input
          type="number"
          min={1}
          max={180}
          value={data.episodeDuration || ''}
          onChange={(e) => handleNumberInput('episodeDuration', e.target.value)}
          placeholder="Enter episode duration"
        />
      </div>

      {/* Platform */}
      <div className="space-y-2">
        <Label>Target Platform</Label>
        <Input
          type="text"
          value={data.platform || ''}
          onChange={(e) => onChange({ platform: e.target.value })}
          placeholder="Enter target platform"
        />
      </div>

      {/* Format */}
      <div className="space-y-2">
        <Label>Series Format</Label>
        <Select
          value={data.format || ''}
          onValueChange={(value) => onChange({ format: value as SeriesData['format'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scripted">Scripted</SelectItem>
            <SelectItem value="unscripted">Unscripted</SelectItem>
            <SelectItem value="documentary">Documentary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Target Audience */}
      <div className="space-y-2">
        <Label>Target Audience</Label>
        <Input
          type="text"
          value={data.targetAudience || ''}
          onChange={(e) => onChange({ targetAudience: e.target.value })}
          placeholder="Enter target audience"
        />
      </div>
    </div>
  );
}