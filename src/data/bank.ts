// Savollar banki metamaʼlumotlari: versiya, mavzular, diagnostika va tavsiyalar.
// Savollarning o'zi scripts/genQuestions.mjs orqali src/data/*.json fayllariga yoziladi.
// v1 banki (2026-10-11 gacha ishlatilgan) src/data/v1/ papkasida o'zgarishsiz saqlanadi —
// eski natijalarni qayta hisoblash uchun kerak.

import { COMPONENTS } from "@/lib/components";

export const BANK_VERSION = "v2";
/** Rasmiy namunaviy (released) topshiriqlar to'plami versiyasi. */
export const RELEASED_VERSION = "r1";

export type TestKey =
  | "knowing"
  | "applying"
  | "reasoning"
  | "pisa"
  | "r-knowing"
  | "r-applying"
  | "r-reasoning"
  | "r-pisa"
  | "sinov-a"
  | "sinov-b"
  | "diag-a"
  | "diag-b";

/** Dissertatsiyaning diagnostik testi (Ilova 1) versiyasi. */
export const DIAG_TEST_VERSION = "d1";
export const isDiag = (k: TestKey) => k.startsWith("diag-");

export const isReleased = (k: TestKey) => k.startsWith("r-") || k.startsWith("sinov-");
/** Kirish/yakuniy taqqoslash uchun "oila": A va B parallel shakllari bitta oila. */
export const familyOf = (k: TestKey) =>
  k.startsWith("sinov-") ? "sinov" : k.startsWith("diag-") ? "diag" : k;
export const isPisa = (k: TestKey) => k === "pisa" || k === "r-pisa";

/** test_type qiymatiga versiya qo'shiladi: "TIMSS - Bilish · v2". Versiyasiz yozuvlar — v1. */
export const withVersion = (testType: string, version = BANK_VERSION) => `${testType} · ${version}`;
export const versionOf = (k: TestKey) =>
  isDiag(k) ? DIAG_TEST_VERSION : isReleased(k) ? RELEASED_VERSION : BANK_VERSION;

export const parseTestType = (raw: string): { base: string; version: string } => {
  const m = /^(.*?)\s*·\s*([vrd]\d+)$/.exec(raw.trim());
  return m ? { base: m[1], version: m[2] } : { base: raw.trim(), version: "v1" };
};

export const TEST_TYPES: Record<TestKey, string> = {
  knowing: "TIMSS - Bilish",
  applying: "TIMSS - Qo'llash",
  reasoning: "TIMSS - Mulohaza yuritish",
  pisa: "PISA",
  "r-knowing": "Rasmiy TIMSS - Bilish",
  "r-applying": "Rasmiy TIMSS - Qo'llash",
  "r-reasoning": "Rasmiy TIMSS - Mulohaza yuritish",
  "r-pisa": "Rasmiy PISA",
  "sinov-a": "Sinov testi A",
  "sinov-b": "Sinov testi B",
  "diag-a": "Diagnostik test A",
  "diag-b": "Diagnostik test B",
};

export const testKeyOf = (base: string): TestKey | undefined =>
  (Object.keys(TEST_TYPES) as TestKey[]).find((k) => TEST_TYPES[k] === base);

/** Har bir test uchun tegishli metodik tavsiya sahifasi (/tavsiyalar/$slug). */
export const TEST_TAVSIYA: Record<TestKey, { slug: string; title: string }> = {
  knowing: { slug: "knowing", title: "Knowing kompetensiyasi" },
  applying: { slug: "applying", title: "Applying kompetensiyasi" },
  reasoning: { slug: "reasoning", title: "Reasoning kompetensiyasi" },
  pisa: { slug: "employ", title: "Employ kompetensiyasi" },
  "r-knowing": { slug: "knowing", title: "Knowing kompetensiyasi" },
  "r-applying": { slug: "applying", title: "Applying kompetensiyasi" },
  "r-reasoning": { slug: "reasoning", title: "Reasoning kompetensiyasi" },
  "r-pisa": { slug: "employ", title: "Employ kompetensiyasi" },
  "sinov-a": { slug: "mkt", title: "Mathematical Knowledge for Teaching (MKT)" },
  "sinov-b": { slug: "mkt", title: "Mathematical Knowledge for Teaching (MKT)" },
  "diag-a": { slug: "mkt", title: "Mathematical Knowledge for Teaching (MKT)" },
  "diag-b": { slug: "mkt", title: "Mathematical Knowledge for Teaching (MKT)" },
};

export type TopicInfo = { label: string; tip: string };

export const TOPICS: Record<string, TopicInfo> = {
  // TIMSS — Bilish
  "place-value": {
    label: "Xona birliklari",
    tip: "Sonni xona birliklari jadvaliga yozib, har bir raqamning qiymatini (raqam × xona birligi) alohida aytib chiqing.",
  },
  compare: {
    label: "Sonlarni taqqoslash",
    tip: "Avval xonalar sonini, keyin yuqori xonadan boshlab raqamlarni taqqoslash algoritmini mashq qiling.",
  },
  multiply: {
    label: "Ko'paytirish jadvali",
    tip: "Ko'paytirish jadvalini qismlarga bo'lib takrorlang va ko'paytirishni teng qo'shiluvchilar yig'indisi orqali tushuntirishni o'rganing.",
  },
  divide: {
    label: "Bo'lish",
    tip: "Bo'lishni ko'paytirishga teskari amal sifatida tekshiring: bo'linma × bo'luvchi = bo'linuvchi.",
  },
  fraction: {
    label: "O'nli va oddiy kasrlar",
    tip: "Oddiy kasrni o'nli kasrga aylantirib (surat : maxraj) natijani taqqoslang; son o'qida tasvirlab mashq qiling.",
  },
  shapes: {
    label: "Geometrik shakllar",
    tip: "Shakllarni tomonlar soni, parallellik va burchaklar bo'yicha jadvalga solib, farqlovchi belgilarni yodda tuting.",
  },
  units: {
    label: "O'lchov birliklari",
    tip: "Uzunlik, massa, hajm va vaqt birliklari jadvalini tuzib, har bir o'tish koeffitsiyentini misol bilan mustahkamlang.",
  },
  "number-type": {
    label: "Juft/toq, tub/murakkab sonlar",
    tip: "Juft-toqlikni oxirgi raqam, tub-murakkablikni 2, 3, 5, 7 ... ga bo'linish orqali tekshirish ketma-ketligini mashq qiling.",
  },
  rounding: {
    label: "Yaxlitlash",
    tip: "Yaxlitlanayotgan xonadan keyingi raqamga qarash qoidasini (≥ 5 bo'lsa yuqoriga) son o'qida ko'rsatib mashq qiling.",
  },
  time: {
    label: "Vaqt va soat",
    tip: "Soat siferblatida daqiqalarni 15 daqiqalik bo'laklarga bo'lib, soat almashinuvi (45 + 15 = keyingi soat) holatlarini mashq qiling.",
  },
  // TIMSS — Qo'llash
  perimeter: {
    label: "Perimetr",
    tip: "Perimetr — barcha tomonlar yig'indisi ekanini chizma bilan ko'rsating; P = 2·(a + b) ni yuz formulasi bilan aralashtirmang.",
  },
  area: {
    label: "Yuz",
    tip: "Yuzni birlik kvadratlar bilan qoplash orqali tushuntiring va o'lchov birligini (sm²) doim yozing.",
  },
  "word-multiply": {
    label: "Ko'paytirishga oid masalalar",
    tip: 'Masala shartidan "teng guruhlar soni" va "har bir guruhdagi miqdor"ni ajratib, sxema chizing.',
  },
  "word-divide": {
    label: "Bo'lishga oid masalalar",
    tip: "Teng taqsimlash masalalarida natijani ko'paytirish orqali tekshirishni odat qiling.",
  },
  percent: {
    label: "Foiz",
    tip: "Foizni 100 dan ulush sifatida tushuntiring: 25% = 25/100 = 1/4; avval 10% va 1% ni topish usulini mashq qiling.",
  },
  "fraction-of": {
    label: "Sonning qismini topish",
    tip: "Sonning n/d qismini ikki qadamda toping: avval d ga bo'ling, keyin n ga ko'paytiring; chizma bilan ko'rsating.",
  },
  money: {
    label: "Pul bilan hisob",
    tip: "Narx × miqdor = qiymat munosabatini real xarid vaziyatlarida jadval bilan mashq qiling.",
  },
  distance: {
    label: "Tezlik, vaqt, masofa",
    tip: "S = v · t formulasini uchburchak sxemada eslab qoling va birliklarni (km, soat) tekshiring.",
  },
  average: {
    label: "O'rta arifmetik",
    tip: "O'rtacha = yig'indi : sonlar soni; avval yig'indini, keyin bo'lishni alohida qadam qilib yozing.",
  },
  change: {
    label: "Qaytim hisoblash",
    tip: "Qaytim = berilgan pul − xarid narxi; natijani qo'shish orqali tekshiring.",
  },
  // TIMSS — Mulohaza yuritish
  pattern: {
    label: "Ketma-ketlik qonuniyati",
    tip: "Qo'shni hadlar ayirmasini yozib, qonuniyatni so'z bilan ifodalang, so'ng keyingi hadni toping.",
  },
  "age-logic": {
    label: "Yig'indi va farq bo'yicha masala",
    tip: "Kichik son = (yig'indi − farq) : 2 qoidasini kesmalar sxemasi bilan asoslang.",
  },
  square: {
    label: "Perimetrdan yuzga o'tish",
    tip: "Ko'p bosqichli geometrik masalada oraliq natijani (tomon uzunligi) alohida topib, keyin yuzni hisoblang.",
  },
  "multi-step": {
    label: "Ko'p bosqichli masala",
    tip: "Masalani bosqichlarga ajrating: nima ma'lum, nima topiladi, qaysi tartibda; har bir bosqich natijasini yozing.",
  },
  divisibility: {
    label: "Bo'linish belgilari",
    tip: "Har bir sonni berilgan songa bo'lib tekshiring va qoldiqni yozing; bo'linish belgilarini takrorlang.",
  },
  "sum-diff": {
    label: "Yig'indi va ayirma bo'yicha",
    tip: "Katta son = (yig'indi + ayirma) : 2 ni ikki kesma chizmasi orqali tushuntiring.",
  },
  proportion: {
    label: "Proporsiya",
    tip: "Avval birlik qiymatni (1 ta narsa narxi) toping, so'ng kerakli miqdorga ko'paytiring.",
  },
  chart: {
    label: "Ma'lumotlarni tahlil qilish",
    tip: "Jadval yoki diagrammadagi qiymatlarni tartiblab, eng katta/kichigini va farqlarni yozib chiqing.",
  },
  probability: {
    label: "Ehtimollik",
    tip: "Ehtimollik = qulay hollar : barcha hollar; barcha hollarni sanab, kasr shaklida yozing.",
  },
  equation: {
    label: "Tenglama",
    tip: "Noma'lum qo'shiluvchini topish qoidasini qo'llang va topilgan qiymatni tenglamaga qo'yib tekshiring.",
  },
  // PISA
  discount: {
    label: "Chegirma (foiz)",
    tip: "Chegirma summasini va yangi narxni alohida hisoblang; natija asl narxdan kichik ekanini mantiqan tekshiring.",
  },
  fuel: {
    label: "Yo'l xarajati",
    tip: "Vaziyatni bosqichlarga bo'ling: masofa → litr → so'm; har bir bosqichda birliklarni yozing.",
  },
  schedule: {
    label: "Jadvalni modellashtirish",
    tip: "Vaziyatni matematik modelga o'tkazing: oraliqlar soni + boshlang'ich reys; chegaraviy holatni alohida tekshiring.",
  },
  water: {
    label: "Tejash (foiz)",
    tip: "Kunlik tejamni topib, keyin davrga ko'paytiring; har bir oraliq natijani real hayot bilan solishtiring.",
  },
  recipe: {
    label: "Retsept (proporsiya)",
    tip: "Kishilar soni necha marta oshganini toping va masalliqni shuncha marta oshiring.",
  },
  salary: {
    label: "Sof maosh (foiz)",
    tip: "Ushlab qolinadigan summani va qo'lga tegadigan summani farqlang; natijani yig'ish orqali tekshiring.",
  },
  travel: {
    label: "Sayohat vaqti",
    tip: "t = S : v; javobning real ekanini (soat, tezlik birligi) tekshiring.",
  },
  population: {
    label: "Aholi o'sishi (foiz)",
    tip: "O'sish miqdorini va yangi umumiy sonni farqlang; foiz qaysi songa nisbatan olinayotganini aniqlang.",
  },
  savings: {
    label: "Jamg'arma",
    tip: "Har oylik miqdor × oylar soni; javobni taxminiy hisob bilan tekshiring.",
  },
  garden: {
    label: "Bog' maydoni",
    tip: "Avval yuzni (m²), keyin 1 m² dagi miqdorga ko'paytirib umumiy sonni toping.",
  },
  // Rasmiy namunaviy topshiriqlar — TIMSS mazmun sohalari
  "r-num4": {
    label: "Sonlar (4-sinf)",
    tip: "Xona qiymati, to'rt amal va kasrlarni son o'qi, xona jadvali va kesma modeli kabi ko'rgazmali vositalar bilan mustahkamlang.",
  },
  "r-num8": {
    label: "Sonlar (8-sinf)",
    tip: "Oddiy va o'nli kasr, foiz va daraja o'rtasidagi bog'lanishlarni bir masalani turli ko'rinishda yozish orqali mashq qiling.",
  },
  "r-alg8": {
    label: "Algebra (8-sinf)",
    tip: "Ifoda, tenglama va qonuniyatni avval sonli misollarda kuzating, so'ng umumiy formulaga o'ting; javobni qiymat qo'yib tekshiring.",
  },
  "r-geo4": {
    label: "Geometriya va o'lchov (4-sinf)",
    tip: "Shakllarni qirqish, buklash va katakli qog'ozda chizish kabi amaliy faoliyat orqali simmetriya va yuz tushunchalarini shakllantiring.",
  },
  "r-data4": {
    label: "Ma'lumotlar (4-sinf)",
    tip: "Sinfda kichik so'rov o'tkazib, natijani jadval va diagrammada tasvirlang; diagrammadan savollar tuzishni mashq qiling.",
  },
  // Rasmiy namunaviy topshiriqlar — PISA mazmun toifalari
  "r-quantity": {
    label: "Miqdor (Quantity)",
    tip: "Hisobni real kontekstda (pul, vaqt, materiallar) bajaring va javobning mantiqiyligini taxminiy hisob bilan tekshiring.",
  },
  "r-change": {
    label: "O'zgarish va bog'liqlik (Change)",
    tip: "Formula, jadval va grafik o'rtasida o'tishni mashq qiling; o'sish turini (chiziqli, kvadratik, foizli) aniqlang.",
  },
  "r-space": {
    label: "Fazo va shakl (Space)",
    tip: "Yuz, hajm va fazoviy tasavvurni kubiklar va chizmalar bilan modellashtiring.",
  },
  "r-uncertainty": {
    label: "Noaniqlik va ma'lumotlar (Uncertainty)",
    tip: "Diagramma va statistik xulosalarni tanqidiy o'qing: o'q boshlanishi, tanlanma va ehtimollik talqiniga e'tibor bering.",
  },
};

// Diagnostik testda "mavzu" o'rnida matematik tayyorgarlik komponenti ishlatiladi.
for (const c of COMPONENTS) TOPICS[c.key] ??= { label: c.label, tip: c.tip };

export const topicLabel = (t: string) => TOPICS[t]?.label ?? t;

export const PROCESS_LABEL: Record<string, string> = {
  // Tasnif rasmiy topshiriqlar uchun taxminiy (2026-10 tasdiqlangan ro'yxat).
  formulate: "Formulate (vaziyatni modelga o'tkazish)",
  employ: "Employ (tushuncha va amallarni qo'llash)",
  interpret: "Interpret (natijani talqin qilish)",
};

/** ID raqamidan mavzuni aniqlash (v1 savollarida `topic` maydoni yo'q). */
const TOPIC_ORDER: Record<string, string[]> = {
  K: [
    "place-value",
    "compare",
    "multiply",
    "divide",
    "fraction",
    "shapes",
    "units",
    "number-type",
    "rounding",
    "time",
  ],
  A: [
    "perimeter",
    "area",
    "word-multiply",
    "word-divide",
    "percent",
    "fraction-of",
    "money",
    "distance",
    "average",
    "change",
  ],
  R: [
    "pattern",
    "age-logic",
    "square",
    "multi-step",
    "divisibility",
    "sum-diff",
    "proportion",
    "chart",
    "probability",
    "equation",
  ],
  P: [
    "discount",
    "fuel",
    "schedule",
    "water",
    "recipe",
    "salary",
    "travel",
    "population",
    "savings",
    "garden",
  ],
};

export const topicOfId = (id: string): string | undefined => {
  const m = /^([KARP])-(\d+)$/.exec(id);
  if (!m) return undefined;
  return TOPIC_ORDER[m[1]][(Number(m[2]) - 1) % 10];
};

export const processOfId = (id: string): string | undefined => {
  if (!id.startsWith("P-")) return undefined;
  return topicOfId(id) === "schedule" ? "formulate" : "employ";
};
