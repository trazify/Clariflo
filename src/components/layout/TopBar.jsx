import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export const TopBar = () => {
  const { isAudioBlocked, triggerResumeAudio } = useAppStore();

  if (!isAudioBlocked) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-40 anim-slide-down">
      <button 
        onClick={triggerResumeAudio}
        className="px-5 py-2.5 bg-white/10 backdrop-blur-xl text-white font-semibold rounded-full border border-white/15 hover:bg-white/15 hover:scale-105 active:scale-95 transition-all text-sm shadow-lg"
      >
        ▶ Resume Sounds
      </button>
    </div>
  );
};
