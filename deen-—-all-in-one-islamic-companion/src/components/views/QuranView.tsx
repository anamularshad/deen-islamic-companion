import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Bookmark,
  Check,
  Copy,
  ChevronLeft,
  Settings2,
  Eye,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { Ayah, Language, SurahSummary, UserPreferences } from '../../types';
import { ALL_SURAHS } from '../../data/quranSurahs';
import { getSurahVerses, BUILT_IN_SURAHS } from '../../data/sampleAyahs';
import { getTranslation } from '../../i18n/translations';

interface QuranViewProps {
  language: Language;
  preferences: UserPreferences;
  onUpdatePreferences: (updates: Partial<UserPreferences>) => void;
  onToggleBookmark: (item: any) => void;
  isBookmarked: (id: string) => boolean;
  memorizedAyahs: string[];
  onToggleMemorized: (ayahKey: string) => void;
}

export const QuranView: React.FC<QuranViewProps> = ({
  language,
  preferences,
  onUpdatePreferences,
  onToggleBookmark,
  isBookmarked,
  memorizedAyahs,
  onToggleMemorized,
}) => {
  const t = getTranslation(language);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<SurahSummary | null>(null);
  const [verses, setVerses] = useState<Ayah[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(false);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showTextControls, setShowTextControls] = useState(false);

  // Audio Player State
  const [playingAyahIndex, setPlayingAyahIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Filtered surah list
  const filteredSurahs = ALL_SURAHS.filter(
    (s) =>
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.bengaliName.includes(searchQuery) ||
      s.name.includes(searchQuery) ||
      s.number.toString() === searchQuery.trim()
  );

  // Load verses when a Surah is opened
  useEffect(() => {
    if (!selectedSurah) return;
    setLoadingVerses(true);
    setPlayingAyahIndex(null);
    setIsPlaying(false);

    getSurahVerses(selectedSurah.number)
      .then((data) => {
        setVerses(data);
      })
      .catch((err) => {
        console.error('Error loading surah:', err);
        setVerses(BUILT_IN_SURAHS[selectedSurah.number] || []);
      })
      .finally(() => {
        setLoadingVerses(false);
      });
  }, [selectedSurah]);

  // Audio Playback Handler
  const handlePlayAyah = (index: number) => {
    const targetAyah = verses[index];
    if (!targetAyah?.audioUrl) return;

    if (playingAyahIndex === index && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    audioRef.current.src = targetAyah.audioUrl;
    audioRef.current.play().then(() => {
      setPlayingAyahIndex(index);
      setIsPlaying(true);
    }).catch((e) => {
      console.warn('Audio play prevented', e);
    });

    audioRef.current.onended = () => {
      // Auto-advance to next ayah
      if (index + 1 < verses.length) {
        handlePlayAyah(index + 1);
      } else {
        setIsPlaying(false);
        setPlayingAyahIndex(null);
      }
    };
  };

  const handleCopyAyah = (ayah: Ayah) => {
    const text = `${ayah.arabicText}\n\n"${language === 'bn' ? ayah.translationBn : ayah.translationEn}"\n— [Surah ${selectedSurah?.englishName} ${selectedSurah?.number}:${ayah.numberInSurah}]`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* If No Surah Selected: Show 114 Surahs Catalog */}
      {!selectedSurah ? (
        <div className="space-y-4">
          {/* Header Banner */}
          <div className="relative rounded-3xl overflow-hidden border border-[#E4EAE5] dark:border-[#23332B] p-6 bg-gradient-to-r from-[#064E3B] to-[#087F5B] text-white">
            <img
              src="/src/assets/images/quran_reading_serene_1793584913104.jpg"
              alt="Quran Reading"
              referrerPolicy="no-referrer"
              className="absolute right-0 top-0 bottom-0 w-1/3 object-cover opacity-25 hidden sm:block"
            />
            <div className="relative z-10 max-w-xl">
              <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold">
                Al-Qur'an Al-Kareem
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                {t.navQuran}
              </h1>
              <p className="text-xs text-white/80 mt-1.5 leading-relaxed">
                Read, listen, memorize, and reflect upon the Holy Quran with authentic Uthmani script and verified translations.
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#68756E] dark:text-[#8E9D95] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={t.searchSurah}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] text-[#17231F] dark:text-[#E4EAE5] focus:outline-none focus:border-[#087F5B]"
            />
          </div>

          {/* Surahs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredSurahs.map((surah) => (
              <button
                key={surah.number}
                onClick={() => setSelectedSurah(surah)}
                className="p-4 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] hover:border-[#087F5B] dark:hover:border-[#C9A45C] hover:shadow-xs transition-all text-left flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F7F9F6] dark:bg-[#101A16] border border-[#E4EAE5] dark:border-[#23332B] flex items-center justify-center font-bold text-xs text-[#087F5B] dark:text-[#C9A45C] group-hover:bg-[#087F5B] group-hover:text-white transition-colors">
                    {surah.number}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#17231F] dark:text-[#E4EAE5] group-hover:text-[#087F5B] dark:group-hover:text-[#C9A45C] transition-colors">
                      {language === 'bn' ? surah.bengaliName : surah.englishName}
                    </h3>
                    <p className="text-[11px] text-[#68756E] dark:text-[#8E9D95]">
                      {surah.revelationType === 'Meccan' ? t.meccan : t.medinan} · {surah.numberOfAyahs} {t.verses}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-arabic text-lg text-[#064E3B] dark:text-[#C9A45C]">
                    {surah.name}
                  </p>
                  <p className="text-[10px] text-[#68756E] dark:text-[#8E9D95]">
                    {language === 'bn' ? surah.bengaliMeaning : surah.englishNameTranslation}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Surah Reader View */
        <div className="space-y-4">
          {/* Top Bar for Surah Navigation */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] flex items-center justify-between gap-2 shadow-xs">
            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.pause();
                  setIsPlaying(false);
                }
                setSelectedSurah(null);
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#087F5B] dark:text-[#C9A45C] hover:underline"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Surahs</span>
            </button>

            <div className="text-center">
              <h2 className="text-base font-bold text-[#17231F] dark:text-[#E4EAE5]">
                {selectedSurah.number}. {selectedSurah.englishName} ({selectedSurah.name})
              </h2>
              <p className="text-[11px] text-[#68756E] dark:text-[#8E9D95]">
                {selectedSurah.revelationType} · {selectedSurah.numberOfAyahs} {t.verses} · Reciter: Mishary Alafasy
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowTextControls(!showTextControls)}
                className={`p-2 rounded-xl border transition-colors ${
                  showTextControls
                    ? 'border-[#087F5B] text-[#087F5B] bg-[#087F5B]/10'
                    : 'border-[#E4EAE5] dark:border-[#23332B] text-[#68756E] dark:text-[#8E9D95]'
                }`}
                title="Adjust font size and transliteration"
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Text Settings Collapsible */}
          {showTextControls && (
            <div className="p-4 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-semibold text-[#17231F] dark:text-[#E4EAE5] block mb-1">
                  {t.arabicSize}: {preferences.arabicFontSize}px
                </label>
                <input
                  type="range"
                  min="22"
                  max="42"
                  value={preferences.arabicFontSize}
                  onChange={(e) => onUpdatePreferences({ arabicFontSize: parseInt(e.target.value, 10) })}
                  className="w-full accent-[#087F5B]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#17231F] dark:text-[#E4EAE5] block mb-1">
                  {t.translationSize}: {preferences.translationFontSize}px
                </label>
                <input
                  type="range"
                  min="13"
                  max="20"
                  value={preferences.translationFontSize}
                  onChange={(e) => onUpdatePreferences({ translationFontSize: parseInt(e.target.value, 10) })}
                  className="w-full accent-[#087F5B]"
                />
              </div>

              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="translitToggle"
                  checked={showTransliteration}
                  onChange={(e) => setShowTransliteration(e.target.checked)}
                  className="rounded text-[#087F5B] focus:ring-0"
                />
                <label htmlFor="translitToggle" className="font-medium text-[#17231F] dark:text-[#E4EAE5] cursor-pointer">
                  {t.transliteration}
                </label>
              </div>
            </div>
          )}

          {/* Bismillah Header (except for Surah At-Tawbah #9) */}
          {selectedSurah.number !== 9 && (
            <div className="p-6 text-center rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B]">
              <p className="font-arabic text-xl sm:text-2xl text-[#064E3B] dark:text-[#C9A45C]">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="text-[11px] text-[#68756E] dark:text-[#8E9D95] mt-1 italic">
                In the name of Allah, the Entirely Merciful, the Especially Merciful
              </p>
            </div>
          )}

          {/* Verses List */}
          {loadingVerses ? (
            <div className="p-12 text-center text-xs text-[#68756E] dark:text-[#8E9D95]">
              <div className="w-8 h-8 rounded-full border-2 border-[#087F5B] border-t-transparent animate-spin mx-auto mb-2" />
              Loading authentic Surah verses...
            </div>
          ) : verses.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#19251F] border text-xs text-[#68756E]">
              Verses for this Surah are being fetched or network is offline. Please check your connection.
            </div>
          ) : (
            <div className="space-y-3">
              {verses.map((ayah, idx) => {
                const ayahKey = `${selectedSurah.number}:${ayah.numberInSurah}`;
                const isItemBookmarked = isBookmarked(`ayah-${selectedSurah.number}-${ayah.numberInSurah}`);
                const isMemorized = memorizedAyahs.includes(ayahKey);
                const isCurrentPlaying = playingAyahIndex === idx && isPlaying;

                return (
                  <div
                    key={ayah.numberInSurah}
                    className={`p-5 rounded-2xl border transition-all ${
                      isCurrentPlaying
                        ? 'border-[#087F5B] dark:border-[#C9A45C] bg-[#087F5B]/5 dark:bg-[#C9A45C]/10 shadow-xs'
                        : 'border-[#E4EAE5] dark:border-[#23332B] bg-white dark:bg-[#19251F]'
                    }`}
                  >
                    {/* Top Row: Ayah Number & Actions */}
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E4EAE5]/60 dark:border-[#23332B]/60">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-[#F7F9F6] dark:bg-[#101A16] border border-[#E4EAE5] dark:border-[#23332B] flex items-center justify-center text-xs font-bold text-[#087F5B] dark:text-[#C9A45C]">
                          {ayah.numberInSurah}
                        </span>
                        {isMemorized && (
                          <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                            {t.memorized}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Audio Play Button */}
                        <button
                          onClick={() => handlePlayAyah(idx)}
                          className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                            isCurrentPlaying
                              ? 'bg-[#087F5B] text-white'
                              : 'text-[#68756E] dark:text-[#8E9D95] hover:bg-black/5 dark:hover:bg-white/5'
                          }`}
                          title={isCurrentPlaying ? t.pauseAudio : t.playAudio}
                        >
                          {isCurrentPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>

                        {/* Copy Ayah */}
                        <button
                          onClick={() => handleCopyAyah(ayah)}
                          className="p-1.5 rounded-lg text-[#68756E] dark:text-[#8E9D95] hover:bg-black/5 dark:hover:bg-white/5"
                          title={t.copyVerse}
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {/* Memorized Toggle */}
                        <button
                          onClick={() => onToggleMemorized(ayahKey)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isMemorized
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-[#68756E] dark:text-[#8E9D95] hover:bg-black/5 dark:hover:bg-white/5'
                          }`}
                          title={t.markMemorized}
                        >
                          <Check className="w-4 h-4" />
                        </button>

                        {/* Bookmark */}
                        <button
                          onClick={() =>
                            onToggleBookmark({
                              id: `ayah-${selectedSurah.number}-${ayah.numberInSurah}`,
                              type: 'ayah',
                              refId: ayahKey,
                              title: `Surah ${selectedSurah.englishName} (${selectedSurah.number}:${ayah.numberInSurah})`,
                              subtitle: ayah.translationEn,
                              arabicSnippet: ayah.arabicText,
                              dateAdded: new Date().toISOString(),
                            })
                          }
                          className={`p-1.5 rounded-lg transition-colors ${
                            isItemBookmarked
                              ? 'text-[#087F5B] dark:text-[#C9A45C]'
                              : 'text-[#68756E] dark:text-[#8E9D95] hover:bg-black/5 dark:hover:bg-white/5'
                          }`}
                          title={t.bookmarkVerse}
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Arabic Text */}
                    <p
                      className="text-right font-arabic leading-loose text-[#17231F] dark:text-[#E4EAE5] my-2"
                      style={{ fontSize: `${preferences.arabicFontSize}px` }}
                      dir="rtl"
                    >
                      {ayah.arabicText} <span className="text-[#087F5B] dark:text-[#C9A45C] text-sm">﴿{ayah.numberInSurah}﴾</span>
                    </p>

                    {/* Optional Transliteration */}
                    {showTransliteration && ayah.transliteration && (
                      <p className="text-xs text-[#68756E] dark:text-[#8E9D95] italic my-1">
                        {ayah.transliteration}
                      </p>
                    )}

                    {/* Translation */}
                    <p
                      className="text-[#17231F] dark:text-[#E4EAE5] font-medium leading-relaxed mt-2"
                      style={{ fontSize: `${preferences.translationFontSize}px` }}
                    >
                      {language === 'bn' ? ayah.translationBn : ayah.translationEn}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
