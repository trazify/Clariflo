import React from 'react';
import { ListTodo } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const LeftWidgetBar = () => {
  const { activePanel, setActivePanel } = useAppStore();

  const toggle = (panel) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  return (
    <div className="fixed bottom-5 left-6 z-50 anim-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="toolbar-pill">
        <button
          onClick={() => toggle('tasks')}
          className={`tb-btn ${activePanel === 'tasks' ? 'active' : ''}`}
          title="Tasks"
        >
          <ListTodo size={20} />
        </button>
      </div>
    </div>
  );
};
