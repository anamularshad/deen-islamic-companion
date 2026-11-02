import React, { useState } from 'react';
import { Bookmark, Trash2, Copy, Download, Search } from 'lucide-react';
import { BookmarkItem, Language } from '../../../types';
import { getTranslation } from '../../../i18n/translations';

interface BookmarksViewProps {
  language: Language;
  bookmarks: BookmarkItem[];
  onRemoveBookmark: (id: string) => void;
  onClearAllBookmarks: () => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  language,
  bookmarks,
  onRemoveBookmark,
  onClearAllBookmarks,
}) => {
  const t = getTranslation(language);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = bookmarks.filter((b) => {
    const matchesType = filterType === 'all' || b.type === filterType;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.title.toLowerCase().includes(q) ||
      b.subtitle.toLowerCase().includes(q) ||
      (b.arabicSnippet && b.arabicSnippet.includes(q));
    return matchesType && matchesSearch;
  });

  const handleCopy = (item: BookmarkItem) => {
    const text = `${item.arabicSnippet ? item.arabicSnippet + '\n\n' : ''}${item.title}\n${item.subtitle}`;
    navigator.clipboard.writeText(text);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(bookmarks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deen-bookmarks-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#064E3B] to-[#087F5B] text-white shadow-sm border border-[#E4EAE5] dark:border-[#23332B] flex items-center justify-between">
        <div className="max-w-xl">
          <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold">
            Saved Gems & Verses
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            {t.bookmarks} ({bookmarks.length})
          </h1>
        </div>

        {bookmarks.length > 0 && (
          <button
            onClick={handleExport}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] rounded-2xl w-full sm:w-auto">
          {['all', 'ayah', 'hadith', 'dua'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filterType === type
                  ? 'bg-[#087F5B] text-white shadow-xs'
                  : 'text-[#68756E] dark:text-[#8E9D95] hover:text-[#17231F] dark:hover:text-white'
              }`}
            >
              {type === 'all' ? 'All' : `${type}s`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#68756E] dark:text-[#8E9D95] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] text-[#17231F] dark:text-[#E4EAE5] focus:outline-none focus:border-[#087F5B]"
          />
        </div>
      </div>

      {/* Bookmarks List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] text-xs text-[#68756E] dark:text-[#8E9D95] space-y-2">
            <Bookmark className="w-8 h-8 mx-auto text-[#68756E] opacity-40" />
            <p className="font-semibold text-sm text-[#17231F] dark:text-[#E4EAE5]">
              No saved bookmarks found
            </p>
            <p>Tap the bookmark icon on any Quran verse, Hadith, or Dua to keep it here for quick reflection.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-xs space-y-2 transition-all"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#E4EAE5]/60 dark:border-[#23332B]/60">
                <span className="text-xs font-bold text-[#087F5B] dark:text-[#C9A45C]">
                  {item.title}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(item)}
                    className="p-1.5 rounded-lg text-[#68756E] dark:text-[#8E9D95] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    title="Copy"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemoveBookmark(item.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {item.arabicSnippet && (
                <p className="text-right font-arabic text-base leading-loose text-[#17231F] dark:text-[#E4EAE5]" dir="rtl">
                  {item.arabicSnippet}
                </p>
              )}

              <p className="text-xs text-[#17231F] dark:text-[#E4EAE5] font-medium leading-relaxed">
                "{item.subtitle}"
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
