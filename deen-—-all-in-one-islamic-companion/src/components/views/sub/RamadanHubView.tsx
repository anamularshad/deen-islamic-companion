import React, { useState } from 'react';
import { Moon, Clock, Check, Sparkles, BookOpen, Heart, Info } from 'lucide-react';
import { DailyPrayerTracker, Language, PrayerTimeSlot } from '../../../types';
import { getTranslation } from '../../../i18n/translations';

interface RamadanHubViewProps {
  language: Language;
  prayerSlots: PrayerTimeSlot[];
  todayTracker: DailyPrayerTracker;
  onUpdateFastingStatus: (fasted: boolean) => void;
}

export const RamadanHubView: React.FC<RamadanHubViewProps> = ({
  language,
  prayerSlots,
  todayTracker,
  onUpdateFastingStatus,
}) => {
  const t = getTranslation(language);
  const [completedJuz, setCompletedJuz] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('deen_ramadan_juz');
      return saved ? JSON.parse(saved) : [1];
    } catch {
      return [1];
    }
  });

  const toggleJuz = (juzNum: number) => {
    const next = completedJuz.includes(juzNum)
      ? completedJuz.filter((n) => n !== juzNum)
      : [...completedJuz, juzNum];
    setCompletedJuz(next);
    localStorage.setItem('deen_ramadan_juz', JSON.stringify(next));
  };

  const fajrSlot = prayerSlots.find((s) => s.name === 'fajr');
  const maghribSlot = prayerSlots.find((s) => s.name === 'maghrib');

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#064E3B] to-[#087F5B] text-white shadow-sm border border-[#E4EAE5] dark:border-[#23332B]">
        <div className="max-w-xl">
          <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold">
            The Holy Month of Mercy & Light
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            {t.ramadanHub}
          </h1>
          <p className="text-xs text-white/80 mt-1 leading-relaxed">
            Track your fasting, daily Iftar & Suhoor timings, 30-Day Quran completion plan, and authentic Ramadan supplications.
          </p>
        </div>
      </div>

      {/* Suhoor & Iftar Timings Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Suhoor */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#68756E] dark:text-[#8E9D95] uppercase tracking-wider">
              {t.suhoorTime}
            </span>
            <p className="text-2xl font-bold text-[#17231F] dark:text-[#E4EAE5] mt-1 tabular-nums">
              {fajrSlot ? fajrSlot.timeFormatted : '--:--'}
            </p>
            <p className="text-[11px] text-[#68756E] dark:text-[#8E9D95] mt-0.5">
              Stop eating and drinking before Fajr Adhan begins
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Iftar */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#68756E] dark:text-[#8E9D95] uppercase tracking-wider">
              {t.iftarTime}
            </span>
            <p className="text-2xl font-bold text-[#087F5B] dark:text-[#C9A45C] mt-1 tabular-nums">
              {maghribSlot ? maghribSlot.timeFormatted : '--:--'}
            </p>
            <p className="text-[11px] text-[#68756E] dark:text-[#8E9D95] mt-0.5">
              Break fast promptly upon hearing the Maghrib Adhan
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Moon className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Fasting Tracker Status Toggle */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-[#17231F] dark:text-[#E4EAE5]">
            {t.fastingTracker}
          </h3>
          <p className="text-xs text-[#68756E] dark:text-[#8E9D95] mt-0.5">
            Record your daily fast for personal spiritual consistency.
          </p>
        </div>

        <button
          onClick={() => onUpdateFastingStatus(!todayTracker.fasted)}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            todayTracker.fasted
              ? 'bg-[#087F5B] text-white shadow-xs'
              : 'border border-[#E4EAE5] dark:border-[#23332B] hover:border-[#087F5B] text-[#17231F] dark:text-[#E4EAE5]'
          }`}
        >
          {todayTracker.fasted ? (
            <>
              <Check className="w-4 h-4" />
              <span>{t.fastCompleted}</span>
            </>
          ) : (
            <span>{t.logFast}</span>
          )}
        </button>
      </div>

      {/* Authentic Ramadan Duas */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#17231F] dark:text-[#E4EAE5] flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-500" />
          <span>{t.ramadanDuas}</span>
        </h3>

        {/* Iftar Dua */}
        <div className="p-4 rounded-xl bg-[#F7F9F6] dark:bg-[#101A16] border border-[#E4EAE5] dark:border-[#23332B] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#087F5B] dark:text-[#C9A45C]">Dua Upon Breaking the Fast (Iftar)</span>
            <span className="text-[#68756E] dark:text-[#8E9D95]">Abu Dawud #2357</span>
          </div>
          <p className="text-right font-arabic text-base sm:text-lg leading-loose text-[#17231F] dark:text-[#E4EAE5]" dir="rtl">
            ذَهَبَ الظَّمَأُ، وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ.
          </p>
          <p className="text-xs text-[#68756E] dark:text-[#8E9D95] italic">
            Dhahabaẓ-ẓama'u, wabtallatil-'urūqu, wa thabatal-ajru in shā' Allāh.
          </p>
          <p className="text-xs text-[#17231F] dark:text-[#E4EAE5] font-medium">
            "The thirst has gone, the veins are moistened, and the reward is confirmed, if Allah wills."
          </p>
        </div>

        {/* Laylat al-Qadr Dua */}
        <div className="p-4 rounded-xl bg-[#F7F9F6] dark:bg-[#101A16] border border-[#E4EAE5] dark:border-[#23332B] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#087F5B] dark:text-[#C9A45C]">Dua for the Night of Decree (Laylat al-Qadr)</span>
            <span className="text-[#68756E] dark:text-[#8E9D95]">Jami' at-Tirmidhi #3513 (Sahih)</span>
          </div>
          <p className="text-right font-arabic text-base sm:text-lg leading-loose text-[#17231F] dark:text-[#E4EAE5]" dir="rtl">
            اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي.
          </p>
          <p className="text-xs text-[#68756E] dark:text-[#8E9D95] italic">
            Allāhumma innaka 'Afuwwun tuḥibbul-'afwa fa'fu 'annī.
          </p>
          <p className="text-xs text-[#17231F] dark:text-[#E4EAE5] font-medium">
            "O Allah, You are Most Forgiving, and You love forgiveness, so forgive me."
          </p>
        </div>
      </div>

      {/* 30-Day Quran Completion Plan (Juz 1 to 30) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#17231F] dark:text-[#E4EAE5] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#087F5B] dark:text-[#C9A45C]" />
              <span>{t.juzTracker}</span>
            </h3>
            <p className="text-xs text-[#68756E] dark:text-[#8E9D95] mt-0.5">
              Read 1 Juz (~20 pages) each day to complete the Quran during Ramadan.
            </p>
          </div>
          <span className="text-xs font-bold text-[#087F5B] dark:text-[#C9A45C]">
            {completedJuz.length} / 30 Completed
          </span>
        </div>

        {/* 30 Juz interactive checkboxes */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => {
            const isDone = completedJuz.includes(juz);
            return (
              <button
                key={juz}
                onClick={() => toggleJuz(juz)}
                className={`h-11 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
                  isDone
                    ? 'bg-[#087F5B] text-white shadow-xs'
                    : 'bg-[#F7F9F6] dark:bg-[#101A16] border border-[#E4EAE5] dark:border-[#23332B] text-[#68756E] dark:text-[#8E9D95] hover:border-[#087F5B]'
                }`}
              >
                <span>Juz {juz}</span>
                {isDone && <Check className="w-3 h-3 mt-0.5" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
