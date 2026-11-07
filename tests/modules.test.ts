import { expect, test } from "bun:test";
import { DIAG_FORMS, diagItemById } from "../src/data/diag";
import { MODULES } from "../src/data/modules";
import { PUPIL_ERRORS, ADAPT_ITEMS, TOOLS } from "../src/data/amaliyot";
import { BLOCKS } from "../src/data/model";
import { TABLE_3_5, TABLE_3_6, TABLE_3_7 } from "../src/data/dissResults";
import { scoreDiag } from "../src/lib/diagScore";
import { buildAttempts, defaultBanks } from "../src/lib/results";
import { buildPath } from "../src/lib/path";

test("diagnostika: faqat A (kirish) va B (yakuniy) shakllari, 20 tadan, 40 ball", () => {
  expect(Object.keys(DIAG_FORMS)).toEqual(["A", "B"]);
  expect(DIAG_FORMS.A.length).toBe(20);
  expect(DIAG_FORMS.B.length).toBe(20);
  expect(diagItemById.size).toBe(40);
  expect(scoreDiag(DIAG_FORMS.A, {}).max).toBe(40);
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
  expect(by.bilim.plan).toBe("ijodiy");
  expect(by.savodxonlik.plan).toBe("qollab");
  expect(by.savodxonlik.done).toBe(true);
  expect(p.steps[0].pct).toBeLessThanOrEqual(p.steps[4].pct);
  expect(p.provisional).toBe(true);
});

test("avtoreferat: komponentlar tartibi, blok nomlari, ijodiy topshiriqlar", async () => {
  const { COMPONENTS } = await import("../src/lib/components");
  expect(COMPONENTS.map((c) => c.key)).toEqual([
    "bilim",
    "tafakkur",
    "savodxonlik",
    "metodik",
    "refleksiya",
  ]);
  expect(MODULES.map((m) => m.key)).toEqual(COMPONENTS.map((c) => c.key));
  expect(BLOCKS.map((b) => b.title)).toEqual([
    "Maqsadli blok",
    "Nazariy-metodologik blok",
    "Mazmuniy blok",
    "Tashkiliy-texnologik blok",
    "Diagnostik-monitoring blok",
    "Natijaviy blok",
  ]);
  for (const m of MODULES) {
    expect(m.creative.length).toBe(3);
    expect(m.basis.length).toBeGreaterThan(2);
  }
  expect(TABLE_3_6.map((r) => r.key)).toEqual(COMPONENTS.map((c) => c.key));
});

test("avtoreferat 4-jadval: o'rtacha baho, S, η va T qayta hisoblanadi", async () => {
  const { TABLE_4, gradeMean, gradeSD, EFFICIENCY } = await import("../src/data/dissResults");
  const r = (x: number, d: number) => Math.round(x * 10 ** d) / 10 ** d;
  const [aT, aN, yT, yN] = TABLE_4;
  expect([aT, aN, yT, yN].map((x) => r(gradeMean(x), 2))).toEqual([3.75, 3.76, 4.3, 3.85]);
  expect(r(gradeSD(yT), 3)).toBe(0.714);
  expect(r(gradeSD(yN), 3)).toBe(0.726);
  const t =
    (gradeMean(yT) - gradeMean(yN)) / Math.sqrt(gradeSD(yT) ** 2 / 180 + gradeSD(yN) ** 2 / 180);
  expect(r(t, 2)).toBe(EFFICIENCY.t);
  expect(r(gradeMean(yT) / gradeMean(yN), 2)).toBe(EFFICIENCY.eta.yakuniy);
  expect(r((gradeMean(yT) / gradeMean(yN) - 1) * 100, 1)).toBe(EFFICIENCY.gainPct);
});

test("topshiriqlar banki: har bir TIMSS/PISA topshirig'i darajaga ega", async () => {
  const { levelOf } = await import("../src/data/bankLevels");
  const timss = (await import("../src/data/timss.json")).default as Record<
    string,
    { topic: string }[]
  >;
  const pisa = (await import("../src/data/pisa.json")).default as { topic: string }[];
  const all = [...Object.values(timss).flat(), ...pisa];
  expect(all.length).toBe(400);
  for (const q of all) expect(levelOf(q)).toBeDefined();
  expect(levelOf({ intlPct: 72 })).toBe("past");
  expect(levelOf({ intlPct: 40 })).toBe("orta");
  expect(levelOf({ intlPct: 20 })).toBe("yuqori");
});
