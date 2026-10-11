// Yagona daraja shkalasi: test natijasi, diagnostika va monitoring bir xil chegaralardan foydalanadi.
// Matnlar bazadagi avvalgi yozuvlar bilan mos (level ustuni).

export type LevelKey = "alo" | "yaxshi" | "orta" | "quyi";

export const LEVELS: { key: LevelKey; min: number; label: string; short: string }[] = [
  { key: "alo", min: 80, label: "A'lo daraja", short: "A'lo" },
  { key: "yaxshi", min: 60, label: "Yaxshi daraja", short: "Yaxshi" },
  { key: "orta", min: 40, label: "O'rta daraja", short: "O'rta" },
  { key: "quyi", min: 0, label: "Quyi daraja — qaytadan urinib ko'ring", short: "Quyi" },
];

export const levelInfo = (pct: number) =>
  LEVELS.find((l) => pct >= l.min) ?? LEVELS[LEVELS.length - 1];

export const levelOf = (pct: number) => levelInfo(pct).label;

export const levelClass: Record<LevelKey, string> = {
  alo: "bg-emerald-500",
  yaxshi: "bg-primary",
  orta: "bg-amber-500",
  quyi: "bg-red-500",
};

export const levelText: Record<LevelKey, string> = {
  alo: "text-emerald-700 dark:text-emerald-400",
  yaxshi: "text-primary",
  orta: "text-amber-700 dark:text-amber-400",
  quyi: "text-red-600 dark:text-red-400",
};

export const pctOf = (correct: number, total: number) =>
  total ? Math.round((correct / total) * 100) : 0;
