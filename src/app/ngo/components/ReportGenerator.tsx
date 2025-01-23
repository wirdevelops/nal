import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Download, FileText, Heart, PieChart, Users } from 'lucide-react';

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

interface ReportType {
    id: 'impact' | 'financial' | 'volunteer' | 'donor';
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export function ReportGenerator({ projectId, onGenerate }: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
    const [reportOptions, setReportOptions] = useState<ReportOptions>({
        type: 'impact',
      dateRange: { from: new Date(), to: new Date() },
      sections: ['Impact Summary', 'Detailed Metrics', 'Charts & Graphs'],
      format: 'pdf',
   });

   const reportTypes: ReportType[] = [
        { id: 'impact', label: 'Impact Report', icon: PieChart },
        { id: 'financial', label: 'Financial Report', icon: FileText },
        { id: 'volunteer', label: 'Volunteer Report', icon: Users },
        { id: 'donor', label: 'Donor Report', icon: Heart },
    ];

    const sectionOptions = {
        impact: ['Impact Summary', 'Detailed Metrics', 'Charts & Graphs', 'Beneficiary Stories'],
        financial: ['Financial Overview', 'Donations', 'Expenses', 'Projections'],
        volunteer: ['Volunteer Summary', 'Hours Logged', 'Activities', 'Impact'],
        donor: ['Donor List', 'Donation History', 'Recognition', 'Impact'],
    };

    /**
   * Handles the report generation
   */
  const handleGenerate = useCallback(async () => {
        setIsGenerating(true);
    try {
      await onGenerate(reportOptions);
      setShowPreview(true);
        } catch (error) {
      console.error('Failed to generate report:', error);
        } finally {
         setIsGenerating(false);
        }
  },[reportOptions, onGenerate]);


    const handleDateChange = useCallback((range: any) => {
        if (range?.from && range?.to) {
            setReportOptions((prev) => ({ ...prev, dateRange: { from: range.from, to: range.to } }));
        }
    },[]);

  return (
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
      <CardContent className="space-y-6">
           {/* Report Type Selection */}
        <div className="space-y-2">
              <Label>Report Type</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {reportTypes.map(({ id, label, icon: Icon }) => (
                 <Button
                   key={id}
                      variant={reportOptions.type === id ? 'default' : 'outline'}
                  className="flex flex-col items-center justify-center h-24 gap-2"
                   onClick={() => setReportOptions((prev) => ({ ...prev, type: id }))}
                      >
                     <Icon className="h-6 w-6" />
                      <span>{label}</span>
                   </Button>
                 ))}
           </div>
        </div>

        {/* Date Range Selection */}
        <div className="space-y-2">
          <Label>Date Range</Label>
            <DayPicker
                mode="range"
                defaultMonth={reportOptions.dateRange.from}
                selected={{ from: reportOptions.dateRange.from, to: reportOptions.dateRange.to }}
                onSelect={handleDateChange}
                numberOfMonths={2}
            />
        </div>

        {/* Sections Selection */}
        <div className="space-y-2">
            <Label>Include Sections</Label>
            <div className="grid grid-cols-2 gap-4">
              {sectionOptions[reportOptions.type].map((section) => (
                    <div key={section} className="flex items-center space-x-2">
                    <Checkbox
                     id={section}
                         checked={reportOptions.sections.includes(section)}
                            onCheckedChange={(checked) => {
                                setReportOptions((prev) => ({
                                     ...prev,
                                      sections: checked
                                        ? [...prev.sections, section]
                                        : prev.sections.filter((s) => s !== section),
                                 }));
                             }}
                   />
                     <Label htmlFor={section}>{section}</Label>
                  </div>
                ))}
           </div>
         </div>

           {/* Format Selection */}
          <div className="space-y-2">
              <Label>Report Format</Label>
             <Select
                  value={reportOptions.format}
                  onValueChange={(value: 'pdf' | 'excel') =>
                    setReportOptions((prev) => ({ ...prev, format: value }))
                     }
               >
                   <SelectTrigger>
                      <SelectValue />
                   </SelectTrigger>
                    <SelectContent>
                         <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                    </SelectContent>
              </Select>
          </div>
      </CardContent>

        <CardFooter className="flex justify-between">
             <Button variant="outline" onClick={() => setShowPreview(true)}>
                Preview
           </Button>
               <Button
                onClick={handleGenerate}
                disabled={isGenerating || reportOptions.sections.length === 0}
               >
            {isGenerating ? (
                    'Generating...'
                    ) : (
                    <>
                    <Download className="w-4 h-4 mr-2" />
                        Generate Report
                    </>
                   )}
             </Button>
         </CardFooter>


         {/* Preview Dialog */}
         <Dialog open={showPreview} onOpenChange={setShowPreview}>
           <DialogContent className="max-w-4xl">
            <DialogTitle>Report Preview</DialogTitle>
            <DialogDescription>
                Preview your report before generating the final version.
             </DialogDescription>

               <div className="h-[600px] overflow-y-auto border rounded-lg p-4">
                 {/* Report Preview Content */}
                    <div className="space-y-6">
                      <h1 className="text-2xl font-bold">
                            {reportTypes.find(r => r.id === reportOptions.type)?.label}
                        </h1>

                      <div className="text-sm text-muted-foreground">
                          Generated for period: {reportOptions.dateRange.from.toLocaleDateString()} - {reportOptions.dateRange.to.toLocaleDateString()}
                      </div>

                      {reportOptions.sections.map((section) => (
                         <div key={section} className="space-y-2">
                            <h2 className="text-xl font-semibold">{section}</h2>
                            <p className="text-muted-foreground">
                                Preview content for {section} section...
                             </p>
                         </div>
                       ))}
                   </div>
              </div>

               <DialogFooter>
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                     Close Preview
               </Button>
               <Button onClick={handleGenerate} disabled={isGenerating}>
                   Generate Final Report
                </Button>
              </DialogFooter>
          </DialogContent>
        </Dialog>
    </Card>
  );
}