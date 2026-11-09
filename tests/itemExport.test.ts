import { expect, test } from "bun:test";
import { buildItemExport } from "../src/lib/itemExport";
import { defaultBanks, parseCsv, loadBankV1 } from "../src/lib/results";

const row = (answers: unknown, test_type = "TIMSS - Bilish · v2") => ({
  id: "result-1", full_name: "Ali Valiyev", university: "TDPU", course: "2",
  test_type, answers: JSON.stringify(answers), score: "1", total_questions: "84",
  percentage: "1.19", started_at: "2026-11-09T10:00:00Z", completed_at: "2026-11-09T10:10:00Z",
});

test("one row per item preserves raw index, text, result ID and stored totals", () => {
  const banks = defaultBanks();
  const q = banks.v2.knowing?.[0];
  if (!q) throw new Error("Bank missing");
  const output = buildItemExport([row({ [q.id]: q.correctIndex, _meta: { consent: true } })], banks);
  const rows = parseCsv(output.csv);
  expect(rows.length).toBe(84);
  const first = rows.find((r) => r["Topshiriq ID"] === q.id);
  expect(first?.["Natija ID"]).toBe("result-1");
  expect(first?.["Saqlangan javob (JSON)"]).toBe(String(q.correctIndex));
  expect(first?.["Javob matni"]).toBe(q.options[q.correctIndex]);
  expect(first?.["Topshiriq balli"]).toBe("1");
  expect(first?.["Saqlangan umumiy ball"]).toBe("1");
  expect(rows.some((r) => r["Topshiriq ID"] === "_meta")).toBe(false);
});

test("empty answers create no inferred item scores", () => {
  const rows = parseCsv(buildItemExport([row({})], defaultBanks()).csv);
  expect(rows.length).toBe(84);
  expect(rows.every((r) => r["Topshiriq balli"] === "")).toBe(true);
});

test("unknown IDs are preserved without inferred keys or scores", () => {
  const rows = parseCsv(buildItemExport([row({ "missing-id": 0 })], defaultBanks()).csv);
  const unknown = rows.find((r) => r["Topshiriq ID"] === "missing-id");
  expect(unknown?.["Saqlangan javob (JSON)"]).toBe("0");
  expect(unknown?.["Topshiriq balli"]).toBe("");
  expect(unknown?.["To'g'ri javob / mezon"]).toBe("");
});

test("legacy results resolve against v1 rather than the current bank", async () => {
  const v1 = await loadBankV1();
  const q = v1.pisa?.[0];
  if (!q) throw new Error("Bank missing");
  const rows = parseCsv(buildItemExport([row({ [q.id]: q.correctIndex }, "PISA")], { ...defaultBanks(), v1 }).csv);
  expect(rows.length).toBe(150);
  expect(rows[0]["Bank versiyasi"]).toBe("v1");
  expect(rows[0]["Topshiriq"]).toBe(q.q);
});

test("diagnostic written answer, explanation and teacher rubric remain separate", () => {
  const rows = parseCsv(buildItemExport(
    [row({ "DA-1": { j: "0,4 > 0,35", t: "Xona qiymati" } }, "Diagnostik test A · d1")],
    defaultBanks(), new Map([["result-1", { "DA-1": 2 }]]),
  ).csv);
  expect(rows[0]["Javob matni"]).toBe("0,4 > 0,35");
  expect(rows[0]["Yechim / izoh"]).toBe("Xona qiymati");
  expect(rows[0]["Topshiriq balli"]).toBe("2");
  expect(rows[0]["Baholash manbasi"]).toBe("O'qituvchi rubrikasi");
});

test("spreadsheet formulas are neutralized and multiline raw responses round-trip", () => {
  const r = row({ "unknown": '=SUM(1;2)\n"matn"' });
  r.full_name = "=1+1";
  const rows = parseCsv(buildItemExport([r], defaultBanks()).csv);
  expect(rows[0]["F.I.Sh."]).toBe("'=1+1");
  expect(rows.find((r) => r["Topshiriq ID"] === "unknown")?.["Saqlangan javob (JSON)"]).toBe(JSON.stringify('=SUM(1;2)\n"matn"'));
});