import { useRef, useEffect } from 'react';
import { CheckCircle, Clock, Circle } from 'lucide-react';
import { TimelinePhase } from '../../types/timeline';
import { useTimelineScroll } from '../../../others/useTimelineScroll';

interface TimelineNavigationProps {
  phases: TimelinePhase[];
  selectedPhase: TimelinePhase;
  onPhaseSelect: (phase: TimelinePhase) => void;
}

export const TimelineNavigation = ({
  phases,
  selectedPhase,
  onPhaseSelect
}: TimelineNavigationProps) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollLeft, handleScroll, timelineWidth } = useTimelineScroll(timelineRef);

  useEffect(() => {
    if (selectedPhase && timelineRef.current) {
      const phaseButton = timelineRef.current.querySelector(`[data-phase-id="${selectedPhase.id}"]`);
      if (phaseButton) {
        const buttonCenter = (phaseButton as HTMLElement).offsetLeft + phaseButton.clientWidth / 2;
        const containerCenter = timelineRef.current.offsetWidth / 2;
        const scrollAmount = buttonCenter - containerCenter;
        timelineRef.current.scrollTo({
          left: scrollAmount,
          behavior: 'smooth',
        });
      }
    }
  }, [selectedPhase]);

  const getPhaseIcon = (status: TimelinePhase['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-white" />;
      case 'current':
        return <Clock className="w-5 h-5 text-white" />;
      default:
        return <Circle className="w-5 h-5 text-white" />;
    }
  };

  const getPhaseColor = (status: TimelinePhase['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'current':
        return 'bg-blue-500';
      default:
        return 'bg-gray-300 dark:bg-gray-600';
    }
  };

  return (
    <div className="relative overflow-x-auto">
      <div className="absolute left-0 right-0 h-1 top-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-700" />
      
      <div 
        ref={timelineRef}
        onScroll={handleScroll}
        className="relative flex justify-between max-w-4xl mx-auto whitespace-nowrap scroll-smooth"
        style={{
          paddingLeft: timelineWidth > (timelineRef.current?.offsetWidth || 0) ? 
            `${timelineRef.current?.offsetWidth || 0 / 2}px` : '',
          paddingRight: timelineWidth > (timelineRef.current?.offsetWidth || 0) ? 
            `${timelineRef.current?.offsetWidth || 0 / 2}px` : '',
        }}
      >
        {phases.map((phase) => (
          <button
            key={phase.id}
            data-phase-id={phase.id}
            onClick={() => onPhaseSelect(phase)}
            className={`relative flex flex-col items-center space-y-2 group 
              ${selectedPhase.id === phase.id ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10
              ${getPhaseColor(phase.status)}`}
            >
              {getPhaseIcon(phase.status)}
            </div>
            <span className={`text-sm font-medium ${
              selectedPhase.id === phase.id 
                ? 'text-gray-900 dark:text-gray-100' 
                : 'text-gray-500'
            }`}>
              {phase.name}
            </span>
          </button>
        ))}
      </div>

      {/* Scroll Indicators */}
      {timelineWidth > (timelineRef.current?.offsetWidth || 0) && (
        <>
          <div className={`absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r 
            from-white to-transparent dark:from-gray-800 pointer-events-none
            ${scrollLeft === 0 ? 'hidden' : 'block'}`} 
          />
          <div className={`absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l 
            from-white to-transparent dark:from-gray-800 pointer-events-none
            ${scrollLeft >= timelineWidth - (timelineRef.current?.offsetWidth || 0) ? 'hidden' : 'block'}`}
          />
        </>
      )}
    </div>
  );
};