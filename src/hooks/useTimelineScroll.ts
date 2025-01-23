import { useState, useEffect, RefObject } from 'react';

export const useTimelineScroll = (timelineRef: RefObject<HTMLDivElement>) => {
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    if (timelineRef.current) {
      setTimelineWidth(timelineRef.current.scrollWidth);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (timelineRef.current) {
        setTimelineWidth(timelineRef.current.scrollWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleScroll = () => {
    if (timelineRef.current) {
      setScrollLeft(timelineRef.current.scrollLeft);
    }
  };

  return {
    timelineWidth,
    scrollLeft,
    handleScroll,
  };
};