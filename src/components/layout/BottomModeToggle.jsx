import React from 'react';
import { Clock, Timer, BarChart3, Volume2, Palette, Settings } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const BottomModeToggle = () => {
  const { activeMode, setMode, activePanel, setActivePanel } = useAppStore();

  const togglePanel = (panel) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  return (
    <>
      {/* CENTER — Mode switcher (Clock = Home, Timer = Focus) */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 anim-slide-up" style={{ animationDelay: '0.15s' }}>
        <div className="toolbar-pill">
          <button
            onClick={() => setMode('home')}
            className={`tb-btn ${activeMode === 'home' ? 'active' : ''}`}
            title="Home"
          >
            <Clock size={20} />
          </button>
          <button
            onClick={() => setMode('focus')}
            className={`tb-btn ${activeMode === 'focus' ? 'active' : ''}`}
            title="Focus"
          >
            <Timer size={20} />
          </button>
        </div>
      </div>

      {/* RIGHT — Utilities */}
      <div className="fixed bottom-5 right-6 z-50 anim-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="toolbar-pill">
          <button
            onClick={() => togglePanel('stats')}
            className={`tb-btn ${activePanel === 'stats' ? 'active' : ''}`}
            title="Stats"
          >
            <BarChart3 size={20} />
          </button>
          <button
            onClick={() => togglePanel('soundscape')}
            className={`tb-btn ${activePanel === 'soundscape' ? 'active' : ''}`}
            title="Sounds"
          >
            <Volume2 size={20} />
          </button>
          <button
            onClick={() => togglePanel('theme')}
            className={`tb-btn ${activePanel === 'theme' ? 'active' : ''}`}
            title="Themes"
          >
            <Palette size={20} />
          </button>
          <button
            onClick={() => togglePanel('settings')}
            className={`tb-btn ${activePanel === 'settings' ? 'active' : ''}`}
            title="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
    </>
  );
};
