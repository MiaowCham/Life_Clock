import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { calculatePreciseAge, getYearProgress, getTotalUnits, formatTwoDigits, isBirthdayToday, hasReachedBirthdayTime } from '../utils/dateUtils';
import { AgeDuration } from '../types';

interface LiveTimerProps {
  birthDate: Date;
}

const LiveTimer: React.FC<LiveTimerProps> = ({ birthDate }) => {
  const [age, setAge] = useState<AgeDuration>(calculatePreciseAge(birthDate));
  const [progress, setProgress] = useState(0);
  const [totals, setTotals] = useState(getTotalUnits(birthDate));
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [showBirthdayMessage, setShowBirthdayMessage] = useState(false);

  // Refs for confetti
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiInstance = useRef<any>(null);

  // Initialize confetti instance strictly bound to our canvas
  useEffect(() => {
    if (canvasRef.current && !confettiInstance.current) {
      confettiInstance.current = confetti.create(canvasRef.current, {
        resize: true,
        useWorker: true
      });
    }
    // Cleanup
    return () => {
      if (confettiInstance.current) {
        try {
          confettiInstance.current.reset();
        } catch(e) { 
          // Ignore reset errors during unmount
        }
      }
    };
  }, []);

  // Derived state for theming
  const isDateMatch = isBirthdayToday(birthDate);
  const isTimeMatch = hasReachedBirthdayTime(birthDate);
  const isBirthday = isDateMatch && isTimeMatch;

  // Trigger celebration
  const celebrateBirthday = () => {
    if (!confettiInstance.current) return;

    const duration = 3000;
    const end = Date.now() + duration;
    
    // Vibrant birthday colors - Expanded palette
    const colors = [
      '#ef4444', // Red-500
      '#ec4899', // Pink-500
      '#d946ef', // Fuchsia-500
      '#8b5cf6', // Violet-500
      '#6366f1', // Indigo-500
      '#3b82f6', // Blue-500
      '#06b6d4', // Cyan-500
      '#14b8a6', // Teal-500
      '#10b981', // Emerald-500
      '#84cc16', // Lime-500
      '#fbbf24', // Amber-400
      '#f97316', // Orange-500
    ];

    (function frame() {
      if (!confettiInstance.current) return;

      // Launch from left corner
      confettiInstance.current({
        particleCount: 1, 
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.9 },
        colors: colors,
        scalar: 0.8,
        drift: 0.5,
        ticks: 200
      });
      // Launch from right corner
      confettiInstance.current({
        particleCount: 1, 
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.9 },
        colors: colors,
        scalar: 0.8,
        drift: -0.5,
        ticks: 200
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  useEffect(() => {
    // Reset states if birthDate changes
    setHasCelebrated(false);
    setShowBirthdayMessage(false);
  }, [birthDate]);

  useEffect(() => {
    const update = () => {
      setAge(calculatePreciseAge(birthDate));
      setProgress(getYearProgress(birthDate));
      setTotals(getTotalUnits(birthDate));
      
      const strictBirthdayNow = isBirthdayToday(birthDate) && hasReachedBirthdayTime(birthDate);

      if (strictBirthdayNow) {
        setHasCelebrated((prev) => {
          if (!prev) {
            // Trigger effects
            celebrateBirthday();
            setShowBirthdayMessage(true);
            
            // Fade out message after 10 seconds
            setTimeout(() => {
              setShowBirthdayMessage(false);
            }, 10000);
            
            return true;
          }
          return prev;
        });
      }
    };
    
    update();
    const timer = setInterval(update, 50);

    return () => clearInterval(timer);
  }, [birthDate]);

  const themeColors = {
    ringGradient: isBirthday
      ? `conic-gradient(from 0deg, rgba(245, 158, 11, 0) 0%, rgba(245, 158, 11, 1) ${progress * 100}%, transparent ${progress * 100}%)`
      : `conic-gradient(from 0deg, rgba(6, 182, 212, 0) 0%, rgba(6, 182, 212, 0.4) ${progress * 100}%, transparent ${progress * 100}%)`,
    textPrimary: isBirthday ? 'text-amber-500 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400',
    textLabel: isBirthday ? 'text-amber-600/70 dark:text-amber-500/70' : 'text-slate-500 dark:text-slate-400',
  };

  return (
    <div className="w-full max-w-xl lg:max-w-5xl landscape:max-w-5xl mx-auto fade-in flex flex-col lg:flex-row landscape:flex-row items-center justify-center lg:gap-12 landscape:gap-6 px-4 py-8 lg:py-4 my-auto relative">
      
      {/* Explicit Canvas for Confetti to avoid DOM errors */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      />

      {/* 1. Gradient Sector Progress (Radar Style) */}
      <div className="relative w-[60vmin] h-[60vmin] max-w-[320px] max-h-[320px] sm:max-w-[380px] sm:max-h-[380px] md:max-w-[420px] md:max-h-[420px] lg:max-w-[480px] lg:max-h-[480px] mb-6 lg:mb-0 landscape:mb-0 flex-shrink-0 flex items-center justify-center">
        {/* Background Circle container */}
        <div className={`absolute inset-0 rounded-full border backdrop-blur-sm transition-colors duration-1000 ${isBirthday ? 'bg-amber-100/30 dark:bg-amber-900/10 border-amber-300 dark:border-amber-700/50' : 'bg-slate-200/50 dark:bg-slate-900/30 border-slate-300 dark:border-slate-800/50'}`} />
        
        {/* The Gradient Sweep */}
        <div 
          className="absolute inset-2 rounded-full transition-all duration-300 opacity-100"
          style={{ background: themeColors.ringGradient }}
        />
        
        {/* Inner Content */}
        <div className="z-10 flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline text-slate-800 dark:text-slate-200 drop-shadow-sm dark:drop-shadow-md">
            <span className={`text-4xl sm:text-5xl lg:text-8xl font-bold font-mono tracking-tighter ${isBirthday ? 'text-amber-600 dark:text-amber-300' : ''}`}>{age.years}</span>
            <span className={`text-lg sm:text-xl font-bold ml-1 ${themeColors.textLabel}`}>岁</span>
          </div>
          {/* Progress Pill */}
          <div className={`mt-3 px-3 py-1 sm:px-4 sm:py-1.5 border rounded-full backdrop-blur text-[10px] sm:text-xs font-mono tracking-wider shadow-sm transition-all duration-500 ${isBirthday ? 'bg-amber-100/80 dark:bg-amber-900/60 border-amber-300 dark:border-amber-700' : 'border-slate-300 dark:border-slate-600/50 bg-white/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-400'}`}>
            {showBirthdayMessage ? (
              <span className="text-pink-500 font-bold animate-pulse">🎂 生日快乐! 🎉</span>
            ) : (
              <span className={isBirthday ? 'text-amber-700 dark:text-amber-300 font-bold' : ''}>
                {isBirthday ? '新的一岁 ' : '进度 '}{(progress * 100).toFixed(6)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Wrapper for Text and Grid */}
      <div className="flex flex-col w-full lg:w-auto landscape:w-auto flex-1 max-w-xl justify-center">
        
        {/* Header Text */}
        <div className={`text-center mb-2 lg:mb-4 text-sm sm:text-base font-medium tracking-widest uppercase ${themeColors.textLabel} opacity-80`}>
          您已经生活了
        </div>

        {/* 2. Precise Age Text */}
        <div className="w-full text-center mb-6 landscape:mb-4 px-1 flex-shrink-0">
          <div className={`flex flex-wrap justify-center items-baseline gap-x-2 sm:gap-x-4 font-mono leading-none ${isBirthday ? 'text-amber-800/70 dark:text-amber-200/70' : 'text-slate-500 dark:text-slate-400'}`}>
            <div className="whitespace-nowrap">
              <span className={`font-bold text-2xl sm:text-3xl lg:text-4xl ${themeColors.textPrimary}`}>{age.years}</span>
              <span className="text-sm sm:text-lg lg:text-xl ml-0.5 mr-1">年</span>
              <span className={`font-bold text-2xl sm:text-3xl lg:text-4xl ${themeColors.textPrimary}`}>{age.months}</span>
              <span className="text-sm sm:text-lg lg:text-xl ml-0.5 mr-1">月</span>
              <span className={`font-bold text-2xl sm:text-3xl lg:text-4xl ${themeColors.textPrimary}`}>{age.days}</span>
              <span className="text-sm sm:text-lg lg:text-xl ml-0.5 mr-1">天</span>
            </div>
            <div className="whitespace-nowrap mt-2 sm:mt-0">
              <span className={`font-bold text-2xl sm:text-3xl lg:text-4xl ${themeColors.textPrimary}`}>{formatTwoDigits(age.hours)}</span>
              <span className="text-sm sm:text-lg lg:text-xl ml-0.5 mr-1">时</span>
              <span className={`font-bold text-2xl sm:text-3xl lg:text-4xl ${themeColors.textPrimary}`}>{formatTwoDigits(age.minutes)}</span>
              <span className="text-sm sm:text-lg lg:text-xl ml-0.5 mr-1">分</span>
              <span className={`font-bold text-2xl sm:text-3xl lg:text-4xl w-[1.8ch] inline-block text-center ${themeColors.textPrimary}`}>{formatTwoDigits(age.seconds)}</span>
              <span className="text-sm sm:text-lg lg:text-xl ml-0.5">秒</span>
            </div>
          </div>
        </div>

        {/* 3. Life Total Conversion (Grid) */}
        <div className="w-full flex-grow-0">
          <h3 className={`text-xs font-bold mb-2 lg:mb-3 pl-1 flex items-center gap-2 uppercase tracking-widest ${isBirthday ? 'text-amber-600 dark:text-amber-500' : 'text-slate-500 dark:text-slate-500'}`}>
            <span className={`w-1 h-3 rounded-full ${isBirthday ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'bg-cyan-500'}`}></span>
            生命总值折算
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full">
            <TotalCard 
              label="总天数" 
              value={totals.days} 
              suffix="天" 
              decimals={5}
              isBirthday={isBirthday}
            />
            <TotalCard 
              label="总小时" 
              value={totals.hours} 
              suffix="时" 
              decimals={4}
              isBirthday={isBirthday}
            />
            <TotalCard 
              label="总分钟" 
              value={totals.minutes} 
              suffix="分" 
              decimals={2}
              isBirthday={isBirthday}
            />
            <TotalCard 
              label="总秒数" 
              value={totals.seconds} 
              suffix="秒"
              decimals={0}
              highlight
              isBirthday={isBirthday}
            />
          </div>
        </div>
      
      </div>

    </div>
  );
};

// Component for the Totals Card (Unchanged but included for context)
const TotalCard: React.FC<{ 
  label: string; 
  value: number; 
  suffix: string; 
  decimals?: number;
  highlight?: boolean;
  isBirthday?: boolean;
}> = ({ label, value, suffix, decimals = 0, highlight = false, isBirthday = false }) => {
  
  const valString = value.toFixed(decimals);
  const [intPart, decPart] = valString.split('.');
  
  // Dynamic styles based on birthday/highlight
  let bgClass = isBirthday 
    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700/50 hover:border-amber-400 dark:hover:border-amber-500' 
    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700';

  if (highlight) {
    bgClass = isBirthday
      ? 'bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-600/60'
      : 'bg-slate-100 dark:bg-slate-900/60 border-blue-200 dark:border-blue-900/50';
  }

  const textClass = isBirthday
    ? (highlight ? 'text-amber-600 dark:text-amber-300' : 'text-slate-800 dark:text-amber-100')
    : (highlight ? 'text-blue-600 dark:text-cyan-400' : 'text-slate-800 dark:text-slate-200');

  const labelClass = isBirthday
    ? 'text-amber-800/60 dark:text-amber-200/60'
    : 'text-slate-500 dark:text-slate-500';

  const suffixClass = isBirthday
    ? (highlight ? 'text-amber-500/70 dark:text-amber-400/70' : 'text-amber-400 dark:text-amber-600')
    : (highlight ? 'text-blue-400/70 dark:text-cyan-500/50' : 'text-slate-400 dark:text-slate-600');

  return (
    <div className={`
      relative group overflow-hidden
      flex flex-col justify-between h-full
      p-2 sm:p-3 lg:p-5
      rounded-2xl border
      transition-all duration-300
      ${bgClass}
    `}>
      {/* Background glow for highlight */}
      {highlight && (
        <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl pointer-events-none ${isBirthday ? 'bg-amber-400/20 dark:bg-amber-500/20' : 'bg-cyan-400/10 dark:bg-cyan-500/10'}`}></div>
      )}

      {/* Top Label */}
      <div className="mb-0.5 sm:mb-2">
        <span className={`text-[10px] sm:text-xs font-bold tracking-wide ${labelClass}`}>{label}</span>
      </div>
      
      {/* Number and Unit Wrapper */}
      <div className="flex flex-col flex-grow justify-center">
        
        {/* The Number */}
        <div className={`font-mono font-medium leading-none tracking-tight ${textClass}`}>
          <span className="text-lg sm:text-xl lg:text-3xl break-all">
            {parseInt(intPart).toLocaleString()}
          </span>
          {decimals > 0 && (
            <span className={`text-xs sm:text-base lg:text-xl font-mono ml-[1px] ${isBirthday ? 'text-amber-400 dark:text-amber-500/70' : 'text-slate-400 dark:text-slate-500'}`}>
              .{decPart}
            </span>
          )}
        </div>

        {/* The Unit */}
        <div className="mt-auto self-end pt-0.5 sm:pt-2">
           <span className={`text-[10px] sm:text-sm font-bold ${suffixClass}`}>
             {suffix}
           </span>
        </div>

      </div>
    </div>
  );
};

export default LiveTimer;