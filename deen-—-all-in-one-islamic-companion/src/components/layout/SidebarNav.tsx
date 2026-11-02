import React from 'react';
import {
  Home,
  BookOpen,
  Clock,
  Bookmark,
  Compass,
  Repeat,
  CheckSquare,
  Moon,
  GraduationCap,
  Sparkles,
  Search,
  Settings,
  Heart,
  Calendar,
  Calculator,
  Building2,
} from 'lucide-react';
import { NavTab, MoreSubSection, Language } from '../../types';
import { getTranslation } from '../../i18n/translations';

interface SidebarNavProps {
  activeTab: NavTab;
  moreSubSection: MoreSubSection;
  onNavigateTab: (tab: NavTab) => void;
  onNavigateSub: (sub: MoreSubSection) => void;
  language: Language;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  moreSubSection,
  onNavigateTab,
  onNavigateSub,
  language,
}) => {
  const t = getTranslation(language);

  const mainNav = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'quran', label: t.navQuran, icon: BookOpen },
    { id: 'prayer', label: t.navPrayer, icon: Clock },
    { id: 'hadith', label: t.navHadith, icon: Bookmark },
  ];

  const toolsNav = [
    { id: 'mosques', label: t.mosquesNearMe, icon: Building2 },
    { id: 'qibla', label: t.findQibla, icon: Compass },
    { id: 'tasbih', label: t.openTasbih, icon: Repeat },
    { id: 'duas', label: t.readDuas, icon: Heart },
    { id: 'tracker', label: t.trackPrayers, icon: CheckSquare },
    { id: 'ramadan', label: t.ramadanHub, icon: Moon },
    { id: 'calendar', label: 'Hijri Calendar', icon: Calendar },
    { id: 'learning', label: t.knowledgeCenter, icon: GraduationCap },
    { id: 'zakat', label: t.zakatCalculator, icon: Calculator },
    { id: 'ai-assistant', label: t.aiAssistant, icon: Sparkles },
    { id: 'bookmarks', label: t.bookmarks, icon: Bookmark },
    { id: 'search', label: t.globalSearch, icon: Search },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-[#E4EAE5] dark:border-[#23332B] bg-white dark:bg-[#19251F] shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto p-4 transition-colors">
      {/* Main Sections */}
      <div className="space-y-1 mb-6">
        <p className="px-3 text-[11px] font-semibold tracking-wider uppercase text-[#68756E] dark:text-[#8E9D95] mb-2">
          Overview
        </p>
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigateTab(item.id as NavTab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#087F5B] text-white shadow-sm'
                  : 'text-[#17231F] dark:text-[#E4EAE5] hover:bg-[#F7F9F6] dark:hover:bg-[#101A16]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Worship & Companion Tools */}
      <div className="space-y-1 pt-4 border-t border-[#E4EAE5] dark:border-[#23332B]">
        <p className="px-3 text-[11px] font-semibold tracking-wider uppercase text-[#68756E] dark:text-[#8E9D95] mb-2">
          Worship & Tools
        </p>
        {toolsNav.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTab === 'more' && moreSubSection === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => onNavigateSub(tool.id as MoreSubSection)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-[#087F5B]/10 dark:bg-[#C9A45C]/15 text-[#087F5B] dark:text-[#C9A45C] font-semibold'
                  : 'text-[#68756E] dark:text-[#8E9D95] hover:text-[#17231F] dark:hover:text-white hover:bg-[#F7F9F6] dark:hover:bg-[#101A16]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{tool.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
