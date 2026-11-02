import React, { useState, useEffect } from 'react';
import {
  Clock,
  Compass,
  Repeat,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Copy,
  Share2,
  Sparkles,
  Heart,
  Calendar,
  ChevronRight,
  Eye,
  EyeOff,
  Moon,
  Building2,
} from 'lucide-react';
import {
  CityLocation,
  DailyPrayerTracker,
  Language,
  MoreSubSection,
  NavTab,
  PrayerTimeSlot,
  UserPreferences,
} from '../../types';
import { getTranslation } from '../../i18n/translations';
import { DAILY_VERSES } from '../../data/sampleAyahs';
import { AUTHENTIC_HADITHS } from '../../data/hadiths';
import { AUTHENTIC_DUAS } from '../../data/duas';
import { formatRemainingTime } from '../../utils/prayerTimes';

interface HomeDashboardProps {
  language: Language;
  currentCity: CityLocation;
  prayerSlots: PrayerTimeSlot[];
  nextPrayer: PrayerTimeSlot | null;
  timeRemainingSeconds: number;
  hijriDateFormatted: string;
  gregorianDateFormatted: string;
  todayTracker: DailyPrayerTracker;
  preferences: UserPreferences;
  onNavigateTab: (tab: NavTab) => void;
  onNavigateSub: (sub: MoreSubSection) => void;
  onOpenPrayerSettings: () => void;
  onToggleBookmark: (item: any) => void;
  isBookmarked: (id: string) => boolean;
  onUpdatePreferences: (updates: Partial<UserPreferences>) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  language,
  currentCity,
  prayerSlots,
  nextPrayer,
  timeRemainingSeconds,
  hijriDateFormatted,
  gregorianDateFormatted,
  todayTracker,
  preferences,
  onNavigateTab,
  onNavigateSub,
  onOpenPrayerSettings,
  onToggleBookmark,
  isBookmarked,
  onUpdatePreferences,
}) => {
  const t = getTranslation(language);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Daily selections based on day of month
  const dayOfMonth = new Date().getDate();
  const dailyVerse = DAILY_VERSES[(dayOfMonth - 1) % DAILY_VERSES.length];
  const dailyHadith = AUTHENTIC_HADITHS[(dayOfMonth - 1) % AUTHENTIC_HADITHS.length];
  const dailyDua = AUTHENTIC_DUAS[(dayOfMonth - 1) % AUTHENTIC_DUAS.length];

  // Count completed prayers
  const completedPrayersCount = Object.values(todayTracker.prayers).filter(
    (status) => status === 'completed' || status === 'jamaah'
  ).length;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async (title: string, text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(`${title}\n\n${text}`);
      alert('Content copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Hero Card with Tranquil Mosque Photography */}
      <div className="relative rounded-3xl overflow-hidden border border-[#E4EAE5] dark:border-[#23332B] shadow-sm bg-gradient-to-b from-[#064E3B] to-[#087F5B] text-white">
        {/* Background Image with Ambient Scrim */}
        <img
          src="/src/assets/images/deen_hero_banner_1793584912623.jpg"
          alt="Tranquil Mosque Courtyard"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay"
        />

        <div className="relative z-10 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold mb-1">
                {hijriDateFormatted}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {t.goodMorning}
              </h1>
              <p className="text-xs text-white/80 mt-1">
                {gregorianDateFormatted} · {currentCity.name}, {currentCity.country}
              </p>
            </div>

            {/* Quick Hijri Note */}
            <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-[11px] text-white/90 max-w-xs">
              <span className="font-medium text-[#C9A45C]">Notice:</span> Hijri dates may vary by 1–2 days based on local moon sighting.
            </div>
          </div>

          {/* Next Prayer Countdown Spotlight */}
          <div className="mt-6 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-white/70">
                {t.nextPrayer}
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {nextPrayer ? nextPrayer.label : 'Fajr'}
                </span>
                <span className="text-lg text-[#C9A45C] font-semibold">
                  {nextPrayer ? nextPrayer.timeFormatted : '--:--'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3.5 py-1.5 rounded-xl bg-black/25 backdrop-blur-md border border-white/15 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C9A45C] animate-pulse" />
                <span className="text-xs font-mono tabular-nums tracking-wide font-medium">
                  {formatRemainingTime(timeRemainingSeconds)}
                </span>
              </div>
              <button
                onClick={() => onNavigateTab('prayer')}
                className="px-3.5 py-1.5 rounded-xl bg-white text-[#064E3B] text-xs font-semibold hover:bg-white/90 transition-colors shadow-sm"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Today's 5 Prayers Timeline Strip */}
      <div className="bg-white dark:bg-[#19251F] rounded-2xl border border-[#E4EAE5] dark:border-[#23332B] p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#68756E] dark:text-[#8E9D95]">
            {t.todaySchedule}
          </h2>
          <button
            onClick={onOpenPrayerSettings}
            className="text-xs text-[#087F5B] dark:text-[#C9A45C] hover:underline font-medium"
          >
            {t.calculationSettings}
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {prayerSlots.map((slot) => {
            const isTarget = slot.isNext;
            const isPassed = slot.isPassed;
            return (
              <div
                key={slot.name}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isTarget
                    ? 'border-[#087F5B] dark:border-[#C9A45C] bg-[#087F5B]/10 dark:bg-[#C9A45C]/15 shadow-xs'
                    : isPassed
                    ? 'border-transparent bg-[#F7F9F6]/60 dark:bg-[#101A16]/40 opacity-70'
                    : 'border-[#E4EAE5] dark:border-[#23332B] bg-white dark:bg-[#19251F]'
                }`}
              >
                <p className={`text-[11px] font-medium ${
                  isTarget ? 'text-[#087F5B] dark:text-[#C9A45C] font-bold' : 'text-[#68756E] dark:text-[#8E9D95]'
                }`}>
                  {slot.label}
                </p>
                <p className="text-xs font-bold text-[#17231F] dark:text-[#E4EAE5] mt-1 tabular-nums">
                  {slot.timeFormatted}
                </p>
                <p className="text-[10px] text-[#68756E] dark:text-[#8E9D95] font-arabic mt-0.5">
                  {slot.arabicLabel}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#68756E] dark:text-[#8E9D95] mb-3 px-1">
          {t.quickActions}
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-9 gap-2.5">
          {[
            { label: t.findMosques, icon: Building2, action: () => onNavigateSub('mosques'), color: 'text-emerald-700 dark:text-emerald-400' },
            { label: t.readQuran, icon: BookOpen, action: () => onNavigateTab('quran'), color: 'text-emerald-700 dark:text-emerald-400' },
            { label: t.findQibla, icon: Compass, action: () => onNavigateSub('qibla'), color: 'text-amber-700 dark:text-amber-400' },
            { label: t.openTasbih, icon: Repeat, action: () => onNavigateSub('tasbih'), color: 'text-teal-700 dark:text-teal-400' },
            { label: t.readDuas, icon: Heart, action: () => onNavigateSub('duas'), color: 'text-rose-700 dark:text-rose-400' },
            { label: t.trackPrayers, icon: CheckCircle2, action: () => onNavigateSub('tracker'), color: 'text-blue-700 dark:text-blue-400' },
            { label: t.ramadanHub, icon: Moon, action: () => onNavigateSub('ramadan'), color: 'text-indigo-700 dark:text-indigo-400' },
            { label: 'Calendar', icon: Calendar, action: () => onNavigateSub('calendar'), color: 'text-cyan-700 dark:text-cyan-400' },
            { label: 'AI Assistant', icon: Sparkles, action: () => onNavigateSub('ai-assistant'), color: 'text-purple-700 dark:text-purple-400' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={item.action}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] hover:border-[#087F5B] dark:hover:border-[#C9A45C] hover:shadow-xs transition-all text-center min-h-[72px]"
              >
                <div className={`w-8 h-8 rounded-xl bg-[#F7F9F6] dark:bg-[#101A16] flex items-center justify-center mb-1.5 ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium text-[#17231F] dark:text-[#E4EAE5] leading-tight line-clamp-1">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Worship Progress Tracker Card (Toggleable Privacy) */}
      {!preferences.hideWorshipProgressOnHome && (
        <div className="bg-white dark:bg-[#19251F] rounded-2xl border border-[#E4EAE5] dark:border-[#23332B] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#087F5B] dark:text-[#C9A45C]" />
              <h2 className="text-sm font-bold text-[#17231F] dark:text-[#E4EAE5]">
                {t.worshipConsistency}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdatePreferences({ hideWorshipProgressOnHome: true })}
                className="text-[11px] text-[#68756E] dark:text-[#8E9D95] hover:text-[#17231F] flex items-center gap-1"
                title="Hide personal progress"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Hide</span>
              </button>
              <button
                onClick={() => onNavigateSub('tracker')}
                className="text-xs text-[#087F5B] dark:text-[#C9A45C] font-semibold hover:underline"
              >
                Open Tracker →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-[#F7F9F6] dark:bg-[#101A16] border border-[#E4EAE5] dark:border-[#23332B]">
              <p className="text-[11px] text-[#68756E] dark:text-[#8E9D95] font-medium">{t.completedPrayers}</p>
              <p className="text-xl font-bold text-[#087F5B] dark:text-[#C9A45C] mt-1 tabular-nums">
                {completedPrayersCount} / 5
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#F7F9F6] dark:bg-[#101A16] border border-[#E4EAE5] dark:border-[#23332B]">
              <p className="text-[11px] text-[#68756E] dark:text-[#8E9D95] font-medium">{t.dhikrCountToday}</p>
              <p className="text-xl font-bold text-[#17231F] dark:text-[#E4EAE5] mt-1 tabular-nums">
                {todayTracker.tasbihCount || 0}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#F7F9F6] dark:bg-[#101A16] border border-[#E4EAE5] dark:border-[#23332B]">
              <p className="text-[11px] text-[#68756E] dark:text-[#8E9D95] font-medium">{t.quranReading}</p>
              <p className="text-xl font-bold text-[#17231F] dark:text-[#E4EAE5] mt-1 tabular-nums">
                {todayTracker.quranPagesRead || 0} <span className="text-xs font-normal text-[#68756E]">pages</span>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#F7F9F6] dark:bg-[#101A16] border border-[#E4EAE5] dark:border-[#23332B]">
              <p className="text-[11px] text-[#68756E] dark:text-[#8E9D95] font-medium">{t.fastingStatus}</p>
              <p className={`text-sm font-bold mt-2 ${
                todayTracker.fasted ? 'text-[#087F5B] dark:text-[#C9A45C]' : 'text-[#68756E] dark:text-[#8E9D95]'
              }`}>
                {todayTracker.fasted ? t.fastedToday : t.notFasting}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Daily Scripture Feed (Verse, Hadith, Dua) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Daily Quran Verse */}
        <div className="bg-white dark:bg-[#19251F] rounded-2xl border border-[#E4EAE5] dark:border-[#23332B] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#087F5B] dark:text-[#C9A45C]">
                {t.dailyVerse}
              </span>
              <span className="text-[11px] text-[#68756E] dark:text-[#8E9D95]">
                Surah {dailyVerse.surahNumber}:{dailyVerse.numberInSurah}
              </span>
            </div>

            <p className="text-right font-arabic text-lg leading-loose text-[#17231F] dark:text-[#E4EAE5] my-2" dir="rtl">
              {dailyVerse.arabicText}
            </p>

            <p className="text-xs text-[#68756E] dark:text-[#8E9D95] italic mt-2">
              {dailyVerse.transliteration}
            </p>

            <p className="text-xs text-[#17231F] dark:text-[#E4EAE5] mt-2 font-medium leading-relaxed">
              {language === 'bn' ? dailyVerse.translationBn : dailyVerse.translationEn}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E4EAE5] dark:border-[#23332B]">
            <button
              onClick={() => onNavigateTab('quran')}
              className="text-xs text-[#087F5B] dark:text-[#C9A45C] font-semibold hover:underline flex items-center gap-1"
            >
              <span>Read in Surah</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleCopy(`${dailyVerse.arabicText}\n${dailyVerse.translationEn} (Quran ${dailyVerse.surahNumber}:${dailyVerse.numberInSurah})`, `verse-${dailyVerse.numberInSurah}`)}
                className="p-1.5 rounded-lg text-[#68756E] dark:text-[#8E9D95] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Copy verse"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => onToggleBookmark({
                  id: `ayah-${dailyVerse.surahNumber}-${dailyVerse.numberInSurah}`,
                  type: 'ayah',
                  refId: `${dailyVerse.surahNumber}:${dailyVerse.numberInSurah}`,
                  title: `Surah ${dailyVerse.surahNumber}:${dailyVerse.numberInSurah}`,
                  subtitle: dailyVerse.translationEn,
                  arabicSnippet: dailyVerse.arabicText,
                  dateAdded: new Date().toISOString(),
                })}
                className={`p-1.5 rounded-lg transition-colors ${
                  isBookmarked(`ayah-${dailyVerse.surahNumber}-${dailyVerse.numberInSurah}`)
                    ? 'text-[#087F5B] dark:text-[#C9A45C]'
                    : 'text-[#68756E] dark:text-[#8E9D95] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                title="Bookmark"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Daily Hadith */}
        <div className="bg-white dark:bg-[#19251F] rounded-2xl border border-[#E4EAE5] dark:border-[#23332B] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#087F5B] dark:text-[#C9A45C]">
                {t.dailyHadith}
              </span>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="font-medium text-[#17231F] dark:text-[#E4EAE5]">{dailyHadith.collectionName} #{dailyHadith.hadithNumber}</span>
                <span className="text-[#087F5B] dark:text-[#C9A45C] font-semibold">({dailyHadith.grade})</span>
              </div>
            </div>

            <p className="text-right font-arabic text-base leading-loose text-[#17231F] dark:text-[#E4EAE5] my-2" dir="rtl">
              {dailyHadith.arabic}
            </p>

            <p className="text-xs text-[#17231F] dark:text-[#E4EAE5] mt-2 font-medium leading-relaxed">
              "{language === 'bn' ? dailyHadith.bengali : dailyHadith.english}"
            </p>

            <p className="text-[11px] text-[#68756E] dark:text-[#8E9D95] mt-2">
              Narrator: {dailyHadith.narrator || 'Sahabi (RA)'} · Scholar: {dailyHadith.scholar}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E4EAE5] dark:border-[#23332B]">
            <button
              onClick={() => onNavigateTab('hadith')}
              className="text-xs text-[#087F5B] dark:text-[#C9A45C] font-semibold hover:underline flex items-center gap-1"
            >
              <span>Explore Hadith Library</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleCopy(`${dailyHadith.arabic}\n\n"${dailyHadith.english}"\n(${dailyHadith.collectionName} #${dailyHadith.hadithNumber}, Grade: ${dailyHadith.grade})`, `hadith-${dailyHadith.id}`)}
                className="p-1.5 rounded-lg text-[#68756E] dark:text-[#8E9D95] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Copy hadith"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => onToggleBookmark({
                  id: `hadith-${dailyHadith.id}`,
                  type: 'hadith',
                  refId: dailyHadith.id,
                  title: `${dailyHadith.collectionName} #${dailyHadith.hadithNumber}`,
                  subtitle: dailyHadith.english,
                  arabicSnippet: dailyHadith.arabic,
                  dateAdded: new Date().toISOString(),
                })}
                className={`p-1.5 rounded-lg transition-colors ${
                  isBookmarked(`hadith-${dailyHadith.id}`)
                    ? 'text-[#087F5B] dark:text-[#C9A45C]'
                    : 'text-[#68756E] dark:text-[#8E9D95] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                title="Bookmark"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Dua Card */}
      <div className="bg-white dark:bg-[#19251F] rounded-2xl border border-[#E4EAE5] dark:border-[#23332B] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#087F5B] dark:text-[#C9A45C]">
              {t.dailyDua}
            </span>
          </div>
          <span className="text-[11px] text-[#68756E] dark:text-[#8E9D95]">
            {dailyDua.reference}
          </span>
        </div>

        <h3 className="text-sm font-bold text-[#17231F] dark:text-[#E4EAE5]">
          {language === 'bn' && dailyDua.titleBn ? dailyDua.titleBn : dailyDua.title}
        </h3>

        <p className="text-right font-arabic text-base sm:text-lg leading-loose text-[#17231F] dark:text-[#E4EAE5] my-2" dir="rtl">
          {dailyDua.arabic}
        </p>

        <p className="text-xs text-[#68756E] dark:text-[#8E9D95] italic mt-1">
          {dailyDua.transliteration}
        </p>

        <p className="text-xs text-[#17231F] dark:text-[#E4EAE5] font-medium mt-2 leading-relaxed">
          {language === 'bn' ? dailyDua.bengali : dailyDua.english}
        </p>

        {dailyDua.virtue && (
          <p className="text-[11px] text-[#087F5B] dark:text-[#C9A45C] mt-2 bg-[#087F5B]/5 dark:bg-[#C9A45C]/10 p-2 rounded-xl">
            ✨ {dailyDua.virtue}
          </p>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E4EAE5] dark:border-[#23332B]">
          <button
            onClick={() => onNavigateSub('duas')}
            className="text-xs text-[#087F5B] dark:text-[#C9A45C] font-semibold hover:underline"
          >
            All Duas & Adhkar →
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleCopy(`${dailyDua.arabic}\n\n${dailyDua.english}\n(${dailyDua.reference})`, `dua-${dailyDua.id}`)}
              className="p-1.5 rounded-lg text-[#68756E] dark:text-[#8E9D95] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
