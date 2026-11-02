import React, { useState } from 'react';
import { Calculator, DollarSign, Info, ShieldCheck, Check } from 'lucide-react';
import { Language } from '../../../types';
import { getTranslation } from '../../../i18n/translations';

interface ZakatCalculatorViewProps {
  language: Language;
}

export const ZakatCalculatorView: React.FC<ZakatCalculatorViewProps> = ({
  language,
}) => {
  const t = getTranslation(language);

  // Currency
  const [currency, setCurrency] = useState('USD');
  const [nisabStandard, setNisabStandard] = useState<'silver' | 'gold'>('silver');

  // Asset inputs
  const [cash, setCash] = useState<number>(0);
  const [goldValue, setGoldValue] = useState<number>(0);
  const [silverValue, setSilverValue] = useState<number>(0);
  const [inventoryValue, setInventoryValue] = useState<number>(0);
  const [investments, setInvestments] = useState<number>(0);

  // Liabilities
  const [debts, setDebts] = useState<number>(0);

  // Approximate Nisab values (can be customized or estimated)
  // Silver Nisab (595g * ~$1.00/g ≈ $595) - more beneficial to poor
  // Gold Nisab (85g * ~$80/g ≈ $6,800)
  const nisabThreshold = nisabStandard === 'silver' ? 600 : 6800;

  const totalAssets = cash + goldValue + silverValue + inventoryValue + investments;
  const netWealth = Math.max(0, totalAssets - debts);
  const isEligible = netWealth >= nisabThreshold;
  const zakatDue = isEligible ? netWealth * 0.025 : 0;

  return (
    <div className="space-y-6 pb-24 md:pb-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#064E3B] to-[#087F5B] text-white shadow-sm border border-[#E4EAE5] dark:border-[#23332B]">
        <div className="max-w-xl">
          <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold">
            The Third Pillar of Islam
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            {t.zakatCalculator}
          </h1>
          <p className="text-xs text-white/80 mt-1 leading-relaxed">
            Calculate your annual 2.5% obligatory charity on qualifying surplus wealth meeting the Nisab threshold.
          </p>
        </div>
      </div>

      {/* Nisab Selector & Currency */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div>
          <h4 className="text-xs font-bold text-[#17231F] dark:text-[#E4EAE5]">
            Nisab Standard Benchmark
          </h4>
          <p className="text-[11px] text-[#68756E] dark:text-[#8E9D95]">
            Classical scholars generally recommend the silver standard as it extends aid to more beneficiaries.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-[#F7F9F6] dark:bg-[#101A16] rounded-xl border border-[#E4EAE5] dark:border-[#23332B]">
          <button
            onClick={() => setNisabStandard('silver')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              nisabStandard === 'silver'
                ? 'bg-[#087F5B] text-white shadow-xs'
                : 'text-[#68756E] dark:text-[#8E9D95]'
            }`}
          >
            Silver (595g ≈ ${nisabThreshold})
          </button>
          <button
            onClick={() => setNisabStandard('gold')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              nisabStandard === 'gold'
                ? 'bg-[#087F5B] text-white shadow-xs'
                : 'text-[#68756E] dark:text-[#8E9D95]'
            }`}
          >
            Gold (85g ≈ $6,800)
          </button>
        </div>
      </div>

      {/* Input Fields */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#17231F] dark:text-[#E4EAE5] uppercase tracking-wider pb-2 border-b border-[#E4EAE5] dark:border-[#23332B]">
          1. Zakat-Eligible Assets (Held for 1 Lunar Year)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-[#17231F] dark:text-[#E4EAE5] block mb-1">
              Cash at Bank & on Hand ($)
            </label>
            <input
              type="number"
              min="0"
              value={cash || ''}
              onChange={(e) => setCash(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="w-full p-2.5 rounded-xl border border-[#E4EAE5] dark:border-[#23332B] bg-[#F7F9F6] dark:bg-[#101A16] text-xs font-mono font-medium focus:outline-none focus:border-[#087F5B]"
            />
          </div>

          <div>
            <label className="font-semibold text-[#17231F] dark:text-[#E4EAE5] block mb-1">
              Gold Value ($)
            </label>
            <input
              type="number"
              min="0"
              value={goldValue || ''}
              onChange={(e) => setGoldValue(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="w-full p-2.5 rounded-xl border border-[#E4EAE5] dark:border-[#23332B] bg-[#F7F9F6] dark:bg-[#101A16] text-xs font-mono font-medium focus:outline-none focus:border-[#087F5B]"
            />
          </div>

          <div>
            <label className="font-semibold text-[#17231F] dark:text-[#E4EAE5] block mb-1">
              Silver Value ($)
            </label>
            <input
              type="number"
              min="0"
              value={silverValue || ''}
              onChange={(e) => setSilverValue(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="w-full p-2.5 rounded-xl border border-[#E4EAE5] dark:border-[#23332B] bg-[#F7F9F6] dark:bg-[#101A16] text-xs font-mono font-medium focus:outline-none focus:border-[#087F5B]"
            />
          </div>

          <div>
            <label className="font-semibold text-[#17231F] dark:text-[#E4EAE5] block mb-1">
              Business Merchandise & Goods ($)
            </label>
            <input
              type="number"
              min="0"
              value={inventoryValue || ''}
              onChange={(e) => setInventoryValue(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="w-full p-2.5 rounded-xl border border-[#E4EAE5] dark:border-[#23332B] bg-[#F7F9F6] dark:bg-[#101A16] text-xs font-mono font-medium focus:outline-none focus:border-[#087F5B]"
            />
          </div>
        </div>

        <h3 className="text-sm font-bold text-[#17231F] dark:text-[#E4EAE5] uppercase tracking-wider pt-4 pb-2 border-b border-[#E4EAE5] dark:border-[#23332B]">
          2. Deductible Liabilities & Debts
        </h3>

        <div className="text-xs">
          <label className="font-semibold text-[#17231F] dark:text-[#E4EAE5] block mb-1">
            Immediate Debts Due ($)
          </label>
          <input
            type="number"
            min="0"
            value={debts || ''}
            onChange={(e) => setDebts(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className="w-full p-2.5 rounded-xl border border-[#E4EAE5] dark:border-[#23332B] bg-[#F7F9F6] dark:bg-[#101A16] text-xs font-mono font-medium focus:outline-none focus:border-[#087F5B]"
          />
        </div>

        {/* Calculation Result Box */}
        <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-[#064E3B] to-[#087F5B] text-white shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-white/80 font-semibold">
              Net Zakat-Eligible Wealth
            </span>
            <span className="text-base font-bold font-mono tabular-nums">
              ${netWealth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/20">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-bold">
                Total Zakat Due (2.5%)
              </span>
              <p className="text-[11px] text-white/70">
                {isEligible
                  ? `Qualifies for Zakat (Exceeds Nisab threshold of $${nisabThreshold})`
                  : `Below Nisab threshold ($${nisabThreshold}). No Zakat is due.`}
              </p>
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#C9A45C] font-mono tabular-nums">
              ${zakatDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Rules Notice */}
      <div className="p-4 rounded-2xl bg-[#087F5B]/5 dark:bg-[#C9A45C]/10 border border-[#087F5B]/20 dark:border-[#C9A45C]/30 text-xs text-[#68756E] dark:text-[#8E9D95] flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-[#087F5B] dark:text-[#C9A45C] shrink-0 mt-0.5" />
        <p>
          "Take from their wealth a charity by which you purify them and cause them increase" (Surah At-Tawbah 9:103). Zakat must be distributed to eligible categories defined in the Quran (the poor, the needy, those in debt, etc.).
        </p>
      </div>
    </div>
  );
};
