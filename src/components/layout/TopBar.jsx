import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export const TopBar = () => {
  const { isAudioBlocked, triggerResumeAudio } = useAppStore();

  return (
    <div className="fixed top-0 inset-x-0 z-40 p-5 flex items-start justify-between pointer-events-none">
      {/* Logo — top left, always visible */}
      <div className="pointer-events-auto">
        <h1 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-md select-none lowercase">
          clariflo
        </h1>
      </div>

      {/* Resume Sounds — center, only when blocked */}
      {isAudioBlocked && (
        <div className="pointer-events-auto">
          <button 
            onClick={triggerResumeAudio}
            className="px-4 py-2 bg-white/10 backdrop-blur-xl text-white font-semibold rounded-full border border-white/10 hover:bg-white/15 active:scale-95 transition-all text-sm"
          >
            ▶ Resume Sounds
          </button>
        </div>
      )}

      {/* Empty right side — NO quotes */}
      <div />
    </div>
  );
};
