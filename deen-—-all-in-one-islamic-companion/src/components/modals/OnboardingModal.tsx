import React, { useState } from 'react';
import { Sparkles, Globe, MapPin, ArrowRight } from 'lucide-react';
import { CityLocation, Language } from '../../types';
import { POPULAR_CITIES } from '../../data/cities';
import { getTranslation } from '../../i18n/translations';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (lang: Language, city: CityLocation) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
}) => {
  const [selectedLang, setSelectedLang] = useState<Language>('en');
  const [selectedCity, setSelectedCity] = useState<CityLocation>(POPULAR_CITIES[0]);
  const [step, setStep] = useState<1 | 2>(1);

  if (!isOpen) return null;

  const t = getTranslation(selectedLang);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="bg-white dark:bg-[#19251F] w-full max-w-md rounded-3xl shadow-2xl border border-[#E4EAE5] dark:border-[#23332B] p-6 sm:p-8 flex flex-col transition-colors">
        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#087F5B]/10 dark:bg-[#C9A45C]/15 border border-[#087F5B]/20 dark:border-[#C9A45C]/30 flex items-center justify-center text-[#087F5B] dark:text-[#C9A45C] mx-auto mb-4">
          <Sparkles className="w-7 h-7" />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#17231F] dark:text-[#E4EAE5] tracking-tight">
            {selectedLang === 'ar' ? 'مرحباً بك في دين' : selectedLang === 'bn' ? 'দ্বীন-এ স্বাগতম' : 'Welcome to DEEN'}
          </h2>
          <p className="text-xs text-[#68756E] dark:text-[#8E9D95] mt-1 max-w-xs mx-auto">
            {t.tagline}
          </p>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-[#17231F] dark:text-[#E4EAE5] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#087F5B] dark:text-[#C9A45C]" />
              <span>Select Your Language / اختر اللغة / ভাষা নির্বাচন করুন</span>
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              {[
                { id: 'en', title: 'English', desc: 'English interface & translations' },
                { id: 'ar', title: 'العربية', desc: 'واجهة باللغة العربية مع دعم كامل' },
                { id: 'bn', title: 'বাংলা', desc: 'সহজ বাংলা অনুবাদ ও ফিচারসমূহ' },
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLang(lang.id as Language)}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    selectedLang === lang.id
                      ? 'border-[#087F5B] dark:border-[#C9A45C] bg-[#087F5B]/5 dark:bg-[#C9A45C]/10 text-[#087F5B] dark:text-[#C9A45C]'
                      : 'border-[#E4EAE5] dark:border-[#23332B] hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold">{lang.title}</p>
                    <p className="text-[11px] text-[#68756E] dark:text-[#8E9D95] mt-0.5">{lang.desc}</p>
                  </div>
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedLang === lang.id
                      ? 'border-[#087F5B] dark:border-[#C9A45C] bg-[#087F5B] dark:bg-[#C9A45C]'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}>
                    {selectedLang === lang.id && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-4 py-3 rounded-xl bg-[#087F5B] hover:bg-[#064E3B] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-[#17231F] dark:text-[#E4EAE5] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#087F5B] dark:text-[#C9A45C]" />
              <span>{t.selectCity}</span>
            </p>

            <div className="max-h-52 overflow-y-auto space-y-1 pr-1 border border-[#E4EAE5] dark:border-[#23332B] rounded-2xl p-2">
              {POPULAR_CITIES.map((city) => (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-center justify-between ${
                    selectedCity.id === city.id
                      ? 'bg-[#087F5B] text-white font-semibold'
                      : 'hover:bg-black/5 dark:hover:bg-white/5 text-[#17231F] dark:text-[#E4EAE5]'
                  }`}
                >
                  <span>{city.name}, {city.country}</span>
                  {selectedCity.id === city.id && <span>✓</span>}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-4 rounded-xl border border-[#E4EAE5] dark:border-[#23332B] text-xs font-semibold text-[#68756E] dark:text-[#8E9D95]"
              >
                Back
              </button>
              <button
                onClick={() => onComplete(selectedLang, selectedCity)}
                className="flex-1 py-3 rounded-xl bg-[#087F5B] hover:bg-[#064E3B] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <span>Enter DEEN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
