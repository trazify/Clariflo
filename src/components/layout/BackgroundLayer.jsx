import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { themes } from '../../data/themes';

export const BackgroundLayer = () => {
  const activeThemeId = useAppStore(state => state.activeTheme);
  const activeTheme = themes.find(t => t.id === activeThemeId) || themes[0];

  const [layerA, setLayerA] = useState({ url: activeTheme.type === 'image' ? activeTheme.url : null, gradient: activeTheme.type === 'gradient' ? activeTheme.value : null, opacity: 1 });
  const [layerB, setLayerB] = useState({ url: null, gradient: null, opacity: 0 });
  const [activeLayer, setActiveLayer] = useState('a');

  useEffect(() => {
    const isGradient = activeTheme.type === 'gradient';
    const newUrl = isGradient ? null : activeTheme.url;
    const newGradient = isGradient ? activeTheme.value : null;
    const newKey = newUrl || newGradient;

    const currentKey = activeLayer === 'a' ? (layerA.url || layerA.gradient) : (layerB.url || layerB.gradient);

    if (newKey !== currentKey) {
      if (activeLayer === 'a') {
        setLayerB({ url: newUrl, gradient: newGradient, opacity: 0 });
        setTimeout(() => {
          setLayerB({ url: newUrl, gradient: newGradient, opacity: 1 });
          setLayerA(prev => ({ ...prev, opacity: 0 }));
          setActiveLayer('b');
        }, 50);
      } else {
        setLayerA({ url: newUrl, gradient: newGradient, opacity: 0 });
        setTimeout(() => {
          setLayerA({ url: newUrl, gradient: newGradient, opacity: 1 });
          setLayerB(prev => ({ ...prev, opacity: 0 }));
          setActiveLayer('a');
        }, 50);
      }
    }
  }, [activeTheme]);

  const renderLayer = (layer, z) => {
    if (layer.gradient) {
      return (
        <div
          className="absolute inset-0"
          style={{
            background: layer.gradient,
            opacity: layer.opacity,
            transition: 'opacity 800ms ease-in-out',
            zIndex: z
          }}
        />
      );
    }
    if (layer.url) {
      return (
        <img
          src={layer.url}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: layer.opacity, transition: 'opacity 800ms ease-in-out', zIndex: z }}
        />
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 bg-neutral-900" />
      {renderLayer(layerA, 1)}
      {renderLayer(layerB, 2)}
      {/* Subtle dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/10" style={{ zIndex: 3 }} />
    </div>
  );
};
