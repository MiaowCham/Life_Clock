import React, { useState } from 'react';
import { BirthDetails } from '../types';

interface DateSelectorProps {
  onStart: (details: BirthDetails) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ onStart }) => {
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('00:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && time) {
      onStart({ date, time });
    }
  };

  return (
    <div className="w-full max-w-md p-5 sm:p-8 landscape:p-4 bg-white dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl dark:shadow-2xl fade-in transition-all duration-300">
      <div className="text-center mb-5 sm:mb-8 landscape:mb-3">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent mb-1 sm:mb-2">
          生命时钟
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">精确到秒的年龄计算</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 landscape:space-y-2">
        <div>
          <label className="block text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 dark:text-slate-500 font-semibold mb-1 sm:mb-2">
            出生日期
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 dark:text-slate-500 font-semibold mb-1 sm:mb-2">
            出生时间
          </label>
          <input
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={!date || !time}
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20 transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2 sm:mt-4 landscape:mt-2"
        >
          开始计时
        </button>
      </form>
    </div>
  );
};

export default DateSelector;