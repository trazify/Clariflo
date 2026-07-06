import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Monitor } from 'lucide-react';
import { usePomodoro } from '../../hooks/usePomodoro';
import { useAppStore } from '../../store/useAppStore';

export const Timer = ({ compact = false }) => {
  const { timeLeft, formattedTime, toggleTimer, resetTimer, timerState, breakType, switchToFocus, switchToShortBreak, switchToLongBreak } = usePomodoro();
  const { timerMode, focusDuration, breakDuration, longBreakDuration, sessionCount } = useAppStore();

  const [isPipActive, setIsPipActive] = useState(false);
  const pipRef = useRef(null);

  const filledDots = sessionCount % 4;
  const dotsArray = [...Array(4).keys()].map(i => i < filledDots);

  // Active tab detection
  let activeTab = 'Focus';
  if (timerState === 'break' && breakType === 'short') activeTab = 'Short Break';
  if (timerState === 'break' && breakType === 'long') activeTab = 'Long Break';
  if (timerState === 'idle' && breakType === 'short' && timeLeft === breakDuration * 60) activeTab = 'Short Break';
  if (timerState === 'idle' && breakType === 'long' && timeLeft === longBreakDuration * 60) activeTab = 'Long Break';

  const isRunning = timerState === 'running' || timerState === 'break';

  let totalDuration = focusDuration * 60;
  if (activeTab === 'Short Break') totalDuration = breakDuration * 60;
  if (activeTab === 'Long Break') totalDuration = longBreakDuration * 60;

  const handleTab = (label) => {
    if (label === 'Focus') switchToFocus();
    else if (label === 'Short Break') switchToShortBreak();
    else if (label === 'Long Break') switchToLongBreak();
  };

  const drawTimerCanvas = (canvas, timeSecs, label, totalSecs) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Draw background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#0f0a1c');
    grad.addColorStop(1, '#05030a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw active purple glow border
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Format time
    const mins = Math.floor(timeSecs / 60);
    const secs = timeSecs % 60;
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    // Draw Active State Text
    ctx.font = 'bold 12px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.textAlign = 'center';
    ctx.fillText(label.toUpperCase(), canvas.width / 2, 45);

    // Draw Main Clock
    ctx.font = 'bold 54px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(timeStr, canvas.width / 2, 105);

    // Draw Progress Bar
    const progress = totalSecs > 0 ? (timeSecs / totalSecs) : 0;
    const barX = 30;
    const barY = 135;
    const barWidth = canvas.width - (barX * 2);
    const barHeight = 6;

    // Track
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(barX, barY, barWidth, barHeight, 3) : ctx.rect(barX, barY, barWidth, barHeight);
    ctx.fill();

    // Fill
    if (progress > 0) {
      ctx.fillStyle = '#7c3aed';
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(barX, barY, barWidth * progress, barHeight, 3) : ctx.rect(barX, barY, barWidth * progress, barHeight);
      ctx.fill();
    }
  };

  const togglePip = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 170;

      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;

      // Draw initial frame
      drawTimerCanvas(canvas, timeLeft, activeTab, totalDuration);

      const stream = canvas.captureStream(10);
      video.srcObject = stream;

      video.addEventListener('leavepictureinpicture', () => {
        setIsPipActive(false);
        if (pipRef.current) {
          if (pipRef.current.stream) {
            pipRef.current.stream.getTracks().forEach(track => track.stop());
          }
          pipRef.current = null;
        }
      });

      await video.play();
      await video.requestPictureInPicture();
      
      pipRef.current = { video, canvas, stream };
      setIsPipActive(true);
    } catch (e) {
      console.error('Failed to enter Picture-in-Picture mode:', e);
    }
  };

  // Keep PiP canvas updated as timer ticks
  useEffect(() => {
    if (isPipActive && pipRef.current && pipRef.current.canvas) {
      drawTimerCanvas(pipRef.current.canvas, timeLeft, activeTab, totalDuration);
    }
  }, [timeLeft, activeTab, totalDuration, isPipActive]);

  // Clean up PiP on unmount
  useEffect(() => {
    return () => {
      if (pipRef.current) {
        if (document.pictureInPictureElement === pipRef.current.video) {
          document.exitPictureInPicture().catch(() => {});
        }
        if (pipRef.current.stream) {
          pipRef.current.stream.getTracks().forEach(track => track.stop());
        }
      }
    };
  }, []);

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
        <button 
          onClick={togglePip} 
          className={`ctrl-icon ${isPipActive ? 'text-[#7c3aed]' : 'text-white/45'}`}
          title="Picture-in-Picture Timer"
        >
          <Monitor size={22} />
        </button>
      </div>
    </div>
  );
};
