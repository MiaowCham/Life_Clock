export interface AgeDuration {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

export interface BirthDetails {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
}

export interface AIInsightData {
  title: string;
  content: string;
  category: 'historical' | 'celestial' | 'milestone' | 'fun-fact';
}