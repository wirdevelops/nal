import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CalendarIcon, PlusCircle, Link, Paperclip } from 'lucide-react';
import { Milestone, TeamMember, SubTask } from '../../types/timeline';
import { SubTaskItem } from './SubTaskItem';

interface MilestoneDetailsProps {
  milestone: Milestone;
  teamMembers: TeamMember[];
  onUpdate: (milestone: Milestone) => void;
  onClose: () => void;
}

export const MilestoneDetails = ({ milestone, teamMembers, onUpdate, onClose }: MilestoneDetailsProps) => {
  const [editedMilestone, setEditedMilestone] = useState<Milestone>(milestone);

  const handleSubTaskToggle = (taskId: string) => {
    const updatedTasks = editedMilestone.subTasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setEditedMilestone({ ...editedMilestone, subTasks: updatedTasks });
  };

  const handleSubTaskUpdate = (updatedTask: SubTask) => {
    const updatedTasks = editedMilestone.subTasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setEditedMilestone({ ...editedMilestone, subTasks: updatedTasks });
  };

  const addSubTask = () => {
    const newTask: SubTask = {
      id: uuidv4(),
      title: 'New Task',
      completed: false
    };
    setEditedMilestone({
      ...editedMilestone,
      subTasks: [...editedMilestone.subTasks, newTask]
    });
  };

  const handleSave = () => {
    onUpdate(editedMilestone);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <input
              type="text"
              value={editedMilestone.title}
              onChange={(e) => setEditedMilestone({ ...editedMilestone, title: e.target.value })}
              className="text-xl font-semibold bg-transparent border-none focus:ring-0"
            />
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <CalendarIcon className="w-4 h-4 mr-2" />
              <input
                type="date"
                value={editedMilestone.date}
                onChange={(e) => setEditedMilestone({ ...editedMilestone, date: e.target.value })}
                className="bg-transparent border-none"
              />
            </div>
          </div>
          <select
            value={editedMilestone.priority}
            onChange={(e) => setEditedMilestone({ 
              ...editedMilestone, 
              priority: e.target.value as 'low' | 'medium' | 'high' 
            })}
            className="text-sm border rounded-md"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Description */}
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <textarea
              value={editedMilestone.description}
              onChange={(e) => setEditedMilestone({ ...editedMilestone, description: e.target.value })}
              className="w-full rounded-md border"
              rows={3}
            />
          </div>

          {/* Sub-tasks */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Sub-tasks</h3>
              <button
                onClick={addSubTask}
                className="text-sm text-blue-500 flex items-center"
              >
                <PlusCircle className="w-4 h-4 mr-1" /> Add Task
              </button>
            </div>
            <div className="space-y-2">
              {editedMilestone.subTasks.map(task => (
                <SubTaskItem
                  key={task.id}
                  subTask={task}
                  onToggle={handleSubTaskToggle}
                  onUpdate={handleSubTaskUpdate}
                  teamMembers={teamMembers}
                />
              ))}
            </div>
          </div>

          {/* Team Members */}
          <div>
            <h3 className="font-medium mb-2">Team Members</h3>
            <div className="flex flex-wrap gap-2">
              {teamMembers.map(member => (
                <label key={member.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editedMilestone.teamMembers.includes(member.id)}
                    onChange={(e) => {
                      const updatedMembers = e.target.checked
                        ? [...editedMilestone.teamMembers, member.id]
                        : editedMilestone.teamMembers.filter(id => id !== member.id);
                      setEditedMilestone({ ...editedMilestone, teamMembers: updatedMembers });
                    }}
                    className="rounded border-gray-300"
                  />
                  <span>{member.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Dependencies and Attachments */}
          <div className="flex space-x-4">
            {editedMilestone.dependencies && (
              <div>
                <h3 className="font-medium mb-2">Dependencies</h3>
                <div className="flex items-center space-x-2">
                  <Link className="w-4 h-4" />
                  <span>{editedMilestone.dependencies.length} linked milestones</span>
                </div>
              </div>
            )}

            {editedMilestone.attachments && (
              <div>
                <h3 className="font-medium mb-2">Attachments</h3>
                <div className="flex items-center space-x-2">
                  <Paperclip className="w-4 h-4" />
                  <span>{editedMilestone.attachments.length} files</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};