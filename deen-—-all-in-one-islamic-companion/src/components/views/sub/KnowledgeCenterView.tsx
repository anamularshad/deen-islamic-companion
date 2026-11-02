import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Info,
  Sparkles,
} from 'lucide-react';
import { Language } from '../../../types';
import { KNOWLEDGE_ARTICLES, KnowledgeArticle } from '../../../data/knowledge';
import { getTranslation } from '../../../i18n/translations';

interface KnowledgeCenterViewProps {
  language: Language;
}

export const KnowledgeCenterView: React.FC<KnowledgeCenterViewProps> = ({
  language,
}) => {
  const t = getTranslation(language);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Topics' },
    { id: 'salah', label: 'Prayer (Salah) Guide' },
    { id: 'wudu', label: 'Ablution (Wudu)' },
    { id: 'faith', label: 'Articles of Faith' },
    { id: 'pillars', label: '5 Pillars' },
    { id: 'zakat', label: 'Zakat Rules' },
  ];

  const filteredArticles = KNOWLEDGE_ARTICLES.filter(
    (a) => activeCategory === 'all' || a.category === activeCategory
  );

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#064E3B] to-[#087F5B] text-white shadow-sm border border-[#E4EAE5] dark:border-[#23332B]">
        <div className="max-w-xl">
          <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold">
            Authentic Islamic Learning
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            {t.knowledgeCenter}
          </h1>
          <p className="text-xs text-white/80 mt-1 leading-relaxed">
            Essential guides on foundational beliefs, step-by-step prayer & wudu tutorials, and practical worship instructions.
          </p>
        </div>
      </div>

      {!selectedArticle ? (
        /* Articles List */
        <div className="space-y-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === c.id
                    ? 'bg-[#087F5B] text-white shadow-xs'
                    : 'bg-white dark:bg-[#19251F] text-[#68756E] dark:text-[#8E9D95] border border-[#E4EAE5] dark:border-[#23332B] hover:text-[#17231F] dark:hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredArticles.map((art) => (
              <button
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="p-5 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] hover:border-[#087F5B] dark:hover:border-[#C9A45C] hover:shadow-xs transition-all text-left flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#087F5B] dark:text-[#C9A45C]">
                      {art.category.toUpperCase()}
                    </span>
                    <span className="text-[11px] font-arabic text-[#68756E] dark:text-[#8E9D95]">
                      {art.titleAr}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-[#17231F] dark:text-[#E4EAE5] group-hover:text-[#087F5B] dark:group-hover:text-[#C9A45C] transition-colors">
                    {language === 'bn' ? art.titleBn : art.titleEn}
                  </h3>

                  <p className="text-xs text-[#68756E] dark:text-[#8E9D95] mt-1.5 leading-relaxed">
                    {language === 'bn' ? art.summaryBn : art.summaryEn}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-[#087F5B] dark:text-[#C9A45C] mt-4 pt-3 border-t border-[#E4EAE5]/60 dark:border-[#23332B]/60">
                  <span>Start Learning</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Detailed Article Reader */
        <div className="space-y-5">
          {/* Back button */}
          <button
            onClick={() => setSelectedArticle(null)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#087F5B] dark:text-[#C9A45C] hover:underline"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Learning Guides</span>
          </button>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#087F5B] dark:text-[#C9A45C]">
                {selectedArticle.category.toUpperCase()}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#17231F] dark:text-[#E4EAE5] mt-1">
                {language === 'bn' ? selectedArticle.titleBn : selectedArticle.titleEn}
              </h2>
              <p className="text-sm font-arabic text-[#68756E] dark:text-[#8E9D95] mt-1">
                {selectedArticle.titleAr}
              </p>
            </div>

            {/* General Content Paragraphs */}
            <div className="space-y-3 text-xs sm:text-sm text-[#17231F] dark:text-[#E4EAE5] leading-relaxed">
              {(language === 'bn' ? selectedArticle.contentBn : selectedArticle.contentEn).map((p, idx) => (
                <p key={idx} className="p-3.5 rounded-xl bg-[#F7F9F6] dark:bg-[#101A16] border border-[#E4EAE5] dark:border-[#23332B]">
                  {p}
                </p>
              ))}
            </div>

            {/* Step-by-Step Instructions if present (e.g. Salah or Wudu) */}
            {selectedArticle.steps && selectedArticle.steps.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-[#E4EAE5] dark:border-[#23332B]">
                <h3 className="text-sm font-bold text-[#17231F] dark:text-[#E4EAE5] uppercase tracking-wider">
                  Step-by-Step Guidance
                </h3>

                <div className="space-y-3">
                  {selectedArticle.steps.map((st) => (
                    <div
                      key={st.stepNumber}
                      className="p-4 sm:p-5 rounded-2xl border border-[#E4EAE5] dark:border-[#23332B] bg-white dark:bg-[#19251F] space-y-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-[#087F5B] text-white flex items-center justify-center font-bold text-xs">
                          {st.stepNumber}
                        </span>
                        <h4 className="text-sm font-bold text-[#17231F] dark:text-[#E4EAE5]">
                          {language === 'bn' ? st.titleBn : st.title}
                        </h4>
                      </div>

                      {st.arabic && (
                        <p className="text-right font-arabic text-base sm:text-lg text-[#064E3B] dark:text-[#C9A45C] my-2" dir="rtl">
                          {st.arabic}
                        </p>
                      )}

                      <p className="text-xs sm:text-sm text-[#68756E] dark:text-[#8E9D95] leading-relaxed pl-11">
                        {language === 'bn' ? st.descriptionBn : st.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* References */}
            <div className="p-4 rounded-xl bg-[#F7F9F6] dark:bg-[#101A16] border border-[#E4EAE5] dark:border-[#23332B] text-xs">
              <span className="font-bold text-[#17231F] dark:text-[#E4EAE5] block mb-1">
                Authentic Source References:
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-[#68756E] dark:text-[#8E9D95]">
                {selectedArticle.references.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
