import React, { useState, useEffect } from 'react';
import { useClock } from '../../hooks/useClock';

const quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "It's not about having time, it's about making time.", author: "Unknown" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Small daily improvements are the key to staggering long-term results.", author: "Unknown" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Nourishing yourself in a way that helps you blossom in the direction you want to go is attainable.", author: "Deborah Day" },
];

export const HomeMode = () => {
  const { getFormattedTime, getGreeting } = useClock();
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  return (
    <div className="flex flex-col items-center justify-center w-full select-none mode-transition">
      {/* Massive clock */}
      <h1 className="clock-display text-[5rem] md:text-[7rem] lg:text-[8rem] text-white mb-4">
        {getFormattedTime()}
      </h1>

      {/* Greeting */}
      <p className="text-lg md:text-xl font-medium text-white/70 mb-6 tracking-tight">
        {getGreeting()}
      </p>

      {/* Quote with author */}
      <div className="text-center max-w-lg px-4 anim-fade-in" style={{ animationDelay: '0.3s' }}>
        <p className="text-sm md:text-base text-white/50 italic leading-relaxed">
          "{quote.text}"
        </p>
        <p className="text-xs text-white/35 mt-2 font-medium">
          — {quote.author}
        </p>
      </div>
    </div>
  );
};
