import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Settings,
  MapPin,
  Volume2,
  Bell,
  Sliders,
  ChevronRight,
  Info,
} from 'lucide-react';
import { CityLocation, Language, PrayerTimeSlot, UserPreferences } from '../../types';
import { getTranslation } from '../../i18n/translations';
import { formatRemainingTime, generateMonthlyTimetable } from '../../utils/prayerTimes';
import { playGoalChime } from '../../utils/audio';

interface PrayerScheduleViewProps {
  language: Language;
  currentCity: CityLocation;
  prayerSlots: PrayerTimeSlot[];
  nextPrayer: PrayerTimeSlot | null;
  timeRemainingSeconds: number;
  preferences: UserPreferences;
  onOpenLocationModal: () => void;
  onOpenSettingsModal: () => void;
  onUpdatePreferences: (updates: Partial<UserPreferences>) => void;
}

export const PrayerScheduleView: React.FC<PrayerScheduleViewProps> = ({
  language,
  currentCity,
  prayerSlots,
  nextPrayer,
  timeRemainingSeconds,
  preferences,
  onOpenLocationModal,
  onOpenSettingsModal,
  onUpdatePreferences,
}) => {
  const t = getTranslation(language);
  const [showMonthlyTimetable, setShowMonthlyTimetable] = useState(false);
  const [testSoundPlayed, setTestSoundPlayed] = useState(false);

  const today = new Date();
  const monthlyTimetable = generateMonthlyTimetable(
    today.getFullYear(),
    today.getMonth(),
    currentCity,
    preferences
  );

  const handleTestAdhan = () => {
    playGoalChime();
    setTestSoundPlayed(true);
    setTimeout(() => setTestSoundPlayed(false), 3000);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header Spotlight Card */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#064E3B] to-[#087F5B] text-white shadow-sm border border-[#E4EAE5] dark:border-[#23332B]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A45C]">
                {t.nextPrayer}
              </span>
              <span className="text-xs text-white/70">· {currentCity.name}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
              {nextPrayer ? nextPrayer.label : 'Fajr'}
            </h1>
            <p className="text-sm font-semibold text-[#C9A45C] mt-1">
              {nextPrayer ? nextPrayer.timeFormatted : '--:--'}
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end">
            <span className="text-xs uppercase tracking-wider text-white/70 font-medium">
              {t.timeRemaining}
            </span>
            <div className="text-2xl sm:text-3xl font-mono tabular-nums font-bold tracking-tight mt-1">
              {formatRemainingTime(timeRemainingSeconds)}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={onOpenLocationModal}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#C9A45C]" />
                <span>{currentCity.name}</span>
              </button>
              <button
                onClick={onOpenSettingsModal}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-[#C9A45C]" />
                <span>{preferences.calculationMethod}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Switcher: Today's Schedule vs Monthly Timetable */}
      <div className="flex items-center justify-between p-1 bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] rounded-2xl">
        <button
          onClick={() => setShowMonthlyTimetable(false)}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
            !showMonthlyTimetable
              ? 'bg-[#087F5B] text-white shadow-xs'
              : 'text-[#68756E] dark:text-[#8E9D95] hover:text-[#17231F] dark:hover:text-white'
          }`}
        >
          {t.todaySchedule}
        </button>
        <button
          onClick={() => setShowMonthlyTimetable(true)}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
            showMonthlyTimetable
              ? 'bg-[#087F5B] text-white shadow-xs'
              : 'text-[#68756E] dark:text-[#8E9D95] hover:text-[#17231F] dark:hover:text-white'
          }`}
        >
          {t.viewMonthlyTimetable}
        </button>
      </div>

      {!showMonthlyTimetable ? (
        /* Daily Detailed Schedule Cards */
        <div className="space-y-3">
          {prayerSlots.map((slot) => {
            const isNext = slot.isNext;
            const isPassed = slot.isPassed;
            return (
              <div
                key={slot.name}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  isNext
                    ? 'border-[#087F5B] dark:border-[#C9A45C] bg-[#087F5B]/5 dark:bg-[#C9A45C]/10 shadow-xs'
                    : isPassed
                    ? 'border-[#E4EAE5] dark:border-[#23332B] bg-[#F7F9F6]/50 dark:bg-[#101A16]/50 opacity-75'
                    : 'border-[#E4EAE5] dark:border-[#23332B] bg-white dark:bg-[#19251F]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isNext
                        ? 'bg-[#087F5B] text-white shadow-xs'
                        : 'bg-[#F7F9F6] dark:bg-[#101A16] text-[#087F5B] dark:text-[#C9A45C]'
                    }`}
                  >
                    <Clock className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#17231F] dark:text-[#E4EAE5]">
                        {slot.label}
                      </h3>
                      {isNext && (
                        <span className="text-[10px] font-bold text-[#087F5B] dark:text-[#C9A45C] bg-[#087F5B]/15 px-2 py-0.5 rounded-full">
                          {t.now}
                        </span>
                      )}
                      {isPassed && (
                        <span className="text-[10px] text-[#68756E] dark:text-[#8E9D95]">
                          ({t.prayerPassed})
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-arabic text-[#68756E] dark:text-[#8E9D95]">
                      {slot.arabicLabel}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base sm:text-lg font-bold text-[#17231F] dark:text-[#E4EAE5] tabular-nums">
                    {slot.timeFormatted}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Adhan Reminder & Audio Test */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#087F5B]/10 dark:bg-[#C9A45C]/15 flex items-center justify-center text-[#087F5B] dark:text-[#C9A45C]">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#17231F] dark:text-[#E4EAE5]">
                  Prayer Time Reminder Chime
                </h4>
                <p className="text-[11px] text-[#68756E] dark:text-[#8E9D95]">
                  Plays gentle melodic chime when a prayer begins
                </p>
              </div>
            </div>

            <button
              onClick={handleTestAdhan}
              className="px-3 py-1.5 rounded-xl border border-[#087F5B] text-[#087F5B] dark:border-[#C9A45C] dark:text-[#C9A45C] text-xs font-medium hover:bg-[#087F5B]/10 transition-colors shrink-0"
            >
              {testSoundPlayed ? 'Playing...' : 'Test Sound'}
            </button>
          </div>
        </div>
      ) : (
        /* Monthly Timetable Table */
        <div className="bg-white dark:bg-[#19251F] rounded-2xl border border-[#E4EAE5] dark:border-[#23332B] overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#E4EAE5] dark:border-[#23332B] flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#17231F] dark:text-[#E4EAE5] uppercase tracking-wider">
              {today.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            <span className="text-xs text-[#68756E] dark:text-[#8E9D95]">
              {currentCity.name} ({preferences.asrMethod} Asr)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F9F6] dark:bg-[#101A16] text-[#68756E] dark:text-[#8E9D95] font-semibold border-b border-[#E4EAE5] dark:border-[#23332B]">
                <tr>
                  <th className="p-3">Day</th>
                  <th className="p-3">Fajr</th>
                  <th className="p-3">Sunrise</th>
                  <th className="p-3">Dhuhr</th>
                  <th className="p-3">Asr</th>
                  <th className="p-3">Maghrib</th>
                  <th className="p-3">Isha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4EAE5] dark:divide-[#23332B] tabular-nums">
                {monthlyTimetable.map((row) => {
                  const isCurrentDay = row.day === today.getDate();
                  const fajr = row.slots.find((s) => s.name === 'fajr')?.timeFormatted;
                  const sunrise = row.slots.find((s) => s.name === 'sunrise')?.timeFormatted;
                  const dhuhr = row.slots.find((s) => s.name === 'dhuhr')?.timeFormatted;
                  const asr = row.slots.find((s) => s.name === 'asr')?.timeFormatted;
                  const maghrib = row.slots.find((s) => s.name === 'maghrib')?.timeFormatted;
                  const isha = row.slots.find((s) => s.name === 'isha')?.timeFormatted;

                  return (
                    <tr
                      key={row.day}
                      className={
                        isCurrentDay
                          ? 'bg-[#087F5B]/10 dark:bg-[#C9A45C]/15 font-bold text-[#087F5B] dark:text-[#C9A45C]'
                          : 'hover:bg-[#F7F9F6] dark:hover:bg-[#101A16]'
                      }
                    >
                      <td className="p-3 font-semibold">{row.day}</td>
                      <td className="p-3">{fajr}</td>
                      <td className="p-3 text-[#68756E] dark:text-[#8E9D95]">{sunrise}</td>
                      <td className="p-3">{dhuhr}</td>
                      <td className="p-3">{asr}</td>
                      <td className="p-3">{maghrib}</td>
                      <td className="p-3">{isha}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notice & Scholarly Advice */}
      <div className="p-4 rounded-2xl bg-[#087F5B]/5 dark:bg-[#C9A45C]/10 border border-[#087F5B]/20 dark:border-[#C9A45C]/30 text-xs text-[#68756E] dark:text-[#8E9D95] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#087F5B] dark:text-[#C9A45C] shrink-0 mt-0.5" />
        <p>
          Prayer times are computed using standard astronomical calculations. Adjust calculation methods or add manual minute buffers in <strong>Prayer Settings</strong> to match your local mosque's timetable.
        </p>
      </div>
    </div>
  );
};
