import { Calendar, DollarSign, Users, Clock } from 'lucide-react';

interface ProjectStats {
  daysInProduction: number;
  budget: string;
  teamSize: number;
  phase: 'Development' | 'Pre-Production' | 'Production' | 'Post-Production';
  progress: number;
}

interface ProjectHeaderProps {
  title: string;
  type: string;
  stats: ProjectStats;
  posterUrl: string;
}

export function ProjectHeader({ title, type, stats, posterUrl }: ProjectHeaderProps) {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="container p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Poster */}
          <div className="w-full md:w-48 lg:w-64">
            <img 
              src={posterUrl} 
              alt={`${title} poster`}
              className="w-full h-64 md:h-auto object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Project Info */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
                <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">
                  {type}
                </span>
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
                {stats.phase}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Days in Production</p>
                  <p className="font-semibold">{stats.daysInProduction}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Budget</p>
                  <p className="font-semibold">{stats.budget}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Team Size</p>
                  <p className="font-semibold">{stats.teamSize}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Progress</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-1">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${stats.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
