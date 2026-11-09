import { answerText, isAnswered } from "@/lib/answers";
import { asDiagAnswer, isDiagAnswered, scoreDiag } from "@/lib/diagScore";
import { DIAG_FORMS } from "@/data/diag";
import { buildAttempts, type Bank, type RubricMap } from "@/lib/results";

/** Neutralize spreadsheet formulas while preserving raw responses as JSON. */
export const exportCell = (value: unknown): string => {
  let text = String(value ?? "");
  if (/^[\s]*[=+@-]/.test(text)) text = "'" + text;
  return /[;"\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const ITEM_HEADERS = [
  "Natija ID", "F.I.Sh.", "Universitet", "Kurs", "Test", "Bank versiyasi",
  "Kod", "Bosqich", "Guruh", "Boshlangan", "Yakunlangan", "Saqlangan umumiy ball",
  "Saqlangan maksimal ball", "Saqlangan umumiy foiz", "Topshiriq ID", "Topshiriq",
  "Javob turi", "Saqlangan javob (JSON)", "Tanlangan variant indeksi (0 dan)",
  "Javob matni", "Yechim / izoh", "Javob holati", "To'g'ri javob / mezon",
  "Topshiriq balli", "Maksimal ball", "Baholash manbasi", "Bank bilan moslik",
];

/** One row per attempt/item; unresolved IDs and empty answers are never silently discarded. */
export function buildItemExport(
  rows: Record<string, string>[],
  banks: Record<string, Bank>,
  rubric: RubricMap = new Map(),
) {
  const attempts = new Map(buildAttempts(rows, banks, rubric).attempts.map((a) => [a.id, a]));
  const lines: unknown[][] = [];
  let unresolved = 0;
  for (const row of rows) {
    const a = attempts.get(row.id);
    let raw: Record<string, unknown> = {};
    let valid = true;
    try {
      const parsed: unknown = JSON.parse(row.answers || "{}");
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) valid = false;
      else raw = parsed as Record<string, unknown>;
    } catch { valid = false; }
    const ids = new Set([...(a?.questions.map((q) => q.id) ?? []), ...Object.keys(raw).filter((id) => !id.startsWith("_"))]);
    // Even an unresolved attempt without responses remains visible in the export.
    if (!ids.size) ids.add("");
    const questions = new Map(a?.questions.map((q) => [q.id, q]));
    const diagItems = a?.testKey === "diag-a" ? DIAG_FORMS.A : a?.testKey === "diag-b" ? DIAG_FORMS.B : undefined;
    const diagScores = diagItems ? scoreDiag(diagItems, raw, rubric.get(row.id)) : undefined;
    for (const id of ids) {
      const q = questions.get(id);
      const value = raw[id];
      const diagnostic = !!diagItems;
      const da = asDiagAnswer(value);
      const answered = diagnostic ? isDiagAnswered(value) : (typeof value === "string" || typeof value === "number") && isAnswered(value);
      const choice = !!q && !diagnostic && !q.answer;
      const validChoice = choice && typeof value === "number" && Number.isInteger(value) && value >= 0 && value < q.options.length;
      const matched = !!q && valid && (!answered || !choice || validChoice);
      const ds = diagScores?.byItem[id];
      const scored = matched && (answered || ds?.source === "rubric");
      const points = scored ? (ds?.points ?? a?.itemPoints[id] ?? "") : "";
      if (!matched) unresolved++;
      lines.push([
        row.id, row.full_name, row.university, row.course, row.test_type, a?.version ?? "",
        a?.code ?? "", a?.stage ?? "", a?.group ?? "", row.started_at, row.completed_at,
        row.score, row.total_questions, row.percentage, id, q?.q ?? "",
        diagnostic ? "Diagnostik ochiq javob" : q?.answer ? "Ochiq javob" : q ? "Variantli" : "Noma'lum",
        value === undefined ? "" : JSON.stringify(value), validChoice ? value : "",
        diagnostic ? da.j ?? "" : validChoice ? q.options[value as number] : typeof value === "string" ? value : "",
        diagnostic ? da.t ?? "" : "", !valid ? "Javoblar formati noto'g'ri" : answered ? "Javob berilgan" : "Javob saqlanmagan",
        q ? diagnostic ? q.explain : answerText(q) : "", points, q ? a?.itemMax ?? "" : "",
        scored ? diagnostic ? ds?.source === "rubric" ? "O'qituvchi rubrikasi" : "Avtomatik dastlabki" : "Avtomatik" : "Hisoblanmagan",
        matched ? "Mos" : "Tekshirish kerak",
      ]);
    }
  }
  return {
    csv: "\uFEFF" + [ITEM_HEADERS, ...lines].map((line) => line.map(exportCell).join(";")).join("\r\n"),
    count: lines.length,
    unresolved,
  };
}

export function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}