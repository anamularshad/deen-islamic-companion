import React, { useState } from 'react';
import {
  Settings,
  Globe,
  MapPin,
  Moon,
  Sun,
  Sliders,
  Volume2,
  Download,
  Trash2,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { CityLocation, Language, UserPreferences } from '../../../types';
import { getTranslation } from '../../../i18n/translations';
import { exportAllUserData, clearAllLocalUserData } from '../../../utils/storage';

interface SettingsViewProps {
  language: Language;
  preferences: UserPreferences;
  onUpdatePreferences: (updates: Partial<UserPreferences>) => void;
  onOpenLocationModal: () => void;
  onOpenPrayerSettings: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  language,
  preferences,
  onUpdatePreferences,
  onOpenLocationModal,
  onOpenPrayerSettings,
}) => {
  const t = getTranslation(language);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleExport = () => {
    const jsonStr = exportAllUserData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deen-data-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    clearAllLocalUserData();
    setShowClearConfirm(false);
    setClearedNotice(true);
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#064E3B] to-[#087F5B] text-white shadow-sm border border-[#E4EAE5] dark:border-[#23332B]">
        <div className="max-w-xl">
          <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold">
            Preferences & Privacy
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            {t.settings}
          </h1>
          <p className="text-xs text-white/80 mt-1 leading-relaxed">
            Customize language, appearance, prayer calculations, typography, and manage local data.
          </p>
        </div>
      </div>

      {/* Language Preference */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-xs space-y-3">
        <label className="text-xs font-bold text-[#17231F] dark:text-[#E4EAE5] uppercase tracking-wider flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#087F5B] dark:text-[#C9A45C]" />
          <span>{t.language}</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'en', label: 'English', desc: 'English interface' },
            { id: 'ar', label: 'العربية', desc: 'دعم RTL كامل' },
            { id: 'bn', label: 'বাংলা', desc: 'সহজ বাংলা অনুবাদ' },
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => onUpdatePreferences({ language: l.id as Language })}
              className={`p-3 rounded-xl border text-center transition-all ${
                preferences.language === l.id
                  ? 'border-[#087F5B] dark:border-[#C9A45C] bg-[#087F5B]/10 dark:bg-[#C9A45C]/15 font-bold text-[#087F5B] dark:text-[#C9A45C]'
                  : 'border-[#E4EAE5] dark:border-[#23332B] hover:bg-[#F7F9F6] dark:hover:bg-[#101A16] text-[#17231F] dark:text-[#E4EAE5]'
              }`}
            >
              <p className="text-sm font-bold">{l.label}</p>
              <p className="text-[10px] text-[#68756E] dark:text-[#8E9D95] mt-0.5">{l.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Appearance (Theme) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-xs space-y-3">
        <label className="text-xs font-bold text-[#17231F] dark:text-[#E4EAE5] uppercase tracking-wider flex items-center gap-2">
          <Sun className="w-4 h-4 text-[#087F5B] dark:text-[#C9A45C]" />
          <span>{t.themeMode}</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onUpdatePreferences({ theme: 'light' })}
            className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
              preferences.theme === 'light'
                ? 'border-[#087F5B] bg-[#087F5B]/10 text-[#087F5B] font-bold'
                : 'border-[#E4EAE5] dark:border-[#23332B] text-[#68756E]'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>{t.light} Theme</span>
          </button>
          <button
            onClick={() => onUpdatePreferences({ theme: 'dark' })}
            className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
              preferences.theme === 'dark'
                ? 'border-[#C9A45C] bg-[#C9A45C]/15 text-[#C9A45C] font-bold'
                : 'border-[#E4EAE5] dark:border-[#23332B] text-[#68756E]'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>{t.dark} Theme</span>
          </button>
        </div>
      </div>

      {/* Location & Calculation */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-xs space-y-3">
        <label className="text-xs font-bold text-[#17231F] dark:text-[#E4EAE5] uppercase tracking-wider flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#087F5B] dark:text-[#C9A45C]" />
          <span>{t.location} & Prayer Calculation</span>
        </label>

        <div className="p-3 rounded-xl bg-[#F7F9F6] dark:bg-[#101A16] border border-[#E4EAE5] dark:border-[#23332B] flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#17231F] dark:text-[#E4EAE5]">
              {preferences.selectedCity.name}, {preferences.selectedCity.country}
            </p>
            <p className="text-[11px] text-[#68756E] dark:text-[#8E9D95]">
              Method: {preferences.calculationMethod} · Asr: {preferences.asrMethod}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenLocationModal}
              className="px-3 py-1.5 rounded-lg border border-[#087F5B] text-[#087F5B] dark:border-[#C9A45C] dark:text-[#C9A45C] text-xs font-semibold hover:bg-[#087F5B]/10 transition-colors"
            >
              Change City
            </button>
            <button
              onClick={onOpenPrayerSettings}
              className="px-3 py-1.5 rounded-lg border border-[#E4EAE5] dark:border-[#23332B] text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Typography Font Size Sliders */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-xs space-y-4">
        <label className="text-xs font-bold text-[#17231F] dark:text-[#E4EAE5] uppercase tracking-wider block">
          Quran Reading Typography
        </label>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-semibold">{t.arabicSize}</span>
            <span className="font-mono text-[#087F5B] dark:text-[#C9A45C]">{preferences.arabicFontSize}px</span>
          </div>
          <input
            type="range"
            min="22"
            max="42"
            value={preferences.arabicFontSize}
            onChange={(e) => onUpdatePreferences({ arabicFontSize: parseInt(e.target.value, 10) })}
            className="w-full accent-[#087F5B]"
          />
          <p className="text-right font-arabic text-lg mt-1 text-[#064E3B] dark:text-[#C9A45C]" dir="rtl" style={{ fontSize: `${preferences.arabicFontSize}px` }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>

        <div className="pt-2 border-t border-[#E4EAE5] dark:border-[#23332B]">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-semibold">{t.translationSize}</span>
            <span className="font-mono text-[#087F5B] dark:text-[#C9A45C]">{preferences.translationFontSize}px</span>
          </div>
          <input
            type="range"
            min="13"
            max="20"
            value={preferences.translationFontSize}
            onChange={(e) => onUpdatePreferences({ translationFontSize: parseInt(e.target.value, 10) })}
            className="w-full accent-[#087F5B]"
          />
        </div>
      </div>

      {/* Data Backup & Privacy Controls */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-xs space-y-3">
        <label className="text-xs font-bold text-[#17231F] dark:text-[#E4EAE5] uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#087F5B] dark:text-[#C9A45C]" />
          <span>{t.privacyControls}</span>
        </label>
        <p className="text-xs text-[#68756E] dark:text-[#8E9D95]">
          All prayer logs, tasbih counts, notes, and bookmarks are kept 100% locally in your browser.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            onClick={handleExport}
            className="flex-1 py-2.5 px-4 rounded-xl border border-[#E4EAE5] dark:border-[#23332B] hover:border-[#087F5B] text-xs font-semibold text-[#17231F] dark:text-[#E4EAE5] flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-[#087F5B] dark:text-[#C9A45C]" />
            <span>{t.exportData}</span>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="py-2.5 px-4 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.clearAllData}</span>
          </button>
        </div>

        {clearedNotice && (
          <p className="text-xs text-emerald-600 font-semibold text-center mt-2">
            Local data cleared. Reloading application...
          </p>
        )}
      </div>

      {/* Scholarly Disclaimer Footer */}
      <div className="p-4 rounded-2xl bg-[#087F5B]/5 dark:bg-[#C9A45C]/10 border border-[#087F5B]/20 dark:border-[#C9A45C]/30 text-xs text-[#68756E] dark:text-[#8E9D95] text-center">
        {t.scholarDisclaimer}
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#19251F] w-full max-w-sm rounded-2xl p-6 border border-[#E4EAE5] dark:border-[#23332B] shadow-xl text-center space-y-3">
            <h3 className="text-sm font-bold text-rose-600">
              Clear All Local Data?
            </h3>
            <p className="text-xs text-[#68756E] dark:text-[#8E9D95]">
              This will permanently delete all your saved bookmarks, worship tracker history, and custom settings on this device.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 rounded-xl border border-[#E4EAE5] dark:border-[#23332B] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
              >
                Yes, Clear Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
