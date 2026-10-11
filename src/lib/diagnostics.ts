import { processOfId, topicLabel, topicOfId } from "@/data/bank";
import { pctOf } from "@/lib/levels";

export type BankQuestion = {
  id: string;
  correctIndex: number;
  topic?: string;
  process?: string;
};

export type Row = { key: string; label: string; correct: number; total: number; pct: number };

const group = (
  questions: BankQuestion[],
  answers: Record<string, number>,
  keyOf: (q: BankQuestion) => string | undefined,
  labelOf: (k: string) => string,
): Row[] => {
  const acc = new Map<string, { correct: number; total: number }>();
  for (const q of questions) {
    const k = keyOf(q);
    if (!k) continue;
    const cur = acc.get(k) ?? { correct: 0, total: 0 };
    cur.total += 1;
    if (answers[q.id] === q.correctIndex) cur.correct += 1;
    acc.set(k, cur);
  }
  return [...acc.entries()]
    .map(([key, v]) => ({ key, label: labelOf(key), ...v, pct: pctOf(v.correct, v.total) }))
    .sort((a, b) => a.pct - b.pct || a.label.localeCompare(b.label));
};

/** Bitta urinish bo'yicha mavzular va (PISA uchun) jarayonlar kesimida natija. */
export const diagnose = (questions: BankQuestion[], answers: Record<string, number>) => {
  const byTopic = group(questions, answers, (q) => q.topic ?? topicOfId(q.id), topicLabel);
  const byProcess = group(
    questions,
    answers,
    (q) => q.process ?? processOfId(q.id),
    (k) => k,
  );
  const correct = questions.filter((q) => answers[q.id] === q.correctIndex).length;
  const answered = questions.filter((q) => answers[q.id] !== undefined).length;
  return {
    byTopic,
    byProcess,
    correct,
    answered,
    total: questions.length,
    pct: pctOf(correct, questions.length),
  };
};

/** Kuchli (≥ 80%) va rivojlantirish kerak (< 60%) bo'lgan mavzular. */
export const splitStrengths = (rows: Row[]) => ({
  strong: rows.filter((r) => r.pct >= 80).sort((a, b) => b.pct - a.pct),
  weak: rows.filter((r) => r.pct < 60),
});
