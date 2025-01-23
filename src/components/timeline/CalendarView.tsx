import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus
} from 'lucide-react';
import { TimelinePhase, Milestone } from '../../types/timeline';
import { projectColors } from '../../constants/projectColors';
import AddMilestoneModal from './AddModal';

interface CalendarViewProps {
  phases: TimelinePhase[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onMilestoneClick: (milestone: Milestone) => void;
  onAddMilestone?: (date: Date) => void;
  teamMembers: { id: string; name: string; avatar?: string }[];
}

export const CalendarView = ({
  phases,
  selectedDate,
  onDateSelect,
  onMilestoneClick,
  onAddMilestone,
  teamMembers
}: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(selectedDate);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [view, setView] = useState<'month' | 'week'>('month');

  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);
const [selectedNewMilestoneDate, setSelectedNewMilestoneDate] = useState<Date | null>(null);

  // Get current week dates
  const getWeekDates = (date: Date) => {
    const week = [];
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay()); // Start from Sunday

    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      week.push(day);
    }
    return week;
  };

  // Get days for month view
  const getMonthDates = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add padding days from previous month
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ 
        date: prevDate, 
        isPadding: true,
        isCurrentMonth: false
      });
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ 
        date: new Date(year, month, i), 
        isPadding: false,
        isCurrentMonth: true
      });
    }

    // Add padding days for next month if needed
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({
        date: nextDate,
        isPadding: true,
        isCurrentMonth: false
      });
    }

    return days;
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    }
    setCurrentDate(newDate);
  };

  const getDayMilestones = (date: Date) => {
    return phases.reduce((acc: Milestone[], phase) => {
      const phaseMilestones = phase.milestones.filter(milestone => 
        new Date(milestone.date).toDateString() === date.toDateString()
      );
      return [...acc, ...phaseMilestones];
    }, []);
  };

  const handleAddMilestone = (date: Date) => {
    setSelectedNewMilestoneDate(date);
    setShowAddMilestoneModal(true);
  };

  const renderDay = (date: Date, isPadding = false) => {
    const milestones = getDayMilestones(date);
    const isSelected = date.toDateString() === selectedDate.toDateString();
    const isToday = date.toDateString() === new Date().toDateString();
    const isHovered = hoveredDate?.toDateString() === date.toDateString();

    return (
      <div
        onClick={() => !isPadding && onDateSelect(date)}
        onMouseEnter={() => setHoveredDate(date)}
        onMouseLeave={() => setHoveredDate(null)}
        className={`
          relative ${view === 'week' ? 'min-h-40' : 'min-h-28'} transition-all duration-200
          ${isPadding 
            ? 'bg-gray-50 dark:bg-gray-900' 
            : 'bg-white dark:bg-gray-800'}
          ${isSelected ? 'ring-2 ring-blue-500 z-10' : ''}
          ${isToday ? 'ring-1 ring-blue-500' : ''}
          ${!isPadding && 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'}
        `}
      >
        <div className="p-2 space-y-1">
          <div className="flex items-center justify-between">
            <span className={`
              text-sm font-medium
              ${isPadding 
                ? 'text-gray-400 dark:text-gray-600' 
                : isToday 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-900 dark:text-gray-100'}
            `}>
              {date.getDate()}
            </span>
            
            {!isPadding && (isHovered || isSelected) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddMilestone?.(date);
                }}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700
                         text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="space-y-1">
            {milestones.map(milestone => (
              <div
                key={milestone.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onMilestoneClick(milestone);
                }}
                className="p-1 rounded bg-blue-100 dark:bg-blue-900 
                         text-blue-800 dark:text-blue-200 text-sm cursor-pointer
                         hover:bg-blue-200 dark:hover:bg-blue-800 truncate"
              >
                {milestone.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const dates = view === 'month' 
    ? getMonthDates(currentDate) 
    : getWeekDates(currentDate);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {currentDate.toLocaleString('default', { 
              month: 'long', 
              year: 'numeric',
              ...(view === 'week' && { day: 'numeric' })
            })}
          </h2>
          <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1.5 text-sm font-medium ${
                view === 'month'
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1.5 text-sm font-medium ${
                view === 'week'
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Week
            </button>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleNavigate('prev')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 
                     text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleNavigate('next')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 
                     text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} 
            className="px-2 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 
                     text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Days */}
      <div className="grid grid-cols-7 auto-rows-fr gap-px bg-gray-200 dark:bg-gray-700">
        {view === 'month' 
          ? dates.map((day, index) => (
              <React.Fragment key={index}>
                {renderDay(day.date, day.isPadding)}
              </React.Fragment>
            ))
          : dates.map((date, index) => (
              <React.Fragment key={index}>
                {renderDay(date)}
              </React.Fragment>
            ))
        }
      </div>
     
      {/* Add Milestone Modal */}
      {showAddMilestoneModal && selectedNewMilestoneDate && (
        <AddMilestoneModal
          date={selectedNewMilestoneDate}
          onClose={() => {
            setShowAddMilestoneModal(false);
            setSelectedNewMilestoneDate(null);
          }}
          onSubmit={(milestoneData) => {
            onAddMilestone?.(selectedNewMilestoneDate);
            setShowAddMilestoneModal(false);
            setSelectedNewMilestoneDate(null);
          }}
          teamMembers={teamMembers}
        />
      )}
    </div>
  );
};