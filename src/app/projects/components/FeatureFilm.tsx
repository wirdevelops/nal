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
import type { FeatureFilmData } from '@/types/project-types';

interface FeatureFilmFieldsProps {
  data: FeatureFilmData;
  onChange: (data: Partial<FeatureFilmData>) => void;
}

export function FeatureFilmFields({ data, onChange }: FeatureFilmFieldsProps) {
  const fields = projectTypeFields.feature;

  return (
    <div className="grid gap-4 grid-cols-2">
      {fields.map((field) => {
        if (field.type === 'select' && field.options) {
          return (
            <div key={field.name} className="space-y-2">
              <Label>{field.label}</Label>
              <Select
                value={data[field.name] || ''}
                onValueChange={(value) => onChange({ [field.name]: value })}
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
        }

        return (
          <div key={field.name} className="space-y-2">
            <Label>{field.label}</Label>
            <Input
              type={field.type}
              value={data[field.name] || ''}
              onChange={(e) => onChange({ [field.name]: e.target.value })}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              {...(field.validation || {})}
            />
          </div>
        );
      })}
    </div>
  );
}