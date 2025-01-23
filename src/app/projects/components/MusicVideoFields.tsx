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

import type { MusicVideoData } from '@/types/project-types';
interface MusicVideoFieldsProps {
  data: MusicVideoData;
  onChange: (data: Partial<MusicVideoData>) => void;
}

export function MusicVideoFields({ data, onChange }: MusicVideoFieldsProps) {
  const handleNumberInput = (field: string, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      onChange({ [field]: numValue });
    }
  };

  return (
    <div className="grid gap-4 grid-cols-2">
      {/* Artist & Song */}
      <div className="space-y-2">
        <Label>Artist Name</Label>
        <Input
          value={data.artist || ''}
          onChange={(e) => onChange({ artist: e.target.value })}
          placeholder="Enter artist name"
        />
      </div>

      <div className="space-y-2">
        <Label>Song Title</Label>
        <Input
          value={data.songTitle || ''}
          onChange={(e) => onChange({ songTitle: e.target.value })}
          placeholder="Enter song title"
        />
      </div>

      {/* Genre & Duration */}
      <div className="space-y-2">
        <Label>Music Genre</Label>
        <Input
          value={data.genre || ''}
          onChange={(e) => onChange({ genre: e.target.value })}
          placeholder="Enter music genre"
        />
      </div>

      <div className="space-y-2">
        <Label>Duration (minutes)</Label>
        <Input
          type="number"
          step="0.5"
          min={0.5}
          value={data.duration || ''}
          onChange={(e) => handleNumberInput('duration', e.target.value)}
          placeholder="Enter duration"
        />
      </div>

      {/* Performance Type */}
      <div className="space-y-2">
        <Label>Performance Type</Label>
        <Select
          value={data.performanceType || ''}
          onValueChange={(value) => onChange({ performanceType: value as MusicVideoData['performanceType'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select performance type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lip-sync">Lip Sync</SelectItem>
            <SelectItem value="live">Live Performance</SelectItem>
            <SelectItem value="narrative">Narrative</SelectItem>
            <SelectItem value="conceptual">Conceptual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label>Location Type</Label>
        <Select
          value={data.location || ''}
          onValueChange={(value) => onChange({ location: value as MusicVideoData['location'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select location type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="studio">Studio</SelectItem>
            <SelectItem value="outdoor">Outdoor</SelectItem>
            <SelectItem value="multiple">Multiple Locations</SelectItem>
            <SelectItem value="virtual">Virtual/CGI</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Record Label */}
      <div className="space-y-2">
        <Label>Record Label</Label>
        <Input
          value={data.recordLabel || ''}
          onChange={(e) => onChange({ recordLabel: e.target.value })}
          placeholder="Enter record label"
        />
      </div>

      {/* Special Requirements */}
      <div className="space-y-2">
        <Label>Special Effects</Label>
        <Select
          value={data.specialEffects ? 'yes' : 'no'}
          onValueChange={(value) => onChange({ specialEffects: value === 'yes' })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Special effects required?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Choreography */}
      <div className="space-y-2">
        <Label>Choreography Required</Label>
        <Select
          value={data.choreoRequired ? 'yes' : 'no'}
          onValueChange={(value) => onChange({ choreoRequired: value === 'yes' })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choreography required?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Concept */}
      <div className="col-span-2 space-y-2">
        <Label>Creative Concept</Label>
        <Textarea
          value={data.concept || ''}
          onChange={(e) => onChange({ concept: e.target.value })}
          placeholder="Describe the creative concept"
          rows={3}
        />
      </div>

      {/* Visual Style */}
      <div className="col-span-2 space-y-2">
        <Label>Visual Style</Label>
        <Textarea
          value={data.visualStyle || ''}
          onChange={(e) => onChange({ visualStyle: e.target.value })}
          placeholder="Describe the visual style"
          rows={2}
        />
      </div>
    </div>
  );
}