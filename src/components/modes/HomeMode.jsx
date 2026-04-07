import React from 'react';
import { useClock } from '../../hooks/useClock';

export const HomeMode = () => {
  const { getFormattedTime, getGreeting } = useClock();

  return (
    <div className="flex flex-col items-center justify-center w-full select-none mode-enter">
      {/* Greeting ABOVE clock — Flocus style */}
      <p className="text-xl md:text-2xl font-semibold text-white/80 mb-6 text-center leading-snug tracking-tight">
        {getGreeting()}
      </p>

      {/* Massive clock */}
      <h1 className="clock-display text-[7rem] md:text-[10rem] lg:text-[13rem] text-white">
        {getFormattedTime()}
      </h1>
    </div>
  );
};
