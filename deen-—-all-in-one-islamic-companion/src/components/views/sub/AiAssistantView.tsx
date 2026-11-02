import React, { useState } from 'react';
import { Sparkles, Send, BookOpen, AlertCircle, RefreshCw, MessageSquare } from 'lucide-react';
import { Language } from '../../../types';
import { getTranslation } from '../../../i18n/translations';

interface AiAssistantViewProps {
  language: Language;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({ language }) => {
  const t = getTranslation(language);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text:
        language === 'ar'
          ? 'السلام عليكم ورحمة الله وبركاته. أنا رفيقك التعليمي في تطبيق دين. يمكنك سؤالي عن معاني الآيات، شرح الأحاديث النبوية الصحيحة، أو مصطلحات الشريعة الإسلامية.'
          : language === 'bn'
          ? 'আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ। দ্বীন এআই ইসলামিক সহকারীতে স্বাগতম। আপনি কুরআন-হাদিসের নির্ভরযোগ্য ব্যাখ্যা, নামাজের নিয়মাবলী বা ইসলামিক পরিভাষা সম্পর্কে শিক্ষামূলক যে কোনো প্রশ্ন করতে পারেন।'
          : 'Assalamu Alaikum wa Rahmatullah. Welcome to the DEEN Islamic Assistant. You may ask questions regarding Quranic verses, verified Hadiths, Islamic terminology, or worship etiquettes. All answers are grounded in authentic cited sources.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const suggestedQuestions = [
    {
      en: 'What is the virtue of Tahajjud (night prayer)?',
      ar: 'ما فضل صلاة قيام الليل والتهجد؟',
      bn: 'তাহাজ্জুদ নামাজের ফজিলত ও আদায়ের নিয়ম কী?',
    },
    {
      en: 'Explain the core message of Ayat al-Kursi (2:255)',
      ar: 'ما التفسير والرسالة المركزية لآية الكرسي؟',
      bn: 'আয়াতুল কুরসীর মূল বক্তব্য ও তাৎপর্য কী?',
    },
    {
      en: 'What are the essential Sunnah steps of Wudu?',
      ar: 'ما هي سنن الوضوء المؤكدة؟',
      bn: 'অজুর আবশ্যকীয় সুন্নাতসমূহ কী কী?',
    },
    {
      en: 'Hadiths about kindness to parents and mother',
      ar: 'أحاديث نبوية في بر الوالدين والأم',
      bn: 'পিতামাতার সাথে সদাচরণ সম্পর্কে হাদিসের নির্দেশনা',
    },
  ];

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmed,
          language: language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.answer || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Error contacting AI assistant:', err);
      setErrorMsg(
        err.message ||
          'Unable to connect to the educational AI service. Please verify your connection or API key.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#064E3B] to-[#087F5B] text-white shadow-sm border border-[#E4EAE5] dark:border-[#23332B]">
        <div className="max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold">
              Grounded & Cited
            </span>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md">Gemini 3.8 Flash</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            {t.aiAssistant}
          </h1>
          <p className="text-xs text-white/80 mt-1 leading-relaxed">
            Educational companion for understanding Islamic references, Quranic contexts, and Hadiths with citations.
          </p>
        </div>
      </div>

      {/* Strict Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-[#087F5B]/5 dark:bg-[#C9A45C]/10 border border-[#087F5B]/20 dark:border-[#C9A45C]/30 text-xs text-[#68756E] dark:text-[#8E9D95] flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-[#087F5B] dark:text-[#C9A45C] shrink-0 mt-0.5" />
        <p>{t.aiDisclaimer}</p>
      </div>

      {/* Suggested Questions */}
      <div>
        <span className="text-xs font-semibold text-[#68756E] dark:text-[#8E9D95] uppercase tracking-wider block mb-2 px-1">
          {t.suggestedQuestions}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {suggestedQuestions.map((q, idx) => {
            const label = language === 'ar' ? q.ar : language === 'bn' ? q.bn : q.en;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(label)}
                className="p-3 rounded-xl border border-[#E4EAE5] dark:border-[#23332B] bg-white dark:bg-[#19251F] text-xs font-medium text-[#17231F] dark:text-[#E4EAE5] hover:border-[#087F5B] dark:hover:border-[#C9A45C] hover:bg-[#F7F9F6] dark:hover:bg-[#101A16] transition-all text-left flex items-center justify-between gap-2 shadow-2xs"
              >
                <span className="line-clamp-1">{label}</span>
                <Sparkles className="w-3.5 h-3.5 text-[#087F5B] dark:text-[#C9A45C] shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-sm space-y-4 min-h-[300px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#087F5B] text-white rounded-br-none shadow-xs font-medium'
                  : 'bg-[#F7F9F6] dark:bg-[#101A16] text-[#17231F] dark:text-[#E4EAE5] border border-[#E4EAE5] dark:border-[#23332B] rounded-bl-none shadow-2xs whitespace-pre-line'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[10px] text-[#68756E] dark:text-[#8E9D95] mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-3 text-xs text-[#68756E] dark:text-[#8E9D95]">
            <RefreshCw className="w-4 h-4 animate-spin text-[#087F5B] dark:text-[#C9A45C]" />
            <span>{t.aiThinking}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputQuestion);
        }}
        className="flex items-center gap-2 bg-white dark:bg-[#19251F] p-2 rounded-2xl border border-[#E4EAE5] dark:border-[#23332B] shadow-xs"
      >
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder={t.askAiQuestion}
          disabled={loading}
          className="flex-1 px-3 py-2 text-xs sm:text-sm bg-transparent text-[#17231F] dark:text-[#E4EAE5] focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputQuestion.trim() || loading}
          className="w-10 h-10 rounded-xl bg-[#087F5B] hover:bg-[#064E3B] text-white flex items-center justify-center transition-colors disabled:opacity-40 shadow-xs shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
