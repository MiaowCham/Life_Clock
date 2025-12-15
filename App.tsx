import React, { useState, useEffect } from 'react';
import DateSelector from './components/DateSelector';
import LiveTimer from './components/LiveTimer';
import { BirthDetails } from './types';

const App: React.FC = () => {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  
  // Initialize theme based on precedence: URI -> LocalStorage -> System -> Default (Light)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      // 1. URI Parameter
      const params = new URLSearchParams(window.location.search);
      const themeParam = params.get('theme');
      if (themeParam === 'dark') return true;
      if (themeParam === 'light') return false;

      // 2. Local Storage
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') return true;
      if (savedTheme === 'light') return false;

      // 3. System Preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return true;
      }
    }
    // 4. Default to Light
    return false;
  });

  // Load birth date from local storage on mount
  useEffect(() => {
    const savedDate = localStorage.getItem('birthDate');
    if (savedDate) {
      const date = new Date(savedDate);
      if (!isNaN(date.getTime())) {
        setBirthDate(date);
      }
    }
  }, []);

  // Listen for system theme changes if no manual override exists
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const params = new URLSearchParams(window.location.search);
      // Only auto-switch if no user preference is stored and no URI param
      if (!localStorage.getItem('theme') && !params.has('theme')) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
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
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
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

            <a 
              href="https://github.com/MiaowCham/Life_Clock" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              title="GitHub Repository"
            >
               <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current">
                   <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
               </svg>
            </a>

            {birthDate && (
               <button 
                 onClick={handleReset}
                 className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                 title="重新设定"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                 </svg>
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
        
        {/* Footer */}
        <footer className="w-full py-3 text-center z-20 shrink-0 relative">
          <p className="text-[10px] text-slate-400/40 dark:text-slate-600/40 font-mono tracking-widest uppercase">
            ✦ Powered by Gemini
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;