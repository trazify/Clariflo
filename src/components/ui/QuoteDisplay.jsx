import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { quotes } from '../../data/quotes';

export const QuoteDisplay = ({ compact = false }) => {
  const quoteCategory = useAppStore(state => state.quoteCategory);
  const [currentQuote, setCurrentQuote] = useState(null);

  const getRandomQuote = () => {
    let pool = quotes;
    if (quoteCategory !== 'all') {
      pool = quotes.filter(q => q.category === quoteCategory);
      if (pool.length === 0) pool = quotes;
    }
    const randomIndex = Math.floor(Math.random() * pool.length);
    setCurrentQuote(pool[randomIndex]);
  };

  useEffect(() => {
    getRandomQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteCategory]);

  if (!currentQuote) return null;

  return (
    <div className={`flex flex-col group relative ${compact ? 'items-end text-right' : 'items-center text-center'}`}>
      <p className={`font-medium text-white/90 ${compact ? 'text-sm italic' : 'text-lg md:text-xl leading-relaxed'}`}>
        "{currentQuote.text}"
      </p>
      <p className={`text-white/60 mt-1 ${compact ? 'text-xs' : 'text-sm mt-3'}`}>
        — {currentQuote.author}
      </p>
      
      {!compact && (
        <button 
          onClick={getRandomQuote}
          className="mt-6 p-2 rounded-full bg-white/5 hover:bg-white/20 text-white/50 hover:text-white transition-all opacity-0 group-hover:opacity-100"
          title="New Quote"
        >
          <RefreshCw size={18} />
        </button>
      )}
    </div>
  );
};
