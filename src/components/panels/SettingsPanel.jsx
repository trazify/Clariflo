import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const SettingsPanel = () => {
  const { activePanel, setActivePanel, focusDuration, breakDuration, longBreakDuration, setFocusDuration, setBreakDuration, setLongBreakDuration, userName, setUserName } = useAppStore();
  const isOpen = activePanel === 'settings';

  const [localFocus, setLocalFocus] = useState(focusDuration);
  const [localBreak, setLocalBreak] = useState(breakDuration);
  const [localLong, setLocalLong] = useState(longBreakDuration);
  const [localName, setLocalName] = useState(userName);

  // Sync local state when panel opens
  React.useEffect(() => {
    if (isOpen) {
      setLocalFocus(focusDuration);
      setLocalBreak(breakDuration);
      setLocalLong(longBreakDuration);
      setLocalName(userName);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setFocusDuration(localFocus);
    setBreakDuration(localBreak);
    setLongBreakDuration(localLong);
    setUserName(localName);
    setActivePanel(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setActivePanel(null)} />
      <div className="fixed bottom-20 right-6 z-50 w-[320px] anim-slide-up">
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-white/90 tracking-widest uppercase">Settings</h2>
            <button onClick={() => setActivePanel(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all">
              <X size={16} />
            </button>
          </div>
          
          {/* Display Name */}
          <div className="mb-5">
            <label className="text-xs text-white/50 font-medium mb-2 block">Display Name</label>
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-white/25 transition-colors"
            />
          </div>

          {/* Duration Sliders */}
          <div className="flex flex-col gap-4 mb-6">
            {[
              { label: 'Focus', value: localFocus, setter: setLocalFocus, min: 5, max: 60 },
              { label: 'Short Break', value: localBreak, setter: setLocalBreak, min: 1, max: 30 },
              { label: 'Long Break', value: localLong, setter: setLocalLong, min: 5, max: 45 },
            ].map(({ label, value, setter, min, max }) => (
              <div key={label}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-white/50 font-medium">{label}</span>
                  <span className="text-xs text-white/70 font-bold">{value} min</span>
                </div>
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={value}
                  onChange={(e) => setter(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full py-3 bg-accent hover:bg-accent-dark text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
};
