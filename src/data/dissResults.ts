// Dissertatsiyaning tajriba-sinov natijalari (3-bob, 3.5–3.7-jadvallar; avtoreferatda 4- va 5-jadvallar).
// Raqamlar dissertatsiyadan o'zgarishsiz olingan; ular platformada yig'ilgan natijalar emas.

import type { ComponentKey } from "@/lib/components";

export const DISS_SAMPLE = {
  total: 360,
  tg: 180,
  ng: 180,
  universities: [
    "Qo'qon davlat universiteti",
    "Chirchiq davlat pedagogika universiteti",
    "Ajiniyoz nomidagi Nukus davlat pedagogika instituti",
  ],
  course: "boshlang'ich ta'lim yo'nalishi, 3–4-kurs talabalari",
};

/** 3.5-jadval. Aniqlovchi va yakuniy bosqichlarda darajalar dinamikasi (%). */
export const TABLE_3_5: {
  group: "TG" | "NG";
  stage: "Aniqlovchi" | "Yakuniy";
  past: number;
  orta: number;
  yuqori: number;
}[] = [
  { group: "TG", stage: "Aniqlovchi", past: 40.0, orta: 45.0, yuqori: 15.0 },
  { group: "TG", stage: "Yakuniy", past: 15.0, orta: 40.0, yuqori: 45.0 },
  { group: "NG", stage: "Aniqlovchi", past: 38.9, orta: 46.1, yuqori: 15.0 },
  { group: "NG", stage: "Yakuniy", past: 35.0, orta: 45.0, yuqori: 20.0 },
];

/** 3.6-jadval. Komponentlar bo'yicha yakuniy natijalar (M ± SD) va Cohen d (3.3-bo'lim). */
export const TABLE_3_6: {
  key: ComponentKey;
  label: string;
  tgM: number;
  tgSD: number;
  ngM: number;
  ngSD: number;
  t: number;
  d: number;
}[] = [
  {
    key: "bilim",
    label: "Matematik bilim",
    tgM: 28.45,
    tgSD: 4.17,
    ngM: 24.92,
    ngSD: 4.65,
    t: 7.6,
    d: 0.799,
  },
  {
    key: "tafakkur",
    label: "Matematik tafakkur",
    tgM: 27.06,
    tgSD: 4.07,
    ngM: 22.4,
    ngSD: 4.13,
    t: 10.78,
    d: 1.137,
  },
  {
    key: "savodxonlik",
    label: "Matematik savodxonlik",
    tgM: 27.35,
    tgSD: 3.82,
    ngM: 21.51,
    ngSD: 4.55,
    t: 13.2,
    d: 1.39,
  },
  {
    key: "metodik",
    label: "Matematik-metodik kompetentlik",
    tgM: 26.12,
    tgSD: 3.92,
    ngM: 22.25,
    ngSD: 4.3,
    t: 8.93,
    d: 0.941,
  },
  {
    key: "refleksiya",
    label: "Refleksiv faoliyat",
    tgM: 26.63,
    tgSD: 4.16,
    ngM: 20.38,
    ngSD: 4.82,
    t: 13.17,
    d: 1.388,
  },
];

/** 3.7-jadval. Yakuniy diagnostika: darajalar bo'yicha talabalar soni. */
export const TABLE_3_7 = [
  { group: "Tajriba guruhi (TG)", n: 180, past: 27, orta: 72, yuqori: 81 },
  { group: "Nazorat guruhi (NG)", n: 180, past: 63, orta: 81, yuqori: 36 },
  { group: "Jami", n: 360, past: 90, orta: 153, yuqori: 117 },
];

/** Pearson χ² (yakuniy bosqich, 2×3 jadval). */
export const CHI2_FINAL = { chi2: 32.237, df: 2, p: "< 0,001" };

export const fmt = (x: number, d = 1) => x.toFixed(d).replace(".", ",");

/**
 * Avtoreferat, 4-jadval: darajalar baholarga o'tkazilgan (past — "3", o'rta — "4", yuqori — "5").
 * Talabalar soni; o'rtacha baho, S, V va η shu taqsimotdan hisoblanadi.
 */
export const TABLE_4 = [
  { stage: "Aniqlovchi", group: "TG", n: 180, g3: 72, g4: 81, g5: 27 },
  { stage: "Aniqlovchi", group: "NG", n: 180, g3: 70, g4: 83, g5: 27 },
  { stage: "Yakuniy", group: "TG", n: 180, g3: 27, g4: 72, g5: 81 },
  { stage: "Yakuniy", group: "NG", n: 180, g3: 63, g4: 81, g5: 36 },
] as const;

export type GradeRow = (typeof TABLE_4)[number];

/** O'rtacha baho: X̄ = (1/n)·Σ nᵢxᵢ. */
export const gradeMean = (r: GradeRow) => (3 * r.g3 + 4 * r.g4 + 5 * r.g5) / r.n;

/** O'rtacha kvadratik chetlanish (avtoreferatdagidek, n ga bo'lingan). */
export const gradeSD = (r: GradeRow) => {
  const m = gradeMean(r);
  return Math.sqrt((r.g3 * (3 - m) ** 2 + r.g4 * (4 - m) ** 2 + r.g5 * (5 - m) ** 2) / r.n);
};

/** Avtoreferatda e'lon qilingan statistik ko'rsatkichlar (3.2–3.3-bandlar). */
export const EFFICIENCY = {
  baselineChi2: { chi2: 0.05, df: 2, p: "0,97" },
  t: 5.93,
  tCrit: 1.97,
  eta: { aniqlovchi: 1.0, yakuniy: 1.12 },
  gainPct: 11.7,
  ci: { tg: 0.1, ng: 0.11 },
  v: { tg: 16.6, ng: 18.9 },
};
