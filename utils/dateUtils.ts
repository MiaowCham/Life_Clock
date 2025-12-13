import { AgeDuration } from '../types';

/**
 * Calculates the precise age breakdown.
 */
export const calculatePreciseAge = (birthDate: Date): AgeDuration => {
  const now = new Date();
  
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();
  let hours = now.getHours() - birthDate.getHours();
  let minutes = now.getMinutes() - birthDate.getMinutes();
  let seconds = now.getSeconds() - birthDate.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes--;
  }
  if (minutes < 0) {
    minutes += 60;
    hours--;
  }
  if (hours < 0) {
    hours += 24;
    days--;
  }
  if (days < 0) {
    const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += previousMonth.getDate();
    months--;
  }
  if (months < 0) {
    months += 12;
    years--;
  }

  const totalSeconds = Math.floor((now.getTime() - birthDate.getTime()) / 1000);

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    totalSeconds
  };
};

/**
 * Calculates the progress (0-1) of the current age year.
 */
export const getYearProgress = (birthDate: Date): number => {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  // Construct birth date for current year
  let lastBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate(), birthDate.getHours(), birthDate.getMinutes(), birthDate.getSeconds());
  let nextBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate(), birthDate.getHours(), birthDate.getMinutes(), birthDate.getSeconds());

  // If we haven't reached this year's birthday yet, then last birthday was last year
  if (now < lastBirthday) {
    nextBirthday = lastBirthday;
    lastBirthday = new Date(currentYear - 1, birthDate.getMonth(), birthDate.getDate(), birthDate.getHours(), birthDate.getMinutes(), birthDate.getSeconds());
  }

  const totalDuration = nextBirthday.getTime() - lastBirthday.getTime();
  const elapsed = now.getTime() - lastBirthday.getTime();

  return Math.min(1, Math.max(0, elapsed / totalDuration));
};

export const getTotalUnits = (birthDate: Date) => {
  const now = new Date();
  const diff = now.getTime() - birthDate.getTime();
  
  // Constants
  const MS_PER_SECOND = 1000;
  const MS_PER_MINUTE = MS_PER_SECOND * 60;
  const MS_PER_HOUR = MS_PER_MINUTE * 60;
  const MS_PER_DAY = MS_PER_HOUR * 24;

  return {
    days: diff / MS_PER_DAY,
    hours: diff / MS_PER_HOUR,
    minutes: diff / MS_PER_MINUTE,
    seconds: Math.floor(diff / MS_PER_SECOND),
  };
};

export const formatTwoDigits = (num: number): string => {
  return num.toString().padStart(2, '0');
};

export const formatDateForDisplay = (date: Date): string => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};