import React, { useEffect, useState } from 'react';
import { calculatePreciseAge, getYearProgress, getTotalUnits, formatTwoDigits } from '../utils/dateUtils';
import { AgeDuration } from '../types';

interface LiveTimerProps {
  birthDate: Date;
}

const LiveTimer: React.FC<LiveTimerProps> = ({ birthDate }) => {
  const [age, setAge] = useState<AgeDuration>(calculatePreciseAge(birthDate));
  const [progress, setProgress] = useState(0);
  const [totals, setTotals] = useState(getTotalUnits(birthDate));

  useEffect(() => {
    const update = () => {
      setAge(calculatePreciseAge(birthDate));
      setProgress(getYearProgress(birthDate));
      setTotals(getTotalUnits(birthDate));
    };
    
    update();
    const timer = setInterval(update, 50);

    return () => clearInterval(timer);
  }, [birthDate]);

  // Darker gradient for light mode visibility, keeping the same for dark mode
  const gradientStyle = {
    background: `conic-gradient(from 0deg, rgba(6, 182, 212, 0) 0%, rgba(6, 182, 212, 0.4) ${progress * 100}%, transparent ${progress * 100}%)`
  };

  return (
    // my-auto ensures it centers vertically if there is space, but scrolls if not.
    <div className="w-full max-w-xl lg:max-w-5xl landscape:max-w-5xl mx-auto fade-in flex flex-col lg:flex-row landscape:flex-row items-center justify-center lg:gap-12 landscape:gap-6 px-4 py-8 lg:py-4 my-auto">
      
      {/* 1. Gradient Sector Progress (Radar Style) */}
      {/* Reverted size restrictions as requested */}
      <div className="relative w-[60vmin] h-[60vmin] max-w-[320px] max-h-[320px] sm:max-w-[380px] sm:max-h-[380px] md:max-w-[420px] md:max-h-[420px] lg:max-w-[480px] lg:max-h-[480px] mb-6 lg:mb-0 landscape:mb-0 flex-shrink-0 flex items-center justify-center">
        {/* Background Circle container - Darker border in light mode */}
        <div className="absolute inset-0 rounded-full bg-slate-200/50 dark:bg-slate-900/30 border border-slate-300 dark:border-slate-800/50 backdrop-blur-sm" />
        
        {/* The Gradient Sweep */}
        <div 
          className="absolute inset-2 rounded-full transition-all duration-75 opacity-100"
          style={gradientStyle}
        />
        
        {/* Inner Content */}
        <div className="z-10 flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline text-slate-800 dark:text-slate-200 drop-shadow-sm dark:drop-shadow-md">
            {/* Reduced font sizes */}
            <span className="text-4xl sm:text-5xl lg:text-8xl font-bold font-mono tracking-tighter">{age.years}</span>
            <span className="text-lg sm:text-xl font-bold ml-1 text-slate-500 dark:text-slate-400">岁</span>
          </div>
          {/* Progress Pill - Darker text/border in light mode - Reduced text size */}
          <div className="mt-3 px-3 py-1 sm:px-4 sm:py-1.5 border border-slate-300 dark:border-slate-600/50 rounded-full bg-white/60 dark:bg-slate-900/60 backdrop-blur text-[10px] sm:text-xs text-slate-700 dark:text-slate-400 font-mono tracking-wider shadow-sm">
            进度 {(progress * 100).toFixed(6)}%
          </div>
        </div>
      </div>

      {/* Wrapper for Text and Grid - Stacks vertically on right side in landscape */}
      <div className="flex flex-col w-full lg:w-auto landscape:w-auto flex-1 max-w-xl justify-center">
        
        {/* 2. Precise Age Text (Compact Text Style) */}
        <div className="w-full text-center mb-6 landscape:mb-4 px-1 flex-shrink-0">
          <div className="flex flex-wrap justify-center items-baseline gap-x-2 sm:gap-x-4 text-slate-500 dark:text-slate-400 font-mono leading-none">
            <div className="whitespace-nowrap">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-2xl sm:text-3xl lg:text-4xl">{age.years}</span>
              <span className="text-sm sm:text-lg lg:text-xl ml-0.5 mr-1">年</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold text-2xl sm:text-3xl lg:text-4xl">{age.months}</span>
              <span className="text-sm sm:text-lg lg:text-xl ml-0.5 mr-1">月</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold text-2xl sm:text-3xl lg:text-4xl">{age.days}</span>
              <span className="text-sm sm:text-lg lg:text-xl ml-0.5 mr-1">天</span>
            </div>
            <div className="whitespace-nowrap mt-2 sm:mt-0">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-2xl sm:text-3xl lg:text-4xl">{formatTwoDigits(age.hours)}</span>
              <span className="text-sm sm:text-lg lg:text-xl ml-0.5 mr-1">时</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold text-2xl sm:text-3xl lg:text-4xl">{formatTwoDigits(age.minutes)}</span>
              <span className="text-sm sm:text-lg lg:text-xl ml-0.5 mr-1">分</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold text-2xl sm:text-3xl lg:text-4xl w-[1.8ch] inline-block text-center">{formatTwoDigits(age.seconds)}</span>
              <span className="text-sm sm:text-lg lg:text-xl ml-0.5">秒</span>
            </div>
          </div>
        </div>

        {/* 3. Life Total Conversion (Grid) */}
        <div className="w-full flex-grow-0">
          <h3 className="text-slate-500 dark:text-slate-500 text-xs font-bold mb-2 lg:mb-3 pl-1 flex items-center gap-2 uppercase tracking-widest">
            <span className="w-1 h-3 bg-cyan-500 rounded-full"></span>
            生命总值折算
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full">
            <TotalCard 
              label="总天数" 
              value={totals.days} 
              suffix="天" 
              decimals={5}
            />
            <TotalCard 
              label="总小时" 
              value={totals.hours} 
              suffix="时" 
              decimals={4}
            />
            <TotalCard 
              label="总分钟" 
              value={totals.minutes} 
              suffix="分" 
              decimals={2}
            />
            <TotalCard 
              label="总秒数" 
              value={totals.seconds} 
              suffix="秒"
              decimals={0}
              highlight
            />
          </div>
        </div>
      
      </div>

    </div>
  );
};

// Component for the Totals Card
// Designed to have equal heights and handle wrapping gracefully
const TotalCard: React.FC<{ 
  label: string; 
  value: number; 
  suffix: string; 
  decimals?: number;
  highlight?: boolean;
}> = ({ label, value, suffix, decimals = 0, highlight = false }) => {
  
  const valString = value.toFixed(decimals);
  const [intPart, decPart] = valString.split('.');
  
  return (
    <div className={`
      relative group overflow-hidden
      flex flex-col justify-between h-full
      p-2 sm:p-3 lg:p-5
      rounded-2xl border
      transition-all duration-300
      ${highlight 
        ? 'bg-slate-100 dark:bg-slate-900/60 border-blue-200 dark:border-blue-900/50' 
        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
      }
      hover:border-slate-300 dark:hover:border-slate-700
    `}>
      {/* Background glow for highlight */}
      {highlight && (
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      )}

      {/* Top Label */}
      <div className="mb-0.5 sm:mb-2">
        <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-500 font-bold tracking-wide">{label}</span>
      </div>
      
      {/* Number and Unit Wrapper */}
      {/* h-full allows the flex container to stretch if neighbors are taller */}
      <div className="flex flex-col flex-grow justify-center">
        
        {/* The Number: Responsive font size to avoid wrapping */}
        <div className={`font-mono font-medium leading-none tracking-tight ${highlight ? 'text-blue-600 dark:text-cyan-400' : 'text-slate-800 dark:text-slate-200'}`}>
          {/* Base size reduced to text-lg, scales up to text-3xl on larger screens */}
          <span className="text-lg sm:text-xl lg:text-3xl break-all">
            {parseInt(intPart).toLocaleString()}
          </span>
          {decimals > 0 && (
            <span className="text-xs sm:text-base lg:text-xl text-slate-400 dark:text-slate-500 font-mono ml-[1px]">
              .{decPart}
            </span>
          )}
        </div>

        {/* The Unit: Pushed to bottom right */}
        <div className="mt-auto self-end pt-0.5 sm:pt-2">
           <span className={`text-[10px] sm:text-sm font-bold ${highlight ? 'text-blue-400/70 dark:text-cyan-500/50' : 'text-slate-400 dark:text-slate-600'}`}>
             {suffix}
           </span>
        </div>

      </div>
    </div>
  );
};

export default LiveTimer;