export interface KnowledgeArticle {
  id: string;
  category: 'pillars' | 'salah' | 'wudu' | 'faith' | 'zakat' | 'manners';
  titleEn: string;
  titleAr: string;
  titleBn: string;
  summaryEn: string;
  summaryBn: string;
  contentEn: string[];
  contentBn: string[];
  references: string[];
  steps?: { stepNumber: number; title: string; titleBn: string; arabic?: string; description: string; descriptionBn: string }[];
}

export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'six-articles-of-faith',
    category: 'faith',
    titleEn: 'The Six Articles of Faith (Iman)',
    titleAr: 'أركان الإيمان الستة',
    titleBn: 'ঈমানের ছয়টি মূল স্তম্ভ',
    summaryEn: 'The foundational beliefs that define the creed of a Muslim.',
    summaryBn: 'মুমিনের আকিদা ও বিশ্বাসের ছয়টি মৌলিক মূলনীতি।',
    references: ['Sahih Muslim #8 (Hadith Jibril)', 'Surah Al-Baqarah 2:285', 'Surah An-Nisa 4:136'],
    contentEn: [
      '1. Belief in Allah: Affirming that Allah is the Sole Creator, Sustainer, and the Only One worthy of worship without any partners.',
      '2. Belief in His Angels: Believing in the unseen noble servants of Allah made of light, such as Jibril, Mika\'il, and Israfil, who obey Allah without fail.',
      '3. Belief in His Books: Believing in all divinely revealed scriptures including the Tawrat (Torah), Zabur (Psalms), Injeel (Gospel), and the final uncorrupted Qur\'an.',
      '4. Belief in His Messengers: Believing in all Prophets sent to humanity, starting with Adam (as) and culminating with Muhammad (peace be upon him) as the final Messenger.',
      '5. Belief in the Last Day: Affirming the Day of Resurrection, the Reckoning, the Balance, the Bridge (Sirat), and the eternal realities of Paradise and Hellfire.',
      '6. Belief in Divine Decree (Al-Qadr): Believing that everything occurs according to Allah\'s timeless knowledge, divine will, and creation, encompassing both what seems pleasant and painful.',
    ],
    contentBn: [
      '১. আল্লাহর প্রতি বিশ্বাস: আল্লাহ একমাত্র সৃষ্টিকর্তা, পালনকর্তা এবং কোনো শরিক ছাড়া তিনিই একমাত্র সত্য উপাস্য।',
      '২. ফেরেশতাদের প্রতি বিশ্বাস: নূরের তৈরি আল্লাহর নিষ্পাপ অনুগত সেবকগণের প্রতি বিশ্বাস (যেমন জিবরাঈল, মিকাঈল, ইসরাফীল আঃ)।',
      '৩. আসমানি কিতাবসমূহের প্রতি বিশ্বাস: তাওরাত, যাবুর, ইনজিল এবং সর্বশেষ অপরিবর্তিত পবিত্র আল-কোরআনের প্রতি বিশ্বাস।',
      '৪. সকল নবী ও রাসুলগণের প্রতি বিশ্বাস: আদম (আঃ) থেকে শুরু করে শেষ নবী ও রাসুল হযরত মুহাম্মদ (সাঃ) পর্যন্ত সকল প্রেরিত মহাপুরুষের প্রতি বিশ্বাস।',
      '৫. আখেরাত বা শেষ দিবসের প্রতি বিশ্বাস: পুনরুত্থান, হিসাব-নিকাশ, মিজান, পুলসিরাত এবং জান্নাত ও জাহান্নামের শাশ্বত সত্যতায় বিশ্বাস।',
      '৬. তাকদির বা ভাগ্যের প্রতি বিশ্বাস: সকল ভালো ও মন্দের সার্বিক নিয়ন্ত্রণ ও জ্ঞান আল্লাহর ইচ্ছাধীন—এ কথার ওপর অবিচল বিশ্বাস।',
    ],
  },
  {
    id: 'five-pillars-of-islam',
    category: 'pillars',
    titleEn: 'The Five Pillars of Islam (Arkan al-Islam)',
    titleAr: 'أركان الإسلام الخمسة',
    titleBn: 'ইসলামের পাঁচটি মূল স্তম্ভ',
    summaryEn: 'The foundational practices that structure daily Islamic life and devotion.',
    summaryBn: 'দৈনন্দিন ইসলামিক জীবন ও আমলের পাঁচটি মৌলিক বুনিয়াদ।',
    references: ['Sahih al-Bukhari #8', 'Sahih Muslim #16'],
    contentEn: [
      '1. Shahadah (Declaration of Faith): Bearing witness that there is no god but Allah, and Muhammad is His Messenger.',
      '2. Salah (Prayer): Establishing the five obligatory daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha) in their specified times.',
      '3. Zakat (Obligatory Charity): Giving 2.5% of qualifying accumulated wealth annually to those in need.',
      '4. Sawm (Fasting Ramadan): Refraining from food, drink, and marital relations from dawn until sunset during the holy month of Ramadan.',
      '5. Hajj (Pilgrimage to Makkah): Journeying to Makkah at least once in a lifetime for those who are physically and financially able.',
    ],
    contentBn: [
      '১. শাহাদাত (ঈমানের সাক্ষ্য): সাক্ষ্য দেওয়া যে আল্লাহ ছাড়া কোনো সত্য উপাস্য নেই এবং মুহাম্মদ (সাঃ) তাঁর রাসুল।',
      '২. সালাত (নামাজ): প্রতিদিন নির্দিষ্ট সময়ে পাঁচ ওয়াক্ত ফরজ নামাজ (ফজর, জোহর, আসর, মাগরিব, এশা) কায়েম করা।',
      '৩. যাকাত (বাধ্যতামূলক দান): নিসাব পরিমাণ সম্পদের মালিক হলে প্রতি বছর সম্পদের ২.৫% দরিদ্র ও হকদারদের প্রদান করা।',
      '৪. সাওম (রমজানের রোজা): পবিত্র রমজান মাসে সুবহে সাদিক থেকে সূর্যাস্ত পর্যন্ত পানাহার ও কামনা-বাসনা থেকে বিরত থাকা।',
      '৫. হজ (পবিত্র মক্কায় তীর্থযাত্রা): শারীরিক ও আর্থিকভাবে সামর্থ্যবান ব্যক্তির জন্য জীবনে অন্তত একবার মক্কা শরিফের হজ পালন করা।',
    ],
  },
  {
    id: 'step-by-step-salah-guide',
    category: 'salah',
    titleEn: 'Step-by-Step Prayer (Salah) Guide',
    titleAr: 'دليل صفة الصلاة خطوة بخطوة',
    titleBn: 'ধারাবাহিক নামাজ (সালাত) শিক্ষা গাইড',
    summaryEn: 'The authentic method of prayer according to the Prophetic Sunnah.',
    summaryBn: 'সুন্নাহ সম্মত ধারাবাহিক নামাজ আদায়ের পূর্ণাঙ্গ নিয়ম।',
    references: ['Sahih al-Bukhari #631 ("Pray as you have seen me pray")', 'Sahih Muslim #397'],
    contentEn: [
      'Prayer is the pillar of the faith and the first deed evaluated on the Day of Judgment. Here is the step-by-step posture and recitation guideline.',
    ],
    contentBn: [
      'নামাজ হলো দ্বীনের মূল স্তম্ভ এবং কিয়ামতের দিন বান্দার কাছ থেকে সর্বপ্রথম নামাজের হিসাব নেওয়া হবে। নিচে ধারাবাহিক নিয়ম ও দোয়া তুলে ধরা হলো।',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Takbirat al-Ihram (Beginning of Salah)',
        titleBn: 'তাকবীরে তাহরীমা (নামাজ শুরু)',
        arabic: 'اللَّهُ أَكْبَرُ',
        description: 'Stand upright facing the Qibla with sincere intention in the heart. Raise both hands to shoulder or ear level and say: "Allahu Akbar" (Allah is the Greatest).',
        descriptionBn: 'কিবলামুখী হয়ে মনে নিয়ত করে উভয় হাত কাঁধ বা কান বরাবর তুলে ‘আল্লাহু আকবার’ বলে নামাজ শুরু করুন এবং হাত বাঁধুন।',
      },
      {
        stepNumber: 2,
        title: 'Qiyam (Standing) & Surah Al-Fatiha',
        titleBn: 'কিয়াম (দাঁড়িয়ে কেরাত ও সূরা ফাতিহা পাঠ)',
        arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ...',
        description: 'Place the right hand over the left wrist on the chest or below the navel (according to scholarly schools). Recite the opening supplication (Thana/Du\'a al-Istiftah), followed by Surah Al-Fatiha and a portion of the Qur\'an.',
        descriptionBn: 'উভয় হাত বেঁধে ছানা পাঠ করুন, অতঃপর আউযুবিল্লাহ-বিসমিল্লাহ সহকারে সূরা আল-ফাতিহা এবং পবিত্র কোরআন থেকে অন্য কোনো সূরা বা আয়াত তিলাওয়াত করুন।',
      },
      {
        stepNumber: 3,
        title: 'Ruku\' (Bowing)',
        titleBn: 'রুকু (নত হওয়া)',
        arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
        description: 'Say "Allahu Akbar" and bow with a straight back, placing hands firmly on knees. Recite "Subhana Rabbiyal-Azeem" (Glory be to my Lord the Almighty) at least 3 times with calmness.',
        descriptionBn: '‘আল্লাহু আকবার’ বলে পিঠ সোজা রেখে রুকুতে যান এবং দুই হাত দিয়ে হাঁটু শক্তভাবে ধরুন। অন্তত ৩ বার পাঠ করুন: ‘সুবহানা রাব্বিয়াল আযীম’।',
      },
      {
        stepNumber: 4,
        title: 'I\'tidal (Standing after Bowing)',
        titleBn: 'কওমা (রুকু থেকে সোজা হয়ে দাঁড়ানো)',
        arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ • رَبَّنَا وَلَكَ الْحَمْدُ',
        description: 'Rise up straight from bowing saying: "Sami\' Allāhu liman ḥamidah" (Allah hears whoever praises Him). Once fully upright, say: "Rabbanā wa lakal-ḥamd" (Our Lord, to You belongs all praise).',
        descriptionBn: 'রুকু থেকে সোজা হয়ে দাঁড়ানোর সময় বলুন: ‘সামিআল্লাহু লিমান হামিদাহ’। সোজা হয়ে দাঁড়িয়ে বলুন: ‘রব্বানা লাকাল হামদ’।',
      },
      {
        stepNumber: 5,
        title: 'Sujud (Prostration)',
        titleBn: 'সিজদা (মস্তক অবনত করা)',
        arabic: 'سُبْحَانَ رَبِّيَ الأَعْلَى',
        description: 'Say "Allahu Akbar" and prostrate on seven contact points: the forehead & nose, both palms, both knees, and toes of both feet facing the Qibla. Recite "Subhana Rabbiyal-A\'la" (Glory be to my Lord the Most High) at least 3 times.',
        descriptionBn: '‘আল্লাহু আকবার’ বলে সাতটি অঙ্গের ওপর সিজদা করুন: কপাল ও নাক, দুই হাতের তালু, দুই হাঁটু এবং দুই পায়ের আঙুলসমূহ। অন্তত ৩ বার পাঠ করুন: ‘সুবহানা রাব্বিয়াল আ’লা’।',
      },
      {
        stepNumber: 6,
        title: 'Jalsah (Sitting between two Sujuds)',
        titleBn: 'জলসা (দুই সিজদার মাঝে বসা)',
        arabic: 'رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي',
        description: 'Rise from prostration saying "Allahu Akbar" and sit peacefully on the left foot with right foot upright. Supplicate: "Rabbighfir li, Rabbighfir li" (My Lord, forgive me), then perform the second Sujud similarly.',
        descriptionBn: '‘আল্লাহু আকবার’ বলে উঠে সোজা হয়ে বসুন এবং দোয়া করুন: ‘রাব্বিগফিরলী, রাব্বিগফিরলী’ (হে আমার রব, আমাকে ক্ষমা করুন)। এরপর একইভাবে দ্বিতীয় সিজদা আদায় করুন।',
      },
      {
        stepNumber: 7,
        title: 'Tashahhud (Sitting for Testimony)',
        titleBn: 'তাশাহহুদ (আত্তাহিয়্যাতু পাঠ)',
        arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ...',
        description: 'Sit in the final sitting position. Recite the Tashahhud (Attahiyyaat), send blessings upon the Prophet (Durood Ibrahim), and make personal du\'as before concluding.',
        descriptionBn: 'নামাজের শেষ বৈঠকে বসে ‘আত্তাহিয়্যাতু’, ‘দুরুদে ইব্রাহিম’ এবং ‘দোয়ায়ে মাছুরা’ পাঠ করুন।',
      },
      {
        stepNumber: 8,
        title: 'Tasleem (Concluding the Prayer)',
        titleBn: 'সালাম (নামাজ সম্পন্ন করা)',
        arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
        description: 'Turn your face to the right and say: "As-salāmu ʿalaykum wa raḥmatullāh", then turn to the left and say the same. Prayer is now complete.',
        descriptionBn: 'ডান কাঁধের দিকে মুখ ফিরিয়ে বলুন: ‘আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ’, অতঃপর বাম দিকে ফিরে একইভাবে সালাম ফিরিয়ে নামাজ সম্পন্ন করুন।',
      },
    ],
  },
  {
    id: 'wudu-guide',
    category: 'wudu',
    titleEn: 'Step-by-Step Ablution (Wudu) Guide',
    titleAr: 'صفة الوضوء الكاملة',
    titleBn: 'ধারাবাহিক অজু (ওজু) শিক্ষা গাইড',
    summaryEn: 'How to perform spiritual purification prior to prayer.',
    summaryBn: 'নামাজের পূর্বে পবিত্রতা অর্জনের ধারাবাহিক নিয়মাবলী।',
    references: ['Surah Al-Ma\'idah 5:6', 'Sahih al-Bukhari #159', 'Sahih Muslim #226'],
    contentEn: [
      'Ritual purity is a prerequisite for prayer. Performing wudu with mindfulness washes away sins and brings spiritual tranquility.',
    ],
    contentBn: [
      'পবিত্রতা হলো নামাজের অপরিহার্য শর্ত। মনোযোগ দিয়ে সুন্দরভাবে অজু সম্পন্ন করলে সগিরা গুনাহসমূহ ধুয়ে যায় এবং অন্তরে প্রশান্তি লাভ হয়।',
    ],
    steps: [
      { stepNumber: 1, title: 'Niyyah & Bismillah', titleBn: 'নিয়ত ও বিসমিল্লাহ', description: 'Make sincere intention in your heart to purify yourself for Allah, then say: "Bismillah".', descriptionBn: 'মনে মনে অজুর নিয়ত করুন এবং মুখে ‘বিসমিল্লাহ’ বলে শুরু করুন।' },
      { stepNumber: 2, title: 'Washing Hands', titleBn: 'দুই হাত ধৌত করা', description: 'Wash both hands up to the wrists thoroughly three times, making sure water reaches between fingers.', descriptionBn: 'দুই হাতের কবজি পর্যন্ত ভালোভাবে তিনবার ধৌত করুন এবং আঙুলসমূহ খিলাল করুন।' },
      { stepNumber: 3, title: 'Rinsing Mouth', titleBn: 'কুলি করা (মাদমাদাহ)', description: 'Take water into the mouth with the right hand and rinse thoroughly three times.', descriptionBn: 'ডান হাতে পানি নিয়ে তিনবার ভালোমতো কুলি করুন।' },
      { stepNumber: 4, title: 'Sniffing Water into Nose', titleBn: 'নাকে পানি দেওয়া (ইসতিনশাক)', description: 'Sniff water gently into the nostrils and blow it out with the left hand three times.', descriptionBn: 'ডান হাতে নাকে পানি দিয়ে বাম হাত দ্বারা নাক তিনবার পরিষ্কার করুন।' },
      { stepNumber: 5, title: 'Washing the Face', titleBn: 'মুখমণ্ডল ধৌত করা', description: 'Wash the entire face three times, from the hairline to the chin, and from ear to ear.', descriptionBn: 'কপালের চুলের গোড়া থেকে থুতনির নিচ পর্যন্ত এবং এক কানের লতি থেকে অন্য কানের লতি পর্যন্ত সম্পূর্ণ মুখ তিনবার ধৌত করুন।' },
      { stepNumber: 6, title: 'Washing Arms to the Elbows', titleBn: 'কনুই পর্যন্ত হাত ধৌত করা', description: 'Wash the right arm from fingertips up to and including the elbow 3 times, then the left arm 3 times.', descriptionBn: 'প্রথমে ডান হাত আঙুলের ডগা থেকে কনুই পর্যন্ত তিনবার এবং পরে একইভাবে বাম হাত তিনবার ধৌত করুন।' },
      { stepNumber: 7, title: 'Wiping the Head (Masah)', titleBn: 'মাথা মাসেহ করা', description: 'Wet hands and wipe over the head from front to back and return once, and wipe the ears inside and out.', descriptionBn: 'ভেজা হাত দিয়ে কপালের দিক থেকে পেছনের ঘাড় পর্যন্ত নিয়ে গিয়ে আবার সামনে টেনে এনে সম্পূর্ণ মাথা এবং কানের ভেতর ও বাইরে একবার মাসেহ করুন।' },
      { stepNumber: 8, title: 'Washing Both Feet to the Ankles', titleBn: 'পা ধৌত করা', description: 'Wash the right foot including the ankles thoroughly 3 times, then the left foot 3 times.', descriptionBn: 'প্রথমে ডান পা গোড়ালি ও টাখনু সহ তিনবার এবং পরে বাম পা একইভাবে তিনবার পরিষ্কার করে ধৌত করুন।' },
    ],
  },
  {
    id: 'zakat-guide',
    category: 'zakat',
    titleEn: 'Zakat Rules & Calculation Guide',
    titleAr: 'أحكام وحساب الزكاة',
    titleBn: 'যাকাতের নিয়ম ও হিসাব নির্দেশিকা',
    summaryEn: 'Understanding Nisab thresholds, eligible assets, and distribution rules.',
    summaryBn: 'যাকাতের নিসাব, ফরজ হওয়ার শর্ত ও হিসাবের পূর্ণ বিবরণ।',
    references: ['Surah At-Tawbah 9:60', 'Sahih al-Bukhari #1405'],
    contentEn: [
      'Zakat is an obligatory pillar of Islam due once a lunar year on surplus wealth that exceeds the Nisab threshold.',
      'Nisab threshold benchmark: 85 grams of 24k gold (or equivalent cash value) or 595 grams of pure silver.',
      'Rate: Exactly 2.5% (one fortieth) of net liquid and tradeable assets held for one lunar year.',
      'Eligible assets: Cash in bank accounts, cash at home, gold, silver, traded business inventory, and investment stocks for resale.',
      'Deductible: Immediate short-term debts and living expenses due at the time of calculation.',
    ],
    contentBn: [
      'যাকাত হলো ইসলামের তৃতীয় গুরুত্বপূর্ণ ফরজ স্তম্ভ। কারো মালিকানায় বছরান্তে নিসাব পরিমাণ উদ্বৃত্ত সম্পদ থাকলে তার ওপর যাকাত প্রদান আবশ্যক হয়।',
      'নিসাবের পরিমাণ: সাড়ে সাত তোলা (৮৫ গ্রাম) স্বর্ণ অথবা সাড়ে বায়ান্ন তোলা (৫৯৫ গ্রাম) রৌপ্য অথবা তার সমমূল্যের নগদ অর্থ ও বাণিজ্যিক সম্পদ।',
      'হার: মোট যাকাতযোগ্য সম্পদের শতকরা ২.৫% (৪০ ভাগের ১ ভাগ)।',
      'যাকাতযোগ্য সম্পদ: ব্যাংকে রক্ষিত টাকা, নগদ অর্থ, সোনা-রুপা, ব্যবসার বিক্রয়যোগ্য মালামাল এবং শেয়ার বা বন্ডের নগদ লভ্যাংশ।',
      'বাদযোগ্য: বর্তমান জরুরি ঋণ এবং তাৎক্ষণিক জীবিকা নির্বাহের দেনা।',
    ],
  },
];
