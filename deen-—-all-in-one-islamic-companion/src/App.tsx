import React, { useState, useEffect, useMemo } from 'react';
import {
  CityLocation,
  DailyPrayerTracker,
  Language,
  MoreSubSection,
  NavTab,
  PrayerName,
  UserPreferences,
} from './types';
import {
  DEFAULT_PREFERENCES,
  loadBookmarks,
  loadMemorizedAyahs,
  loadQadaCounter,
  loadTrackerData,
  loadUserPreferences,
  QadaState,
  saveBookmarks,
  saveMemorizedAyahs,
  saveQadaCounter,
  saveTrackerData,
  saveUserPreferences,
} from './utils/storage';
import { calculateDailyPrayerTimes } from './utils/prayerTimes';
import { getHijriDate } from './utils/hijriCalendar';
import { TopHeader } from './components/layout/TopHeader';
import { BottomNav } from './components/layout/BottomNav';
import { SidebarNav } from './components/layout/SidebarNav';
import { HomeDashboard } from './components/views/HomeDashboard';
import { QuranView } from './components/views/QuranView';
import { PrayerScheduleView } from './components/views/PrayerScheduleView';
import { HadithView } from './components/views/HadithView';
import { MoreHubView } from './components/views/MoreHubView';
import { LocationModal } from './components/modals/LocationModal';
import { PrayerSettingsModal } from './components/modals/PrayerSettingsModal';
import { OnboardingModal } from './components/modals/OnboardingModal';
import { ApkInstallModal } from './components/modals/ApkInstallModal';

export default function App() {
  // User Preferences
  const [preferences, setPreferences] = useState<UserPreferences>(() => loadUserPreferences());
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [moreSubSection, setMoreSubSection] = useState<MoreSubSection>('menu');

  // Modals State
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isPrayerSettingsOpen, setIsPrayerSettingsOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => !preferences.hasCompletedOnboarding);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  // Worship & Bookmarks Persistence
  const [trackerData, setTrackerData] = useState<Record<string, DailyPrayerTracker>>(() => loadTrackerData());
  const [bookmarks, setBookmarks] = useState(() => loadBookmarks());
  const [qadaState, setQadaState] = useState<QadaState>(() => loadQadaCounter());
  const [memorizedAyahs, setMemorizedAyahs] = useState<string[]>(() => loadMemorizedAyahs());

  // Current Date & Clock Ticker
  const [currentTime, setCurrentTime] = useState(new Date());

  // Ticking interval for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync Dark Mode class with <html>
  useEffect(() => {
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.theme]);

  // Sync RTL / LTR direction with Language
  useEffect(() => {
    if (preferences.language === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', preferences.language);
    }
  }, [preferences.language]);

  // Update Preferences Helper
  const handleUpdatePreferences = (updates: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...updates };
    setPreferences(updated);
    saveUserPreferences(updated);
  };

  // Today's Date String: YYYY-MM-DD
  const todayDateKey = useMemo(() => {
    const y = currentTime.getFullYear();
    const m = String(currentTime.getMonth() + 1).padStart(2, '0');
    const d = String(currentTime.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [currentTime]);

  // Today's Tracker Object
  const todayTracker = useMemo<DailyPrayerTracker>(() => {
    if (trackerData[todayDateKey]) {
      return trackerData[todayDateKey];
    }
    return {
      date: todayDateKey,
      prayers: {
        fajr: 'none',
        sunrise: 'none',
        dhuhr: 'none',
        asr: 'none',
        maghrib: 'none',
        isha: 'none',
      },
      fasted: false,
      quranPagesRead: 0,
      tasbihCount: 0,
    };
  }, [trackerData, todayDateKey]);

  // Update Tracker Helper
  const handleUpdateTracker = (updates: Partial<DailyPrayerTracker>) => {
    const updatedToday = { ...todayTracker, ...updates };
    const nextData = { ...trackerData, [todayDateKey]: updatedToday };
    setTrackerData(nextData);
    saveTrackerData(nextData);
  };

  // Prayer times calculated live
  const prayerCalculation = useMemo(() => {
    return calculateDailyPrayerTimes(currentTime, preferences.selectedCity, preferences);
  }, [currentTime, preferences.selectedCity, preferences]);

  // Hijri Date
  const hijriDate = useMemo(() => {
    return getHijriDate(currentTime, preferences.hijriAdjustment);
  }, [currentTime, preferences.hijriAdjustment]);

  const gregorianFormatted = useMemo(() => {
    return currentTime.toLocaleDateString(
      preferences.language === 'ar' ? 'ar-SA' : preferences.language === 'bn' ? 'bn-BD' : 'en-US',
      { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    );
  }, [currentTime, preferences.language]);

  // Bookmark Helpers
  const handleToggleBookmark = (item: any) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === item.id);
      let next;
      if (exists) {
        next = prev.filter((b) => b.id !== item.id);
      } else {
        next = [item, ...prev];
      }
      saveBookmarks(next);
      return next;
    });
  };

  const isBookmarked = (id: string) => {
    return bookmarks.some((b) => b.id === id);
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = prev.filter((b) => b.id !== id);
      saveBookmarks(next);
      return next;
    });
  };

  const handleClearAllBookmarks = () => {
    setBookmarks([]);
    saveBookmarks([]);
  };

  // Memorized Ayahs Helper
  const handleToggleMemorized = (ayahKey: string) => {
    setMemorizedAyahs((prev) => {
      const exists = prev.includes(ayahKey);
      const next = exists ? prev.filter((k) => k !== ayahKey) : [...prev, ayahKey];
      saveMemorizedAyahs(next);
      return next;
    });
  };

  // Qada Helper
  const handleUpdateQada = (updates: Partial<QadaState>) => {
    setQadaState((prev) => {
      const next = { ...prev, ...updates };
      saveQadaCounter(next);
      return next;
    });
  };

  // Tasbih Count Today Helper
  const handleUpdateCountToday = (delta: number) => {
    handleUpdateTracker({
      tasbihCount: Math.max(0, (todayTracker.tasbihCount || 0) + delta),
    });
  };

  // Navigation Helpers
  const handleNavigateTab = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'more') {
      setMoreSubSection('menu');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSub = (sub: MoreSubSection) => {
    setActiveTab('more');
    setMoreSubSection(sub);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F7F9F6] text-[#17231F] dark:bg-[#101A16] dark:text-[#E4EAE5] transition-colors flex flex-col font-sans">
      {/* Top Header */}
      <TopHeader
        language={preferences.language}
        theme={preferences.theme}
        currentCity={preferences.selectedCity}
        hijriFormatted={
          preferences.language === 'ar'
            ? hijriDate.formattedAr
            : preferences.language === 'bn'
            ? hijriDate.formattedBn
            : hijriDate.formattedEn
        }
        gregorianFormatted={gregorianFormatted}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onToggleTheme={() =>
          handleUpdatePreferences({ theme: preferences.theme === 'dark' ? 'light' : 'dark' })
        }
        onSelectLanguage={(lang) => handleUpdatePreferences({ language: lang })}
        onOpenSearch={() => handleNavigateSub('search')}
        onOpenApkModal={() => setIsApkModalOpen(true)}
      />

      {/* Main Layout: Desktop Sidebar + Content Area */}
      <div className="flex-1 flex max-w-6xl w-full mx-auto">
        {/* Desktop Sidebar Navigation */}
        <SidebarNav
          activeTab={activeTab}
          moreSubSection={moreSubSection}
          onNavigateTab={handleNavigateTab}
          onNavigateSub={handleNavigateSub}
          language={preferences.language}
        />

        {/* Dynamic Screen View */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 py-6 overflow-x-hidden">
          {activeTab === 'home' && (
            <HomeDashboard
              language={preferences.language}
              currentCity={preferences.selectedCity}
              prayerSlots={prayerCalculation.slots}
              nextPrayer={prayerCalculation.nextPrayer}
              timeRemainingSeconds={prayerCalculation.timeRemainingSeconds}
              hijriDateFormatted={
                preferences.language === 'ar'
                  ? hijriDate.formattedAr
                  : preferences.language === 'bn'
                  ? hijriDate.formattedBn
                  : hijriDate.formattedEn
              }
              gregorianDateFormatted={gregorianFormatted}
              todayTracker={todayTracker}
              preferences={preferences}
              onNavigateTab={handleNavigateTab}
              onNavigateSub={handleNavigateSub}
              onOpenPrayerSettings={() => setIsPrayerSettingsOpen(true)}
              onToggleBookmark={handleToggleBookmark}
              isBookmarked={isBookmarked}
              onUpdatePreferences={handleUpdatePreferences}
            />
          )}

          {activeTab === 'quran' && (
            <QuranView
              language={preferences.language}
              preferences={preferences}
              onUpdatePreferences={handleUpdatePreferences}
              onToggleBookmark={handleToggleBookmark}
              isBookmarked={isBookmarked}
              memorizedAyahs={memorizedAyahs}
              onToggleMemorized={handleToggleMemorized}
            />
          )}

          {activeTab === 'prayer' && (
            <PrayerScheduleView
              language={preferences.language}
              currentCity={preferences.selectedCity}
              prayerSlots={prayerCalculation.slots}
              nextPrayer={prayerCalculation.nextPrayer}
              timeRemainingSeconds={prayerCalculation.timeRemainingSeconds}
              preferences={preferences}
              onOpenLocationModal={() => setIsLocationModalOpen(true)}
              onOpenSettingsModal={() => setIsPrayerSettingsOpen(true)}
              onUpdatePreferences={handleUpdatePreferences}
            />
          )}

          {activeTab === 'hadith' && (
            <HadithView
              language={preferences.language}
              onToggleBookmark={handleToggleBookmark}
              isBookmarked={isBookmarked}
            />
          )}

          {activeTab === 'more' && (
            <MoreHubView
              language={preferences.language}
              subSection={moreSubSection}
              onNavigateSub={setMoreSubSection}
              onNavigateTab={handleNavigateTab}
              currentCity={preferences.selectedCity}
              prayerSlots={prayerCalculation.slots}
              todayTracker={todayTracker}
              trackerData={trackerData}
              qadaState={qadaState}
              preferences={preferences}
              bookmarks={bookmarks}
              onOpenLocationModal={() => setIsLocationModalOpen(true)}
              onOpenPrayerSettings={() => setIsPrayerSettingsOpen(true)}
              onUpdatePreferences={handleUpdatePreferences}
              onToggleBookmark={handleToggleBookmark}
              isBookmarked={isBookmarked}
              onRemoveBookmark={handleRemoveBookmark}
              onClearAllBookmarks={handleClearAllBookmarks}
              onUpdatePrayerStatus={(prayer: PrayerName, status: any) => {
                handleUpdateTracker({
                  prayers: {
                    ...todayTracker.prayers,
                    [prayer]: status,
                  },
                });
              }}
              onUpdateFastingStatus={(fasted: boolean) => {
                handleUpdateTracker({ fasted });
              }}
              onUpdateNotes={(notes: string) => {
                handleUpdateTracker({ notes });
              }}
              onUpdateQada={handleUpdateQada}
              onUpdateCountToday={handleUpdateCountToday}
              onSaveFullTrackerData={(data) => {
                setTrackerData(data);
                saveTrackerData(data);
              }}
            />
          )}
        </main>
      </div>

      {/* Persistent Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleNavigateTab}
        language={preferences.language}
      />

      {/* Global Modals */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentCity={preferences.selectedCity}
        onSelectCity={(city: CityLocation) => handleUpdatePreferences({ selectedCity: city })}
        language={preferences.language}
      />

      <PrayerSettingsModal
        isOpen={isPrayerSettingsOpen}
        onClose={() => setIsPrayerSettingsOpen(false)}
        preferences={preferences}
        onUpdatePreferences={handleUpdatePreferences}
        language={preferences.language}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={(selectedLang, selectedCity) => {
          handleUpdatePreferences({
            language: selectedLang,
            selectedCity: selectedCity,
            hasCompletedOnboarding: true,
          });
          setIsOnboardingOpen(false);
        }}
      />

      <ApkInstallModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />
    </div>
  );
}
