import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { themes } from '../../data/themes';
import { AnimatedScene } from './AnimatedScene';

function themeToLayer(theme, opacity) {
  return {
    type: theme?.type || null,
    url: theme?.type === 'image' || theme?.type === 'video' ? theme.url : null,
    poster: theme?.poster || null,
    gradient: theme?.type === 'gradient' ? theme.value : null,
    sceneId: theme?.type === 'animated' ? theme.id : null,
    opacity,
  };
}

function layerKey(layer) {
  return layer.url || layer.gradient || layer.sceneId || null;
}

export const BackgroundLayer = () => {
  const activeThemeId = useAppStore(state => state.activeTheme);
  const activeTheme = themes.find(t => t.id === activeThemeId) || themes[0];

  const [layerA, setLayerA] = useState(() => themeToLayer(activeTheme, 1));
  const [layerB, setLayerB] = useState(() => ({ type: null, url: null, poster: null, gradient: null, sceneId: null, opacity: 0 }));
  const [activeLayer, setActiveLayer] = useState('a');

  useEffect(() => {
    const newLayer = themeToLayer(activeTheme, 0);
    const newKey = layerKey(newLayer);
    const currentKey = activeLayer === 'a' ? layerKey(layerA) : layerKey(layerB);

    if (newKey !== currentKey) {
      if (activeLayer === 'a') {
        setLayerB({ ...newLayer, opacity: 0 });
        setTimeout(() => {
          setLayerB(prev => ({ ...prev, opacity: 1 }));
          setLayerA(prev => ({ ...prev, opacity: 0 }));
          setActiveLayer('b');
        }, 50);
      } else {
        setLayerA({ ...newLayer, opacity: 0 });
        setTimeout(() => {
          setLayerA(prev => ({ ...prev, opacity: 1 }));
          setLayerB(prev => ({ ...prev, opacity: 0 }));
          setActiveLayer('a');
        }, 50);
      }
    }
  }, [activeTheme]);

  const renderLayer = (layer, z) => {
    const baseStyle = {
      position: 'absolute',
      inset: 0,
      opacity: layer.opacity,
      transition: 'opacity 800ms ease-in-out',
      zIndex: z,
    };

    if (layer.gradient) {
      return (
        <div style={{ ...baseStyle, background: layer.gradient }} />
      );
    }

    if (layer.type === 'animated' && layer.sceneId) {
      return (
        <div style={baseStyle}>
          <AnimatedScene sceneId={layer.sceneId} />
        </div>
      );
    }

    if (layer.type === 'video' && layer.url) {
      return (
        <video
          key={layer.url}
          src={layer.url}
          poster={layer.poster}
          autoPlay
          loop
          muted
          playsInline
          style={{ ...baseStyle, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      );
    }

    if (layer.url) {
      return (
        <img
          src={layer.url}
          alt=""
          style={{ ...baseStyle, width: '100%', height: '100%', objectFit: 'cover' }}
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
      <div className="absolute inset-0 bg-black/20" style={{ zIndex: 3 }} />
    </div>
  );
};
