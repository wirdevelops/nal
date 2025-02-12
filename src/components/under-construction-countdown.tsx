import { useState, useEffect } from 'react';
import { format, toZonedTime } from 'date-fns-tz';

const UnderConstructionCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const launchTimeZone = 'America/Toronto';
    const launchTime = toZonedTime('2023-04-08T08:00:00', launchTimeZone);

    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = launchTime.getTime() - now.getTime();

      if (diff <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {timeLeft.days} Days
      {timeLeft.hours} Hours
      {timeLeft.minutes} Minutes
      {timeLeft.seconds} Seconds
    </>
  );
};

export default UnderConstructionCountdown;