import React from 'react';
import { Play, Pause, RotateCcw, Monitor } from 'lucide-react';
import { usePomodoro } from '../../hooks/usePomodoro';
import { useAppStore } from '../../store/useAppStore';

export const Timer = ({ compact = false }) => {
  const { timeLeft, formattedTime, toggleTimer, resetTimer, timerState, breakType, switchToFocus, switchToShortBreak, switchToLongBreak } = usePomodoro();
  const { timerMode, focusDuration, breakDuration, longBreakDuration, sessionCount } = useAppStore();

  const filledDots = sessionCount % 4;
  const dotsArray = [...Array(4).keys()].map(i => i < filledDots);

  // Active tab detection
  let activeTab = 'Focus';
  if (timerState === 'break' && breakType === 'short') activeTab = 'Short Break';
  if (timerState === 'break' && breakType === 'long') activeTab = 'Long Break';
  if (timerState === 'idle' && breakType === 'short' && timeLeft === breakDuration * 60) activeTab = 'Short Break';
  if (timerState === 'idle' && breakType === 'long' && timeLeft === longBreakDuration * 60) activeTab = 'Long Break';

  const isRunning = timerState === 'running' || timerState === 'break';

  const handleTab = (label) => {
    if (label === 'Focus') switchToFocus();
    else if (label === 'Short Break') switchToShortBreak();
    else if (label === 'Long Break') switchToLongBreak();
  };

  // Compact
  if (compact) {
    return (
      <div className="glass-panel p-5 flex flex-col items-center gap-3 min-w-[180px] anim-scale-in">
        <span className="text-xs font-semibold text-white/40 tracking-widest uppercase">{activeTab}</span>
        <h2 className="timer-display text-4xl text-white">{formattedTime()}</h2>
        <button onClick={toggleTimer} className="start-btn !py-2 !px-8 !text-sm">
          {isRunning ? 'Pause' : 'Start'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full select-none mode-enter">
      {/* "What do you want to focus on?" */}
      <p className="text-lg md:text-xl font-semibold text-white/70 mb-5 tracking-tight">
        What do you want to focus on?
      </p>

      {/* Tabs — Flocus: rounded-rect buttons with border, active = solid purple */}
      <div className="flex gap-3 mb-3">
        {['Focus', 'Short Break', 'Long Break'].map((label) => (
          <button
            key={label}
            onClick={() => handleTab(label)}
            className={`focus-tab ${label === activeTab ? 'active' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Session dots */}
      <div className="flex gap-2 mb-6">
        {dotsArray.map((filled, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-all duration-150 ${filled ? 'bg-white' : 'bg-white/25'}`} />
        ))}
      </div>

      {/* MASSIVE timer */}
      <h1 className="timer-display text-[7rem] md:text-[10rem] lg:text-[13rem] text-white mb-8">
        {formattedTime()}
      </h1>

      {/* Controls: Start pill + reset + PiP — Flocus style */}
      <div className="flex items-center gap-4">
        <button onClick={toggleTimer} className="start-btn">
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={resetTimer} className="ctrl-icon">
          <RotateCcw size={22} />
        </button>
        <button className="ctrl-icon">
          <Monitor size={22} />
        </button>
      </div>
    </div>
  );
};
