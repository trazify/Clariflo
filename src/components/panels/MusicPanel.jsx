import React, { useState } from 'react';
import { X, CornerDownLeft, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const MusicPanel = () => {
  const { activePanel, setActivePanel, musicUrl, setMusicUrl } = useAppStore();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(false);
  const isOpen = activePanel === 'music';

  const getEmbedInfo = (url) => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('spotify.com')) return { type: 'spotify', src: `https://open.spotify.com/embed${urlObj.pathname}` };
      if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.has('list')) return { type: 'youtube', src: `https://www.youtube.com/embed/videoseries?list=${urlObj.searchParams.get('list')}&autoplay=1` };
      if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.has('v')) return { type: 'youtube', src: `https://www.youtube.com/embed/${urlObj.searchParams.get('v')}?autoplay=1` };
      if (urlObj.hostname.includes('youtu.be')) return { type: 'youtube', src: `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}?autoplay=1` };
    } catch (e) { return null; }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const info = getEmbedInfo(inputValue.trim());
    if (info) { setMusicUrl(inputValue.trim()); setError(false); setInputValue(''); }
    else { setError(true); }
  };

  const currentEmbed = getEmbedInfo(musicUrl);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setActivePanel(null)} />
      <div className="fixed bottom-16 left-5 z-50 w-[380px] anim-slide-up">
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white/80 tracking-widest uppercase">Music</h2>
            <button onClick={() => setActivePanel(null)} className="p-1 rounded-lg hover:bg-white/10 text-white/35 hover:text-white transition-all cursor-pointer">
              <X size={16} />
            </button>
          </div>

          {!currentEmbed ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => { setInputValue(e.target.value); setError(false); }}
                  placeholder="Paste YouTube or Spotify URL"
                  className="w-full bg-white/5 border border-white/8 rounded-xl px-3 py-2.5 placeholder:text-white/20 text-white outline-none focus:border-white/20 text-sm pr-10 transition-colors"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[#7c3aed] hover:bg-[#6d28d9] text-white transition-colors cursor-pointer">
                  <CornerDownLeft size={14} />
                </button>
              </div>
              {error && <p className="text-xs text-red-400 pl-1">Please paste a valid YouTube or Spotify link</p>}
              <p className="text-[10px] text-white/25 pl-1">Supports YouTube videos/playlists and Spotify tracks</p>
            </form>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex justify-end">
                <button onClick={() => setMusicUrl('')} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/8 hover:bg-red-500/40 text-white/50 hover:text-white transition-colors text-xs font-medium cursor-pointer">
                  <Trash2 size={12} /> Clear
                </button>
              </div>
              <div className="w-full h-[260px] rounded-xl overflow-hidden border border-white/8 bg-black">
                <iframe src={currentEmbed.src} style={{ width: '100%', height: '100%' }} frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="Music Player" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
