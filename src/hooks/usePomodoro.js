import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';

export const usePomodoro = () => {
  const { 
    timerMode, focusDuration, breakDuration, longBreakDuration,
    timerState, setTimerState, recordSession, sessionCount, incrementSessionCount 
  } = useAppStore();

  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  const [breakType, setBreakType] = useState('short'); // 'short' | 'long'
  const intervalRef = useRef(null);

  useEffect(() => {
    // Reset time if duration or mode changes while idle
    if (timerState === 'idle') {
      if (timerMode === 'pomodoro' || timerMode === 'countdown') {
        setTimeLeft(focusDuration * 60);
      } else if (timerMode === 'stopwatch') {
        setTimeLeft(0);
      }
      setBreakType('short');
    }
  }, [focusDuration, timerMode, timerState]);

  useEffect(() => {
    if (timerState === 'running' || timerState === 'break') {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (timerMode === 'stopwatch') {
            return prev + 1; // Count up
          }
          
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1; // Count down
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [timerState, timerMode]);

  const handleTimerComplete = () => {
    clearInterval(intervalRef.current);
    
    // Play alert sound
    const playAlert = () => {
      try {
        const audio = new Audio('/sounds/alerts/chime/freesound_community-chime-sound-7143.mp3');
        audio.play().catch(e => console.log('Audio autoplay blocked', e));
      } catch (e) {
        console.error('Failed to play alert:', e);
      }
    };
    playAlert();
    
    if (timerMode === 'pomodoro') {
      if (timerState === 'running') {
        // Focus complete, register stats
        incrementSessionCount();
        recordSession(focusDuration);
        
        // Use incremented count to determine if this is a long break
        const newCount = sessionCount + 1;
        const isLongBreak = newCount > 0 && newCount % 4 === 0;
        
        // Auto-continue to break countdown immediately
        setBreakType(isLongBreak ? 'long' : 'short');
        setTimeLeft((isLongBreak ? longBreakDuration : breakDuration) * 60);
        setTimerState('break');
      } else if (timerState === 'break') {
        // Break complete, auto-continue directly back to running focus timer
        setBreakType('short');
        setTimeLeft(focusDuration * 60);
        setTimerState('running');
      }
    } else if (timerMode === 'countdown') {
      recordSession(focusDuration);
      setTimerState('idle');
    }
  };

  const toggleTimer = () => {
    if (timerState === 'idle' || timerState === 'paused') {
      setTimerState('running');
    } else if (timerState === 'running') {
      setTimerState('paused');
    } else if (timerState === 'break') {
      setTimerState('paused');
    }
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setTimerState('idle');
    setBreakType('short');
    if (timerMode === 'stopwatch') {
      setTimeLeft(0);
    } else {
      setTimeLeft(focusDuration * 60);
    }
  };

  // Manual tab switching for Focus / Short Break / Long Break
  const switchToFocus = () => {
    clearInterval(intervalRef.current);
    setTimerState('idle');
    setBreakType('short');
    setTimeLeft(focusDuration * 60);
  };

  const switchToShortBreak = () => {
    clearInterval(intervalRef.current);
    setTimerState('idle');
    setBreakType('short');
    setTimeLeft(breakDuration * 60);
  };

  const switchToLongBreak = () => {
    clearInterval(intervalRef.current);
    setTimerState('idle');
    setBreakType('long');
    setTimeLeft(longBreakDuration * 60);
  };

  const formattedTime = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return { 
    timeLeft, formattedTime, toggleTimer, resetTimer, timerState, breakType,
    switchToFocus, switchToShortBreak, switchToLongBreak 
  };
};
