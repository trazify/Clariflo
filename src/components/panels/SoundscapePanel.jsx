import React from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { soundPacks } from '../../data/sounds';

export const SoundscapePanel = () => {
  const { activePanel, setActivePanel, activeSounds, toggleSound, setSoundVolume } = useAppStore();
  const isOpen = activePanel === 'soundscape';

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setActivePanel(null)} />
      <div className="fixed bottom-16 left-5 z-50 w-[340px] anim-slide-up">
        <div className="glass-panel p-5 max-h-[420px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white/80 tracking-widest uppercase">Sounds</h2>
            <button onClick={() => setActivePanel(null)} className="p-1 rounded-lg hover:bg-white/10 text-white/35 hover:text-white transition-all cursor-pointer">
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
            <div className="grid grid-cols-4 gap-2">
              {soundPacks.map(pack => 
                pack.sounds.map(sound => {
                  const activeState = activeSounds[pack.category];
                  const isActive = activeState?.id === sound.id;
                  
                  return (
                    <button
                      key={sound.id}
                      onClick={() => toggleSound(pack.category, sound.id)}
                      className={`flex flex-col items-center gap-1 py-3 px-1.5 rounded-xl transition-all cursor-pointer ${
                        isActive ? 'bg-[#7c3aed]/20 ring-1 ring-[#7c3aed]/40' : 'hover:bg-white/5'
                      }`}
                    >
                      <span className="text-xl">{sound.emoji || pack.icon}</span>
                      <span className="text-[9px] text-white/50 font-medium text-center leading-tight line-clamp-2">{sound.name}</span>
                      
                      {isActive && activeState && (
                        <input 
                          type="range" min="0" max="1" step="0.01"
                          value={activeState.volume}
                          onChange={(e) => { e.stopPropagation(); setSoundVolume(pack.category, parseFloat(e.target.value)); }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer sound-slider outline-none mt-0.5"
                        />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
