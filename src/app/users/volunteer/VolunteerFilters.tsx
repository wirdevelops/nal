import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { BackgroundCheck, Skill } from '@/types/ngo/volunteer';

interface VolunteerFiltersProps {
  onFilterChange: (filters: VolunteerFilters) => void;
  filters: VolunteerFilters;
}

export type VolunteerFilters = {
  search: string;
  backgroundStatus: BackgroundCheck | 'all';
  skills: Skill[];
  availability: string[];
};

export function VolunteerFilters({ onFilterChange, filters }: VolunteerFiltersProps) {
  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  return (
    <div className="space-y-6">
      <Input
        placeholder="Search by user ID..."
        value={filters.search}
        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Background Check Status */}
        <div className="space-y-2">
          <Label>Verification Status</Label>
          <Select
            value={filters.backgroundStatus}
            onValueChange={(value: VolunteerFilters['backgroundStatus']) => 
              onFilterChange({ ...filters, backgroundStatus: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.values(BackgroundCheck).map((status) => (
                <SelectItem 
                  key={status} 
                  value={status}
                  className="capitalize"
                >
                  {status.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Skills Filter */}
        <div className="space-y-2">
          <Label>Skills</Label>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(Skill).map((skill) => (
              <div key={skill} className="flex items-center space-x-2">
                <Checkbox
                  id={skill}
                  checked={filters.skills.includes(skill)}
                  onCheckedChange={(checked) => {
                    const newSkills = checked
                      ? [...filters.skills, skill]
                      : filters.skills.filter((s) => s !== skill);
                    onFilterChange({ ...filters, skills: newSkills });
                  }}
                />
                <Label 
                  htmlFor={skill} 
                  className="text-sm font-normal capitalize"
                >
                  {skill.toLowerCase().replace('_', ' ')}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Availability Days Filter */}
        <div className="space-y-2">
          <Label>Available Days</Label>
          <div className="grid grid-cols-2 gap-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="flex items-center space-x-2">
                <Checkbox
                  id={day}
                  checked={filters.availability.includes(day)}
                  onCheckedChange={(checked) => {
                    const newAvailability = checked
                      ? [...filters.availability, day]
                      : filters.availability.filter((d) => d !== day);
                    onFilterChange({ ...filters, availability: newAvailability });
                  }}
                />
                <Label htmlFor={day} className="text-sm font-normal">
                  {day}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}