import { expect, test } from "bun:test";
import { checkOpen, isCorrect } from "../src/lib/answers";
import released from "../src/data/released.json";
import forms from "../src/data/forms.json";

const N = (accept: number[], tol = 0) => ({ type: "number" as const, accept, tol });

test.each([
  [N([5917]), "5 917", true],
  [N([5917]), "5,917", true],
  [N([5917]), "5817", false],
  [N([5917]), "", false],
  [N([0.5]), "0,5 m", true],
  [N([0.5]), "1/2", true],
  [N([0.5]), "50 sm", false],
  [N([1275.75, 1276, 1275]), "1 276 ta", true],
  [N([12600]), "12 600 ZAR", true],
  [N([11, 11.2], 0.3), "≈ 11,2 %", true],
  [N([11, 11.2], 0.3), "10", false],
] as const)("son: %p %p", (spec, v, exp) => {
  expect(checkOpen(spec, v)).toBe(exp);
});

test("oraliq, ro'yxat, vaqt, kasr", () => {
  expect(checkOpen({ type: "between", min: 5, max: 6 }, "5,5")).toBe(true);
  expect(checkOpen({ type: "between", min: 5, max: 6 }, "6")).toBe(false);
  expect(checkOpen({ type: "set", accept: [1, 2, 3, 4, 6, 12] }, "1,2,3,4,6,12")).toBe(true);
  expect(checkOpen({ type: "set", accept: [1, 2, 3, 4, 6, 12] }, "2 3 4 6")).toBe(false);
  expect(checkOpen({ type: "set", accept: [112, 1112, 2112] }, "112, 1 112, 2 112")).toBe(true);
  expect(checkOpen({ type: "time", accept: ["10:00"] }, "10")).toBe(true);
  expect(checkOpen({ type: "time", accept: ["10:00"] }, "22:00")).toBe(false);
  expect(checkOpen({ type: "fraction", accept: ["100/101"] }, "100 / 101")).toBe(true);
  expect(checkOpen({ type: "fraction", accept: ["100/101"] }, "101/100")).toBe(false);
});

type Q = Parameters<typeof isCorrect>[0] & { id: string; answer?: { type: string; accept?: unknown[] } };
const all = Object.values(released as unknown as Record<string, Q[]>).flat();

test("rasmiy topshiriqlar: kalitlar to'g'ri, variantlar noyob, ID lar noyob", () => {
  expect(all.length).toBe(96);
  expect(new Set(all.map((q) => q.id)).size).toBe(all.length);
  for (const q of all) {
    if (q.answer) {
      expect(isCorrect(q, "0")).toBe(false);
    } else {
      expect(new Set(q.options).size).toBe(4);
      expect(isCorrect(q, q.correctIndex)).toBe(true);
    }
  }
});

test("sinov shakllari: 30 tadan, kesishmaydi, bankda mavjud", () => {
  const ids = new Set(all.map((q) => q.id));
  expect(forms.A.length).toBe(30);
  expect(forms.B.length).toBe(30);
  expect(forms.A.filter((x) => forms.B.includes(x))).toEqual([]);
  for (const id of [...forms.A, ...forms.B]) expect(ids.has(id)).toBe(true);
});
