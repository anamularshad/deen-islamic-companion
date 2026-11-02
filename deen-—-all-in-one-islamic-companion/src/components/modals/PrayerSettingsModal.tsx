import React from 'react';
import { X, Sliders, Check } from 'lucide-react';
import { Language, UserPreferences } from '../../types';
import { getTranslation } from '../../i18n/translations';

interface PrayerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (updates: Partial<UserPreferences>) => void;
  language: Language;
}

export const PrayerSettingsModal: React.FC<PrayerSettingsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
  language,
}) => {
  const t = getTranslation(language);

  if (!isOpen) return null;

  const calculationMethods = [
    { id: 'UmmAlQura', name: 'Umm Al-Qura University, Makkah', region: 'Arabian Peninsula' },
    { id: 'MuslimWorldLeague', name: 'Muslim World League (MWL)', region: 'Europe, Far East, parts of America' },
    { id: 'NorthAmerica', name: 'Islamic Society of North America (ISNA)', region: 'USA & Canada' },
    { id: 'Egyptian', name: 'Egyptian General Authority of Survey', region: 'Africa, Syria, Lebanon' },
    { id: 'Karachi', name: 'University of Islamic Sciences, Karachi', region: 'Pakistan, Bangladesh, India, Afghanistan' },
    { id: 'Dubai', name: 'Dubai General Authority of Islamic Affairs', region: 'UAE' },
    { id: 'Qatar', name: 'Ministry of Awqaf & Islamic Affairs, Qatar', region: 'Qatar' },
    { id: 'Kuwait', name: 'Ministry of Awqaf, Kuwait', region: 'Kuwait' },
    { id: 'MoonsightingCommittee', name: 'Moonsighting Committee Worldwide', region: 'North America / UK' },
    { id: 'Singapore', name: 'Majlis Ugama Islam Singapura (MUIS)', region: 'Singapore, Malaysia' },
    { id: 'Turkey', name: 'Diyanet İşleri Başkanlığı', region: 'Turkey' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#19251F] w-full max-w-lg rounded-2xl shadow-xl border border-[#E4EAE5] dark:border-[#23332B] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#E4EAE5] dark:border-[#23332B] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#087F5B] dark:text-[#C9A45C]" />
            <h3 className="text-base font-semibold text-[#17231F] dark:text-[#E4EAE5]">
              {t.calculationSettings}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#68756E] hover:text-[#17231F] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs text-[#17231F] dark:text-[#E4EAE5]">
          {/* Asr Juristic Method */}
          <div>
            <label className="font-bold text-sm block mb-1">
              {t.asrJuristic}
            </label>
            <p className="text-[11px] text-[#68756E] dark:text-[#8E9D95] mb-2.5">
              Hanafi shadow ratio is 2x object length; Standard (Shafi'i, Maliki, Hanbali) is 1x.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'Standard', title: 'Standard (Shafi, Maliki, Hanbali)', desc: 'Earlier Asr' },
                { id: 'Hanafi', title: 'Hanafi School', desc: 'Later Asr (2x shadow)' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => onUpdatePreferences({ asrMethod: m.id as any })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    preferences.asrMethod === m.id
                      ? 'border-[#087F5B] dark:border-[#C9A45C] bg-[#087F5B]/10 dark:bg-[#C9A45C]/15 font-bold text-[#087F5B] dark:text-[#C9A45C]'
                      : 'border-[#E4EAE5] dark:border-[#23332B] hover:bg-[#F7F9F6] dark:hover:bg-[#101A16]'
                  }`}
                >
                  <p className="font-semibold">{m.title}</p>
                  <p className="text-[10px] text-[#68756E] dark:text-[#8E9D95] mt-0.5">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Calculation Convention Method */}
          <div>
            <label className="font-bold text-sm block mb-1">
              {t.calculationMethod}
            </label>
            <p className="text-[11px] text-[#68756E] dark:text-[#8E9D95] mb-2.5">
              Determines Fajr & Isha twilight angle conventions used by major Islamic authorities.
            </p>
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {calculationMethods.map((cm) => {
                const isSelected = preferences.calculationMethod === cm.id;
                return (
                  <button
                    key={cm.id}
                    onClick={() => onUpdatePreferences({ calculationMethod: cm.id })}
                    className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'border-[#087F5B] dark:border-[#C9A45C] bg-[#087F5B]/10 dark:bg-[#C9A45C]/15 text-[#087F5B] dark:text-[#C9A45C]'
                        : 'border-[#E4EAE5] dark:border-[#23332B] hover:bg-[#F7F9F6] dark:hover:bg-[#101A16]'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-xs">{cm.name}</p>
                      <p className="text-[10px] text-[#68756E] dark:text-[#8E9D95] mt-0.5">{cm.region}</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#087F5B] dark:text-[#C9A45C]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* High Latitude Adjustment */}
          <div>
            <label className="font-bold text-sm block mb-1">
              High Latitude Adjustment
            </label>
            <p className="text-[11px] text-[#68756E] dark:text-[#8E9D95] mb-2.5">
              For locations at high latitudes during summer months where twilight persists all night.
            </p>
            <select
              value={preferences.highLatitudeRule}
              onChange={(e) => onUpdatePreferences({ highLatitudeRule: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-[#E4EAE5] dark:border-[#23332B] bg-[#F7F9F6] dark:bg-[#101A16] text-xs font-medium focus:outline-none focus:border-[#087F5B]"
            >
              <option value="MiddleOfTheNight">Middle of the Night (Standard)</option>
              <option value="SeventhOfTheNight">Seventh of the Night</option>
              <option value="TwilightAngle">Twilight Angle Relative</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E4EAE5] dark:border-[#23332B] bg-[#F7F9F6] dark:bg-[#101A16]/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#087F5B] hover:bg-[#064E3B] text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
