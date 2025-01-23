import React from 'react';
import Link from 'next/link';

interface ProjectCardProps {
  id: string;
  name: string;
  type: string;
  status: string;
  description?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ id, name, type, status, description}) => {
  return (
        <Link href={`/film-projects/${id}`} className="bg-secondary border-base border shadow-base rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col space-y-2">
            <h2 className="text-xl font-semibold">{name}</h2>
            <div className="flex justify-between">
               <span className="text-gray-500">
                {type}
              </span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  status === 'Idea' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                  status === 'Pre-Production' ? 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-200' :
                  status === 'Production' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200' :
                  status === 'Post-Production' ? 'bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-200' :
                  status === 'Premiere' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200' :
                  status === 'Exhibition' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-700 dark:text-indigo-200' :
                  status === 'Archive' ? 'bg-pink-100 text-pink-800 dark:bg-pink-700 dark:text-pink-200' :
                  ''
                }`}
              >
                {status}
              </span>
            </div>
              {description && <p className="text-gray-600 dark:text-gray-300 text-sm truncate">{description}</p>}
          </div>
      </Link>
  );
};

export default ProjectCard;