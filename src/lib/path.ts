// Individual rivojlanish yo'li (adaptiv yondashuv): oxirgi diagnostika natijasidagi har bir
// komponent darajasiga qarab modul tayinlanadi.
// Avtoreferat (2.1-band): past darajaga qo'llab-quvvatlovchi, o'rta darajaga rivojlantiruvchi,
// yuqori darajaga ijodiy-tadqiqotchilik topshiriqlari beriladi.

import { COMPONENTS, componentPct, type ComponentKey } from "@/lib/components";
import { levelInfo, type LevelKey } from "@/lib/levels";
import type { Attempt } from "@/lib/results";
import type { SubmissionRow } from "@/lib/db";

export type PathPlan = "qollab" | "rivojlantiruvchi" | "ijodiy";

export const PLAN_LABEL: Record<PathPlan, string> = {
  qollab:
    "Qo'llab-quvvatlovchi topshiriqlar: to'liq modul — nazariya, namunaviy tahlil, mashq, metodik topshiriq, refleksiya",
  rivojlantiruvchi: "Rivojlantiruvchi topshiriqlar: mashq va metodik topshiriq",
  ijodiy: "Ijodiy-tadqiqotchilik topshiriqlari",
};

/** Modul sahifasida reja boshlanadigan qadam. */
export const PLAN_ANCHOR: Record<PathPlan, string> = {
  qollab: "q1",
  rivojlantiruvchi: "q3",
  ijodiy: "q5",
};

export type PathStep = {
  key: ComponentKey;
  label: string;
  pct: number;
  level: LevelKey;
  plan: PathPlan;
  done: boolean;
};

export type LearningPath = {
  basis: Attempt;
  /** Rubrika bo'yicha to'liq baholanmagan bo'lsa — dastlabki (avtomatik) ball asosida. */
  provisional: boolean;
  steps: PathStep[];
};

const planOf = (level: LevelKey): PathPlan =>
  level === "past" ? "qollab" : level === "orta" ? "rivojlantiruvchi" : "ijodiy";

export const buildPath = (
  attempts: Attempt[],
  submissions: SubmissionRow[] = [],
): LearningPath | null => {
  const basis = [...attempts]
    .filter((a) => a.diag && a.status !== "sinov")
    .sort((x, y) => (x.completedAt ?? "").localeCompare(y.completedAt ?? ""))
    .at(-1);
  if (!basis) return null;
  const done = new Set(
    submissions
      .filter(
        (s) => s.kind === "modul-bajarildi" && (s.created_at ?? "") >= (basis.completedAt ?? ""),
      )
      .map((s) => s.ref),
  );
  const steps = COMPONENTS.map((c) => {
    const pct = componentPct(basis.components[c.key]);
    const level = levelInfo(Number.isFinite(pct) ? pct : 0).key;
    return {
      key: c.key,
      label: c.label,
      pct: Number.isFinite(pct) ? pct : 0,
      level,
      plan: planOf(level),
      done: done.has(c.key),
    };
  }).sort((a, b) => a.pct - b.pct);
  return { basis, provisional: (basis.diag?.rubricCount ?? 0) < basis.nItems, steps };
};
