import React, { useState, useEffect } from 'react';
import {
  Repeat,
  RotateCcw,
  Undo2,
  Volume2,
  VolumeX,
  Vibrate,
  VibrateOff,
  Sparkles,
  ChevronDown,
  Check,
} from 'lucide-react';
import { Language, UserPreferences } from '../../../types';
import { getTranslation } from '../../../i18n/translations';
import { playGoalChime, playTasbihClick, triggerHaptic } from '../../../utils/audio';

interface TasbihCounterViewProps {
  language: Language;
  preferences: UserPreferences;
  onUpdateCountToday: (countDelta: number) => void;
}

export const DHIKR_PRESETS = [
  { id: 'subhanallah', ar: 'سُبْحَانَ اللَّهِ', en: 'SubhanAllah', bn: 'সুবহানাল্লাহ', meaning: 'Glory be to Allah' },
  { id: 'alhamdulillah', ar: 'الْحَمْدُ لِلَّهِ', en: 'Alhamdulillah', bn: 'আলহামদুলিল্লাহ', meaning: 'All praise is for Allah' },
  { id: 'allahuakbar', ar: 'اللَّهُ أَكْبَرُ', en: 'Allahu Akbar', bn: 'আল্লাহু আকবার', meaning: 'Allah is the Greatest' },
  { id: 'astaghfirullah', ar: 'أَسْتَغْفِرُ اللَّهَ', en: 'Astaghfirullah', bn: 'আস্তাগফিরুল্লাহ', meaning: 'I seek forgiveness from Allah' },
  { id: 'lailahaillallah', ar: 'لَا إِلَهَ إِلَّا اللَّهُ', en: 'La ilaha illallah', bn: 'লা ইলাহা ইল্লাল্লাহ', meaning: 'There is no god but Allah' },
  { id: 'salawat', ar: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', en: 'Allahumma Salli ala Muhammad', bn: 'আল্লাহুম্মা সাল্লি আলা মুহাম্মদ', meaning: 'Blessings upon the Prophet' },
  { id: 'subhanallah_wa_bihamdihi', ar: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', en: 'SubhanAllahi wa bihamdihi', bn: 'সুবহানাল্লাহি ওয়া বিহামদিহী', meaning: 'Glory and praise be to Allah' },
];

export const TasbihCounterView: React.FC<TasbihCounterViewProps> = ({
  language,
  preferences,
  onUpdateCountToday,
}) => {
  const t = getTranslation(language);

  const [count, setCount] = useState<number>(0);
  const [target, setTarget] = useState<number>(33);
  const [laps, setLaps] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [vibrateEnabled, setVibrateEnabled] = useState<boolean>(true);
  const [selectedDhikr, setSelectedDhikr] = useState(DHIKR_PRESETS[0]);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [history, setHistory] = useState<{ dhikr: string; count: number; date: string }[]>([]);

  // Load from local storage
  useEffect(() => {
    try {
      const savedCount = localStorage.getItem('deen_tasbih_count');
      const savedLaps = localStorage.getItem('deen_tasbih_laps');
      const savedTarget = localStorage.getItem('deen_tasbih_target');
      if (savedCount) setCount(parseInt(savedCount, 10));
      if (savedLaps) setLaps(parseInt(savedLaps, 10));
      if (savedTarget) setTarget(parseInt(savedTarget, 10));
    } catch {
      // Ignore
    }
  }, []);

  const persist = (newCount: number, newLaps: number) => {
    try {
      localStorage.setItem('deen_tasbih_count', newCount.toString());
      localStorage.setItem('deen_tasbih_laps', newLaps.toString());
      localStorage.setItem('deen_tasbih_target', target.toString());
    } catch {
      // Ignore
    }
  };

  const handleIncrement = () => {
    if (soundEnabled) playTasbihClick();
    if (vibrateEnabled) triggerHaptic(20);

    const nextCount = count + 1;
    onUpdateCountToday(1);

    if (target > 0 && nextCount >= target) {
      // Goal reached!
      if (soundEnabled) playGoalChime();
      if (vibrateEnabled) triggerHaptic(100);
      const nextLaps = laps + 1;
      setCount(0);
      setLaps(nextLaps);
      persist(0, nextLaps);
    } else {
      setCount(nextCount);
      persist(nextCount, laps);
    }
  };

  const handleUndo = () => {
    if (count > 0) {
      const prev = count - 1;
      setCount(prev);
      persist(prev, laps);
      onUpdateCountToday(-1);
    }
  };

  const handleConfirmReset = () => {
    setCount(0);
    setLaps(0);
    persist(0, 0);
    setShowResetConfirm(false);
  };

  const progressPercent = target > 0 ? Math.min(100, Math.round((count / target) * 100)) : 0;

  return (
    <div className="space-y-6 pb-24 md:pb-8 max-w-xl mx-auto">
      {/* Header */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-[#064E3B] to-[#087F5B] text-white shadow-sm border border-[#E4EAE5] dark:border-[#23332B] flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold">
            Dhikr & Remembrance
          </span>
          <h1 className="text-2xl font-bold tracking-tight mt-1">
            {t.openTasbih}
          </h1>
        </div>

        {/* Audio & Haptic Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${
              soundEnabled
                ? 'bg-white/20 border-white/30 text-white'
                : 'bg-black/20 border-white/10 text-white/50'
            }`}
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setVibrateEnabled(!vibrateEnabled)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${
              vibrateEnabled
                ? 'bg-white/20 border-white/30 text-white'
                : 'bg-black/20 border-white/10 text-white/50'
            }`}
            title="Toggle Haptic"
          >
            {vibrateEnabled ? <Vibrate className="w-4 h-4" /> : <VibrateOff className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Dhikr Selector Bar */}
      <div className="p-3 bg-white dark:bg-[#19251F] rounded-2xl border border-[#E4EAE5] dark:border-[#23332B] shadow-xs">
        <label className="text-[11px] font-semibold text-[#68756E] dark:text-[#8E9D95] uppercase tracking-wider block mb-1">
          {t.dhikrPreset}
        </label>
        <select
          value={selectedDhikr.id}
          onChange={(e) => {
            const found = DHIKR_PRESETS.find((d) => d.id === e.target.value);
            if (found) setSelectedDhikr(found);
          }}
          className="w-full bg-[#F7F9F6] dark:bg-[#101A16] border border-[#E4EAE5] dark:border-[#23332B] rounded-xl p-2.5 text-xs font-semibold text-[#17231F] dark:text-[#E4EAE5] focus:outline-none focus:border-[#087F5B]"
        >
          {DHIKR_PRESETS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.en} ({d.ar})
            </option>
          ))}
        </select>
      </div>

      {/* Target Selector Buttons */}
      <div className="flex items-center justify-between gap-2 p-1.5 bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] rounded-2xl">
        <span className="text-xs font-semibold text-[#68756E] dark:text-[#8E9D95] pl-3">
          {t.target}:
        </span>
        <div className="flex items-center gap-1.5">
          {[33, 99, 100, 500].map((num) => (
            <button
              key={num}
              onClick={() => {
                setTarget(num);
                localStorage.setItem('deen_tasbih_target', num.toString());
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                target === num
                  ? 'bg-[#087F5B] text-white shadow-xs'
                  : 'text-[#68756E] dark:text-[#8E9D95] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Big Tactile Counter Pad */}
      <div className="p-8 rounded-3xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-sm flex flex-col items-center justify-center text-center">
        {/* Selected Dhikr Display */}
        <p className="font-arabic text-2xl sm:text-3xl text-[#064E3B] dark:text-[#C9A45C] leading-loose mb-1" dir="rtl">
          {selectedDhikr.ar}
        </p>
        <p className="text-xs font-bold text-[#17231F] dark:text-[#E4EAE5]">
          {language === 'bn' ? selectedDhikr.bn : selectedDhikr.en}
        </p>
        <p className="text-[11px] text-[#68756E] dark:text-[#8E9D95] italic mt-0.5">
          "{selectedDhikr.meaning}"
        </p>

        {/* Giant Interactive Tap Area */}
        <button
          onClick={handleIncrement}
          className="my-6 w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-b from-[#F7F9F6] to-white dark:from-[#101A16] dark:to-[#19251F] border-4 border-[#087F5B] dark:border-[#C9A45C] shadow-lg flex flex-col items-center justify-center cursor-pointer select-none active:scale-95 transition-all duration-100 group"
          aria-label={t.tapToCount}
        >
          <span className="text-5xl sm:text-6xl font-extrabold text-[#087F5B] dark:text-[#C9A45C] font-mono tabular-nums tracking-tight group-hover:scale-105 transition-transform">
            {count}
          </span>
          <span className="text-[11px] uppercase tracking-wider text-[#68756E] dark:text-[#8E9D95] font-semibold mt-1">
            {t.tapToCount}
          </span>
          <div className="w-24 bg-[#E4EAE5] dark:bg-[#23332B] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#087F5B] dark:bg-[#C9A45C] h-full transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </button>

        {/* Laps and Sub-stats */}
        <div className="flex items-center gap-6 text-xs text-[#68756E] dark:text-[#8E9D95]">
          <div>
            <span className="font-medium">{t.lap}:</span>{' '}
            <strong className="text-[#17231F] dark:text-[#E4EAE5]">{laps}</strong>
          </div>
          <div>
            <span className="font-medium">Goal:</span>{' '}
            <strong className="text-[#17231F] dark:text-[#E4EAE5]">{target}</strong>
          </div>
        </div>

        {/* Action Controls: Reset & Undo */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handleUndo}
            disabled={count === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E4EAE5] dark:border-[#23332B] text-xs font-semibold text-[#68756E] dark:text-[#8E9D95] hover:text-[#17231F] dark:hover:text-white disabled:opacity-40 transition-colors"
          >
            <Undo2 className="w-4 h-4" />
            <span>{t.undo}</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.reset}</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#19251F] w-full max-w-xs rounded-2xl p-5 border border-[#E4EAE5] dark:border-[#23332B] shadow-xl text-center space-y-3">
            <h3 className="text-sm font-bold text-[#17231F] dark:text-[#E4EAE5]">
              {t.confirmReset}
            </h3>
            <p className="text-xs text-[#68756E] dark:text-[#8E9D95]">
              This will reset your current count and laps back to zero.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 rounded-xl border border-[#E4EAE5] dark:border-[#23332B] text-xs font-semibold text-[#68756E]"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleConfirmReset}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm"
              >
                {t.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
