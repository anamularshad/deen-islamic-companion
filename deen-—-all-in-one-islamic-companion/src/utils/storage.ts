import { BookmarkItem, DailyPrayerTracker, UserPreferences } from '../types';
import { DEFAULT_CITY } from '../data/cities';

const PREFS_KEY = 'deen_user_preferences_v1';
const TRACKER_KEY = 'deen_worship_tracker_v1';
const BOOKMARKS_KEY = 'deen_bookmarks_v1';
const QADA_KEY = 'deen_qada_counter_v1';
const MEMORIZED_KEY = 'deen_memorized_ayahs_v1';

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  language: 'en',
  selectedCity: DEFAULT_CITY,
  useGps: false,
  calculationMethod: 'UmmAlQura',
  asrMethod: 'Standard',
  highLatitudeRule: 'MiddleOfTheNight',
  hijriAdjustment: 0,
  arabicFontSize: 28,
  translationFontSize: 16,
  adhanSound: true,
  vibrationEnabled: true,
  hideWorshipProgressOnHome: false,
  hasCompletedOnboarding: false,
};

export function loadUserPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PREFERENCES, ...parsed };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function saveUserPreferences(prefs: UserPreferences) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save preferences to localStorage', e);
  }
}

export function loadTrackerData(): Record<string, DailyPrayerTracker> {
  try {
    const raw = localStorage.getItem(TRACKER_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveTrackerData(data: Record<string, DailyPrayerTracker>) {
  try {
    localStorage.setItem(TRACKER_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save tracker to localStorage', e);
  }
}

export function loadBookmarks(): BookmarkItem[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveBookmarks(bookmarks: BookmarkItem[]) {
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch (e) {
    console.error('Failed to save bookmarks to localStorage', e);
  }
}

export interface QadaState {
  fajr: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
  fasts: number;
}

export function loadQadaCounter(): QadaState {
  try {
    const raw = localStorage.getItem(QADA_KEY);
    return raw
      ? JSON.parse(raw)
      : { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0, fasts: 0 };
  } catch {
    return { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0, fasts: 0 };
  }
}

export function saveQadaCounter(state: QadaState) {
  try {
    localStorage.setItem(QADA_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save Qada to localStorage', e);
  }
}

export function loadMemorizedAyahs(): string[] {
  try {
    const raw = localStorage.getItem(MEMORIZED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMemorizedAyahs(list: string[]) {
  try {
    localStorage.setItem(MEMORIZED_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save memorized ayahs', e);
  }
}

export function exportAllUserData(): string {
  const data = {
    exportDate: new Date().toISOString(),
    preferences: loadUserPreferences(),
    tracker: loadTrackerData(),
    bookmarks: loadBookmarks(),
    qada: loadQadaCounter(),
    memorized: loadMemorizedAyahs(),
  };
  return JSON.stringify(data, null, 2);
}

export function clearAllLocalUserData() {
  localStorage.removeItem(PREFS_KEY);
  localStorage.removeItem(TRACKER_KEY);
  localStorage.removeItem(BOOKMARKS_KEY);
  localStorage.removeItem(QADA_KEY);
  localStorage.removeItem(MEMORIZED_KEY);
}
