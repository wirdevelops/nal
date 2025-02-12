import { Overview } from '../../../components/Overview';
import { ProjectMetricsDashboard } from '../../../components/ProjectMetricsDashboard';
import { DonorWall } from '../../../components/DonorWall';

export default function ProjectOverviewPage({ params }: { params: { projectId: string } }) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Overview project={params.projectId} />
        <DonorWall donors={[]} />
      </div>

      <ProjectMetricsDashboard projectId={params.projectId} />
    </div>
  );
}