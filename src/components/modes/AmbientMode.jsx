import React from 'react';
import { Timer } from '../ui/Timer';

export const AmbientMode = () => {
  return (
    <div className="w-full h-full flex justify-end items-start">
      <Timer compact={true} />
    </div>
  );
};
