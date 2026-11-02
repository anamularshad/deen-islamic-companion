import React, { useState } from 'react';
import { Search, BookOpen, Bookmark, Heart, GraduationCap, ChevronRight } from 'lucide-react';
import { Language, MoreSubSection, NavTab } from '../../../types';
import { ALL_SURAHS } from '../../../data/quranSurahs';
import { AUTHENTIC_HADITHS } from '../../../data/hadiths';
import { AUTHENTIC_DUAS } from '../../../data/duas';
import { KNOWLEDGE_ARTICLES } from '../../../data/knowledge';
import { getTranslation } from '../../../i18n/translations';

interface GlobalSearchViewProps {
  language: Language;
  onNavigateTab: (tab: NavTab) => void;
  onNavigateSub: (sub: MoreSubSection) => void;
}

export const GlobalSearchView: React.FC<GlobalSearchViewProps> = ({
  language,
  onNavigateTab,
  onNavigateSub,
}) => {
  const t = getTranslation(language);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'quran' | 'hadith' | 'duas' | 'learning'>('all');

  const q = query.toLowerCase().trim();

  // Search Quran
  const quranResults = ALL_SURAHS.filter(
    (s) =>
      s.englishName.toLowerCase().includes(q) ||
      s.englishNameTranslation.toLowerCase().includes(q) ||
      s.bengaliName.includes(q) ||
      s.name.includes(q) ||
      s.number.toString() === q
  ).slice(0, 6);

  // Search Hadith
  const hadithResults = AUTHENTIC_HADITHS.filter(
    (h) =>
      h.english.toLowerCase().includes(q) ||
      h.bengali.includes(q) ||
      h.arabic.includes(q) ||
      h.collectionName.toLowerCase().includes(q) ||
      h.topic.toLowerCase().includes(q)
  ).slice(0, 6);

  // Search Duas
  const duaResults = AUTHENTIC_DUAS.filter(
    (d) =>
      d.title.toLowerCase().includes(q) ||
      (d.titleBn && d.titleBn.includes(q)) ||
      d.english.toLowerCase().includes(q) ||
      d.bengali.includes(q) ||
      d.arabic.includes(q)
  ).slice(0, 6);

  // Search Learning
  const learningResults = KNOWLEDGE_ARTICLES.filter(
    (k) =>
      k.titleEn.toLowerCase().includes(q) ||
      k.titleBn.includes(q) ||
      k.summaryEn.toLowerCase().includes(q) ||
      k.summaryBn.includes(q)
  ).slice(0, 6);

  const totalResults =
    (filter === 'all' || filter === 'quran' ? quranResults.length : 0) +
    (filter === 'all' || filter === 'hadith' ? hadithResults.length : 0) +
    (filter === 'all' || filter === 'duas' ? duaResults.length : 0) +
    (filter === 'all' || filter === 'learning' ? learningResults.length : 0);

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-[#087F5B] dark:text-[#C9A45C] absolute left-4 top-3.5" />
        <input
          type="text"
          autoFocus
          placeholder={t.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 text-sm rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] text-[#17231F] dark:text-[#E4EAE5] shadow-xs focus:outline-none focus:border-[#087F5B] transition-colors"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Results' },
          { id: 'quran', label: 'Quran Surahs' },
          { id: 'hadith', label: 'Hadith Library' },
          { id: 'duas', label: 'Duas & Adhkar' },
          { id: 'learning', label: 'Learning Guides' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === f.id
                ? 'bg-[#087F5B] text-white shadow-xs'
                : 'bg-white dark:bg-[#19251F] text-[#68756E] dark:text-[#8E9D95] border border-[#E4EAE5] dark:border-[#23332B] hover:text-[#17231F] dark:hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {!q ? (
        <div className="p-8 text-center rounded-3xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] text-xs text-[#68756E] dark:text-[#8E9D95] space-y-2">
          <Search className="w-8 h-8 mx-auto text-[#68756E] opacity-30" />
          <p className="font-semibold text-sm text-[#17231F] dark:text-[#E4EAE5]">
            Global Islamic Search
          </p>
          <p>
            Type keywords like "Fatiha", "patience", "parents", "wudu", "charity", or "Bukhari".
          </p>
        </div>
      ) : totalResults === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] text-xs text-[#68756E]">
          {t.noResults}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Quran matches */}
          {(filter === 'all' || filter === 'quran') && quranResults.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#087F5B] dark:text-[#C9A45C] px-1">
                Quran Surahs ({quranResults.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quranResults.map((s) => (
                  <button
                    key={s.number}
                    onClick={() => onNavigateTab('quran')}
                    className="p-3.5 rounded-xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] hover:border-[#087F5B] text-left flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-[#17231F] dark:text-[#E4EAE5]">
                        Surah {s.number}. {language === 'bn' ? s.bengaliName : s.englishName}
                      </h4>
                      <p className="text-[11px] text-[#68756E] dark:text-[#8E9D95]">
                        {s.revelationType} · {s.numberOfAyahs} verses
                      </p>
                    </div>
                    <span className="font-arabic text-base text-[#087F5B] dark:text-[#C9A45C]">
                      {s.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Hadith matches */}
          {(filter === 'all' || filter === 'hadith') && hadithResults.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#087F5B] dark:text-[#C9A45C] px-1">
                Hadith Library ({hadithResults.length})
              </span>
              <div className="space-y-2">
                {hadithResults.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => onNavigateTab('hadith')}
                    className="w-full p-4 rounded-xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] hover:border-[#087F5B] text-left space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#17231F] dark:text-[#E4EAE5]">{h.collectionName} #{h.hadithNumber}</span>
                      <span className="text-[#087F5B] dark:text-[#C9A45C] font-semibold">({h.grade})</span>
                    </div>
                    <p className="text-xs text-[#68756E] dark:text-[#8E9D95] line-clamp-2">
                      "{language === 'bn' ? h.bengali : h.english}"
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Duas matches */}
          {(filter === 'all' || filter === 'duas') && duaResults.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#087F5B] dark:text-[#C9A45C] px-1">
                Duas & Adhkar ({duaResults.length})
              </span>
              <div className="space-y-2">
                {duaResults.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => onNavigateSub('duas')}
                    className="w-full p-4 rounded-xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] hover:border-[#087F5B] text-left space-y-1"
                  >
                    <h4 className="text-xs font-bold text-[#17231F] dark:text-[#E4EAE5]">{d.title}</h4>
                    <p className="text-xs text-[#68756E] dark:text-[#8E9D95] line-clamp-2">
                      "{language === 'bn' ? d.bengali : d.english}"
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Learning Guides */}
          {(filter === 'all' || filter === 'learning') && learningResults.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#087F5B] dark:text-[#C9A45C] px-1">
                Learning Guides ({learningResults.length})
              </span>
              <div className="space-y-2">
                {learningResults.map((k) => (
                  <button
                    key={k.id}
                    onClick={() => onNavigateSub('learning')}
                    className="w-full p-4 rounded-xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] hover:border-[#087F5B] text-left space-y-1"
                  >
                    <h4 className="text-xs font-bold text-[#17231F] dark:text-[#E4EAE5]">{k.titleEn}</h4>
                    <p className="text-xs text-[#68756E] dark:text-[#8E9D95] line-clamp-2">
                      {k.summaryEn}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
