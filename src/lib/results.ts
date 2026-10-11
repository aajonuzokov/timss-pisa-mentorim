// test_results eksportini (CSV) o'qish va savollar bankiga qarab qayta baholash.
// Hamma hisob brauzerda bajariladi: fayl hech qayerga yuborilmaydi.

import timssV2 from "@/data/timss.json";
import pisaV2 from "@/data/pisa.json";
import released from "@/data/released.json";
import { parseTestType, processOfId, testKeyOf, topicOfId, type TestKey } from "@/data/bank";
import type { Question } from "@/components/Quiz";
import { pctOf } from "@/lib/levels";
import { isAnswered, isCorrect, type AnswerValue } from "@/lib/answers";

export { isCorrect };

export type Bank = Partial<Record<TestKey, Question[]>>;

// v1 savollarida mavzu va jarayon maydonlari yo'q: ular ID bo'yicha aniqlanadi (shablonlar tartibi bir xil).
const tag = (qs: Question[]): Question[] =>
  qs.map((q) => ({
    ...q,
    topic: q.topic ?? topicOfId(q.id),
    process: q.process ?? processOfId(q.id),
  }));

const toBank = (timss: Record<string, Question[]>, pisa: Question[]): Bank => ({
  knowing: tag(timss.knowing),
  applying: tag(timss.applying),
  reasoning: tag(timss.reasoning),
  pisa: tag(pisa),
});

export const BANK_V2: Bank = toBank(timssV2 as Record<string, Question[]>, pisaV2 as Question[]);

const R = released as unknown as Record<string, Question[]>;
/** Rasmiy namunaviy topshiriqlar (r1). */
export const BANK_R1: Bank = {
  "r-knowing": R.knowing,
  "r-applying": R.applying,
  "r-reasoning": R.reasoning,
  "r-pisa": R.pisa,
};

let v1Promise: Promise<Bank> | null = null;
export const loadBankV1 = () =>
  (v1Promise ??= Promise.all([
    import("@/data/v1/timss.v1.json"),
    import("@/data/v1/pisa.v1.json"),
  ]).then(([t, p]) => toBank(t.default as Record<string, Question[]>, p.default as Question[])));

/** RFC 4180 uslubidagi CSV: qo'shtirnoq ichidagi ajratgich va qatordan qatorga o'tish qo'llab-quvvatlanadi. */
export const parseCsv = (text: string): Record<string, string>[] => {
  const src = text.replace(/^\uFEFF/, "");
  const firstLine = src.slice(0, src.indexOf("\n") === -1 ? src.length : src.indexOf("\n"));
  const delim =
    (firstLine.match(/;/g)?.length ?? 0) > (firstLine.match(/,/g)?.length ?? 0) ? ";" : ",";
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === delim) {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((f) => f !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f !== "")) rows.push(row);
  const [header, ...body] = rows;
  if (!header) return [];
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), r[i] ?? ""])));
};

export type Status = "toliq" | "toliq-emas" | "sinov";

export type Attempt = {
  id: string;
  full_name: string;
  university: string;
  course: string;
  testKey: TestKey;
  testBase: string;
  version: string;
  answers: Record<string, AnswerValue>;
  questions: Question[];
  correct: number;
  answered: number;
  total: number;
  pct: number;
  storedScore: number;
  completedAt: string;
  status: Status;
  personKey: string;
};

const TEST_NAME = /\btest\b|sinov|tekshiruv/i;

export const normalizeCourse = (c: string) => {
  const m = /\d/.exec(c);
  if (/magist/i.test(c)) return "Magistratura";
  return m ? m[0] : c.trim();
};

export const buildAttempts = (
  rows: Record<string, string>[],
  banks: Record<string, Bank>,
): { attempts: Attempt[]; skipped: number } => {
  const attempts: Attempt[] = [];
  let skipped = 0;
  for (const r of rows) {
    const { base, version } = parseTestType(r.test_type ?? "");
    const testKey = testKeyOf(base);
    const bank = banks[version];
    const questions = testKey && bank ? bank[testKey] : undefined;
    if (!testKey || !questions) {
      skipped++;
      continue;
    }
    let answers: Record<string, AnswerValue> = {};
    try {
      answers = JSON.parse(r.answers || "{}");
    } catch {
      answers = {};
    }
    const answered = questions.filter((q) => isAnswered(answers[q.id])).length;
    const correct = questions.filter((q) => isCorrect(q, answers[q.id])).length;
    const total = questions.length;
    const isTest =
      TEST_NAME.test(r.full_name ?? "") ||
      TEST_NAME.test(r.university ?? "") ||
      (r.full_name ?? "").trim().length < 3 ||
      answered === 0 ||
      Number(r.total_questions) !== total;
    attempts.push({
      id: r.id,
      full_name: (r.full_name ?? "").trim(),
      university: (r.university ?? "").trim(),
      course: normalizeCourse(r.course ?? ""),
      testKey,
      testBase: base,
      version,
      answers,
      questions,
      correct,
      answered,
      total,
      pct: pctOf(correct, total),
      storedScore: Number(r.score),
      completedAt: r.completed_at,
      status: isTest ? "sinov" : answered < total ? "toliq-emas" : "toliq",
      personKey: `${(r.full_name ?? "").trim().toLowerCase().replace(/\s+/g, " ")}|${(r.university ?? "").trim().toLowerCase()}`,
    });
  }
  attempts.sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));
  return { attempts, skipped };
};

export const neededVersions = (rows: Record<string, string>[]) =>
  new Set(rows.map((r) => parseTestType(r.test_type ?? "").version));
