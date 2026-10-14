// Amaliy metodik ishlar (texnologik blok: Case-study, loyiha metodi, Lesson Study, Microteaching).
// O'quvchi xatolari metodik adabiyotda tasvirlangan tipik xatolar asosida tuzilgan
// (haqiqiy o'quvchi ishlari emas); keyinchalik haqiqiy ishlar bilan to'ldiriladi.

import released from "@/data/released.json";
import type { SubmissionKind } from "@/lib/db";

export type Field = { id: string; label: string; hint?: string; rows?: number; url?: boolean };

export type PupilError = {
  id: string;
  grade: number;
  topic: string;
  task: string;
  pupil: string;
  correct: string;
  /** O'qituvchi uchun: xato mexanizmi, sababi va keyingi qadam (talaba javob yuborgandan keyin ko'rsatiladi). */
  diagnosis: string;
  cause: string;
  next: string;
};

export const PUPIL_ERRORS: PupilError[] = [
  {
    id: "X-1",
    grade: 2,
    topic: "Ayirish (o'nlikdan o'tish)",
    task: "63 − 28",
    pupil: "45",
    correct: "35",
    diagnosis: "Har bir xonada kichik raqamdan kattasini ayirgan: 8 − 3 = 5, 6 − 2 = 4.",
    cause:
      "O'nlikni maydalash (qarz olish) tushunilmagan; ayirish raqamlar ustida mexanik amal deb qaralgan.",
    next: "O'nliklar va birliklar modeli (bog'lam cho'plar): 63 ni 5 o'nlik 13 birlik deb almashtirish, so'ng ayirish.",
  },
  {
    id: "X-2",
    grade: 3,
    topic: "Ayirish (nol bor son)",
    task: "305 − 128",
    pupil: "223",
    correct: "177",
    diagnosis:
      "Har xonada kichikdan kattani ayirgan, noldan qarz olish bosqichini o'tkazib yuborgan.",
    cause: "Ichida nol bor sonda qarz ikki xonadan o'tishi tushunilmagan.",
    next: "305 ni 2 yuzlik 9 o'nlik 15 birlik deb yozish; pul (100, 10, 1 so'mlik) modeli bilan ko'rsatish.",
  },
  {
    id: "X-3",
    grade: 2,
    topic: "Qo'shish (o'nlikdan o'tish)",
    task: "47 + 38",
    pupil: "715",
    correct: "85",
    diagnosis: "Birliklar yig'indisi 15 ni to'liq yozib, o'nliklarni (4 + 3 = 7) oldiga qo'ygan.",
    cause: "Xona birligi va 10 birlik = 1 o'nlik almashuvi tushunilmagan.",
    next: "Xona jadvali va almashtirish: 15 birlik = 1 o'nlik 5 birlik; taxminiy baholash (50 + 40 dan oshmaydi).",
  },
  {
    id: "X-4",
    grade: 3,
    topic: "Ko'paytirish (ikki xonali son)",
    task: "24 × 3",
    pupil: "612",
    correct: "72",
    diagnosis: "2 × 3 = 6 va 4 × 3 = 12 ni yonma-yon yozgan.",
    cause: "Taqsimot xossasi va xona qiymati (20 × 3 = 60) tushunilmagan.",
    next: "24 × 3 = 20 × 3 + 4 × 3 = 60 + 12; massiv (to'r) modeli.",
  },
  {
    id: "X-5",
    grade: 3,
    topic: "Bo'lish (bo'linmada nol)",
    task: "408 : 4",
    pupil: "12",
    correct: "102",
    diagnosis: "O'nliklar xonasida 0 : 4 bosqichini tushirib qoldirgan.",
    cause:
      "Har bir xonani bo'lish va bo'linmaga 0 yozish zarurligi anglanmagan; javobni tekshirish odati yo'q.",
    next: "Bo'lishni ko'paytirish bilan tekshirish (12 × 4 = 48 ≠ 408); taxminiy baholash (400 : 4 = 100).",
  },
  {
    id: "X-6",
    grade: 4,
    topic: "O'nli kasrlarni taqqoslash",
    task: "2,7 va 2,45 ni taqqoslang",
    pupil: "2,45 > 2,7, chunki 45 > 7",
    correct: "2,7 > 2,45",
    diagnosis: "Kasr qismidagi raqamlarni butun son kabi taqqoslagan.",
    cause: 'O\'ndan va yuzdan birlar xona qiymati tushunilmagan; "uzunroq son kattaroq" qoidasi.',
    next: "2,7 = 2,70; 10×10 katakli kvadrat yoki metr (2 m 70 sm va 2 m 45 sm).",
  },
  {
    id: "X-7",
    grade: 4,
    topic: "O'nli kasrni 10 ga ko'paytirish",
    task: "3,2 × 10",
    pupil: "3,20",
    correct: "32",
    diagnosis: "\"10 ga ko'paytirsak oxiriga 0 qo'shiladi\" qoidasini o'nli kasrga ko'chirgan.",
    cause: "Qoida ma'nosiz yodlangan: aslida har bir raqam bir xona chapga suriladi.",
    next: "Xona jadvalida raqamlarni surish; pul misoli: 3,2 ming so'mlik 10 ta narsa.",
  },
  {
    id: "X-8",
    grade: 3,
    topic: "Kasrlarni taqqoslash",
    task: "1/3 va 1/4 ni taqqoslang",
    pupil: "1/4 > 1/3, chunki 4 > 3",
    correct: "1/3 > 1/4",
    diagnosis: "Maxrajlarni natural son kabi taqqoslagan.",
    cause:
      "Maxraj butun nechta teng qismga bo'linganini bildirishi va qismlar ko'paysa har biri kichrayishi tushunilmagan.",
    next: "Bir xil tortni 3 va 4 qismga bo'lish; kasrlar lentasi.",
  },
  {
    id: "X-9",
    grade: 4,
    topic: "Kasrlarni qo'shish",
    task: "2/5 + 1/5",
    pupil: "3/10",
    correct: "3/5",
    diagnosis: "Suratlarni ham, maxrajlarni ham qo'shgan.",
    cause: "Maxraj qism o'lchamini, surat qismlar sonini bildirishi tushunilmagan.",
    next: '"2 ta beshdan bir + 1 ta beshdan bir = 3 ta beshdan bir"; doira modeli.',
  },
  {
    id: "X-10",
    grade: 2,
    topic: "Vaqt",
    task: "Soat mili 3 ga yaqin, minut mili 9 da. Soat necha?",
    pupil: "3:45",
    correct: "2:45",
    diagnosis: "Soat mili qaysi raqamga yaqin bo'lsa, o'sha soatni o'qigan.",
    cause: "Soat mili ikki raqam orasida asta harakatlanishi tushunilmagan.",
    next: 'Harakatlanadigan model soatda 2:00 dan 3:00 gacha milni aylantirish; "soat mili hali 3 ga yetmagan".',
  },
  {
    id: "X-11",
    grade: 3,
    topic: "Perimetr",
    task: "Tomonlari 5 sm va 3 sm bo'lgan to'g'ri to'rtburchak perimetri",
    pupil: "15 sm",
    correct: "16 sm",
    diagnosis: "Tomonlarni ko'paytirgan (yuzani topgan).",
    cause: "Perimetr (chegara uzunligi) va yuza (ichini qoplash) tushunchalari aralashgan.",
    next: "Perimetrni ip bilan o'lchash, yuzani kataklar bilan qoplash; ikkalasini bir chizmada solishtirish.",
  },
  {
    id: "X-12",
    grade: 4,
    topic: "Yuza birligi",
    task: "Xona 6 m × 4 m. Yuzasi?",
    pupil: "24 m",
    correct: "24 m²",
    diagnosis: "Son to'g'ri, birlik noto'g'ri.",
    cause: "Yuza kvadrat birliklar soni ekani tushunilmagan.",
    next: '1 m² li kvadratlar bilan qoplash; "nechta kvadrat metr?" savoli.',
  },
  {
    id: "X-13",
    grade: 2,
    topic: "Uzunlikni o'lchash",
    task: "Kesma chizg'ichning 1 dan 6 gacha bo'lgan qismida yotibdi. Uzunligi?",
    pupil: "6 sm",
    correct: "5 sm",
    diagnosis: "Kesma uchidagi belgini javob deb olgan.",
    cause: "Uzunlik — oraliqlar soni ekani, o'lchash 0 dan boshlanishi tushunilmagan.",
    next: "Oraliqlarni sanash; kesmani 0 ga va boshqa joyga qo'yib solishtirish.",
  },
  {
    id: "X-14",
    grade: 3,
    topic: "Matnli masala (\"ko'p\" so'zi)",
    task: "Alida 15 ta olma bor, bu Validagidan 4 ta ko'p. Valida nechta olma bor?",
    pupil: "19",
    correct: "11",
    diagnosis: "\"Ko'p\" so'zini ko'rib qo'shgan.",
    cause: "Kalit so'z bo'yicha amal tanlash; miqdorlar munosabati tahlil qilinmagan.",
    next: "Kesmalar chizmasi: Alida kesmasi Validanikidan 4 ga uzun; kim ko'p, kim kam degan savol.",
  },
  {
    id: "X-15",
    grade: 4,
    topic: "Amallar tartibi",
    task: "3 + 4 × 2",
    pupil: "14",
    correct: "11",
    diagnosis: "Chapdan o'ngga bajargan.",
    cause: "Ko'paytirish qo'shishdan oldin bajarilishi qoidasi va uning ma'nosi tushunilmagan.",
    next: 'Masala orqali: "3 ta qalam va har birida 2 tadan 4 ta quti"; qavslar bilan va qavssiz ifodani solishtirish.',
  },
  {
    id: "X-16",
    grade: 4,
    topic: "Ustunli diagramma",
    task: "Shkalaning har bir bo'linmasi 2 ta o'quvchi. \"Olma\" ustuni 5 bo'linmaga teng. Nechta o'quvchi olmani tanlagan?",
    pupil: "5",
    correct: "10",
    diagnosis: "Bo'linmalar sonini javob deb olgan.",
    cause: "Shkala qadami e'tiborga olinmagan; diagramma o'qish ko'nikmasi.",
    next: "Avval shkalani o'qish odati: \"bitta bo'linma nechaga teng?\"; shkalasi har xil ikki diagrammani solishtirish.",
  },
  {
    id: "X-17",
    grade: 2,
    topic: "Noma'lum qo'shiluvchi",
    task: "6 + □ = 13",
    pupil: "19",
    correct: "7",
    diagnosis: "Ko'rinib turgan sonlarni qo'shgan.",
    cause: 'Tenglik belgisi "javobni yoz" deb tushunilgan, ikki tomon tengligi anglanmagan.',
    next: "Tarozi modeli; \"6 ga nechani qo'shsak 13 bo'ladi?\"; tekshirish: 6 + 19 = 25 ≠ 13.",
  },
  {
    id: "X-18",
    grade: 4,
    topic: "Massa birliklari",
    task: "1 kg 50 g ni kilogrammda ifodalang",
    pupil: "1,5 kg",
    correct: "1,05 kg",
    diagnosis: "50 g ni 0,5 kg deb yozgan.",
    cause: "1 kg = 1000 g va o'nli kasr xonalari bog'lanmagan.",
    next: "Jadval: 1000 g = 1 kg, 100 g = 0,1 kg, 10 g = 0,01 kg; 50 g = 0,05 kg.",
  },
];

/** Moslashtirish uchun 8-sinf TIMSS va PISA topshiriqlari (rasmiy namunaviy to'plamdan). */
type Released = {
  id: string;
  q: string;
  grade: number;
  source?: string;
  topic?: string;
  title?: string;
};
const R = released as unknown as Record<string, Released[]>;
export const ADAPT_ITEMS: Released[] = Object.values(R)
  .flat()
  .filter((q) => q.grade === 8 || q.grade === 15)
  .filter((q, i, arr) => arr.findIndex((x) => x.id === q.id) === i)
  .slice(0, 12);

export const ADAPT_FIELDS: Field[] = [
  { id: "sinf", label: "Qaysi sinf uchun moslashtirdingiz", rows: 1 },
  { id: "matn", label: "Moslashtirilgan topshiriq matni", rows: 5 },
  {
    id: "ozgarish",
    label: "Nima o'zgartirildi: sonlar, kontekst, qadamlar soni, ko'rgazmali tayanch, savol tili",
    rows: 3,
  },
  {
    id: "soha",
    label:
      "Qaysi kognitiv soha (Knowing / Applying / Reasoning yoki Formulate / Employ / Interpret) saqlandi va nega",
    rows: 3,
  },
  { id: "javob", label: "Kutilgan javob va o'quvchilar qayerda qiynalishi mumkin", rows: 3 },
];

export const ERROR_FIELDS: Field[] = [
  { id: "diagnoz", label: "Diagnoz: o'quvchi aniq nima qildi?", rows: 3 },
  { id: "sabab", label: "Sabab: qaysi tushuncha shakllanmagan?", rows: 3 },
  {
    id: "qadam",
    label: "Keyingi qadam: qanday topshiriq, vosita yoki savol bilan tuzatasiz?",
    rows: 3,
  },
];

export const LESSON_FIELDS: Field[] = [
  { id: "mavzu", label: "Mavzu va sinf", rows: 1 },
  { id: "maqsad", label: "Dars maqsadi (o'lchanadigan shaklda)", rows: 2 },
  {
    id: "topshiriq",
    label: "TIMSS/PISA tipidagi asosiy topshiriq va uning kognitiv sohasi",
    rows: 4,
  },
  { id: "qiyinchilik", label: "O'quvchilar qayerda qiynalishi mumkin (KCS)", rows: 3 },
  {
    id: "bosqichlar",
    label: "Dars bosqichlari: kirish, asosiy qism, mustahkamlash (vaqti bilan)",
    rows: 5,
  },
  { id: "vosita", label: "Ko'rgazmali vositalar va ularning vazifasi", rows: 2 },
  {
    id: "differensiatsiya",
    label: "Kuchli va qiynalayotgan o'quvchilar uchun moslashtirish",
    rows: 2,
  },
  { id: "baholash", label: "Maqsadga erishilganini qanday tekshirasiz", rows: 2 },
];

export const MICRO_CRITERIA = [
  {
    id: "maqsad",
    label: "Maqsad aniqligi",
    d: ["Maqsad aytilmagan", "Maqsad umumiy", "Aniq va o'quvchiga tushunarli maqsad"],
  },
  {
    id: "togrilik",
    label: "Matematik to'g'rilik",
    d: ["Xato bor", "Kichik noaniqlik", "To'liq to'g'ri, aniq atamalar"],
  },
  {
    id: "fikrlash",
    label: "O'quvchi fikrlashini ochish",
    d: ["Faqat o'qituvchi gapiradi", "Yopiq savollar", "Ochiq savollar, o'quvchi tushuntiradi"],
  },
  {
    id: "vosita",
    label: "Vosita va vaqtdan foydalanish",
    d: [
      "Vosita yo'q yoki vaqt buzilgan",
      "Vosita bor, samarasi kam",
      "Vosita maqsadga xizmat qiladi, vaqt rejadagidek",
    ],
  },
] as const;

export const MICRO_FIELDS: Field[] = [
  { id: "mavzu", label: "Mavzu, sinf va fragment maqsadi", rows: 2 },
  { id: "video", label: "Video havolasi (YouTube, Google Drive va h.k.)", rows: 1, url: true },
  { id: "yaxshi", label: "Nima yaxshi chiqdi?", rows: 2 },
  { id: "ozgartirish", label: "Qayta o'tkazishda nimani o'zgartirasiz?", rows: 2 },
];

export const LESSON_STUDY_FIELDS: Field[] = [
  { id: "guruh", label: "Guruh a'zolari (ishtirokchi kodlari)", rows: 1 },
  { id: "topshiriq", label: "Dars mavzusi va asosiy TIMSS/PISA topshirig'i", rows: 2 },
  {
    id: "taxmin",
    label: "Rejalashtirish: o'quvchilar qanday yechishini va qayerda qiynalishini taxmin qiling",
    rows: 4,
  },
  { id: "kuzatuv", label: "Kuzatuv: o'quvchilar aslida nima qildi (aniq misollar)", rows: 4 },
  {
    id: "tahlil",
    label: "Tahlil: taxmin va kuzatuv qayerda farq qildi, asosiy qiyinchilik nima",
    rows: 3,
  },
  { id: "takomil", label: "Takomillashtirish: rejada nima o'zgardi", rows: 3 },
  { id: "natija", label: "Qayta o'tkazilgan dars natijasi", rows: 3 },
];

export const KIND_LABEL: Record<SubmissionKind, string> = {
  "modul-metodik": "Modul: metodik topshiriq",
  "modul-bajarildi": "Modul yakunlandi (refleksiya)",
  maqsad: "Shaxsiy maqsadlar",
  "xato-tahlil": "O'quvchi xatosi tahlili",
  moslashtirish: "Topshiriqni moslashtirish",
  "dars-ishlanmasi": "Dars ishlanmasi",
  microteaching: "Microteaching",
  "lesson-study": "Lesson Study",
  "self-score": "O'z-o'zini baholash",
};

/** Barcha maydon nomlari — ish matnini ko'rsatishda kalit o'rniga ishlatiladi. */
export const FIELD_LABEL: Record<string, string> = Object.fromEntries(
  [...ADAPT_FIELDS, ...ERROR_FIELDS, ...LESSON_FIELDS, ...MICRO_FIELDS, ...LESSON_STUDY_FIELDS].map(
    (f) => [f.id, f.label],
  ),
);

export const errorById = (id: string) => PUPIL_ERRORS.find((e) => e.id === id);

export type ToolSlug =
  | "xatolar"
  | "moslashtirish"
  | "dars-ishlanmasi"
  | "microteaching"
  | "lesson-study";

export const TOOLS: {
  slug: ToolSlug;
  title: string;
  tech: string;
  mkt: string;
  desc: string;
  how: string[];
}[] = [
  {
    slug: "xatolar",
    title: "O'quvchi ishlari banki",
    tech: "Case-study",
    mkt: "KCS, SCK",
    desc: "18 ta tipik o'quvchi xatosi: diagnoz qo'ying, sababini aniqlang va keyingi qadamni rejalang.",
    how: [
      "Ro'yxatdan xatoni tanlang.",
      "Uch savolga javob yozing: o'quvchi nima qildi, qaysi tushuncha shakllanmagan, qanday tuzatasiz.",
      "Yuborgandan keyin namunaviy diagnoz ochiladi: o'z javobingiz bilan solishtiring.",
    ],
  },
  {
    slug: "moslashtirish",
    title: "Topshiriqni moslashtirish",
    tech: "Loyiha metodi",
    mkt: "KCT, KCC",
    desc: "TIMSS 8-sinf yoki PISA topshirig'ini boshlang'ich sinf darajasiga moslang, kognitiv sohani saqlagan holda.",
    how: [
      "Rasmiy topshiriqni tanlang va yeching.",
      "Uni 3- yoki 4-sinf uchun qayta yozing: sonlar, kontekst, qadamlar soni, ko'rgazmali tayanch.",
      "Qaysi kognitiv soha saqlanganini asoslang.",
    ],
  },
  {
    slug: "dars-ishlanmasi",
    title: "Dars ishlanmasi",
    tech: "Loyiha metodi",
    mkt: "KCT, KCS",
    desc: "TIMSS/PISA tipidagi topshiriq asosida dars rejasi: maqsad, bosqichlar, qiyinchiliklar, baholash.",
    how: [
      "Shablonni to'ldiring.",
      "O'quvchilar qayerda qiynalishini oldindan yozing (KCS).",
      "Maqsadga erishilganini tekshirish usulini ko'rsating.",
    ],
  },
  {
    slug: "microteaching",
    title: "Microteaching",
    tech: "Microteaching",
    mkt: "KCT, refleksiya",
    desc: "5–7 daqiqalik dars fragmenti: video havolasi, 4 mezon bo'yicha o'z-o'zini baholash, qayta o'tkazish.",
    how: [
      "Fragmentni o'tib, videoga yozing va havolasini qo'ying (YouTube \"havola orqali\", Google Drive).",
      "4 mezon bo'yicha o'zingizni 0–2 ball bilan baholang.",
      "O'qituvchi feedbackidan keyin fragmentni qayta o'tib, 2-urinishni yuboring.",
    ],
  },
  {
    slug: "lesson-study",
    title: "Lesson Study",
    tech: "Lesson Study",
    mkt: "KCS, KCT",
    desc: "Guruh bilan darsni rejalashtirish, kuzatish, tahlil qilish va qayta o'tkazish protokoli.",
    how: [
      "Guruhda bitta TIMSS/PISA topshirig'i asosida dars rejalang va o'quvchilar javobini taxmin qiling.",
      "Bir talaba darsni o'tadi, qolganlar kuzatadi.",
      "Taxmin va kuzatuvni solishtiring, rejani o'zgartirib qayta o'ting. Protokolni bitta a'zo yuboradi.",
    ],
  },
];
