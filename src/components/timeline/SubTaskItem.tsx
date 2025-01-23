import { SubTask, TeamMember } from '../../types/timeline';

interface SubTaskItemProps {
  subTask: SubTask;
  onToggle: (id: string) => void;
  onUpdate: (task: SubTask) => void;
  teamMembers: TeamMember[];
}

export const SubTaskItem = ({ subTask, onToggle, onUpdate, teamMembers }: SubTaskItemProps) => {
  return (
    <div className="flex items-center space-x-2 p-2 border-b">
      <input
        type="checkbox"
        checked={subTask.completed}
        onChange={() => onToggle(subTask.id)}
        className="rounded border-gray-300"
      />
      <input
        type="text"
        value={subTask.title}
        onChange={(e) => onUpdate({ ...subTask, title: e.target.value })}
        className="flex-1 bg-transparent border-none focus:ring-0"
      />
      <select
        value={subTask.assignee || ''}
        onChange={(e) => onUpdate({ ...subTask, assignee: e.target.value })}
        className="text-sm bg-transparent border-none"
      >
        <option value="">Unassigned</option>
        {teamMembers.map(member => (
          <option key={member.id} value={member.id}>{member.name}</option>
        ))}
      </select>
    </div>
  );
};