// Yangi jadvallar (rubrika, portfolio) Lovable tomonidan types.ts qayta yaratilguncha
// tiplanmagan mijoz orqali chaqiriladi. Ulanish va sessiya — umumiy Supabase mijozi.

import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db = supabase as unknown as SupabaseClient<any, "public", any>;

export type ResultRow = {
  id: string;
  full_name: string;
  university: string;
  course: string;
  test_type: string;
  score: number;
  total_questions: number;
  percentage: number;
  level: string;
  answers: Record<string, unknown>;
  started_at: string;
  completed_at: string;
};

export type RubricRow = {
  result_id: string;
  item_id: string;
  score: number;
  comment: string | null;
  updated_at?: string;
};

export type ReflectionRow = {
  id: string;
  code: string;
  result_id: string;
  test_type: string;
  difficulty: string;
  next_step: string;
  created_at: string;
};

export type FeedbackRow = {
  id: string;
  code: string;
  result_id: string | null;
  comment: string;
  recommendations: string;
  created_at: string;
};

/** Bazadan olingan qatorni CSV eksporti ko'rinishiga keltirish (buildAttempts uchun). */
export const rowToRecord = (r: ResultRow): Record<string, string> => ({
  id: r.id,
  full_name: r.full_name,
  university: r.university,
  course: r.course,
  test_type: r.test_type,
  score: String(r.score),
  total_questions: String(r.total_questions),
  percentage: String(r.percentage),
  level: r.level,
  answers: JSON.stringify(r.answers ?? {}),
  started_at: r.started_at,
  completed_at: r.completed_at,
});

export const rubricMapOf = (rows: RubricRow[]) => {
  const m = new Map<string, Record<string, number>>();
  for (const r of rows) {
    const cur = m.get(r.result_id) ?? {};
    cur[r.item_id] = r.score;
    m.set(r.result_id, cur);
  }
  return m;
};

export type SubmissionKind =
  | "modul-metodik"
  | "modul-bajarildi"
  | "maqsad"
  | "xato-tahlil"
  | "moslashtirish"
  | "dars-ishlanmasi"
  | "microteaching"
  | "lesson-study"
  | "self-score";

/** Talaba ishi va (bo'lsa) o'qituvchi bahosi. */
export type SubmissionRow = {
  id: string;
  code: string;
  kind: SubmissionKind;
  ref: string;
  payload: Record<string, unknown>;
  created_at: string;
  score?: number | null;
  criteria?: Record<string, number> | null;
  comment?: string | null;
};

export type SubmissionScoreRow = {
  submission_id: string;
  score: number;
  criteria: Record<string, number> | null;
  comment: string | null;
  updated_at?: string;
};

/** Talaba ishini yuborish: kod bo'yicha kamida bitta diagnostika natijasi bo'lishi kerak. */
export const submitWork = async (
  code: string,
  kind: SubmissionKind,
  ref: string,
  payload: Record<string, unknown>,
) => {
  const { error } = await db.from("portfolio_submissions").insert({ code, kind, ref, payload });
  if (!error) return { ok: true as const };
  const msg = /test topilmadi/i.test(error.message)
    ? "Bu kod bilan topshirilgan test topilmadi. Avval Tajriba-sinov bo'limida kirish diagnostikasini topshiring."
    : /chegaradan/i.test(error.message)
      ? "Bugungi ishlar soni chegaradan oshdi. Ertaga davom ettiring."
      : /allaqachon/i.test(error.message)
        ? "Bu natija allaqachon baholangan."
        : "Yuborib bo'lmadi. Internet aloqasini tekshirib, qayta urinib ko'ring.";
  return { ok: false as const, error: msg };
};
