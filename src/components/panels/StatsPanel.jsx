import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const StatsPanel = () => {
  const { activePanel, setActivePanel, stats } = useAppStore();
  const [period, setPeriod] = useState('week');
  const isOpen = activePanel === 'stats';

  if (!isOpen) return null;

  const hours = Math.floor(stats.today.focusMinutes / 60);
  const mins = stats.today.focusMinutes % 60;

  // Generate weekly data for chart
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIdx = new Date().getDay();
  const weekData = days.map((d, i) => {
    if (i === todayIdx) return { day: d, minutes: stats.today.focusMinutes };
    const hist = stats.history.find(h => {
      const hDate = new Date(h.date);
      return hDate.getDay() === i;
    });
    return { day: d, minutes: hist?.focusMinutes || 0 };
  });

  const maxMinutes = Math.max(...weekData.map(d => d.minutes), 1);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setActivePanel(null)} />
      <div className="fixed bottom-20 right-6 z-50 w-[320px] anim-slide-up">
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-white/90 tracking-widest uppercase">Focus Stats</h2>
            <button onClick={() => setActivePanel(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all">
              <X size={16} />
            </button>
          </div>

          {/* Total Focus Time */}
          <div className="bg-white/5 rounded-2xl p-5 mb-5 text-center border border-white/5">
            <div className="text-3xl font-bold text-white mb-1">{hours}h {mins}m</div>
            <div className="text-xs text-white/40 font-medium tracking-wider uppercase">Total Focus Time</div>
          </div>

          {/* Period Toggle */}
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setPeriod('week')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                period === 'week' ? 'bg-accent text-white' : 'text-white/40 hover:text-white/60'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                period === 'month' ? 'bg-accent text-white' : 'text-white/40 hover:text-white/60'
              }`}
            >
              This Month
            </button>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-24 px-1">
            {weekData.map((d, i) => (
              <div key={d.day} className="flex flex-col items-center flex-1 gap-1.5">
                <div
                  className="w-full rounded-t-md transition-all duration-500"
                  style={{
                    height: `${Math.max((d.minutes / maxMinutes) * 100, 4)}%`,
                    background: i === todayIdx
                      ? 'linear-gradient(to top, #7c3aed, #a78bfa)'
                      : 'rgba(255,255,255,0.1)',
                    minHeight: '3px'
                  }}
                />
                <span className={`text-[10px] font-medium ${i === todayIdx ? 'text-white/70' : 'text-white/30'}`}>
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
