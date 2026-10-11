import { expect, test } from "bun:test";
import { itemAnalysis, pairedT, tCritical, tTwoSidedP, welchT } from "../src/lib/stats";

test("t taqsimoti p-qiymati ma'lum qiymatlarga mos", () => {
  expect(tTwoSidedP(2, 10)).toBeCloseTo(0.07339, 4);
  expect(tTwoSidedP(1.96, 1000)).toBeCloseTo(0.0503, 3);
  expect(tCritical(10)).toBeCloseTo(2.228, 3);
  expect(tCritical(30)).toBeCloseTo(2.042, 3);
});

test("bog'liq tanlanmalar t-mezoni", () => {
  const r = pairedT([50, 60, 70, 80], [55, 65, 72, 90])!;
  expect(r.meanDiff).toBeCloseTo(5.5, 6);
  expect(r.t).toBeCloseTo(3.3166, 3);
  expect(r.df).toBe(3);
  expect(r.p).toBeCloseTo(0.0451, 3);
  expect(r.improved).toBe(4);
});

test("Welch t-mezoni", () => {
  const r = welchT([10, 12, 14, 16], [1, 2, 3, 4, 5])!;
  expect(r.t).toBeGreaterThan(5);
  expect(r.p).toBeLessThan(0.01);
});

test("KR-20 va savollar tahlili", () => {
  const m = [
    [1, 1, 1, 1],
    [1, 1, 1, 0],
    [1, 1, 0, 0],
    [1, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  const r = itemAnalysis(["a", "b", "c", "d"], m);
  expect(r.items[0].p).toBeCloseTo(0.8, 6);
  // Guttman shkalasi: yuqori ishonchlilik
  expect(r.kr20).toBeCloseTo(0.8, 2);
  for (const it of r.items) expect(it.r).toBeGreaterThan(0.4);
});
