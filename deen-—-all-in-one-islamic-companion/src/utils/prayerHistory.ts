import { DailyPrayerTracker, PrayerName } from '../types';

export interface DayPrayerStat {
  date: string; // YYYY-MM-DD
  displayDate: string; // "Nov 1"
  dayOfWeek: string; // "Fri"
  timestamp: number;
  completedCount: number; // 0 - 5
  jamaahCount: number;
  individualCount: number;
  missedCount: number;
  noneCount: number;
  fasted: boolean;
  prayers: Record<PrayerName, 'completed' | 'jamaah' | 'missed' | 'none'>;
  notes?: string;
}

export interface PrayerHistorySummary {
  days: DayPrayerStat[];
  totalPrayersRequired: number; // 30 * 5 = 150
  totalCompleted: number;
  totalJamaah: number;
  totalMissed: number;
  overallPercentage: number;
  jamaahPercentage: number;
  currentStreak: number;
  bestStreak: number;
  prayerBreakdown: Record<PrayerName, { completed: number; jamaah: number; missed: number; rate: number }>;
}

const PRAYER_NAMES: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

/**
 * Builds an array of exactly 30 consecutive days ending on the provided date or today.
 */
export function getLast30DaysPrayerStats(
  trackerData: Record<string, DailyPrayerTracker>,
  referenceDate: Date = new Date()
): PrayerHistorySummary {
  const days: DayPrayerStat[] = [];
  const ref = new Date(referenceDate);

  // Collect last 30 days in ascending chronological order (day 29 ago -> today)
  for (let i = 29; i >= 0; i--) {
    const d = new Date(ref);
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dayNum = String(d.getDate()).padStart(2, '0');
    const dateKey = `${y}-${m}-${dayNum}`;

    const existing = trackerData[dateKey];
    const prayers: Record<PrayerName, 'completed' | 'jamaah' | 'missed' | 'none'> = {
      fajr: existing?.prayers?.fajr || 'none',
      sunrise: 'none',
      dhuhr: existing?.prayers?.dhuhr || 'none',
      asr: existing?.prayers?.asr || 'none',
      maghrib: existing?.prayers?.maghrib || 'none',
      isha: existing?.prayers?.isha || 'none',
    };

    let completedCount = 0;
    let jamaahCount = 0;
    let individualCount = 0;
    let missedCount = 0;
    let noneCount = 0;

    PRAYER_NAMES.forEach((p) => {
      const status = prayers[p];
      if (status === 'jamaah') {
        jamaahCount++;
        completedCount++;
      } else if (status === 'completed') {
        individualCount++;
        completedCount++;
      } else if (status === 'missed') {
        missedCount++;
      } else {
        noneCount++;
      }
    });

    const displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' });

    days.push({
      date: dateKey,
      displayDate,
      dayOfWeek,
      timestamp: d.getTime(),
      completedCount,
      jamaahCount,
      individualCount,
      missedCount,
      noneCount,
      fasted: !!existing?.fasted,
      prayers,
      notes: existing?.notes,
    });
  }

  // Calculate aggregates
  const totalPrayersRequired = days.length * 5;
  const totalCompleted = days.reduce((sum, d) => sum + d.completedCount, 0);
  const totalJamaah = days.reduce((sum, d) => sum + d.jamaahCount, 0);
  const totalMissed = days.reduce((sum, d) => sum + d.missedCount, 0);
  const overallPercentage = totalPrayersRequired > 0 ? Math.round((totalCompleted / totalPrayersRequired) * 100) : 0;
  const jamaahPercentage = totalCompleted > 0 ? Math.round((totalJamaah / totalCompleted) * 100) : 0;

  // Streaks (days with 5/5 completed)
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  // For current streak, check backwards from today
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].completedCount >= 5) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Best streak
  for (const day of days) {
    if (day.completedCount >= 5) {
      tempStreak++;
      if (tempStreak > bestStreak) bestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  }

  // Prayer by prayer breakdown
  const prayerBreakdown: Record<PrayerName, { completed: number; jamaah: number; missed: number; rate: number }> = {
    fajr: { completed: 0, jamaah: 0, missed: 0, rate: 0 },
    sunrise: { completed: 0, jamaah: 0, missed: 0, rate: 0 },
    dhuhr: { completed: 0, jamaah: 0, missed: 0, rate: 0 },
    asr: { completed: 0, jamaah: 0, missed: 0, rate: 0 },
    maghrib: { completed: 0, jamaah: 0, missed: 0, rate: 0 },
    isha: { completed: 0, jamaah: 0, missed: 0, rate: 0 },
  };

  PRAYER_NAMES.forEach((p) => {
    let completed = 0;
    let jamaah = 0;
    let missed = 0;
    days.forEach((d) => {
      const s = d.prayers[p];
      if (s === 'jamaah') {
        jamaah++;
        completed++;
      } else if (s === 'completed') {
        completed++;
      } else if (s === 'missed') {
        missed++;
      }
    });
    prayerBreakdown[p] = {
      completed,
      jamaah,
      missed,
      rate: days.length > 0 ? Math.round((completed / days.length) * 100) : 0,
    };
  });

  return {
    days,
    totalPrayersRequired,
    totalCompleted,
    totalJamaah,
    totalMissed,
    overallPercentage,
    jamaahPercentage,
    currentStreak,
    bestStreak,
    prayerBreakdown,
  };
}

/**
 * Generates realistic sample data for 30 days to demonstrate the chart
 * with realistic devotion habits (Fajr, Dhuhr, Asr, Maghrib, Isha with high consistency, some Jama'ah).
 */
export function generateSample30DayTrackerData(referenceDate: Date = new Date()): Record<string, DailyPrayerTracker> {
  const result: Record<string, DailyPrayerTracker> = {};
  const ref = new Date(referenceDate);

  for (let i = 29; i >= 0; i--) {
    const d = new Date(ref);
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dayNum = String(d.getDate()).padStart(2, '0');
    const dateKey = `${y}-${m}-${dayNum}`;

    // Realistic prayer habits
    // Weekend vs weekday, Friday congregation
    const isFriday = d.getDay() === 5;
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;

    // High consistency for practicing Muslim (approx 85-95%)
    const fajrStatus = Math.random() > 0.15 ? (Math.random() > 0.6 ? 'jamaah' : 'completed') : 'missed';
    const dhuhrStatus = isFriday ? 'jamaah' : Math.random() > 0.1 ? (Math.random() > 0.5 ? 'jamaah' : 'completed') : 'missed';
    const asrStatus = Math.random() > 0.12 ? (Math.random() > 0.7 ? 'jamaah' : 'completed') : 'missed';
    const maghribStatus = Math.random() > 0.05 ? (Math.random() > 0.4 ? 'jamaah' : 'completed') : 'missed';
    const ishaStatus = Math.random() > 0.08 ? (Math.random() > 0.5 ? 'jamaah' : 'completed') : 'missed';

    const fasted = isFriday || d.getDay() === 1 || d.getDay() === 4 ? Math.random() > 0.6 : false;

    result[dateKey] = {
      date: dateKey,
      prayers: {
        fajr: fajrStatus as any,
        sunrise: 'none',
        dhuhr: dhuhrStatus as any,
        asr: asrStatus as any,
        maghrib: maghribStatus as any,
        isha: ishaStatus as any,
      },
      fasted,
      quranPagesRead: Math.floor(Math.random() * 8) + 2,
      tasbihCount: Math.floor(Math.random() * 300) + 100,
      notes: isFriday ? 'Jum’ah Mubarak at local masjid' : undefined,
    };
  }

  return result;
}
