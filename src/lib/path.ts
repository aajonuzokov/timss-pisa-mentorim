// Individual rivojlanish yo'li (adaptiv yondashuv): oxirgi diagnostika natijasidagi har bir
// komponent darajasiga qarab modul tayinlanadi.
// Past → to'liq modul; o'rta → mashq va metodik topshiriq; yuqori → faqat metodik topshiriq.

import { COMPONENTS, componentPct, type ComponentKey } from "@/lib/components";
import { levelInfo, type LevelKey } from "@/lib/levels";
import type { Attempt } from "@/lib/results";
import type { SubmissionRow } from "@/lib/db";

export type PathPlan = "toliq" | "qisman" | "metodik";

export const PLAN_LABEL: Record<PathPlan, string> = {
  toliq: "To'liq modul: nazariya, namunaviy tahlil, mashq, metodik topshiriq, refleksiya",
  qisman: "Mashq va metodik topshiriq",
  metodik: "Faqat metodik topshiriq",
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
  level === "past" ? "toliq" : level === "orta" ? "qisman" : "metodik";

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
