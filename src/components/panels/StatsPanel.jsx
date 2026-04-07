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

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIdx = new Date().getDay();
  const weekData = days.map((d, i) => {
    if (i === todayIdx) return { day: d, minutes: stats.today.focusMinutes };
    const hist = stats.history.find(h => new Date(h.date).getDay() === i);
    return { day: d, minutes: hist?.focusMinutes || 0 };
  });
  const maxMinutes = Math.max(...weekData.map(d => d.minutes), 1);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setActivePanel(null)} />
      <div className="fixed bottom-16 left-5 z-50 w-[300px] anim-slide-up">
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white/80 tracking-widest uppercase">Focus Stats</h2>
            <button onClick={() => setActivePanel(null)} className="p-1 rounded-lg hover:bg-white/10 text-white/35 hover:text-white transition-all cursor-pointer">
              <X size={16} />
            </button>
          </div>

          {/* Total */}
          <div className="bg-white/5 rounded-2xl p-4 mb-4 text-center border border-white/5">
            <div className="text-2xl font-bold text-white">{hours}h {mins}m</div>
            <div className="text-[10px] text-white/35 font-medium tracking-wider uppercase mt-1">Total Focus Time</div>
          </div>

          {/* Period */}
          <div className="flex gap-2 mb-4">
            {['week', 'month'].map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${period === p ? 'bg-[#7c3aed] text-white' : 'text-white/35 hover:text-white/55'}`}>
                This {p === 'week' ? 'Week' : 'Month'}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className="flex items-end justify-between gap-1.5 h-20 px-1">
            {weekData.map((d, i) => (
              <div key={d.day} className="flex flex-col items-center flex-1 gap-1">
                <div
                  className="w-full rounded-t transition-all duration-150"
                  style={{
                    height: `${Math.max((d.minutes / maxMinutes) * 100, 4)}%`,
                    background: i === todayIdx ? 'linear-gradient(to top, #7c3aed, #a78bfa)' : 'rgba(255,255,255,0.08)',
                    minHeight: '2px'
                  }}
                />
                <span className={`text-[9px] font-medium ${i === todayIdx ? 'text-white/60' : 'text-white/25'}`}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
