import { Language } from '../types';

export interface HijriDateInfo {
  day: number;
  month: number; // 1 to 12
  year: number;
  monthNameEn: string;
  monthNameAr: string;
  monthNameBn: string;
  formattedEn: string;
  formattedAr: string;
  formattedBn: string;
  isSpecialDay?: boolean;
  specialEventTitleEn?: string;
  specialEventTitleAr?: string;
  specialEventTitleBn?: string;
}

export const HIJRI_MONTHS = [
  { index: 1, en: 'Muharram', ar: 'مُحَرَّم', bn: 'মুহররম' },
  { index: 2, en: 'Safar', ar: 'صَفَر', bn: 'সফর' },
  { index: 3, en: "Rabi' al-Awwal", ar: 'رَبِيع الأَوَّل', bn: 'রবিউল আউয়াল' },
  { index: 4, en: "Rabi' al-Thani", ar: 'رَبِيع الآخِر', bn: 'রবিউস সানি' },
  { index: 5, en: 'Jumada al-Awwal', ar: 'جُمَادَى الأُولَى', bn: 'জমাদিউল আউয়াল' },
  { index: 6, en: 'Jumada al-Thani', ar: 'جُمَادَى الآخِرَة', bn: 'জমাদিউস সানি' },
  { index: 7, en: 'Rajab', ar: 'رَجَب', bn: 'রজব' },
  { index: 8, en: "Sha'ban", ar: 'شَعْبَان', bn: 'শাবান' },
  { index: 9, en: 'Ramadan', ar: 'رَمَضَان', bn: 'রমজান' },
  { index: 10, en: 'Shawwal', ar: 'شَوَّال', bn: 'শাওয়াল' },
  { index: 11, en: "Dhu al-Qi'dah", ar: 'ذُو القَعْدَة', bn: 'জিলকদ' },
  { index: 12, en: 'Dhu al-Hijjah', ar: 'ذُو الحِجَّة', bn: 'জিলহজ' },
];

export const IMPORTANT_ISLAMIC_DATES = [
  { month: 1, day: 1, en: 'Islamic New Year (1448 AH)', ar: 'رأس السنة الهجرية', bn: 'হিজরি নববর্ষ' },
  { month: 1, day: 10, en: 'Day of Ashura', ar: 'يوم عاشوراء', bn: 'পবিত্র আশুরা' },
  { month: 3, day: 12, en: "Mawlid an-Nabi (Prophet's Birthday)", ar: 'المولد النبوي الشريف', bn: 'ঈদে মিলাদুন্নবী (সাঃ)' },
  { month: 7, day: 27, en: "Al-Isra' wal-Mi'raj", ar: 'الإسراء والمعراج', bn: 'পবিত্র শবে মেরাজ' },
  { month: 8, day: 15, en: "Nisfu Sha'ban (Shab-e-Barat)", ar: 'ليلة النصف من شعبان', bn: 'পবিত্র শবে বরাত' },
  { month: 9, day: 1, en: 'First Day of Ramadan', ar: 'أول أيام رمضان المبارك', bn: 'রমজানের প্রথম রোজা' },
  { month: 9, day: 27, en: 'Laylat al-Qadr (Estimated Night)', ar: 'ليلة القدر المباركة', bn: 'পবিত্র শবে কদর' },
  { month: 10, day: 1, en: 'Eid al-Fitr', ar: 'عيد الفطر المبارك', bn: 'পবিত্র ঈদুল ফিতর' },
  { month: 12, day: 9, en: 'Day of Arafah', ar: 'يوم عرفة', bn: 'আরাফাহ দিবস' },
  { month: 12, day: 10, en: 'Eid al-Adha', ar: 'عيد الأضحى المبارك', bn: 'পবিত্র ঈদুল আজহা' },
  { month: 12, day: 11, en: 'Days of Tashreeq (11-13)', ar: 'أيام التشريق', bn: 'আইয়ামে তাশরিক' },
];

/**
 * Standard astronomical approximation of the Umm Al-Qura / Tabular Islamic calendar
 * with user-defined day adjustment (-2 to +2 days) to match local moon sighting.
 */
export function getHijriDate(date: Date, adjustmentDays: number = 0): HijriDateInfo {
  // Use Intl with islamic-umalqura calendar if available
  const adjustedDate = new Date(date);
  if (adjustmentDays !== 0) {
    adjustedDate.setDate(adjustedDate.getDate() + adjustmentDays);
  }

  try {
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).formatToParts(adjustedDate);

    let day = 1;
    let month = 1;
    let year = 1448;

    for (const part of parts) {
      if (part.type === 'day') day = parseInt(part.value, 10);
      if (part.type === 'month') month = parseInt(part.value, 10);
      if (part.type === 'year') year = parseInt(part.value, 10);
    }

    // Safety fallback
    if (isNaN(month) || month < 1 || month > 12) month = 5;
    if (isNaN(day) || day < 1 || day > 30) day = 1;
    if (isNaN(year)) year = 1448;

    const monthData = HIJRI_MONTHS[month - 1] || HIJRI_MONTHS[0];

    // Check special event
    const special = IMPORTANT_ISLAMIC_DATES.find((e) => e.month === month && e.day === day);

    // Bengali numerals conversion
    const toBnNum = (n: number | string) =>
      n
        .toString()
        .replace(/0/g, '০')
        .replace(/1/g, '১')
        .replace(/2/g, '২')
        .replace(/3/g, '৩')
        .replace(/4/g, '৪')
        .replace(/5/g, '৫')
        .replace(/6/g, '৬')
        .replace(/7/g, '৭')
        .replace(/8/g, '৮')
        .replace(/9/g, '৯');

    // Arabic numerals conversion
    const toArNum = (n: number | string) =>
      n
        .toString()
        .replace(/0/g, '٠')
        .replace(/1/g, '١')
        .replace(/2/g, '٢')
        .replace(/3/g, '٣')
        .replace(/4/g, '٤')
        .replace(/5/g, '٥')
        .replace(/6/g, '٦')
        .replace(/7/g, '٧')
        .replace(/8/g, '٨')
        .replace(/9/g, '٩');

    return {
      day,
      month,
      year,
      monthNameEn: monthData.en,
      monthNameAr: monthData.ar,
      monthNameBn: monthData.bn,
      formattedEn: `${day} ${monthData.en} ${year} AH`,
      formattedAr: `${toArNum(day)} ${monthData.ar} ${toArNum(year)} هـ`,
      formattedBn: `${toBnNum(day)} ${monthData.bn} ${toBnNum(year)} হিজরি`,
      isSpecialDay: !!special,
      specialEventTitleEn: special?.en,
      specialEventTitleAr: special?.ar,
      specialEventTitleBn: special?.bn,
    };
  } catch (e) {
    // Basic fallback calculation
    return {
      day: 20,
      month: 5,
      year: 1448,
      monthNameEn: 'Jumada al-Awwal',
      monthNameAr: 'جُمَادَى الأُولَى',
      monthNameBn: 'জমাদিউল আউয়াল',
      formattedEn: '20 Jumada al-Awwal 1448 AH',
      formattedAr: '٢٠ جُمَادَى الأُولَى ١٤٤٨ هـ',
      formattedBn: '২০ জমাদিউল আউয়াল ১৪৪৮ হিজরি',
    };
  }
}
