import React from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const SettingsPanel = () => {
  const { activePanel, setActivePanel, focusDuration, breakDuration, longBreakDuration, setFocusDuration, setBreakDuration, setLongBreakDuration, userName, setUserName } = useAppStore();
  const isOpen = activePanel === 'settings';

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setActivePanel(null)} />
      <div className="fixed bottom-16 right-5 z-50 w-[300px] anim-slide-up">
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-white/80 tracking-widest uppercase">Settings</h2>
            <button onClick={() => setActivePanel(null)} className="p-1 rounded-lg hover:bg-white/10 text-white/35 hover:text-white transition-all cursor-pointer">
              <X size={16} />
            </button>
          </div>
          
          {/* Display Name */}
          <div className="mb-4">
            <label className="text-xs text-white/40 font-medium mb-1.5 block">Display Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-white/5 border border-white/8 rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-white/20 transition-colors"
            />
          </div>

          {/* Sliders */}
          <div className="flex flex-col gap-3.5">
            {[
              { label: 'Focus', value: focusDuration, setter: setFocusDuration, min: 5, max: 60 },
              { label: 'Short Break', value: breakDuration, setter: setBreakDuration, min: 1, max: 30 },
              { label: 'Long Break', value: longBreakDuration, setter: setLongBreakDuration, min: 5, max: 45 },
            ].map(({ label, value, setter, min, max }) => (
              <div key={label}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-white/40 font-medium">{label}</span>
                  <span className="text-xs text-white/60 font-bold">{value} min</span>
                </div>
                <input type="range" min={min} max={max} value={value} onChange={(e) => setter(Number(e.target.value))} />
              </div>
            ))}
          </div>

          {/* Save */}
          <button
            onClick={() => setActivePanel(null)}
            className="w-full mt-4 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold rounded-xl transition-all active:scale-[0.97] cursor-pointer text-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
};
