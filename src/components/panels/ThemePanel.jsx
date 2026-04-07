import React from 'react';
import { X, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { themes } from '../../data/themes';

export const ThemePanel = () => {
  const { activePanel, setActivePanel, activeTheme, setActiveTheme } = useAppStore();
  const isOpen = activePanel === 'theme';

  if (!isOpen) return null;

  const gradients = themes.filter(t => t.type === 'gradient');
  const images = themes.filter(t => t.type === 'image');

  const ThemeCard = ({ theme }) => (
    <button
      onClick={() => setActiveTheme(theme.id)}
      className={`relative h-14 w-full overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
        activeTheme === theme.id ? 'border-[#7c3aed] shadow-md shadow-purple-500/15' : 'border-transparent hover:border-white/12'
      }`}
    >
      {theme.type === 'gradient' ? (
        <div className="absolute inset-0" style={{ background: theme.value }} />
      ) : (
        <img src={theme.url} alt={theme.name} className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:opacity-90 transition-opacity" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <span className="absolute bottom-1.5 left-2 text-[10px] font-semibold text-white z-10">{theme.name}</span>
      {activeTheme === theme.id && (
        <div className="absolute top-1.5 right-1.5 bg-[#7c3aed] text-white p-0.5 rounded-full">
          <Check size={10} strokeWidth={3} />
        </div>
      )}
    </button>
  );

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setActivePanel(null)} />
      <div className="fixed bottom-16 right-5 z-50 w-[300px] anim-slide-up">
        <div className="glass-panel p-5 max-h-[420px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white/80 tracking-widest uppercase">Themes</h2>
            <button onClick={() => setActivePanel(null)} className="p-1 rounded-lg hover:bg-white/10 text-white/35 hover:text-white transition-all cursor-pointer">
              <X size={16} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-4">
            <div>
              <p className="text-[9px] text-white/30 font-semibold tracking-widest uppercase mb-2">Gradients</p>
              <div className="grid grid-cols-2 gap-2">
                {gradients.map(t => <ThemeCard key={t.id} theme={t} />)}
              </div>
            </div>
            <div>
              <p className="text-[9px] text-white/30 font-semibold tracking-widest uppercase mb-2">Photos</p>
              <div className="grid grid-cols-2 gap-2">
                {images.map(t => <ThemeCard key={t.id} theme={t} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
