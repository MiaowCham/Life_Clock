import React from 'react';

interface TimeCardProps {
  value: number;
  label: string;
  highlight?: boolean;
}

const TimeCard: React.FC<TimeCardProps> = ({ value, label, highlight = false }) => {
  return (
    <div className="flex flex-col items-center">
      <div 
        className={`
          relative w-20 h-24 sm:w-24 sm:h-32 md:w-28 md:h-36 
          flex items-center justify-center 
          rounded-xl border border-slate-700/50 
          ${highlight ? 'bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border-indigo-500/30' : 'bg-slate-900/50'}
          backdrop-blur-md shadow-xl transition-all duration-300
        `}
      >
        <span className={`text-4xl sm:text-5xl md:text-6xl font-mono font-bold ${highlight ? 'text-indigo-400' : 'text-slate-200'}`}>
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="mt-3 text-xs sm:text-sm uppercase tracking-widest text-slate-500 font-medium">
        {label}
      </span>
    </div>
  );
};

export default TimeCard;