// test_results eksportini (CSV) o'qish va savollar bankiga qarab qayta baholash.
// Hamma hisob brauzerda bajariladi: fayl hech qayerga yuborilmaydi.

import timssV2 from "@/data/timss.json";
import pisaV2 from "@/data/pisa.json";
import released from "@/data/released.json";
import forms from "@/data/forms.json";
import { DIAG_FORMS, DIAG_MAX, type DiagItem } from "@/data/diag";
import {
  DIAG_TEST_VERSION,
  isDiag,
  parseTestType,
  processOfId,
  testKeyOf,
  topicOfId,
  type TestKey,
} from "@/data/bank";
import { componentOf, type ComponentScores } from "@/lib/components";
import { scoreDiag } from "@/lib/diagScore";
import type { Question } from "@/components/Quiz";
import { pctOf } from "@/lib/levels";
import { isAnswered, isCorrect, type AnswerValue } from "@/lib/answers";
import { readMeta, type Group, type Stage } from "@/lib/participant";

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
const byId = new Map(Object.values(R).flatMap((qs) => qs.map((q) => [q.id, q] as const)));
const form = (ids: string[]) => ids.map((id) => byId.get(id)!).filter(Boolean);

/** Kirish (A) va yakuniy (B) sinov testlari: qiyinlik, soha va javob turi bo'yicha muvozanatlangan. */
export const FORM_A = form(forms.A);
export const FORM_B = form(forms.B);

/** Rasmiy namunaviy topshiriqlar (r1). */
export const BANK_R1: Bank = {
  "r-knowing": R.knowing,
  "r-applying": R.applying,
  "r-reasoning": R.reasoning,
  "r-pisa": R.pisa,
  "sinov-a": FORM_A,
  "sinov-b": FORM_B,
};

/** Diagnostik test topshiriqlari umumiy savol ko'rinishida (monitoring jadvallari uchun). */
export const diagAsQuestions = (items: DiagItem[]): Question[] =>
  items.map((it) => ({
    id: it.id,
    q: it.q,
    options: [],
    correctIndex: -1,
    explain: it.expected,
    title: it.title,
    topic: it.component,
    component: it.component,
  }));

/** Dissertatsiyaning diagnostik testi (d1): A — kirish, B — yakuniy. */
export const BANK_D1: Bank = {
  "diag-a": diagAsQuestions(DIAG_FORMS.A),
  "diag-b": diagAsQuestions(DIAG_FORMS.B),
};

const DIAG_ITEMS: Partial<Record<TestKey, DiagItem[]>> = {
  "diag-a": DIAG_FORMS.A,
  "diag-b": DIAG_FORMS.B,
};

/** Barcha mavjud banklar (v1 dan tashqari: u kerak bo'lganda alohida yuklanadi). */
export const defaultBanks = (): Record<string, Bank> => ({
  v2: BANK_V2,
  r1: BANK_R1,
  [DIAG_TEST_VERSION]: BANK_D1,
});

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
  /** To'plangan ball (oddiy testda — to'g'ri javoblar soni, diagnostik testda — 0–40 ball). */
  correct: number;
  answered: number;
  /** Maksimal ball (oddiy testda — savollar soni, diagnostik testda — 40). */
  total: number;
  /** Topshiriqlar soni. */
  nItems: number;
  pct: number;
  /** Har bir topshiriq bo'yicha ball va maksimal ball (0/1 yoki 0–2). */
  itemPoints: Record<string, number>;
  itemMax: number;
  /** Matematik tayyorgarlik komponentlari bo'yicha ball. */
  components: ComponentScores;
  /** Diagnostik test: avtomatik ball va o'qituvchi baholagan topshiriqlar soni. */
  diag?: { auto: number; rubricCount: number };
  storedScore: number;
  completedAt: string;
  status: Status;
  personKey: string;
  /** Ishtirokchi kodi (yangi yozuvlarda), bosqich va guruh. */
  code: string;
  stage: Stage;
  group: Group;
  /**
   * Hisobga olinadigan urinish: har bir ishtirokchi, test va bosqich uchun birinchi to'liq urinish.
   * Qolganlari mashq sifatida ko'riladi.
   */
  counted: boolean;
};

const TEST_NAME = /\btest\b|sinov|tekshiruv/i;

export const normalizeCourse = (c: string) => {
  const m = /\d/.exec(c);
  if (/magist/i.test(c)) return "Magistratura";
  return m ? m[0] : c.trim();
};

/** Rubrika ballari: natija ID → topshiriq ID → ball (0–2). */
export type RubricMap = Map<string, Record<string, number>>;

export const buildAttempts = (
  rows: Record<string, string>[],
  banks: Record<string, Bank>,
  rubric: RubricMap = new Map(),
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
    const diagItems = DIAG_ITEMS[testKey];
    let answered: number;
    let correct: number;
    let total: number;
    let itemPoints: Record<string, number>;
    let components: ComponentScores;
    let diag: Attempt["diag"];
    if (diagItems && isDiag(testKey)) {
      const d = scoreDiag(diagItems, answers, rubric.get(r.id));
      answered = d.answered;
      correct = d.total;
      total = DIAG_MAX;
      itemPoints = Object.fromEntries(Object.entries(d.byItem).map(([k, v]) => [k, v.points]));
      components = d.components;
      diag = { auto: d.auto, rubricCount: d.rubricCount };
    } else {
      answered = questions.filter((q) => isAnswered(answers[q.id])).length;
      itemPoints = Object.fromEntries(
        questions.map((q) => [q.id, isCorrect(q, answers[q.id]) ? 1 : 0]),
      );
      correct = Object.values(itemPoints).reduce((s, v) => s + v, 0);
      total = questions.length;
      components = {};
      for (const q of questions) {
        const k = componentOf(testKey, q);
        if (!k) continue;
        const c = (components[k] ??= { score: 0, max: 0 });
        c.max += 1;
        c.score += itemPoints[q.id];
      }
    }
    const nItems = questions.length;
    const isTest =
      TEST_NAME.test(r.full_name ?? "") ||
      TEST_NAME.test(r.university ?? "") ||
      (r.full_name ?? "").trim().length < 3 ||
      answered === 0 ||
      Number(r.total_questions) !== total;
    const meta = readMeta(answers as Record<string, unknown>);
    const code = typeof meta.code === "string" ? meta.code : "";
    const nameKey = `${(r.full_name ?? "").trim().toLowerCase().replace(/\s+/g, " ")}|${(r.university ?? "").trim().toLowerCase()}`;
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
      nItems,
      pct: pctOf(correct, total),
      itemPoints,
      itemMax: diag ? 2 : 1,
      components,
      diag,
      storedScore: Number(r.score),
      completedAt: r.completed_at,
      // Diagnostik testda bo'sh qoldirilgan topshiriq 0 ball oladi: yuborilgan har bir ish to'liq.
      status: isTest ? "sinov" : !diag && answered < nItems ? "toliq-emas" : "toliq",
      personKey: code ? `kod:${code}` : nameKey,
      code,
      stage: meta.stage === "kirish" || meta.stage === "yakuniy" ? meta.stage : "mashq",
      group: meta.group === "tajriba" || meta.group === "nazorat" ? meta.group : "",
      counted: false,
    });
  }
  // Qayta topshirish qoidasi: har bir (ishtirokchi, test, bosqich) uchun birinchi to'liq urinish.
  const firstDone = new Map<string, Attempt>();
  for (const a of [...attempts].sort((x, y) =>
    (x.completedAt ?? "").localeCompare(y.completedAt ?? ""),
  )) {
    if (a.status !== "toliq") continue;
    const k = `${a.personKey}|${a.testKey}|${a.stage}`;
    if (!firstDone.has(k)) firstDone.set(k, a);
  }
  for (const a of firstDone.values()) a.counted = true;
  attempts.sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));
  return { attempts, skipped };
};

export const neededVersions = (rows: Record<string, string>[]) =>
  new Set(rows.map((r) => parseTestType(r.test_type ?? "").version));
