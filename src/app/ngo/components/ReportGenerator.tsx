import { DialogContent } from '@/components/ui/dialog';
import { useNGOProject } from '@/hooks/useNGOProject';
import { NGOProject, ProjectMetrics, TeamMember } from '@/types/ngo/project';
import { useCallback } from 'react';

interface ReportGeneratorProps {
  projectId: string;
}

interface ReportOptions {
  type: 'impact' | 'financial' | 'volunteer' | 'donor';
  dateRange: { from: Date; to: Date };
  sections: string[];
  format: 'pdf' | 'excel';
}

export function ReportGenerator({ projectId }: ReportGeneratorProps) {
  const { getProjectById, calculateMetrics } = useNGOProject();
  const project = getProjectById(projectId);
  const globalMetrics = calculateMetrics();

  const getReportData = useCallback((options: ReportOptions) => {
    if (!project) return null;

    const filterByDate = (dateString: string) => {
      const date = new Date(dateString);
      return date >= options.dateRange.from && date <= options.dateRange.to;
    };

    switch (options.type) {
      case 'impact':
        return {
          metrics: project.metrics,
          impactStories: project.impactStories,
          correlationData: project.metrics.correlationData
            .filter(d => filterByDate(d.date))
        };
      case 'financial':
        return {
          donations: project.donations.filter(d => filterByDate(d.date)),
          budget: project.budget,
          expenses: project.impact.filter(i => i.type === 'expense' && filterByDate(i.date))
        };
      case 'volunteer':
        return {
          team: project.team,
          hours: project.team.reduce((sum, member) => sum + member.hoursContributed, 0),
          activities: project.updates.filter(u => filterByDate(u.date))
        };
      case 'donor':
        return {
          donors: project.donors,
          donations: project.donations.filter(d => filterByDate(d.date)),
          tiers: project.donations.reduce((acc, d) => {
            acc[d.tier] = (acc[d.tier] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        };
      default:
        return null;
    }
  }, [project]);

  const handleGenerate = useCallback(async (options: ReportOptions) => {
    const data = getReportData(options);
    if (!data) return;

    // Generate report based on data
    if (options.format === 'pdf') {
      await generatePdfReport(data, options);
    } else {
      await generateExcelReport(data, options);
    }
  }, [getReportData]);

  // ... rest of the component remains similar, using handleGenerate

  // Update preview content to show real data
  const renderPreviewContent = (options: ReportOptions) => {
    const data = getReportData(options);
    if (!data) return null;

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">
          {reportTypes.find(r => r.id === options.type)?.label}
        </h1>
        <div className="text-sm text-muted-foreground">
          Generated for period: {options.dateRange.from.toLocaleDateString()} - {options.dateRange.to.toLocaleDateString()}
        </div>

        {options.sections.map((section) => (
          <div key={section} className="space-y-2">
            <h2 className="text-xl font-semibold">{section}</h2>
            <PreviewSection 
              section={section}
              data={data}
              options={options}
              project={project!}
              globalMetrics={globalMetrics}
            />
          </div>
        ))}
      </div>
    );
  };

  // Update dialog content
  <DialogContent className="max-w-4xl">
    {/* ... */}
    {renderPreviewContent(reportOptions)}
    {/* ... */}
  </DialogContent>
}

const PreviewSection = ({ section, data, options, project, globalMetrics }: {
  section: string;
  data: any;
  options: ReportOptions;
  project: NGOProject;
  globalMetrics: ProjectMetrics;
}) => {
  switch (section) {
    case 'Impact Summary':
      return (
        <div>
          <p>Total Impact Score: {project.metrics.impactScore}</p>
          <p>Beneficiaries Reached: {project.beneficiaries.reduce((sum, b) => sum + b.count, 0)}</p>
        </div>
      );
    case 'Financial Overview':
      return (
        <div>
          <p>Total Donations: ${project.metrics.donations.toLocaleString()}</p>
          <p>Budget Utilization: {project.metrics.fundingUtilization.toFixed(1)}%</p>
        </div>
      );
    // Add more cases for other sections
    default:
      return <p>Preview content for {section} section...</p>;
  }
};

// Helper functions for report generation
async function generatePdfReport(data: any, options: ReportOptions) {
  // Implementation using pdfmake or similar
}

async function generateExcelReport(data: any, options: ReportOptions) {
  // Implementation using xlsx or similar
}