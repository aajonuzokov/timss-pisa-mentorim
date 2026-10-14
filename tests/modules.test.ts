import { expect, test } from "bun:test";
import { DIAG_FORMS, diagItemById } from "../src/data/diag";
import { MODULES } from "../src/data/modules";
import { PUPIL_ERRORS, ADAPT_ITEMS, TOOLS } from "../src/data/amaliyot";
import { BLOCKS } from "../src/data/model";
import { TABLE_3_5, TABLE_3_6, TABLE_3_7 } from "../src/data/dissResults";
import { scoreDiag } from "../src/lib/diagScore";
import { buildAttempts, defaultBanks } from "../src/lib/results";
import { buildPath } from "../src/lib/path";

test("oraliq diagnostika: 30 topshiriq, har komponentda 6 ta, 60 ball", () => {
  const O = DIAG_FORMS.O;
  expect(O.length).toBe(30);
  for (const c of ["bilim", "tafakkur", "metodik", "savodxonlik", "refleksiya"])
    expect(O.filter((it) => it.component === c).length).toBe(6);
  expect(new Set(O.map((it) => it.id)).size).toBe(30);
  expect(diagItemById.get("DO-30")?.component).toBe("refleksiya");
  const r = scoreDiag(O, {
    "DO-1": { j: "987" },
    "DO-3": { j: "2*3^2*5" },
    "DO-19": { j: "81 000; 89 100" },
  });
  expect(r.max).toBe(60);
  expect(r.auto).toBe(5);
});

test("model, natijalar va modullar ma'lumotlari to'liq", () => {
  expect(BLOCKS.map((b) => b.slug)).toEqual([
    "maqsadli",
    "metodologik",
    "mazmuniy",
    "texnologik",
    "diagnostik",
    "natijaviy",
  ]);
  for (const row of TABLE_3_5)
    expect(Math.round((row.past + row.orta + row.yuqori) * 10) / 10).toBe(100);
  expect(TABLE_3_6.length).toBe(5);
  expect(TABLE_3_7[2].past + TABLE_3_7[2].orta + TABLE_3_7[2].yuqori).toBe(360);
  expect(MODULES.length).toBe(5);
  expect(PUPIL_ERRORS.length).toBe(18);
  expect(ADAPT_ITEMS.length).toBeGreaterThan(5);
  expect(TOOLS.length).toBe(5);
});

test("individual yo'l: past komponent to'liq modul oladi, yakunlangan modul belgilanadi", () => {
  const answers = {
    "DA-5": { j: "21" },
    "DA-6": { j: "40" },
    _meta: { code: "T-9", stage: "kirish", consent: true },
  };
  const rows = [
    {
      id: "r9",
      full_name: "Ali Valiyev",
      university: "TDPU",
      course: "3",
      test_type: "Diagnostik test A · d1",
      score: "4",
      total_questions: "40",
      answers: JSON.stringify(answers),
      completed_at: "2026-10-01T10:00:00Z",
    },
  ];
  const rubric = new Map([
    ["r9", { "DA-1": 2, "DA-2": 2, "DA-3": 2, "DA-4": 2, "DA-13": 2, "DA-14": 1 }],
  ]);
  const { attempts } = buildAttempts(rows, defaultBanks(), rubric);
  const p = buildPath(attempts, [
    {
      id: "s1",
      code: "T-9",
      kind: "modul-bajarildi",
      ref: "savodxonlik",
      payload: {},
      created_at: "2026-10-02T10:00:00Z",
    },
  ])!;
  const by = Object.fromEntries(p.steps.map((s) => [s.key, s]));
  expect(by.bilim.level).toBe("yuqori");
  expect(by.bilim.plan).toBe("metodik");
  expect(by.savodxonlik.plan).toBe("toliq");
  expect(by.savodxonlik.done).toBe(true);
  expect(p.steps[0].pct).toBeLessThanOrEqual(p.steps[4].pct);
  expect(p.provisional).toBe(true);
});
