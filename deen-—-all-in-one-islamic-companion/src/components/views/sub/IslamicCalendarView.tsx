import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Star, Info } from 'lucide-react';
import { Language, UserPreferences } from '../../../types';
import { getHijriDate, IMPORTANT_ISLAMIC_DATES, HIJRI_MONTHS } from '../../../utils/hijriCalendar';
import { getTranslation } from '../../../i18n/translations';

interface IslamicCalendarViewProps {
  language: Language;
  preferences: UserPreferences;
  onUpdatePreferences: (updates: Partial<UserPreferences>) => void;
}

export const IslamicCalendarView: React.FC<IslamicCalendarViewProps> = ({
  language,
  preferences,
  onUpdatePreferences,
}) => {
  const t = getTranslation(language);
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentHijri = getHijriDate(currentDate, preferences.hijriAdjustment);

  // Month navigation
  const handlePrevMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };

  const handleNextMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#064E3B] to-[#087F5B] text-white shadow-sm border border-[#E4EAE5] dark:border-[#23332B]">
        <div className="max-w-xl">
          <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold">
            Hijri & Gregorian Calendar
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            Islamic Calendar (تقويم هجري)
          </h1>
          <p className="text-xs text-white/80 mt-1 leading-relaxed">
            Astronomical Umm Al-Qura lunar dates aligned with major Islamic occasions and moon-sighting settings.
          </p>
        </div>
      </div>

      {/* Moon Sighting Adjustment Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h4 className="text-xs font-bold text-[#17231F] dark:text-[#E4EAE5]">
            Local Moon-Sighting Convention Offset
          </h4>
          <p className="text-[11px] text-[#68756E] dark:text-[#8E9D95]">
            Adjust by ±1 or 2 days to match your country's official sighting announcement.
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {[-2, -1, 0, 1, 2].map((adj) => (
            <button
              key={adj}
              onClick={() => onUpdatePreferences({ hijriAdjustment: adj })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                preferences.hijriAdjustment === adj
                  ? 'bg-[#087F5B] text-white shadow-xs'
                  : 'bg-[#F7F9F6] dark:bg-[#101A16] border border-[#E4EAE5] dark:border-[#23332B] text-[#68756E] dark:text-[#8E9D95]'
              }`}
            >
              {adj > 0 ? `+${adj}` : adj}d
            </button>
          ))}
        </div>
      </div>

      {/* Dual Calendar Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-sm space-y-4">
        {/* Month Navigation Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#17231F] dark:text-[#E4EAE5]">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <p className="text-xs font-semibold text-[#087F5B] dark:text-[#C9A45C]">
              {currentHijri.formattedEn}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl border border-[#E4EAE5] dark:border-[#23332B] text-[#68756E] hover:text-[#17231F] dark:hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl border border-[#E4EAE5] dark:border-[#23332B] text-[#68756E] hover:text-[#17231F] dark:hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#68756E] dark:text-[#8E9D95] pb-2 border-b border-[#E4EAE5] dark:border-[#23332B]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        {/* Month Grid */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {/* Empty prefix slots */}
          {Array.from({ length: firstDayIndex }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-16" />
          ))}

          {/* Day slots */}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const h = getHijriDate(dateObj, preferences.hijriAdjustment);
            const isToday =
              day === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear();

            return (
              <div
                key={day}
                className={`h-16 rounded-xl p-1.5 flex flex-col justify-between border transition-all text-xs ${
                  isToday
                    ? 'border-[#087F5B] dark:border-[#C9A45C] bg-[#087F5B]/10 dark:bg-[#C9A45C]/15 font-bold shadow-xs'
                    : h.isSpecialDay
                    ? 'border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20'
                    : 'border-[#E4EAE5]/60 dark:border-[#23332B]/60 hover:bg-[#F7F9F6] dark:hover:bg-[#101A16]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className={`font-semibold ${isToday ? 'text-[#087F5B] dark:text-[#C9A45C]' : ''}`}>
                    {day}
                  </span>
                  {h.isSpecialDay && <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />}
                </div>

                <div className="text-[10px] text-[#68756E] dark:text-[#8E9D95] font-arabic leading-none text-right">
                  {h.day} {h.monthNameAr.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Important Islamic Dates List */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-[#17231F] dark:text-[#E4EAE5] flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Major Islamic Occasions (الأيام المباركة)</span>
        </h3>

        <div className="divide-y divide-[#E4EAE5] dark:divide-[#23332B]">
          {IMPORTANT_ISLAMIC_DATES.map((item, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-[#17231F] dark:text-[#E4EAE5]">
                  {language === 'bn' ? item.bn : item.en}
                </p>
                <p className="text-[11px] text-[#68756E] dark:text-[#8E9D95] font-arabic">
                  {item.ar}
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#087F5B] dark:text-[#C9A45C] bg-[#087F5B]/10 dark:bg-[#C9A45C]/15 px-2.5 py-1 rounded-lg tabular-nums">
                {item.day} {HIJRI_MONTHS[item.month - 1].en}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
