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

import type { CommercialData } from '@/types/project-types';

interface CommercialFieldsProps {
  data: CommercialData;
  onChange: (data: Partial<CommercialData>) => void;
}

export function CommercialFields({ data, onChange }: CommercialFieldsProps) {
  const handleNumberInput = (field: string, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      onChange({ [field]: numValue });
    }
  };

  return (
    <div className="grid gap-4 grid-cols-2">
      {/* Client & Brand */}
      <div className="space-y-2">
        <Label>Client Name</Label>
        <Input
          value={data.client || ''}
          onChange={(e) => onChange({ client: e.target.value })}
          placeholder="Enter client name"
        />
      </div>

      <div className="space-y-2">
        <Label>Brand Name</Label>
        <Input
          value={data.brand || ''}
          onChange={(e) => onChange({ brand: e.target.value })}
          placeholder="Enter brand name"
        />
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <Label>Duration (seconds)</Label>
        <Input
          type="number"
          min={5}
          max={120}
          value={data.duration || ''}
          onChange={(e) => handleNumberInput('duration', e.target.value)}
          placeholder="Enter duration"
        />
      </div>

      {/* Format */}
      <div className="space-y-2">
        <Label>Commercial Format</Label>
        <Select
          value={data.format || ''}
          onValueChange={(value) => onChange({ format: value as CommercialData['format'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tv">TV Commercial</SelectItem>
            <SelectItem value="digital">Digital Ad</SelectItem>
            <SelectItem value="social">Social Media</SelectItem>
            <SelectItem value="hybrid">Hybrid/Multi-platform</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Target Audience */}
      <div className="space-y-2">
        <Label>Target Audience</Label>
        <Input
          value={data.targetAudience || ''}
          onChange={(e) => onChange({ targetAudience: e.target.value })}
          placeholder="Describe target audience"
        />
      </div>

      {/* Budget */}
      <div className="space-y-2">
        <Label>Budget</Label>
        <Input
          type="number"
          min={0}
          value={data.budget || ''}
          onChange={(e) => handleNumberInput('budget', e.target.value)}
          placeholder="Enter budget"
        />
      </div>

      {/* Campaign Details */}
      <div className="col-span-2 space-y-2">
        <Label>Campaign Objectives</Label>
        <Textarea
          value={data.campaignObjectives || ''}
          onChange={(e) => onChange({ campaignObjectives: e.target.value })}
          placeholder="Describe campaign objectives"
          rows={3}
        />
      </div>

      {/* Campaign Association */}
      <div className="space-y-2">
        <Label>Part of Campaign</Label>
        <Select
          value={data.isPartOfCampaign ? 'yes' : 'no'}
          onValueChange={(value) => onChange({ isPartOfCampaign: value === 'yes' })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select if part of campaign" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {data.isPartOfCampaign && (
        <div className="space-y-2">
          <Label>Campaign Name</Label>
          <Input
            value={data.campaignName || ''}
            onChange={(e) => onChange({ campaignName: e.target.value })}
            placeholder="Enter campaign name"
          />
        </div>
      )}
    </div>
  );
}