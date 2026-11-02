import React, { useState } from 'react';
import { Heart, Search, Bookmark, Copy, Check, RotateCcw } from 'lucide-react';
import { DuaItem, Language } from '../../../types';
import { AUTHENTIC_DUAS, DUA_CATEGORIES } from '../../../data/duas';
import { getTranslation } from '../../../i18n/translations';
import { playTasbihClick, triggerHaptic } from '../../../utils/audio';

interface DuasViewProps {
  language: Language;
  onToggleBookmark: (item: any) => void;
  isBookmarked: (id: string) => boolean;
}

export const DuasView: React.FC<DuasViewProps> = ({
  language,
  onToggleBookmark,
  isBookmarked,
}) => {
  const t = getTranslation(language);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredDuas = AUTHENTIC_DUAS.filter((d) => {
    const matchesCat = selectedCategory === 'all' || d.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      d.title.toLowerCase().includes(q) ||
      (d.titleBn && d.titleBn.includes(q)) ||
      d.english.toLowerCase().includes(q) ||
      d.bengali.includes(q) ||
      d.arabic.includes(q);

    return matchesCat && matchesQuery;
  });

  const handleIncrement = (id: string, target: number) => {
    playTasbihClick();
    triggerHaptic(20);
    setCounts((prev) => {
      const current = prev[id] || 0;
      return { ...prev, [id]: Math.min(target, current + 1) };
    });
  };

  const handleResetCount = (id: string) => {
    setCounts((prev) => ({ ...prev, [id]: 0 }));
  };

  const handleCopy = (dua: DuaItem) => {
    const text = `${dua.arabic}\n\n${dua.transliteration}\n\n"${language === 'bn' ? dua.bengali : dua.english}"\n— [${dua.reference}]`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#064E3B] to-[#087F5B] text-white shadow-sm border border-[#E4EAE5] dark:border-[#23332B]">
        <div className="max-w-xl">
          <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold">
            Hisn al-Muslim & Sunnah
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            {t.readDuas}
          </h1>
          <p className="text-xs text-white/80 mt-1 leading-relaxed">
            Supplications and daily adhkar from the Sunnah for morning, evening, protection, and forgiveness.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#68756E] dark:text-[#8E9D95] absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search supplication by name or meaning..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] text-[#17231F] dark:text-[#E4EAE5] focus:outline-none focus:border-[#087F5B]"
        />
      </div>

      {/* Categories Horizontal Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {DUA_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-[#087F5B] text-white shadow-xs'
                : 'bg-white dark:bg-[#19251F] text-[#68756E] dark:text-[#8E9D95] border border-[#E4EAE5] dark:border-[#23332B] hover:text-[#17231F] dark:hover:text-white'
            }`}
          >
            {language === 'ar' ? cat.ar : language === 'bn' ? cat.bn : cat.en}
          </button>
        ))}
      </div>

      {/* Duas List */}
      <div className="space-y-4">
        {filteredDuas.map((dua) => {
          const currentCount = counts[dua.id] || 0;
          const isComplete = currentCount >= dua.repeatTarget;
          const isItemBookmarked = isBookmarked(`dua-${dua.id}`);

          return (
            <div
              key={dua.id}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-xs space-y-3 transition-all"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#E4EAE5]/60 dark:border-[#23332B]/60">
                <div>
                  <h3 className="text-sm font-bold text-[#17231F] dark:text-[#E4EAE5]">
                    {language === 'bn' && dua.titleBn ? dua.titleBn : dua.title}
                  </h3>
                  <p className="text-[11px] text-[#68756E] dark:text-[#8E9D95]">
                    {dua.reference}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(dua)}
                    className="p-1.5 rounded-lg text-[#68756E] dark:text-[#8E9D95] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    {copiedId === dua.id ? <Check className="w-4 h-4 text-[#087F5B]" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() =>
                      onToggleBookmark({
                        id: `dua-${dua.id}`,
                        type: 'dua',
                        refId: dua.id,
                        title: dua.title,
                        subtitle: dua.english,
                        arabicSnippet: dua.arabic,
                        dateAdded: new Date().toISOString(),
                      })
                    }
                    className={`p-1.5 rounded-lg transition-colors ${
                      isItemBookmarked
                        ? 'text-[#087F5B] dark:text-[#C9A45C]'
                        : 'text-[#68756E] dark:text-[#8E9D95] hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Arabic Text */}
              <p className="text-right font-arabic text-base sm:text-lg leading-loose text-[#17231F] dark:text-[#E4EAE5]" dir="rtl">
                {dua.arabic}
              </p>

              {/* Transliteration */}
              <p className="text-xs text-[#68756E] dark:text-[#8E9D95] italic">
                {dua.transliteration}
              </p>

              {/* Translation */}
              <p className="text-xs sm:text-sm text-[#17231F] dark:text-[#E4EAE5] font-medium leading-relaxed">
                {language === 'bn' ? dua.bengali : dua.english}
              </p>

              {/* Virtue snippet */}
              {dua.virtue && (
                <p className="text-[11px] text-[#087F5B] dark:text-[#C9A45C] bg-[#087F5B]/5 dark:bg-[#C9A45C]/10 p-2.5 rounded-xl">
                  ✨ {dua.virtue}
                </p>
              )}

              {/* Repeat Counter & Tap Target */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E4EAE5]/60 dark:border-[#23332B]/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#68756E] dark:text-[#8E9D95]">
                    Repeat: <strong className="text-[#17231F] dark:text-[#E4EAE5]">{dua.repeatTarget}x</strong>
                  </span>
                  {currentCount > 0 && (
                    <button
                      onClick={() => handleResetCount(dua.id)}
                      className="text-[11px] text-[#68756E] hover:text-[#17231F] p-1"
                      title="Reset count"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleIncrement(dua.id, dua.repeatTarget)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all min-h-[40px] ${
                    isComplete
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-[#087F5B] text-white hover:bg-[#064E3B] active:scale-95'
                  }`}
                >
                  {isComplete ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Completed ({currentCount}/{dua.repeatTarget})</span>
                    </>
                  ) : (
                    <span>Tap to Count ({currentCount}/{dua.repeatTarget})</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
