import { MapPin, Moon, Sun, Search, Globe, Smartphone } from 'lucide-react';
import { CityLocation, Language } from '../../types';
import { getTranslation } from '../../i18n/translations';

interface TopHeaderProps {
  language: Language;
  theme: 'light' | 'dark';
  currentCity: CityLocation;
  hijriFormatted: string;
  gregorianFormatted: string;
  onOpenLocationModal: () => void;
  onToggleTheme: () => void;
  onSelectLanguage: (lang: Language) => void;
  onOpenSearch: () => void;
  onOpenApkModal?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  language,
  theme,
  currentCity,
  hijriFormatted,
  gregorianFormatted,
  onOpenLocationModal,
  onToggleTheme,
  onSelectLanguage,
  onOpenSearch,
  onOpenApkModal,
}) => {
  const t = getTranslation(language);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#E4EAE5] dark:border-[#23332B] bg-[#F7F9F6]/90 dark:bg-[#101A16]/90 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#087F5B] flex items-center justify-center text-white font-bold text-sm shadow-sm">
            د
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-[#064E3B] dark:text-[#E4EAE5] leading-none">
              {t.appName}
            </span>
            <span className="text-[11px] text-[#68756E] dark:text-[#8E9D95] font-medium leading-tight mt-0.5 hidden sm:block">
              {hijriFormatted}
            </span>
          </div>
        </div>

        {/* Center: Location Button */}
        <button
          onClick={onOpenLocationModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E4EAE5] dark:border-[#23332B] bg-white dark:bg-[#19251F] text-xs font-medium text-[#17231F] dark:text-[#E4EAE5] hover:border-[#087F5B] dark:hover:border-[#C9A45C] transition-colors max-w-[160px] sm:max-w-xs truncate"
          title={t.changeLocation}
        >
          <MapPin className="w-3.5 h-3.5 text-[#087F5B] dark:text-[#C9A45C] shrink-0" />
          <span className="truncate">{currentCity.name}, {currentCity.country}</span>
        </button>

        {/* Right Actions: APK/Install, Search, Language, Theme */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onOpenApkModal && (
            <button
              onClick={onOpenApkModal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#087F5B] hover:bg-[#064E3B] text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
              title="Test & Install on Android (APK)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Get App (APK)</span>
              <span className="sm:hidden">App</span>
            </button>
          )}

          <button
            onClick={onOpenSearch}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#68756E] dark:text-[#8E9D95] hover:text-[#17231F] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title={t.globalSearch}
            aria-label={t.globalSearch}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Language Switcher */}
          <div className="relative inline-flex items-center">
            <select
              value={language}
              onChange={(e) => onSelectLanguage(e.target.value as Language)}
              aria-label={t.language}
              className="appearance-none bg-transparent pl-7 pr-2 py-1 text-xs font-medium text-[#68756E] dark:text-[#8E9D95] hover:text-[#17231F] dark:hover:text-white rounded-md cursor-pointer focus:outline-none"
            >
              <option value="en" className="dark:bg-[#19251F]">EN</option>
              <option value="ar" className="dark:bg-[#19251F]">العربية</option>
              <option value="bn" className="dark:bg-[#19251F]">বাংলা</option>
            </select>
            <Globe className="w-3.5 h-3.5 text-[#68756E] dark:text-[#8E9D95] pointer-events-none absolute left-1.5" />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#68756E] dark:text-[#8E9D95] hover:text-[#17231F] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title={theme === 'dark' ? t.light : t.dark}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#C9A45C]" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
