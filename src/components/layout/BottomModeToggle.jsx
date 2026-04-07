import React from 'react';
import { Leaf, Home, Lightbulb, Palette, Settings, Maximize } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const BottomModeToggle = () => {
  const { activeMode, setMode, activePanel, setActivePanel } = useAppStore();

  const togglePanel = (panel) => setActivePanel(activePanel === panel ? null : panel);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 anim-slide-up">
      <div className="toolbar-pill">
        {/* Mode switchers */}
        <button onClick={() => setMode('ambient')} className={`tb-btn ${activeMode === 'ambient' ? 'active' : ''}`} title="Ambient">
          <Leaf size={18} />
        </button>
        <button onClick={() => setMode('home')} className={`tb-btn ${activeMode === 'home' ? 'active' : ''}`} title="Home">
          <Home size={18} />
        </button>
        <button onClick={() => setMode('focus')} className={`tb-btn ${activeMode === 'focus' ? 'active' : ''}`} title="Focus">
          <Lightbulb size={18} />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Utilities */}
        <button onClick={() => togglePanel('theme')} className={`tb-btn ${activePanel === 'theme' ? 'active' : ''}`} title="Themes">
          <Palette size={18} />
        </button>
        <button onClick={() => togglePanel('settings')} className={`tb-btn ${activePanel === 'settings' ? 'active' : ''}`} title="Settings">
          <Settings size={18} />
        </button>
        <button onClick={handleFullscreen} className="tb-btn" title="Fullscreen">
          <Maximize size={18} />
        </button>
      </div>
    </div>
  );
};
