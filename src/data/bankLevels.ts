// Kompetensiyaviy topshiriqlar bankining murakkablik darajalari (avtoreferat, 2.2-band:
// "topshiriqlar past, o'rta va yuqori murakkablik darajalari bo'yicha tabaqalashtirilgan").
// Daraja mavzu bo'yicha belgilanadi: mavzudagi amallar soni va fikrlash talabiga qarab.
// Jadvalni muallif tahrirlashi mumkin: mavzu nomini boshqa darajaga ko'chirish kifoya.

export type BankLevel = "past" | "orta" | "yuqori";

export const BANK_LEVEL_LABEL: Record<BankLevel, string> = {
  past: "Past",
  orta: "O'rta",
  yuqori: "Yuqori",
};

/** Daraja → diagnostika natijasiga ko'ra topshiriq turi (avtoreferat, 2.1-band). */
export const BANK_LEVEL_TASKS: Record<BankLevel, string> = {
  past: "qo'llab-quvvatlovchi",
  orta: "rivojlantiruvchi",
  yuqori: "ijodiy-tadqiqotchilik",
};

const TOPIC_LEVEL: Record<string, BankLevel> = {
  // TIMSS — Bilish (Knowing): bir amalli, eslash va tanish
  "place-value": "past",
  compare: "past",
  multiply: "past",
  divide: "past",
  units: "past",
  rounding: "past",
  time: "past",
  fraction: "orta",
  "number-type": "orta",
  shapes: "orta",
  // TIMSS — Qo'llash (Applying): tanish vaziyatda bir-ikki amal
  "word-multiply": "past",
  "word-divide": "past",
  money: "past",
  change: "past",
  perimeter: "orta",
  area: "orta",
  distance: "orta",
  "fraction-of": "orta",
  average: "orta",
  percent: "yuqori",
  // TIMSS — Mulohaza yuritish (Reasoning): ko'p bosqichli, asoslash talab qiladi
  pattern: "orta",
  chart: "orta",
  divisibility: "orta",
  equation: "orta",
  "age-logic": "yuqori",
  square: "yuqori",
  "multi-step": "yuqori",
  "sum-diff": "yuqori",
  proportion: "yuqori",
  probability: "yuqori",
  // PISA: real vaziyat, modellashtirish
  savings: "past",
  recipe: "past",
  travel: "past",
  discount: "orta",
  fuel: "orta",
  garden: "orta",
  population: "orta",
  water: "yuqori",
  salary: "yuqori",
  schedule: "yuqori",
};

/**
 * Topshiriq darajasi. Rasmiy TIMSS topshiriqlarida xalqaro to'g'ri javoblar ulushi (intlPct)
 * bo'yicha: 60% va undan ko'p — past, 35–59% — o'rta, 35% dan kam — yuqori murakkablik.
 * Qolgan topshiriqlarda mavzu bo'yicha.
 */
export const levelOf = (q: { topic?: string; intlPct?: number }): BankLevel | undefined => {
  if (typeof q.intlPct === "number")
    return q.intlPct >= 60 ? "past" : q.intlPct >= 35 ? "orta" : "yuqori";
  return q.topic ? TOPIC_LEVEL[q.topic] : undefined;
};

const ORDER: Record<BankLevel, number> = { past: 0, orta: 1, yuqori: 2 };

/** Topshiriqlarni darajasi bo'yicha (past → o'rta → yuqori) tartiblaydi, ichki tartib saqlanadi. */
export const sortByLevel = <T extends { topic?: string; intlPct?: number }>(items: T[]): T[] =>
  items
    .map((q, i) => ({ q, i, l: ORDER[levelOf(q) ?? "orta"] }))
    .sort((a, b) => a.l - b.l || a.i - b.i)
    .map((x) => x.q);
