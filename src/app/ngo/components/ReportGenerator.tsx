// src/components/ReportGenerator.tsx
import { useState, useCallback } from 'react';
import { DialogContent } from '@/components/ui/dialog';
import { useNGOProjectStore } from '@/stores/useNGOProjectStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface ReportGeneratorProps {
  projectId: string;
  onGenerate: (options: ReportOptions) => Promise<void>;
}

interface ReportOptions {
  type: 'impact' | 'financial' | 'volunteer' | 'donor';
  dateRange: { from: Date; to: Date };
  sections: string[];
  format: 'pdf' | 'excel';
}

const sectionOptions = {
  impact: ['Impact Summary', 'Detailed Metrics', 'Charts & Graphs', 'Beneficiary Stories'],
  financial: ['Financial Overview', 'Donations', 'Expenses', 'Projections'],
  volunteer: ['Volunteer Summary', 'Hours Logged', 'Activities', 'Impact'],
  donor: ['Donor List', 'Donation History', 'Recognition', 'Impact'],
};

export function ReportGenerator({ projectId, onGenerate }: ReportGeneratorProps) {
  const { getProjectById } = useNGOProjectStore();
  const [options, setOptions] = useState<ReportOptions>({
    type: 'impact',
    dateRange: { from: new Date(), to: new Date() },
    sections: ['Impact Summary'],
    format: 'pdf'
  });

  const handleDateChange = useCallback((range: any) => {
    if (range?.from && range?.to) {
      setOptions(prev => ({ ...prev, dateRange: range }));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Report Type</Label>
          <Select
            value={options.type}
            onValueChange={(value) => setOptions(prev => ({
              ...prev,
              type: value as typeof options.type,
              sections: [sectionOptions[value as keyof typeof sectionOptions][0]]
            }))}
          >
            <SelectContent>
              <SelectItem value="impact">Impact Report</SelectItem>
              <SelectItem value="financial">Financial Report</SelectItem>
              <SelectItem value="volunteer">Volunteer Report</SelectItem>
              <SelectItem value="donor">Donor Report</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Date Range</Label>
          <DayPicker
            mode="range"
            selected={options.dateRange}
            onSelect={handleDateChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Sections</Label>
        <div className="grid grid-cols-2 gap-2">
          {sectionOptions[options.type].map((section) => (
            <div key={section} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.sections.includes(section)}
                onChange={(e) => {
                  setOptions(prev => ({
                    ...prev,
                    sections: e.target.checked
                      ? [...prev.sections, section]
                      : prev.sections.filter(s => s !== section)
                  }));
                }}
              />
              <Label>{section}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Format</Label>
        <Select
          value={options.format}
          onValueChange={(value) => setOptions(prev => ({
            ...prev,
            format: value as typeof options.format
          }))}
        >
          <SelectContent>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="excel">Excel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        onClick={() => onGenerate(options)}
        className="w-full"
      >
        Generate Report
      </Button>
    </div>
  );
}