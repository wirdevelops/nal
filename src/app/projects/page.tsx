import { Metadata } from 'next';
import ProjectsDashboard from './components/ProjectDashboard';

export const metadata: Metadata = {
  title: 'Projects | Nalevel Empire',
  description: 'Manage your film and video projects',
};

export default function ProjectsPage() {
  return (

    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all your film and video projects
          </p>
        </div>
      </div>
      <ProjectsDashboard />
    </div>

  );
}