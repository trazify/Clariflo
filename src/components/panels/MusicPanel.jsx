import React, { useState } from 'react';
import { CornerDownLeft, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const MusicPanel = () => {
  const { activePanel, musicUrl, setMusicUrl } = useAppStore();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(false);
  const isOpen = activePanel === 'music';

  const getEmbedInfo = (url) => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('spotify.com')) {
        return { type: 'spotify', src: `https://open.spotify.com/embed${urlObj.pathname}` };
      }
      if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.has('list')) {
        return { type: 'youtube', src: `https://www.youtube.com/embed/videoseries?list=${urlObj.searchParams.get('list')}&autoplay=1` };
      }
      if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.has('v')) {
        return { type: 'youtube', src: `https://www.youtube.com/embed/${urlObj.searchParams.get('v')}?autoplay=1` };
      }
      if (urlObj.hostname.includes('youtu.be')) {
        return { type: 'youtube', src: `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}?autoplay=1` };
      }
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
    <div className="fixed bottom-20 left-5 z-50 w-[420px] animate-slide-up">
      <div className="glass-panel p-5 shadow-2xl">
        <h2 className="text-base font-bold text-white mb-4">My Music</h2>

        {!currentEmbed ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => { setInputValue(e.target.value); setError(false); }}
                placeholder="Paste YouTube or Spotify URL"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 placeholder:text-white/30 text-white outline-none focus:border-accent/50 text-sm pr-12 transition-colors"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-accent hover:bg-accent-dark text-white transition-colors">
                <CornerDownLeft size={16} />
              </button>
            </div>
            {error && <p className="text-xs text-red-400 pl-1">Please paste a valid YouTube or Spotify link</p>}
            <p className="text-xs text-white/30 pl-1">Supports YouTube videos/playlists and Spotify tracks/albums</p>
          </form>
        ) : (
          <div className="flex flex-col gap-3 animate-fade-in">
            <div className="flex justify-end">
              <button onClick={() => setMusicUrl('')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-red-500/50 text-white/70 hover:text-white transition-colors text-xs font-medium">
                <Trash2 size={13} /> Clear
              </button>
            </div>
            <div className="w-full h-[300px] rounded-xl overflow-hidden border border-white/10 bg-black">
              <iframe src={currentEmbed.src} style={{ width: '100%', height: '100%' }} frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="Music Player" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
