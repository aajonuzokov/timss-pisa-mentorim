// O'qituvchi sessiyasi: Supabase Auth (email + parol) va `teachers` ro'yxati.
// Ro'yxatga kiritilmagan foydalanuvchi tizimga kirsa ham natijalarni ko'ra olmaydi (RLS).

import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { db, type ResultRow, type RubricRow } from "@/lib/db";

export type TeacherState = {
  loading: boolean;
  session: Session | null;
  isTeacher: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

export function useTeacher(): TeacherState {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [isTeacher, setIsTeacher] = useState(false);

  const check = useCallback(async (s: Session | null) => {
    setSession(s);
    if (!s) {
      setIsTeacher(false);
      setLoading(false);
      return;
    }
    const { data, error } = await db
      .from("teachers")
      .select("user_id")
      .eq("user_id", s.user.id)
      .maybeSingle();
    setIsTeacher(!error && !!data);
    setLoading(false);
  }, []);

  useEffect(() => {
    let alive = true;
    db.auth.getSession().then(({ data }) => alive && void check(data.session));
    const { data: sub } = db.auth.onAuthStateChange((_e, s) => {
      if (alive) void check(s);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [check]);

  return {
    loading,
    session,
    isTeacher,
    refresh: async () => {
      const { data } = await db.auth.getSession();
      await check(data.session);
    },
    signOut: async () => {
      await db.auth.signOut();
    },
  };
}

const PAGE = 1000;

/** Jadvalni sahifalab to'liq o'qish (Supabase bir so'rovda ko'pi bilan 1000 qator qaytaradi). */
export async function fetchAll<T>(table: string, order: string): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await db
      .from(table)
      .select("*")
      .order(order, { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    out.push(...((data ?? []) as T[]));
    if (!data || data.length < PAGE) break;
  }
  return out;
}

export const loadResults = () => fetchAll<ResultRow>("test_results", "completed_at");
export const loadRubric = () => fetchAll<RubricRow>("rubric_scores", "updated_at");
