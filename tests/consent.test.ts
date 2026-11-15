import { expect, test } from "bun:test";
import { emptyParticipant, setConsent } from "../src/lib/participant";
import { isParticipantValid } from "../src/components/ParticipantForm";
import { buildParticipantExport } from "../src/lib/participantExport";
import { parseCsv } from "../src/lib/results";

const participant = { ...emptyParticipant(), full_name: "Ali Valiyev", university: "TDPU", course: "2", code: "T-001" };
test("without consent a completed participant cannot submit", () => {
  expect(isParticipantValid(participant)).toBe(false);
  expect(isParticipantValid(setConsent(participant, true))).toBe(true);
});
test("acceptance records its own timestamp, withdrawal clears it", () => {
  const accepted = setConsent(participant, true, "2026-11-15T04:32:00.000Z");
  expect(accepted.consent_at).toBe("2026-11-15T04:32:00.000Z");
  expect(setConsent(accepted, false).consent_at).toBeUndefined();
});
test("export includes Ha and acceptance time, never infers old acceptance time", () => {
  const row = (id: string, meta: unknown) => ({ id, full_name: "Ali", test_type: "PISA", completed_at: "2026-11-15T05:00:00.000Z", answers: JSON.stringify({ _meta: meta }) });
  const result = buildParticipantExport([row("new", { code: "T-001", consent: true, consent_at: "2026-11-15T04:32:00.000Z" }), row("old", { consent: true }), row("unknown", {})]);
  const rows = parseCsv(result.csv);
  expect(result.count).toBe(3);
  expect(rows[0]["Rozilik varag‘i olindi"]).toBe("Ha");
  expect(rows[0]["Rozilik sana-vaqti (Toshkent, UTC+5)"]).toBe("2026-11-15 09:32:00.000 +05:00");
  expect(rows[1]["Rozilik sana-vaqti (Toshkent, UTC+5)"]).toBe("");
  expect(rows[2]["Rozilik varag‘i olindi"]).toBe("Ma’lumot yo‘q");
  expect(rows[2]["Kod"]).toBe("");
});