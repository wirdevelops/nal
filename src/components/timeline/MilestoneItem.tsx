import { Edit2, Trash2, Users } from 'lucide-react';
import { Milestone } from '../../types/timeline';

interface MilestoneItemProps {
  milestone: Milestone;
  onToggle: (id: string) => void;
  onEdit: (milestone: Milestone) => void;
  onDelete: (id: string) => void;
  teamMembers?: { id: string; name: string }[];
}

export const MilestoneItem = ({
  milestone,
  onToggle,
  onEdit,
  onDelete,
  teamMembers = []
}: MilestoneItemProps) => {
  const assignedTeamMembers = teamMembers.filter(member => 
    milestone.teamMembers?.includes(member.id)
  );

  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <div className={`p-2 rounded-full ${
        milestone.completed
          ? 'bg-green-100 dark:bg-green-900'
          : 'bg-gray-100 dark:bg-gray-700'
      }`}>
        <input
          type="checkbox"
          checked={milestone.completed}
          onChange={() => onToggle(milestone.id)}
          className="rounded-md border-gray-300 dark:border-gray-700 
            focus:ring-primary focus:border-primary cursor-pointer"
        />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">{milestone.title}</h3>
            {milestone.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {milestone.description}
              </p>
            )}
          </div>
          <span className="text-sm text-gray-500">
            {new Date(milestone.date).toLocaleDateString()}
          </span>
        </div>
        
        <div className="mt-2 flex items-center space-x-4">
          <span className={`text-sm ${
            milestone.completed
              ? 'text-green-600 dark:text-green-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {milestone.completed ? 'Completed' : 'Pending'}
          </span>
          
          {milestone.priority && (
            <span className={`text-sm px-2 py-0.5 rounded-full ${
              milestone.priority === 'high' 
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : milestone.priority === 'medium'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}>
              {milestone.priority} Priority
            </span>
          )}

          {assignedTeamMembers.length > 0 && (
            <div className="flex items-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-1" />
              <span>{assignedTeamMembers.length} assigned</span>
            </div>
          )}

          {milestone.subTasks?.length > 0 && (
            <div className="text-sm text-gray-500">
              {milestone.subTasks.filter(task => task.completed).length}/{milestone.subTasks.length} tasks
            </div>
          )}
        </div>
      </div>

      <div className="flex space-x-2">
        <button 
          onClick={() => onEdit(milestone)} 
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onDelete(milestone.id)} 
          className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};