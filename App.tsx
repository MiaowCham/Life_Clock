import React, { useState, useEffect } from 'react';
import DateSelector from './components/DateSelector';
import LiveTimer from './components/LiveTimer';
import { BirthDetails } from './types';

const App: React.FC = () => {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  // Default to dark mode
  const [isDark, setIsDark] = useState(true);

  // Load from local storage on mount
  useEffect(() => {
    const savedDate = localStorage.getItem('birthDate');
    if (savedDate) {
      const date = new Date(savedDate);
      if (!isNaN(date.getTime())) {
        setBirthDate(date);
      }
    }
  }, []);

  const handleStart = (details: BirthDetails) => {
    // Create date object from local date string and time string
    const combined = new Date(`${details.date}T${details.time}:00`);
    setBirthDate(combined);
    localStorage.setItem('birthDate', combined.toISOString());
  };

  const handleReset = () => {
    setBirthDate(null);
    localStorage.removeItem('birthDate');
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`${isDark ? 'dark' : ''} h-screen w-screen overflow-hidden flex flex-col`}>
      <div className="flex-1 w-full bg-white dark:bg-black transition-colors duration-300 relative flex flex-col">
        
        {/* Background Decor - Subtle for both themes */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/5 dark:bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

        <header className="w-full p-4 flex justify-between items-center z-20 max-w-7xl mx-auto shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-slate-700 dark:text-slate-300 font-bold text-lg tracking-wide">生命时钟</span>
          </div>
          
          <div className="flex items-center gap-3">
             <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              title={isDark ? "切换亮色模式" : "切换暗色模式"}
             >
               {isDark ? (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                 </svg>
               ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                 </svg>
               )}
             </button>

            {birthDate && (
               <button 
                 onClick={handleReset}
                 className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-transparent"
               >
                 重新设定
               </button>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full relative z-10 overflow-y-auto scroll-smooth">
           {/* 
              min-h-full ensures the container takes at least the full height of the scrollable area.
              flex + justify-center vertically centers the content when it's smaller than the viewport.
              If content grows larger, it naturally extends and scrolling works.
           */}
          <div className="min-h-full w-full flex flex-col items-center justify-center p-4">
            {!birthDate ? (
              <DateSelector onStart={handleStart} />
            ) : (
              <LiveTimer birthDate={birthDate} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;