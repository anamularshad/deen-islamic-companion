import React, { useState } from 'react';
import {
  CheckCircle2,
  Users,
  XCircle,
  Clock,
  Plus,
  Minus,
  Save,
  Moon,
  Info,
  BarChart2,
  Calendar,
  CheckSquare,
} from 'lucide-react';
import { DailyPrayerTracker, Language, PrayerName } from '../../../types';
import { QadaState } from '../../../utils/storage';
import { getTranslation } from '../../../i18n/translations';
import { PrayerD3Chart } from '../../charts/PrayerD3Chart';

interface PrayerTrackerViewProps {
  language: Language;
  todayTracker: DailyPrayerTracker;
  trackerData?: Record<string, DailyPrayerTracker>;
  qadaState: QadaState;
  onUpdatePrayerStatus: (prayer: PrayerName, status: 'completed' | 'jamaah' | 'missed' | 'none') => void;
  onUpdateFastingStatus: (fasted: boolean) => void;
  onUpdateNotes: (notes: string) => void;
  onUpdateQada: (updates: Partial<QadaState>) => void;
  onSaveFullTrackerData?: (data: Record<string, DailyPrayerTracker>) => void;
  initialTab?: 'checklist' | 'history';
}

export const PrayerTrackerView: React.FC<PrayerTrackerViewProps> = ({
  language,
  todayTracker,
  trackerData = {},
  qadaState,
  onUpdatePrayerStatus,
  onUpdateFastingStatus,
  onUpdateNotes,
  onUpdateQada,
  onSaveFullTrackerData,
  initialTab = 'checklist',
}) => {
  const t = getTranslation(language);
  const [activeTab, setActiveTab] = useState<'checklist' | 'history'>(initialTab);
  const [localNotes, setLocalNotes] = useState(todayTracker.notes || '');
  const [notesSaved, setNotesSaved] = useState(false);
  const [isSampleActive, setIsSampleActive] = useState(false);
  const [backupUserData, setBackupUserData] = useState<Record<string, DailyPrayerTracker> | null>(null);

  const prayers: { id: PrayerName; label: string; ar: string }[] = [
    { id: 'fajr', label: t.fajr, ar: 'الفجر' },
    { id: 'dhuhr', label: t.dhuhr, ar: 'الظهر' },
    { id: 'asr', label: t.asr, ar: 'العصر' },
    { id: 'maghrib', label: t.maghrib, ar: 'المغرب' },
    { id: 'isha', label: t.isha, ar: 'العشاء' },
  ];

  const handleSaveNotes = () => {
    onUpdateNotes(localNotes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const completedCount = Object.values(todayTracker.prayers).filter(
    (s) => s === 'completed' || s === 'jamaah'
  ).length;

  // Handle seeding sample data for testing D3 chart
  const handleSeedSampleData = (sample: Record<string, DailyPrayerTracker>) => {
    if (!backupUserData) {
      setBackupUserData(trackerData);
    }
    setIsSampleActive(true);
    if (onSaveFullTrackerData) {
      onSaveFullTrackerData(sample);
    }
  };

  const handleClearSampleData = () => {
    if (backupUserData && onSaveFullTrackerData) {
      onSaveFullTrackerData(backupUserData);
    }
    setIsSampleActive(false);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#064E3B] to-[#087F5B] text-white shadow-sm border border-[#E4EAE5] dark:border-[#23332B]">
        <div className="max-w-xl">
          <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold">
            Personal Worship Journal &amp; Analytics
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            {t.trackPrayers}
          </h1>
          <p className="text-xs text-white/80 mt-1 leading-relaxed">
            Record your daily obligatory prayers, track congregation, and visualize your 30-day worship consistency with interactive D3 charts.
          </p>
        </div>
      </div>

      {/* Main Tab Switch: Daily Checklist vs 30-Day D3 History */}
      <div className="flex p-1.5 rounded-2xl bg-[#F7F9F6] dark:bg-[#101A16] border border-[#E4EAE5] dark:border-[#23332B] gap-2">
        <button
          onClick={() => setActiveTab('checklist')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'checklist'
              ? 'bg-white dark:bg-[#19251F] text-[#087F5B] dark:text-[#C9A45C] shadow-sm'
              : 'text-[#68756E] dark:text-[#8E9D95] hover:text-[#17231F] dark:hover:text-[#E4EAE5]'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Today's Checklist</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'history'
              ? 'bg-white dark:bg-[#19251F] text-[#087F5B] dark:text-[#C9A45C] shadow-sm'
              : 'text-[#68756E] dark:text-[#8E9D95] hover:text-[#17231F] dark:hover:text-[#E4EAE5]'
          }`}
        >
          <BarChart2 className="w-4 h-4 text-[#087F5B] dark:text-[#C9A45C]" />
          <span>30-Day Completion History (D3 Chart)</span>
        </button>
      </div>

      {/* TAB 1: DAILY CHECKLIST & TODAY'S JOURNAL */}
      {activeTab === 'checklist' && (
        <div className="space-y-6">
          {/* Today's Summary Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#68756E] dark:text-[#8E9D95] uppercase tracking-wider">
                Today's Obligatory Prayers
              </span>
              <p className="text-2xl font-extrabold text-[#087F5B] dark:text-[#C9A45C] mt-0.5 tabular-nums">
                {completedCount} of 5 Completed
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateFastingStatus(!todayTracker.fasted)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  todayTracker.fasted
                    ? 'bg-[#087F5B] text-white shadow-xs'
                    : 'border border-[#E4EAE5] dark:border-[#23332B] text-[#68756E] dark:text-[#8E9D95]'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>{todayTracker.fasted ? t.fastedToday : 'Mark Fasting'}</span>
              </button>
            </div>
          </div>

          {/* 5 Daily Prayers Checklist */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#68756E] dark:text-[#8E9D95] px-1">
              {t.dailyChecklist}
            </h2>

            {prayers.map((prayer) => {
              const currentStatus = todayTracker.prayers[prayer.id] || 'none';

              return (
                <div
                  key={prayer.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        currentStatus === 'completed' || currentStatus === 'jamaah'
                          ? 'bg-[#087F5B] text-white'
                          : currentStatus === 'missed'
                          ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-600'
                          : 'bg-[#F7F9F6] dark:bg-[#101A16] text-[#68756E]'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#17231F] dark:text-[#E4EAE5]">
                        {prayer.label}
                      </h3>
                      <p className="text-xs font-arabic text-[#68756E] dark:text-[#8E9D95]">
                        {prayer.ar}
                      </p>
                    </div>
                  </div>

                  {/* Status Selector Buttons */}
                  <div className="grid grid-cols-4 gap-1.5 sm:flex sm:items-center">
                    <button
                      onClick={() => onUpdatePrayerStatus(prayer.id, 'completed')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                        currentStatus === 'completed'
                          ? 'bg-[#087F5B] text-white shadow-xs'
                          : 'border border-[#E4EAE5] dark:border-[#23332B] text-[#68756E] dark:text-[#8E9D95] hover:bg-[#F7F9F6] dark:hover:bg-[#101A16]'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.prayed}</span>
                    </button>

                    <button
                      onClick={() => onUpdatePrayerStatus(prayer.id, 'jamaah')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                        currentStatus === 'jamaah'
                          ? 'bg-[#064E3B] text-white shadow-xs'
                          : 'border border-[#E4EAE5] dark:border-[#23332B] text-[#68756E] dark:text-[#8E9D95] hover:bg-[#F7F9F6] dark:hover:bg-[#101A16]'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{t.prayedJamaah}</span>
                    </button>

                    <button
                      onClick={() => onUpdatePrayerStatus(prayer.id, 'missed')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                        currentStatus === 'missed'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'border border-[#E4EAE5] dark:border-[#23332B] text-[#68756E] dark:text-[#8E9D95] hover:bg-[#F7F9F6] dark:hover:bg-[#101A16]'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{t.missed}</span>
                    </button>

                    <button
                      onClick={() => onUpdatePrayerStatus(prayer.id, 'none')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        currentStatus === 'none'
                          ? 'bg-slate-200 dark:bg-slate-800 text-[#17231F] dark:text-white'
                          : 'border border-transparent text-[#68756E] dark:text-[#8E9D95]'
                      }`}
                    >
                      {t.notYet}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Preview Link to 30-Day D3 Chart */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/70 dark:border-emerald-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#087F5B] text-white flex items-center justify-center shrink-0">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#17231F] dark:text-[#E4EAE5]">
                  Analyze 30-Day Prayer Consistency
                </h4>
                <p className="text-[11px] text-[#68756E] dark:text-[#8E9D95]">
                  View interactive D3 completion trends, congregation breakdown, and streaks.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('history')}
              className="px-3.5 py-2 rounded-xl bg-[#087F5B] hover:bg-[#064E3B] text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
            >
              Open D3 Chart
            </button>
          </div>

          {/* Qada (Make-up) Counter Section */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#17231F] dark:text-[#E4EAE5]">
                {t.qadaCounter}
              </h3>
              <p className="text-xs text-[#68756E] dark:text-[#8E9D95] mt-0.5">
                Keep track of missed prayers you intend to make up over time.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { key: 'fajr', label: 'Fajr', val: qadaState.fajr },
                { key: 'dhuhr', label: 'Dhuhr', val: qadaState.dhuhr },
                { key: 'asr', label: 'Asr', val: qadaState.asr },
                { key: 'maghrib', label: 'Maghrib', val: qadaState.maghrib },
                { key: 'isha', label: 'Isha', val: qadaState.isha },
              ].map((item) => (
                <div
                  key={item.key}
                  className="p-3 rounded-xl border border-[#E4EAE5] dark:border-[#23332B] bg-[#F7F9F6] dark:bg-[#101A16] flex flex-col items-center justify-between"
                >
                  <span className="text-xs font-semibold text-[#17231F] dark:text-[#E4EAE5]">
                    {item.label}
                  </span>
                  <span className="text-xl font-bold my-1 text-[#087F5B] dark:text-[#C9A45C] tabular-nums">
                    {item.val}
                  </span>
                  <div className="flex items-center gap-1 w-full justify-center">
                    <button
                      onClick={() => onUpdateQada({ [item.key]: Math.max(0, item.val - 1) })}
                      disabled={item.val <= 0}
                      className="w-7 h-7 rounded-lg border border-[#E4EAE5] dark:border-[#23332B] flex items-center justify-center text-xs disabled:opacity-30 hover:bg-white dark:hover:bg-[#19251F]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onUpdateQada({ [item.key]: item.val + 1 })}
                      className="w-7 h-7 rounded-lg bg-[#087F5B] text-white flex items-center justify-center text-xs hover:bg-[#064E3B]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Private Personal Reflections */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-xs space-y-3">
            <label className="text-xs font-bold text-[#17231F] dark:text-[#E4EAE5] block">
              {t.saveNotes}
            </label>
            <textarea
              rows={3}
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              placeholder="Record private spiritual thoughts, du'as requested by friends, or Quran reflections..."
              className="w-full p-3 rounded-xl border border-[#E4EAE5] dark:border-[#23332B] bg-[#F7F9F6] dark:bg-[#101A16] text-xs text-[#17231F] dark:text-[#E4EAE5] focus:outline-none focus:border-[#087F5B]"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 rounded-xl bg-[#087F5B] text-white text-xs font-semibold hover:bg-[#064E3B] transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{notesSaved ? 'Saved locally!' : 'Save Notes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 30-DAY D3.JS INTERACTIVE COMPLETION HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <PrayerD3Chart
            language={language}
            trackerData={trackerData}
            onSeedSampleData={handleSeedSampleData}
            onClearSampleData={handleClearSampleData}
            isSampleActive={isSampleActive}
          />
        </div>
      )}

      {/* Privacy Notice */}
      <div className="p-4 rounded-2xl bg-[#F7F9F6] dark:bg-[#101A16] border border-[#E4EAE5] dark:border-[#23332B] text-xs text-[#68756E] dark:text-[#8E9D95] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#087F5B] dark:text-[#C9A45C] shrink-0 mt-0.5" />
        <p>
          Your prayer tracker records and 30-day analytics are stored strictly in your browser's private local storage. They are never transmitted to any external server.
        </p>
      </div>
    </div>
  );
};
