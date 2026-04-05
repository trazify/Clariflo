import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { usePomodoro } from '../../hooks/usePomodoro';
import { useAppStore } from '../../store/useAppStore';

export const Timer = ({ compact = false }) => {
  const { timeLeft, formattedTime, toggleTimer, resetTimer, timerState, breakType, switchToFocus, switchToShortBreak, switchToLongBreak } = usePomodoro();
  const { timerMode, setTimerMode, focusDuration, breakDuration, longBreakDuration, sessionCount } = useAppStore();

  // Session tally
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

  // --- Compact variant ---
  if (compact) {
    return (
      <div className="glass-panel p-6 flex flex-col items-center gap-4 min-w-[200px] anim-scale-in">
        <span className="text-xs font-semibold text-white/50 tracking-widest uppercase">{activeTab}</span>
        <h2 className="timer-display text-4xl text-white">{formattedTime()}</h2>
        <button onClick={toggleTimer} className="play-btn w-10 h-10">
          {isRunning ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" className="ml-0.5" />}
        </button>
      </div>
    );
  }

  // --- Full Focus mode ---
  return (
    <div className="flex flex-col items-center justify-center w-full select-none mode-transition">
      {/* Mode tabs */}
      <div className="flex gap-2 mb-3 anim-fade-in">
        {['Focus', 'Short Break', 'Long Break'].map((label) => {
          const isActive = label === activeTab;
          return (
            <button
              key={label}
              onClick={() => handleTab(label)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-white/15 text-white border border-white/20 shadow-lg'
                  : 'text-white/45 hover:text-white/70'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Session dots */}
      <div className="flex gap-2 mb-8 anim-fade-in" style={{ animationDelay: '0.1s' }}>
        {dotsArray.map((filled, i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${filled ? 'bg-white scale-110' : 'bg-white/20'}`} />
        ))}
      </div>

      {/* HUGE timer */}
      <h1 className="timer-display text-[6rem] md:text-[9rem] lg:text-[11rem] text-white mb-10 anim-scale-in">
        {formattedTime()}
      </h1>

      {/* Controls: Reset (left), Play (center) */}
      <div className="flex items-center gap-5 anim-fade-in" style={{ animationDelay: '0.2s' }}>
        <button onClick={resetTimer} className="ctrl-circle">
          <RotateCcw size={20} />
        </button>

        <button onClick={toggleTimer} className="play-btn">
          {isRunning ? (
            <Pause size={24} fill="white" />
          ) : (
            <Play size={24} fill="white" className="ml-1" />
          )}
        </button>
      </div>
    </div>
  );
};
