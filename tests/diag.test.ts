import { expect, test } from "bun:test";
import { DIAG_FORMS } from "../src/data/diag";
import { checkFactorization, checkAuto, scoreDiag } from "../src/lib/diagScore";
import { buildAttempts, defaultBanks } from "../src/lib/results";
import { levelInfo } from "../src/lib/levels";

test("A va B shakllar tuzilishi bir xil (Ilova 2 taqsimoti)", () => {
  for (const f of [DIAG_FORMS.A, DIAG_FORMS.B]) {
    expect(f.length).toBe(20);
    const by = (c: string) => f.filter((it) => it.component === c).length * 2;
    expect([
      by("bilim"),
      by("tafakkur"),
      by("metodik"),
      by("savodxonlik"),
      by("refleksiya"),
    ]).toEqual([8, 16, 8, 4, 4]);
  }
  DIAG_FORMS.A.forEach((a, i) => {
    const b = DIAG_FORMS.B[i];
    expect([b.n, b.block, b.component, b.auto?.points]).toEqual([
      a.n,
      a.block,
      a.component,
      a.auto?.points,
    ]);
  });
});

test("tub ko'paytuvchilar yoyilmasi", () => {
  expect(checkFactorization("2^4 * 3", 48)).toBe(true);
  expect(checkFactorization("48 = 2⁴×3", 48)).toBe(true);
  expect(checkFactorization("2·2·2·2·3", 48)).toBe(true);
  expect(checkFactorization("2 x 2 x 2 x 3 x 3", 72)).toBe(true);
  expect(checkFactorization("2³ · 3²", 72)).toBe(true);
  expect(checkFactorization("6 × 8", 48)).toBe(false);
  expect(checkFactorization("2^3 * 3", 48)).toBe(false);
});

test("avtomatik qismlar", () => {
  const a7 = DIAG_FORMS.A.find((it) => it.n === 7)!.auto!;
  expect(checkAuto(a7, "5/4")).toBe(true);
  expect(checkAuto(a7, "1 1/4")).toBe(true);
  expect(checkAuto(a7, "1,25")).toBe(true);
  expect(checkAuto(a7, "4/6")).toBe(false);
  const b7 = DIAG_FORMS.B.find((it) => it.n === 7)!.auto!;
  expect(checkAuto(b7, "11/12")).toBe(true);
  const a10 = DIAG_FORMS.A.find((it) => it.n === 10)!.auto!;
  expect(checkAuto(a10, "36; 49")).toBe(true);
  expect(checkAuto(a10, "36")).toBe(false);
});

test("rubrika avtomatik balldan ustun, komponentlar va daraja", () => {
  const ans = {
    "DA-5": { j: "21", t: "28·0,75" },
    "DA-6": { j: "40" },
    "DA-1": { t: "0,40 > 0,35" },
  };
  const auto = scoreDiag(DIAG_FORMS.A, ans);
  expect(auto.auto).toBe(4);
  expect(auto.total).toBe(4);
  const r = scoreDiag(DIAG_FORMS.A, ans, { "DA-5": 1, "DA-1": 2 });
  expect(r.total).toBe(5);
  expect(r.rubricCount).toBe(2);
  expect(r.components.bilim).toEqual({ score: 2, max: 8 });
  expect(r.components.tafakkur).toEqual({ score: 3, max: 16 });
  expect(levelInfo(50).key).toBe("past");
  expect(levelInfo(Math.round((21 / 40) * 100)).key).toBe("orta");
  expect(levelInfo(75).key).toBe("orta");
  expect(levelInfo(Math.round((31 / 40) * 100)).key).toBe("yuqori");
});

test("diagnostik test yozuvi monitoringda o'qiladi", () => {
  const answers = {
    "DA-5": { j: "21" },
    _meta: { code: "T-001", stage: "kirish", group: "tajriba", consent: true, v: 1 },
  };
  const rows = [
    {
      id: "r1",
      full_name: "Ali Valiyev",
      university: "TDPU",
      course: "3",
      test_type: "Diagnostik test A · d1",
      score: "2",
      total_questions: "40",
      answers: JSON.stringify(answers),
      completed_at: "2026-10-01T10:00:00Z",
    },
  ];
  const { attempts, skipped } = buildAttempts(
    rows,
    defaultBanks(),
    new Map([["r1", { "DA-5": 2, "DA-13": 2, "DA-19": 1 }]]),
  );
  expect(skipped).toBe(0);
  const a = attempts[0];
  expect(a.status).toBe("toliq");
  expect(a.counted).toBe(true);
  expect(a.correct).toBe(5);
  expect(a.total).toBe(40);
  expect(a.components.metodik).toEqual({ score: 2, max: 8 });
  expect(a.diag?.rubricCount).toBe(3);
});
