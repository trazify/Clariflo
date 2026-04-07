import React from 'react';
import { CheckSquare, Music, Volume2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const LeftWidgetBar = () => {
  const { activePanel, setActivePanel } = useAppStore();

  const toggle = (panel) => setActivePanel(activePanel === panel ? null : panel);

  return (
    <div className="fixed bottom-5 left-5 z-50 anim-slide-up">
      <div className="toolbar-pill">
        <button onClick={() => toggle('tasks')} className={`tb-btn ${activePanel === 'tasks' ? 'active' : ''}`} title="Tasks">
          <CheckSquare size={18} />
        </button>
        <button onClick={() => toggle('soundscape')} className={`tb-btn ${activePanel === 'soundscape' ? 'active' : ''}`} title="Sounds">
          <Volume2 size={18} />
        </button>
        <button onClick={() => toggle('music')} className={`tb-btn ${activePanel === 'music' ? 'active' : ''}`} title="Music">
          <Music size={18} />
        </button>
      </div>
    </div>
  );
};
