// Diagnostik test (Ilova 1) ballari: avtomatik dastlabki baho va o'qituvchi rubrikasi.
// Yakuniy ball: o'qituvchi rubrika bo'yicha qo'ygan ball, u bo'lmasa — avtomatik dastlabki ball.

import { checkOpen } from "@/lib/answers";
import type { ComponentScores } from "@/lib/components";
import { type DiagAnswer, type DiagAuto, type DiagItem } from "@/data/diag";

const SUP: Record<string, string> = {
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9",
};

const isPrime = (p: number) => {
  if (!Number.isInteger(p) || p < 2) return false;
  for (let d = 2; d * d <= p; d++) if (p % d === 0) return false;
  return true;
};

/** "2^4 · 3", "2⁴×3", "2*2*2*2*3", "48 = 2·2·2·2·3" — tub ko'paytuvchilar yoyilmasi to'g'rimi. */
export const checkFactorization = (raw: string, n: number): boolean => {
  let s = (raw ?? "").replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) => "^" + [...m].map((c) => SUP[c]).join(""));
  // "48 = ..." bo'lsa, oxirgi tenglikdan keyingi qism olinadi.
  if (s.includes("=")) s = s.slice(s.lastIndexOf("=") + 1);
  s = s.replace(/\s*\^\s*/g, "^").trim();
  if (!s) return false;
  const tokens = s.split(/\s*(?:[×x*·•∙]|\s|\.)\s*/i).filter(Boolean);
  if (!tokens.length) return false;
  let product = 1;
  for (const t of tokens) {
    const m = /^(\d+)(?:\^(\d+))?$/.exec(t);
    if (!m) return false;
    const base = Number(m[1]);
    const exp = m[2] ? Number(m[2]) : 1;
    if (!isPrime(base) || exp < 1 || exp > 20) return false;
    product *= base ** exp;
  }
  return product === n;
};

/** "1 1/4" kabi aralash sonni oddiy kasrga aylantiradi ("5/4"). */
const mixedToFraction = (s: string) =>
  s.replace(
    /(\d+)\s+(\d+)\s*\/\s*(\d+)/g,
    (_, a, b, c) => `${Number(a) * Number(c) + Number(b)}/${c}`,
  );

export const checkAuto = (auto: DiagAuto, raw: string | undefined): boolean => {
  const v = (raw ?? "").trim();
  if (!v) return false;
  if (auto.kind === "factor") return checkFactorization(v, auto.n);
  return checkOpen(auto.answer, mixedToFraction(v));
};

export const autoPoints = (item: DiagItem, ans: DiagAnswer | undefined) =>
  item.auto && checkAuto(item.auto, ans?.j) ? item.auto.points : 0;

export const asDiagAnswer = (v: unknown): DiagAnswer =>
  v && typeof v === "object"
    ? {
        j: typeof (v as DiagAnswer).j === "string" ? (v as DiagAnswer).j : undefined,
        t: typeof (v as DiagAnswer).t === "string" ? (v as DiagAnswer).t : undefined,
      }
    : typeof v === "string"
      ? { t: v }
      : {};

export const isDiagAnswered = (v: unknown) => {
  const a = asDiagAnswer(v);
  return !!(a.j?.trim() || a.t?.trim());
};

export type DiagItemScore = { points: number; source: "rubric" | "auto" | "none"; auto: number };

export type DiagResult = {
  byItem: Record<string, DiagItemScore>;
  total: number;
  max: number;
  /** Faqat avtomatik qismlar bo'yicha ball. */
  auto: number;
  /** O'qituvchi rubrika bo'yicha baholagan topshiriqlar soni. */
  rubricCount: number;
  answered: number;
  components: ComponentScores;
};

export const scoreDiag = (
  items: DiagItem[],
  answers: Record<string, unknown>,
  rubric: Record<string, number> = {},
): DiagResult => {
  const byItem: Record<string, DiagItemScore> = {};
  const components: ComponentScores = {};
  let total = 0;
  let auto = 0;
  let rubricCount = 0;
  let answered = 0;
  for (const it of items) {
    const a = asDiagAnswer(answers[it.id]);
    if (isDiagAnswered(a)) answered++;
    const ap = autoPoints(it, a);
    auto += ap;
    const r = rubric[it.id];
    const hasRubric = typeof r === "number" && r >= 0 && r <= 2;
    const points = hasRubric ? r : ap;
    if (hasRubric) rubricCount++;
    byItem[it.id] = { points, source: hasRubric ? "rubric" : ap ? "auto" : "none", auto: ap };
    total += points;
    const c = (components[it.component] ??= { score: 0, max: 0 });
    c.score += points;
    c.max += 2;
  }
  return {
    byItem,
    total,
    max: items.length * 2,
    auto,
    rubricCount,
    answered,
    components,
  };
};
