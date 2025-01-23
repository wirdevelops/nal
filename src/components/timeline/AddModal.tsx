import React, { useState } from 'react';
import { X, Users, Calendar, Flag } from 'lucide-react';
import { Milestone } from '../../types/timeline';

interface AddMilestoneModalProps {
  date: Date;
  onClose: () => void;
  onSubmit: (milestone: {
    title: string;
    date: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    teamMembers: string[];
  }) => void;
  teamMembers: { id: string; name: string; avatar?: string }[];
}

export default function AddMilestoneModal({
  date,
  onClose,
  onSubmit,
  teamMembers
}: AddMilestoneModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      date: date.toISOString().split('T')[0],
      description,
      priority,
      teamMembers: selectedMembers
    });
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleNewMilestoneSubmit = (milestoneData: {
    title: string;
    date: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    teamMembers: string[];
  }) => {
    const newMilestone: Milestone = {
      id: crypto.randomUUID(),
      ...milestoneData,
      completed: false,
      subTasks: [],
    };
    onAddMilestone?.(newMilestone);
    setShowAddMilestoneModal(false);
    setSelectedNewMilestoneDate(null);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Add New Milestone
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <div className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-2" />
              {date.toLocaleDateString()}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <div className="flex gap-3">
              {(['low', 'medium', 'high'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium capitalize
                    ${priority === p
                      ? p === 'high'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : p === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                >
                  <Flag className="w-4 h-4 mr-1" />
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Team Members
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {teamMembers.map((member) => (
                <label
                  key={member.id}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.id)}
                    onChange={(e) => {
                      setSelectedMembers(
                        e.target.checked
                          ? [...selectedMembers, member.id]
                          : selectedMembers.filter((id) => id !== member.id)
                      );
                    }}
                    className="rounded border-gray-300 dark:border-gray-600 
                             text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                  <div className="flex items-center space-x-2">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <Users className="w-6 h-6 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {member.name}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 
                       bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 
                       dark:hover:bg-gray-600 focus:outline-none focus:ring-2 
                       focus:ring-gray-500 dark:focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 
                       rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 
                       focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              Add Milestone
            </button>
          </div>
        </form>
      </div>

    {/* Add Milestone Modal */}
    {showAddMilestoneModal && selectedNewMilestoneDate && (
      <AddMilestoneModal
      date={selectedNewMilestoneDate}
      onClose={() => {
        setShowAddMilestoneModal(false);
        setSelectedNewMilestoneDate(null);
      }}
      onSubmit={handleNewMilestoneSubmit}
      teamMembers={teamMembers}
      />
    )}
    </div>
  );
}
