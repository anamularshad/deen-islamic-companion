import React, { useState } from 'react';
import { Search, Bookmark, Copy, Check, Sparkles, Filter } from 'lucide-react';
import { HadithItem, Language } from '../../types';
import { AUTHENTIC_HADITHS, HADITH_TOPICS } from '../../data/hadiths';
import { getTranslation } from '../../i18n/translations';

interface HadithViewProps {
  language: Language;
  onToggleBookmark: (item: any) => void;
  isBookmarked: (id: string) => boolean;
}

export const HadithView: React.FC<HadithViewProps> = ({
  language,
  onToggleBookmark,
  isBookmarked,
}) => {
  const t = getTranslation(language);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter hadiths
  const filteredHadiths = AUTHENTIC_HADITHS.filter((h) => {
    const matchesTopic = selectedTopic === 'All' || h.topic === selectedTopic;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      h.english.toLowerCase().includes(query) ||
      h.bengali.includes(query) ||
      h.arabic.includes(query) ||
      h.collectionName.toLowerCase().includes(query) ||
      h.hadithNumber.toString().includes(query) ||
      (h.narrator && h.narrator.toLowerCase().includes(query));

    return matchesTopic && matchesSearch;
  });

  const handleCopy = (hadith: HadithItem) => {
    const text = `${hadith.arabic}\n\n"${language === 'bn' ? hadith.bengali : hadith.english}"\n— [${hadith.collectionName} #${hadith.hadithNumber}, Grade: ${hadith.grade}]`;
    navigator.clipboard.writeText(text);
    setCopiedId(hadith.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#064E3B] to-[#087F5B] text-white shadow-sm border border-[#E4EAE5] dark:border-[#23332B]">
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold">
            Authentic Prophetic Traditions
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            {t.navHadith} Library
          </h1>
          <p className="text-xs text-white/80 mt-1.5 leading-relaxed">
            Verified sayings and teachings of Prophet Muhammad (peace be upon him) with recognized scholarly authentication gradings.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#68756E] dark:text-[#8E9D95] absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder={t.searchHadith}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] text-[#17231F] dark:text-[#E4EAE5] focus:outline-none focus:border-[#087F5B]"
        />
      </div>

      {/* Topic Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {HADITH_TOPICS.map((topic) => (
          <button
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              selectedTopic === topic
                ? 'bg-[#087F5B] text-white shadow-xs'
                : 'bg-white dark:bg-[#19251F] text-[#68756E] dark:text-[#8E9D95] border border-[#E4EAE5] dark:border-[#23332B] hover:text-[#17231F] dark:hover:text-white'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Hadith List */}
      <div className="space-y-4">
        {filteredHadiths.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] text-xs text-[#68756E]">
            {t.noResults}
          </div>
        ) : (
          filteredHadiths.map((hadith) => {
            const isItemBookmarked = isBookmarked(`hadith-${hadith.id}`);
            const isCopied = copiedId === hadith.id;

            return (
              <div
                key={hadith.id}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-xs space-y-3 transition-all"
              >
                {/* Attribution & Grade Strip */}
                <div className="flex items-center justify-between pb-2 border-b border-[#E4EAE5]/60 dark:border-[#23332B]/60">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-[#17231F] dark:text-[#E4EAE5]">
                      {hadith.collectionName} #{hadith.hadithNumber}
                    </span>
                    <span className="text-[10px] font-semibold text-[#087F5B] dark:text-[#C9A45C] bg-[#087F5B]/10 dark:bg-[#C9A45C]/15 px-2 py-0.5 rounded-md">
                      {hadith.grade}
                    </span>
                    <span className="text-[11px] text-[#68756E] dark:text-[#8E9D95]">
                      · {hadith.topic}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleCopy(hadith)}
                      className="p-1.5 rounded-lg text-[#68756E] dark:text-[#8E9D95] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      title="Copy Hadith"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-[#087F5B]" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() =>
                        onToggleBookmark({
                          id: `hadith-${hadith.id}`,
                          type: 'hadith',
                          refId: hadith.id,
                          title: `${hadith.collectionName} #${hadith.hadithNumber}`,
                          subtitle: hadith.english,
                          arabicSnippet: hadith.arabic,
                          dateAdded: new Date().toISOString(),
                        })
                      }
                      className={`p-1.5 rounded-lg transition-colors ${
                        isItemBookmarked
                          ? 'text-[#087F5B] dark:text-[#C9A45C]'
                          : 'text-[#68756E] dark:text-[#8E9D95] hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                      title="Bookmark Hadith"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Arabic Text */}
                <p className="text-right font-arabic text-base sm:text-lg leading-loose text-[#17231F] dark:text-[#E4EAE5]" dir="rtl">
                  {hadith.arabic}
                </p>

                {/* Translation */}
                <p className="text-xs sm:text-sm text-[#17231F] dark:text-[#E4EAE5] leading-relaxed font-medium">
                  "{language === 'bn' ? hadith.bengali : hadith.english}"
                </p>

                {/* Metadata Footnote */}
                <div className="text-[11px] text-[#68756E] dark:text-[#8E9D95] pt-1">
                  <span>Narrated by: {hadith.narrator || 'Sahabi (RA)'}</span>
                  {hadith.scholar && <span> · Grading Scholar: {hadith.scholar}</span>}
                  {hadith.chapter && <span> · Chapter: {hadith.chapter}</span>}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
