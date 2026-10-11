import { expect, test } from "bun:test";
import { BANK_R1, BANK_V2, buildAttempts } from "../src/lib/results";
import { normalizeCode, isValidCode } from "../src/lib/participant";

const row = (o: Record<string, string>) => ({
  id: Math.random().toString(36).slice(2),
  full_name: "Ali Valiyev",
  university: "TDPU",
  course: "2",
  score: "0",
  total_questions: "30",
  ...o,
});

test("kod, bosqich va qayta topshirish qoidasi", () => {
  const answersA = Object.fromEntries(
    (BANK_R1["sinov-a"] ?? []).map((q) => [q.id, q.answer ? "0" : q.correctIndex]),
  );
  const meta = (stage: string) => ({ _meta: { code: "T-001", stage, group: "tajriba", consent: true, v: 1 } });
  const rows = [
    row({ test_type: "Sinov testi A · r1", answers: JSON.stringify({ ...answersA, ...meta("kirish") }), completed_at: "2026-10-01T10:00:00Z" }),
    row({ test_type: "Sinov testi A · r1", answers: JSON.stringify({ ...answersA, ...meta("kirish") }), completed_at: "2026-10-02T10:00:00Z" }),
  ];
  const { attempts, skipped } = buildAttempts(rows, { v2: BANK_V2, r1: BANK_R1 });
  expect(skipped).toBe(0);
  expect(attempts.every((a) => a.code === "T-001" && a.stage === "kirish" && a.group === "tajriba")).toBe(true);
  expect(attempts.filter((a) => a.counted).length).toBe(1);
  expect(attempts.find((a) => a.counted)!.completedAt).toBe("2026-10-01T10:00:00Z");
  expect(attempts[0].correct).toBe(15);
});

test("kod normalizatsiyasi", () => {
  expect(normalizeCode(" t-001 ")).toBe("T-001");
  expect(isValidCode("T-001")).toBe(true);
  expect(isValidCode("ab")).toBe(false);
});
