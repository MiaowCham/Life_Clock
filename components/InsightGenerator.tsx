import React, { useEffect, useState } from 'react';
import { generateBirthdayInsights } from '../services/geminiService';
import { AIInsightData } from '../types';
import { calculatePreciseAge } from '../utils/dateUtils';

interface InsightGeneratorProps {
  birthDate: Date;
}

const InsightGenerator: React.FC<InsightGeneratorProps> = ({ birthDate }) => {
  const [insights, setInsights] = useState<AIInsightData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    setError(false);
    try {
      const currentAge = calculatePreciseAge(birthDate).years;
      const data = await generateBirthdayInsights(birthDate, currentAge);
      setInsights(data);
      setFetched(true);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (!fetched && !loading) {
    return (
      <div className="flex justify-center mt-12 fade-in">
        <button
          onClick={fetchInsights}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-full border border-indigo-500/30 transition-all duration-300 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="font-semibold">Reveal Birth Date Insights</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mt-12 w-full max-w-4xl mx-auto px-4 pb-20">
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-slate-800/50 rounded-xl border border-slate-700/50"></div>
          ))}
        </div>
      )}

      {!loading && !error && insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-in">
          {insights.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 p-6 rounded-xl hover:border-indigo-500/50 transition-colors duration-300"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded bg-indigo-900/50 text-indigo-300 border border-indigo-500/20">
                  {item.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2 font-mono">
                {item.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InsightGenerator;