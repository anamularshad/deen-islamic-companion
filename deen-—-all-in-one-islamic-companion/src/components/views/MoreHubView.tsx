import React, { useMemo } from 'react';
import {
  Compass,
  Repeat,
  Heart,
  CheckSquare,
  Moon,
  Calendar,
  GraduationCap,
  Calculator,
  Sparkles,
  Bookmark,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import {
  CityLocation,
  DailyPrayerTracker,
  Language,
  MoreSubSection,
  NavTab,
  PrayerTimeSlot,
  UserPreferences,
} from '../../types';
import { getTranslation } from '../../i18n/translations';
import { QadaState } from '../../utils/storage';
import { getLast30DaysPrayerStats } from '../../utils/prayerHistory';
import { MosquesView } from './sub/MosquesView';
import { DuasView } from './sub/DuasView';
import { QiblaCompassView } from './sub/QiblaCompassView';
import { TasbihCounterView } from './sub/TasbihCounterView';
import { PrayerTrackerView } from './sub/PrayerTrackerView';
import { RamadanHubView } from './sub/RamadanHubView';
import { IslamicCalendarView } from './sub/IslamicCalendarView';
import { KnowledgeCenterView } from './sub/KnowledgeCenterView';
import { ZakatCalculatorView } from './sub/ZakatCalculatorView';
import { AiAssistantView } from './sub/AiAssistantView';
import { BookmarksView } from './sub/BookmarksView';
import { GlobalSearchView } from './sub/GlobalSearchView';
import { SettingsView } from './sub/SettingsView';

interface MoreHubViewProps {
  language: Language;
  subSection: MoreSubSection;
  onNavigateSub: (sub: MoreSubSection) => void;
  onNavigateTab: (tab: NavTab) => void;
  currentCity: CityLocation;
  prayerSlots: PrayerTimeSlot[];
  todayTracker: DailyPrayerTracker;
  trackerData?: Record<string, DailyPrayerTracker>;
  qadaState: QadaState;
  preferences: UserPreferences;
  bookmarks: any[];
  onOpenLocationModal: () => void;
  onOpenPrayerSettings: () => void;
  onUpdatePreferences: (updates: Partial<UserPreferences>) => void;
  onToggleBookmark: (item: any) => void;
  isBookmarked: (id: string) => boolean;
  onRemoveBookmark: (id: string) => void;
  onClearAllBookmarks: () => void;
  onUpdatePrayerStatus: (prayer: any, status: any) => void;
  onUpdateFastingStatus: (fasted: boolean) => void;
  onUpdateNotes: (notes: string) => void;
  onUpdateQada: (updates: Partial<QadaState>) => void;
  onUpdateCountToday: (delta: number) => void;
  onSaveFullTrackerData?: (data: Record<string, DailyPrayerTracker>) => void;
}

export const MoreHubView: React.FC<MoreHubViewProps> = ({
  language,
  subSection,
  onNavigateSub,
  onNavigateTab,
  currentCity,
  prayerSlots,
  todayTracker,
  trackerData = {},
  qadaState,
  preferences,
  bookmarks,
  onOpenLocationModal,
  onOpenPrayerSettings,
  onUpdatePreferences,
  onToggleBookmark,
  isBookmarked,
  onRemoveBookmark,
  onClearAllBookmarks,
  onUpdatePrayerStatus,
  onUpdateFastingStatus,
  onUpdateNotes,
  onUpdateQada,
  onUpdateCountToday,
  onSaveFullTrackerData,
}) => {
  const t = getTranslation(language);

  // 30-Day Prayer Summary Stats
  const stats = useMemo(() => {
    return getLast30DaysPrayerStats(trackerData);
  }, [trackerData]);

  // If inside a sub-tool, render that sub-tool with a back button
  if (subSection !== 'menu') {
    return (
      <div className="space-y-4">
        <button
          onClick={() => onNavigateSub('menu')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#087F5B] dark:text-[#C9A45C] hover:underline px-1 py-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Tools Hub</span>
        </button>

        {subSection === 'mosques' && (
          <MosquesView
            language={language}
            currentCity={currentCity}
            onOpenLocationModal={onOpenLocationModal}
          />
        )}
        {subSection === 'duas' && (
          <DuasView language={language} onToggleBookmark={onToggleBookmark} isBookmarked={isBookmarked} />
        )}
        {subSection === 'qibla' && (
          <QiblaCompassView language={language} currentCity={currentCity} onOpenLocationModal={onOpenLocationModal} />
        )}
        {subSection === 'tasbih' && (
          <TasbihCounterView language={language} preferences={preferences} onUpdateCountToday={onUpdateCountToday} />
        )}
        {subSection === 'tracker' && (
          <PrayerTrackerView
            language={language}
            todayTracker={todayTracker}
            trackerData={trackerData}
            qadaState={qadaState}
            onUpdatePrayerStatus={onUpdatePrayerStatus}
            onUpdateFastingStatus={onUpdateFastingStatus}
            onUpdateNotes={onUpdateNotes}
            onUpdateQada={onUpdateQada}
            onSaveFullTrackerData={onSaveFullTrackerData}
          />
        )}
        {subSection === 'ramadan' && (
          <RamadanHubView
            language={language}
            prayerSlots={prayerSlots}
            todayTracker={todayTracker}
            onUpdateFastingStatus={onUpdateFastingStatus}
          />
        )}
        {subSection === 'calendar' && (
          <IslamicCalendarView
            language={language}
            preferences={preferences}
            onUpdatePreferences={onUpdatePreferences}
          />
        )}
        {subSection === 'learning' && <KnowledgeCenterView language={language} />}
        {subSection === 'zakat' && <ZakatCalculatorView language={language} />}
        {subSection === 'ai-assistant' && <AiAssistantView language={language} />}
        {subSection === 'bookmarks' && (
          <BookmarksView
            language={language}
            bookmarks={bookmarks}
            onRemoveBookmark={onRemoveBookmark}
            onClearAllBookmarks={onClearAllBookmarks}
          />
        )}
        {subSection === 'search' && (
          <GlobalSearchView language={language} onNavigateTab={onNavigateTab} onNavigateSub={onNavigateSub} />
        )}
        {subSection === 'settings' && (
          <SettingsView
            language={language}
            preferences={preferences}
            onUpdatePreferences={onUpdatePreferences}
            onOpenLocationModal={onOpenLocationModal}
            onOpenPrayerSettings={onOpenPrayerSettings}
          />
        )}
      </div>
    );
  }

  // Otherwise, render the Main More Hub Menu
  const toolCards = [
    {
      id: 'tracker',
      title: 'Prayer Tracker & 30-Day D3 Chart',
      desc: 'Interactive 30-day D3 completion history, daily checklist, Jama\'ah logging & Qada',
      icon: BarChart3,
      color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40',
      badge: 'D3.js',
    },
    {
      id: 'mosques',
      title: t.mosquesNearMe,
      desc: 'Find nearby masjids, Jum\'ah congregations & wudu facilities',
      icon: Building2,
      color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      id: 'duas',
      title: t.readDuas,
      desc: 'Morning, evening, and daily sunnah supplications',
      icon: Heart,
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40',
    },
    {
      id: 'qibla',
      title: t.findQibla,
      desc: 'Accurate compass bearing & distance to Holy Kaaba',
      icon: Compass,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40',
    },
    {
      id: 'tasbih',
      title: t.openTasbih,
      desc: 'Tactile digital counter with audio and vibrations',
      icon: Repeat,
      color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/40',
    },
    {
      id: 'ramadan',
      title: t.ramadanHub,
      desc: 'Suhoor/Iftar timings, fasting logs, and 30-Juz plan',
      icon: Moon,
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40',
    },
    {
      id: 'calendar',
      title: 'Islamic Calendar',
      desc: 'Dual Hijri-Gregorian calendar with key Islamic dates',
      icon: Calendar,
      color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40',
    },
    {
      id: 'learning',
      title: t.knowledgeCenter,
      desc: 'Step-by-step Salah & Wudu guides and pillars of faith',
      icon: GraduationCap,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      id: 'zakat',
      title: t.zakatCalculator,
      desc: 'Calculate 2.5% annual Zakat on eligible gold, cash & silver',
      icon: Calculator,
      color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/40',
    },
    {
      id: 'ai-assistant',
      title: t.aiAssistant,
      desc: 'Ask questions with cited Quran & authentic Hadith references',
      icon: Sparkles,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40',
    },
    {
      id: 'bookmarks',
      title: t.bookmarks,
      desc: 'Your saved verses, hadiths, and supplications',
      icon: Bookmark,
      color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      id: 'search',
      title: t.globalSearch,
      desc: 'Instant search across Quran, Hadith, Duas, and guides',
      icon: Search,
      color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40',
    },
    {
      id: 'settings',
      title: t.settings,
      desc: 'Language, themes, prayer methods, and data controls',
      icon: Settings,
      color: 'text-slate-600 bg-slate-100 dark:bg-slate-800',
    },
  ];

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#064E3B] to-[#087F5B] text-white shadow-sm border border-[#E4EAE5] dark:border-[#23332B]">
        <div className="max-w-xl">
          <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold">
            Comprehensive Suite
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            Islamic Tools &amp; Resources
          </h1>
          <p className="text-xs text-white/80 mt-1 leading-relaxed">
            Essential worship tools, calculators, 30-day prayer completion analytics, and authentic companions for daily Muslim life.
          </p>
        </div>
      </div>

      {/* Featured 30-Day Prayer Consistency D3 Widget */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-[#087F5B]/10 dark:bg-[#087F5B]/25 text-[#087F5B] dark:text-[#C9A45C] text-[10px] font-bold uppercase tracking-wider">
              D3.js Visualization
            </span>
            <span className="text-xs font-semibold text-[#68756E] dark:text-[#8E9D95]">
              Last 30 Days Habit Tracking
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#17231F] dark:text-[#E4EAE5]">
            30-Day Prayer Completion History
          </h3>
          <p className="text-xs text-[#68756E] dark:text-[#8E9D95] max-w-lg leading-relaxed">
            Visualize your Salah consistency across 30 days with interactive stacked bars, prayer-by-prayer heatmaps, and moving trend lines.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#087F5B] dark:text-[#C9A45C]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{stats.overallPercentage}% Completed</span>
            </div>
            <span className="text-[#68756E]">•</span>
            <span className="text-[#68756E] dark:text-[#8E9D95]">
              {stats.totalCompleted} of {stats.totalPrayersRequired} prayers
            </span>
            <span className="text-[#68756E]">•</span>
            <span className="text-[#68756E] dark:text-[#8E9D95]">
              {stats.totalJamaah} in congregation ({stats.jamaahPercentage}%)
            </span>
          </div>
        </div>

        <button
          onClick={() => onNavigateSub('tracker')}
          className="self-start md:self-center inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#087F5B] hover:bg-[#064E3B] text-white font-bold text-xs shadow-md transition-all active:scale-95 shrink-0"
        >
          <BarChart3 className="w-4 h-4 text-[#C9A45C]" />
          <span>Open 30-Day D3 Chart</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {toolCards.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => onNavigateSub(tool.id as MoreSubSection)}
              className="p-5 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] hover:border-[#087F5B] dark:hover:border-[#C9A45C] hover:shadow-xs transition-all text-left flex items-start justify-between group"
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tool.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#17231F] dark:text-[#E4EAE5] group-hover:text-[#087F5B] dark:group-hover:text-[#C9A45C] transition-colors">
                      {tool.title}
                    </h3>
                    {tool.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#087F5B] text-white">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#68756E] dark:text-[#8E9D95] mt-1 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-[#68756E] dark:text-[#8E9D95] group-hover:text-[#087F5B] dark:group-hover:text-[#C9A45C] shrink-0 mt-1" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
