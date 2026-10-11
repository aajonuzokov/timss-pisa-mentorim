// Yagona daraja shkalasi (dissertatsiya, Ilova 1 va Ilova 5): past, o'rta, yuqori.
// 40 ballik diagnostik testda: 0–20 — past, 21–30 — o'rta, 31–40 — yuqori.
// Foizda: ≤ 50% — past, 51–75% — o'rta, > 75% — yuqori (barcha testlar uchun bir xil).

export type LevelKey = "yuqori" | "orta" | "past";

export const LEVELS: {
  key: LevelKey;
  /** Shu darajaga kirish uchun foiz (qat'iy katta): pct > above. */
  above: number;
  label: string;
  short: string;
  range: string;
  points: string;
  desc: string;
}[] = [
  {
    key: "yuqori",
    above: 75,
    label: "Yuqori daraja",
    short: "Yuqori",
    range: "> 75%",
    points: "31–40 ball",
    desc: "Matematik bilimlarni qo'llash, mulohaza yuritish, real vaziyatlarni matematiklashtirish, metodik tahlil va refleksiv faoliyat yetarli darajada shakllangan.",
  },
  {
    key: "orta",
    above: 50,
    label: "O'rta daraja",
    short: "O'rta",
    range: "51–75%",
    points: "21–30 ball",
    desc: "Asosiy matematik bilim va ko'nikmalar shakllangan, biroq ularni murakkab, real va metodik vaziyatlarda qo'llashda ayrim qiyinchiliklar mavjud.",
  },
  {
    key: "past",
    above: -1,
    label: "Past daraja",
    short: "Past",
    range: "≤ 50%",
    points: "0–20 ball",
    desc: "Matematik bilim va kompetensiyalar yetarli darajada shakllanmagan; qo'llash, mulohaza, metodik tahlil va refleksiya jarayonlarida sezilarli qiyinchiliklar mavjud.",
  },
];

export const levelInfo = (pct: number) =>
  LEVELS.find((l) => pct > l.above) ?? LEVELS[LEVELS.length - 1];

export const levelOf = (pct: number) => levelInfo(pct).label;

export const levelClass: Record<LevelKey, string> = {
  yuqori: "bg-emerald-500",
  orta: "bg-amber-500",
  past: "bg-red-500",
};

export const levelText: Record<LevelKey, string> = {
  yuqori: "text-emerald-700 dark:text-emerald-400",
  orta: "text-amber-700 dark:text-amber-400",
  past: "text-red-600 dark:text-red-400",
};

export const pctOf = (correct: number, total: number) =>
  total ? Math.round((correct / total) * 100) : 0;

/** Kuchli tomon (yuqori daraja) va rivojlantirish kerak (past daraja) chegaralari. */
export const STRONG_ABOVE = 75;
export const WEAK_MAX = 50;
