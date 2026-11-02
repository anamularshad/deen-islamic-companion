import React from 'react';
import { Home, BookOpen, Clock, Bookmark, Grid } from 'lucide-react';
import { NavTab, Language } from '../../types';
import { getTranslation } from '../../i18n/translations';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  language,
}) => {
  const t = getTranslation(language);

  const tabs: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'quran', label: t.navQuran, icon: BookOpen },
    { id: 'prayer', label: t.navPrayer, icon: Clock },
    { id: 'hadith', label: t.navHadith, icon: Bookmark },
    { id: 'more', label: t.navMore, icon: Grid },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#101A16]/95 backdrop-blur-md border-t border-[#E4EAE5] dark:border-[#23332B] pb-[env(safe-area-inset-bottom)] transition-colors">
      <div className="grid grid-cols-5 h-16 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors relative ${
                isActive
                  ? 'text-[#087F5B] dark:text-[#C9A45C]'
                  : 'text-[#68756E] dark:text-[#8E9D95] hover:text-[#17231F] dark:hover:text-white'
              }`}
              aria-label={tab.label}
              aria-selected={isActive}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
              <span className={`text-[11px] font-medium tracking-tight mt-1 truncate max-w-[60px] ${
                isActive ? 'font-semibold' : ''
              }`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#087F5B] dark:bg-[#C9A45C]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
