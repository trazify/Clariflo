import React from 'react';
import { Timer } from '../ui/Timer';
import { AmbientVisualizer } from '../ui/AmbientVisualizer';

export const AmbientMode = () => {
  return (
    <div className="relative w-full h-full flex justify-end items-start">
      <AmbientVisualizer />
      <div className="relative z-25">
        <Timer compact={true} />
      </div>
    </div>
  );
};
