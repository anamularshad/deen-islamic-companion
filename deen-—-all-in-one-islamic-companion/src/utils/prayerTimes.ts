import {
  Coordinates,
  CalculationMethod,
  PrayerTimes,
  Madhab,
  HighLatitudeRule,
  CalculationParameters,
} from 'adhan';
import { CityLocation, PrayerName, PrayerTimeSlot, UserPreferences } from '../types';

export function getCalculationParameters(methodKey: string): CalculationParameters {
  switch (methodKey) {
    case 'MuslimWorldLeague':
      return CalculationMethod.MuslimWorldLeague();
    case 'Egyptian':
      return CalculationMethod.Egyptian();
    case 'Karachi':
      return CalculationMethod.Karachi();
    case 'UmmAlQura':
      return CalculationMethod.UmmAlQura();
    case 'Dubai':
      return CalculationMethod.Dubai();
    case 'Qatar':
      return CalculationMethod.Qatar();
    case 'Kuwait':
      return CalculationMethod.Kuwait();
    case 'MoonsightingCommittee':
      return CalculationMethod.MoonsightingCommittee();
    case 'Singapore':
      return CalculationMethod.Singapore();
    case 'Turkey':
      return CalculationMethod.Turkey();
    case 'NorthAmerica':
    default:
      return CalculationMethod.NorthAmerica();
  }
}

export function calculateDailyPrayerTimes(
  date: Date,
  location: CityLocation,
  prefs: Pick<UserPreferences, 'calculationMethod' | 'asrMethod' | 'highLatitudeRule'>
): {
  slots: PrayerTimeSlot[];
  nextPrayer: PrayerTimeSlot | null;
  currentPrayer: PrayerTimeSlot | null;
  timeRemainingSeconds: number;
} {
  const coords = new Coordinates(location.latitude, location.longitude);
  const params = getCalculationParameters(prefs.calculationMethod || location.defaultMethod || 'NorthAmerica');

  if (prefs.asrMethod === 'Hanafi') {
    params.madhab = Madhab.Hanafi;
  } else {
    params.madhab = Madhab.Shafi;
  }

  if (prefs.highLatitudeRule === 'SeventhOfTheNight') {
    params.highLatitudeRule = HighLatitudeRule.SeventhOfTheNight;
  } else if (prefs.highLatitudeRule === 'TwilightAngle') {
    params.highLatitudeRule = HighLatitudeRule.TwilightAngle;
  } else {
    params.highLatitudeRule = HighLatitudeRule.MiddleOfTheNight;
  }

  const pt = new PrayerTimes(coords, date, params);

  const rawSlots: { name: PrayerName; label: string; ar: string; bn: string; time: Date }[] = [
    { name: 'fajr', label: 'Fajr', ar: 'الفجر', bn: 'ফজর', time: pt.fajr },
    { name: 'sunrise', label: 'Sunrise', ar: 'الشروق', bn: 'সূর্যোদয়', time: pt.sunrise },
    { name: 'dhuhr', label: 'Dhuhr', ar: 'الظهر', bn: 'জোহর', time: pt.dhuhr },
    { name: 'asr', label: 'Asr', ar: 'العصر', bn: 'আসর', time: pt.asr },
    { name: 'maghrib', label: 'Maghrib', ar: 'المغرب', bn: 'মাগরিব', time: pt.maghrib },
    { name: 'isha', label: 'Isha', ar: 'العشاء', bn: 'এশা', time: pt.isha },
  ];

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  // Find next upcoming prayer
  let nextSlotIndex = -1;
  let currentSlotIndex = -1;

  if (isToday) {
    const nowTime = now.getTime();
    for (let i = 0; i < rawSlots.length; i++) {
      if (rawSlots[i].time.getTime() > nowTime) {
        nextSlotIndex = i;
        break;
      } else {
        currentSlotIndex = i;
      }
    }
  }

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const slots: PrayerTimeSlot[] = rawSlots.map((item, idx) => {
    const isPassed = isToday ? item.time.getTime() < now.getTime() : false;
    const isNext = isToday ? idx === nextSlotIndex : false;
    const isCurrent = isToday ? idx === currentSlotIndex : false;

    return {
      name: item.name,
      label: item.label,
      arabicLabel: item.ar,
      bengaliLabel: item.bn,
      time: item.time,
      timeFormatted: timeFormatter.format(item.time),
      isPassed,
      isNext,
      isCurrent,
    };
  });

  let nextPrayerSlot = nextSlotIndex !== -1 ? slots[nextSlotIndex] : null;
  let currentPrayerSlot = currentSlotIndex !== -1 ? slots[currentSlotIndex] : null;

  // If all prayers passed today, next is tomorrow's Fajr
  let timeRemainingSeconds = 0;
  if (nextPrayerSlot) {
    timeRemainingSeconds = Math.max(0, Math.floor((nextPrayerSlot.time.getTime() - now.getTime()) / 1000));
  } else if (isToday) {
    // Tomorrow's Fajr
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowPt = new PrayerTimes(coords, tomorrow, params);
    timeRemainingSeconds = Math.max(0, Math.floor((tomorrowPt.fajr.getTime() - now.getTime()) / 1000));
    nextPrayerSlot = {
      name: 'fajr',
      label: 'Fajr (Tomorrow)',
      arabicLabel: 'الفجر (غداً)',
      bengaliLabel: 'ফজর (আগামীকাল)',
      time: tomorrowPt.fajr,
      timeFormatted: timeFormatter.format(tomorrowPt.fajr),
      isPassed: false,
      isNext: true,
      isCurrent: false,
    };
  }

  return {
    slots,
    nextPrayer: nextPrayerSlot,
    currentPrayer: currentPrayerSlot,
    timeRemainingSeconds,
  };
}

export function formatRemainingTime(seconds: number): string {
  if (seconds <= 0) return '00:00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  if (hrs > 0) {
    return `${hrs}h ${pad(mins)}m ${pad(secs)}s`;
  }
  return `${pad(mins)}m ${pad(secs)}s`;
}

// Generate monthly timetable for current month
export function generateMonthlyTimetable(
  year: number,
  monthIndex: number, // 0 to 11
  location: CityLocation,
  prefs: Pick<UserPreferences, 'calculationMethod' | 'asrMethod' | 'highLatitudeRule'>
) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const timetable = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, monthIndex, day);
    const { slots } = calculateDailyPrayerTimes(d, location, prefs);
    timetable.push({
      day,
      date: d,
      slots,
    });
  }

  return timetable;
}
