import React from 'react';
import { X, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { themes } from '../../data/themes';

export const ThemePanel = () => {
  const { activePanel, setActivePanel, activeTheme, setActiveTheme } = useAppStore();
  const isOpen = activePanel === 'theme';

  if (!isOpen) return null;

  const gradientThemes = themes.filter(t => t.type === 'gradient');
  const imageThemes = themes.filter(t => t.type === 'image');

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setActivePanel(null)} />
      <div className="fixed bottom-20 right-6 z-50 w-[320px] anim-slide-up">
        <div className="glass-panel p-6 max-h-[480px] flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-white/90 tracking-widest uppercase">Themes</h2>
            <button onClick={() => setActivePanel(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all">
              <X size={16} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-5">
            {/* Gradient Themes */}
            <div>
              <p className="text-[10px] text-white/35 font-semibold tracking-widest uppercase mb-3">Gradients</p>
              <div className="grid grid-cols-2 gap-2.5">
                {gradientThemes.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setActiveTheme(theme.id)}
                    className={`relative h-16 w-full overflow-hidden rounded-xl border-2 transition-all cursor-pointer group ${
                      activeTheme === theme.id ? 'border-accent shadow-lg shadow-accent/15' : 'border-transparent hover:border-white/15'
                    }`}
                  >
                    <div className="absolute inset-0" style={{ background: theme.value }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute bottom-2 left-2.5 text-[10px] font-semibold text-white z-10">{theme.name}</span>
                    {activeTheme === theme.id && (
                      <div className="absolute top-1.5 right-1.5 bg-accent text-white p-0.5 rounded-full shadow-lg">
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Themes */}
            <div>
              <p className="text-[10px] text-white/35 font-semibold tracking-widest uppercase mb-3">Photos</p>
              <div className="grid grid-cols-2 gap-2.5">
                {imageThemes.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setActiveTheme(theme.id)}
                    className={`relative h-16 w-full overflow-hidden rounded-xl border-2 transition-all cursor-pointer group ${
                      activeTheme === theme.id ? 'border-accent shadow-lg shadow-accent/15' : 'border-transparent hover:border-white/15'
                    }`}
                  >
                    <img src={theme.url} alt={theme.name} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute bottom-2 left-2.5 text-[10px] font-semibold text-white z-10">{theme.name}</span>
                    {activeTheme === theme.id && (
                      <div className="absolute top-1.5 right-1.5 bg-accent text-white p-0.5 rounded-full shadow-lg">
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
