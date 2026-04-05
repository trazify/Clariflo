import React from 'react';

export const GlassCard = ({ children, className = '' }) => {
  return (
    <div className={`backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-lg p-6 ${className}`}>
      {children}
    </div>
  );
};
