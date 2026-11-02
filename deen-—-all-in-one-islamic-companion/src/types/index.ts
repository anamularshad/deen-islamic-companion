export type Language = 'en' | 'ar' | 'bn';

export type NavTab = 'home' | 'quran' | 'prayer' | 'hadith' | 'more';

export type MoreSubSection =
  | 'menu'
  | 'mosques'
  | 'duas'
  | 'qibla'
  | 'calendar'
  | 'ramadan'
  | 'tasbih'
  | 'tracker'
  | 'learning'
  | 'zakat'
  | 'ai-assistant'
  | 'bookmarks'
  | 'search'
  | 'settings';

export interface MosquePlace {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  distanceKm?: number;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  isOpenNow?: boolean;
  hasWudu?: boolean;
  hasWomenArea?: boolean;
  hasJummah?: boolean;
}


export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerTimeSlot {
  name: PrayerName;
  label: string;
  arabicLabel: string;
  bengaliLabel: string;
  time: Date;
  timeFormatted: string;
  isPassed: boolean;
  isNext: boolean;
  isCurrent: boolean;
}

export interface CityLocation {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  defaultMethod?: string;
}

export interface SurahSummary {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  bengaliName: string;
  bengaliMeaning: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface Ayah {
  numberInSurah: number;
  surahNumber: number;
  arabicText: string;
  translationEn: string;
  translationBn: string;
  transliteration?: string;
  audioUrl?: string;
  isBookmarked?: boolean;
  isMemorized?: boolean;
}

export interface HadithItem {
  id: string;
  collection: string; // e.g. 'bukhari', 'muslim', 'tirmidhi'
  collectionName: string;
  hadithNumber: string | number;
  bookName: string;
  chapter?: string;
  arabic: string;
  english: string;
  bengali: string;
  grade: 'Sahih' | 'Hasan' | 'Daif' | 'Authentic';
  scholar?: string;
  topic: string;
  narrator?: string;
}

export interface DuaItem {
  id: string;
  category: string;
  categoryLabelEn: string;
  categoryLabelAr: string;
  categoryLabelBn: string;
  title: string;
  titleBn?: string;
  arabic: string;
  transliteration: string;
  english: string;
  bengali: string;
  reference: string;
  repeatTarget: number;
  virtue?: string;
  audioUrl?: string;
}

export interface BookmarkItem {
  id: string;
  type: 'ayah' | 'hadith' | 'dua' | 'article';
  refId: string;
  title: string;
  subtitle: string;
  arabicSnippet?: string;
  dateAdded: string;
}

export interface DailyPrayerTracker {
  date: string; // YYYY-MM-DD
  prayers: Record<PrayerName, 'completed' | 'jamaah' | 'missed' | 'none'>;
  fasted: boolean;
  quranPagesRead: number;
  tasbihCount: number;
  notes?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: Language;
  selectedCity: CityLocation;
  useGps: boolean;
  calculationMethod: string;
  asrMethod: 'Standard' | 'Hanafi';
  highLatitudeRule: string;
  hijriAdjustment: number;
  arabicFontSize: number; // 24 to 40
  translationFontSize: number; // 14 to 20
  adhanSound: boolean;
  vibrationEnabled: boolean;
  hideWorshipProgressOnHome: boolean;
  hasCompletedOnboarding: boolean;
}
