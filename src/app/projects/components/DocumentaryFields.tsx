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

import type { DocumentaryData } from '@/types/project-types';

interface DocumentaryFieldsProps {
  data: DocumentaryData;
  onChange: (data: Partial<DocumentaryData>) => void;
}

export function DocumentaryFields({ data, onChange }: DocumentaryFieldsProps) {
  const handleNumberInput = (field: string, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      onChange({ [field]: numValue });
    }
  };

  return (
    <div className="grid gap-4 grid-cols-2">
      {/* Subject */}
      <div className="col-span-2 space-y-2">
        <Label>Main Subject</Label>
        <Input
          value={data.subject || ''}
          onChange={(e) => onChange({ subject: e.target.value })}
          placeholder="Enter the main subject of your documentary"
        />
      </div>

      {/* Subject Matter Description */}
      <div className="col-span-2 space-y-2">
        <Label>Subject Matter Description</Label>
        <Textarea
          value={data.subjectMatter || ''}
          onChange={(e) => onChange({ subjectMatter: e.target.value })}
          placeholder="Describe the subject matter in detail"
          rows={3}
        />
      </div>

      {/* Research Status */}
      <div className="space-y-2">
        <Label>Research Status</Label>
        <Select
          value={data.researchStatus || ''}
          onValueChange={(value) => onChange({ researchStatus: value as DocumentaryData['researchStatus'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select research status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not-started">Not Started</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Style */}
      <div className="space-y-2">
        <Label>Documentary Style</Label>
        <Select
          value={data.style || ''}
          onValueChange={(value) => onChange({ style: value as DocumentaryData['style'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="observational">Observational</SelectItem>
            <SelectItem value="participatory">Participatory</SelectItem>
            <SelectItem value="expository">Expository</SelectItem>
            <SelectItem value="reflexive">Reflexive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Interviewee Count */}
      <div className="space-y-2">
        <Label>Expected Number of Interviewees</Label>
        <Input
          type="number"
          min={0}
          value={data.intervieweeCount || ''}
          onChange={(e) => handleNumberInput('intervieweeCount', e.target.value)}
          placeholder="Enter number of interviewees"
        />
      </div>

      {/* Expected Duration */}
      <div className="space-y-2">
        <Label>Expected Duration (minutes)</Label>
        <Input
          type="number"
          min={1}
          value={data.expectedDuration || ''}
          onChange={(e) => handleNumberInput('expectedDuration', e.target.value)}
          placeholder="Enter expected duration"
        />
      </div>

      {/* Archival Footage */}
      <div className="space-y-2">
        <Label>Archival Footage Required</Label>
        <Select
          value={data.archivalFootage ? 'yes' : 'no'}
          onValueChange={(value) => onChange({ archivalFootage: value === 'yes' })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select if archival footage is needed" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}