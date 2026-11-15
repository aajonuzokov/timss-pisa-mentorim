import { exportCell } from "./itemExport";

/** Keep each attempt, including historical rows without a code or consent timestamp. */
export function buildParticipantExport(rows: Record<string, string>[]) {
  const headers = ["Natija ID", "Kod", "Ism", "Test", "Test yuborilgan sana-vaqt (Toshkent, UTC+5)", "Rozilik varag‘i olindi", "Rozilik sana-vaqti (Toshkent, UTC+5)"];
  const lines = rows.map((row) => {
    let meta: Record<string, unknown> = {};
    try {
      const parsed = JSON.parse(row.answers || "{}");
      if (parsed?._meta && typeof parsed._meta === "object" && !Array.isArray(parsed._meta)) meta = parsed._meta;
    } catch { /* Missing evidence stays unknown. */ }
    const accepted = meta.consent === true;
    return [row.id, typeof meta.code === "string" ? meta.code : "", row.full_name, row.test_type,
      tashkentTime(row.completed_at), accepted ? "Ha" : meta.consent === false ? "Yo‘q" : "Ma’lumot yo‘q",
      accepted && typeof meta.consent_at === "string" ? tashkentTime(meta.consent_at) : ""];
  });
  return { csv: "\uFEFF" + [headers, ...lines].map((line) => line.map(exportCell).join(";")).join("\r\n"), count: lines.length };
}

export function tashkentTime(value: string) {
  if (!value || !Number.isFinite(Date.parse(value))) return "";
  return new Date(Date.parse(value) + 5 * 60 * 60 * 1000).toISOString().replace("T", " ").replace("Z", " +05:00");
}