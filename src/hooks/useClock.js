import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export const useClock = () => {
  const [time, setTime] = useState(new Date());
  const format = useAppStore((state) => state.clockFormat);
  const userName = useAppStore((state) => state.userName);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    const namePart = userName ? `, ${userName}` : '';
    
    if (hour >= 5 && hour < 12) return `Good morning${namePart}`;
    if (hour >= 12 && hour < 17) return `Good afternoon${namePart}`;
    if (hour >= 17 && hour < 21) return `Good evening${namePart}`;
    return `Working late${namePart}?`;
  };

  const getFormattedTime = () => {
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: format === '12h'
    });
  };

  return { time, getGreeting, getFormattedTime };
};
