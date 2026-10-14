import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MODULE_FIELD_LABEL } from "@/data/modules";
import { FIELD_LABEL, KIND_LABEL, MICRO_CRITERIA, errorById } from "@/data/amaliyot";
import { COMPONENTS, componentPct } from "@/lib/components";
import { LEVELS, levelInfo, levelText } from "@/lib/levels";
import { db, type SubmissionRow, type SubmissionScoreRow } from "@/lib/db";
import type { Attempt } from "@/lib/results";

export const mergeScores = (subs: SubmissionRow[], scores: SubmissionScoreRow[]) => {
  const m = new Map(scores.map((s) => [s.submission_id, s]));
  return subs.map((s) => {
    const sc = m.get(s.id);
    return sc ? { ...s, score: sc.score, criteria: sc.criteria, comment: sc.comment } : s;
  });
};

const COMPONENT_NAME = Object.fromEntries(COMPONENTS.map((c) => [c.key, c.label]));

/** Ish nimaga tegishli ekanini odam o'qiydigan ko'rinishda. */
export const refLabel = (s: SubmissionRow) => {
  if (s.kind === "xato-tahlil") {
    const e = errorById(s.ref);
    return e ? `${e.id}: ${e.topic} (${e.task} = ${e.pupil})` : s.ref;
  }
  if (s.kind === "modul-metodik" || s.kind === "modul-bajarildi")
    return COMPONENT_NAME[s.ref] ? `${COMPONENT_NAME[s.ref]} moduli` : s.ref;
  return s.ref;
};

export function PayloadView({ payload }: { payload: Record<string, unknown> }) {
  return (
    <dl className="space-y-2 text-sm">
      {Object.entries(payload)
        .filter(([k]) => k !== "self")
        .map(([k, v]) => {
          const text = typeof v === "string" ? v : JSON.stringify(v);
          return (
            <div key={k}>
              <dt className="text-xs text-muted-foreground">
                {FIELD_LABEL[k] ?? MODULE_FIELD_LABEL[k] ?? k}
              </dt>
              <dd className="whitespace-pre-line">
                {/^https?:\/\//.test(text) ? (
                  <a
                    href={text}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline break-all"
                  >
                    {text}
                  </a>
                ) : (
                  text || "—"
                )}
              </dd>
            </div>
          );
        })}
    </dl>
  );
}

function WorkCard({
  s,
  name,
  onScore,
}: {
  s: SubmissionRow;
  name: string;
  onScore: (r: SubmissionScoreRow) => void;
}) {
  const [comment, setComment] = useState(s.comment ?? "");
  const [criteria, setCriteria] = useState<Record<string, number>>(s.criteria ?? {});
  const [busy, setBusy] = useState(false);
  const self = (s.payload.self ?? {}) as Record<string, number>;
  const err = s.kind === "xato-tahlil" ? errorById(s.ref) : undefined;

  const save = async (score: number) => {
    setBusy(true);
    const row: SubmissionScoreRow = {
      submission_id: s.id,
      score,
      criteria: s.kind === "microteaching" ? criteria : null,
      comment: comment.trim() || null,
      updated_at: new Date().toISOString(),
    };
    const { error } = await db.from("submission_scores").upsert(row);
    setBusy(false);
    if (error) return toast.error("Saqlanmadi: " + error.message);
    onScore(row);
    toast.success("Baho saqlandi");
  };

  return (
    <article className="p-5 rounded-2xl border bg-card shadow-card" data-sid={s.id}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="text-xs font-semibold text-accent uppercase tracking-wide">
            {KIND_LABEL[s.kind]}
          </div>
          <div className="font-semibold">{refLabel(s)}</div>
          <div className="text-xs text-muted-foreground">
            <span className="font-mono">{s.code}</span> {name && `· ${name}`} ·{" "}
            {s.created_at.slice(0, 10)}
          </div>
        </div>
        {typeof s.score === "number" && (
          <span className="inline-flex items-center gap-1 text-sm text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" /> {s.score} ball
          </span>
        )}
      </div>
      {err && (
        <div className="mt-3 rounded-lg bg-muted p-3 text-xs space-y-1">
          <div>
            <b>Kutilgan diagnoz:</b> {err.diagnosis}
          </div>
          <div>
            <b>Sabab:</b> {err.cause}
          </div>
          <div>
            <b>Keyingi qadam:</b> {err.next}
          </div>
        </div>
      )}
      <div className="mt-3">
        <PayloadView payload={s.payload} />
      </div>
      {s.kind === "microteaching" && (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted">
              <tr className="text-left">
                <th className="px-2 py-1">Mezon</th>
                <th className="px-2 py-1 text-right">Talaba</th>
                <th className="px-2 py-1 text-right">O'qituvchi</th>
              </tr>
            </thead>
            <tbody>
              {MICRO_CRITERIA.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="px-2 py-1">{c.label}</td>
                  <td className="px-2 py-1 text-right">{self[c.id] ?? "—"}</td>
                  <td className="px-2 py-1 text-right">
                    <span className="inline-flex gap-1">
                      {[0, 1, 2].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setCriteria((p) => ({ ...p, [c.id]: v }))}
                          className={`w-6 h-6 rounded border ${criteria[c.id] === v ? "bg-primary text-primary-foreground border-primary" : "hover:border-primary"}`}
                        >
                          {v}
                        </button>
                      ))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <textarea
        rows={2}
        maxLength={2000}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Izoh (talabaning E-portfoliosida ko'rinadi)"
        className="mt-3 w-full px-3 py-2 rounded-lg border bg-background text-sm"
      />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Umumiy baho:</span>
        {[2, 1, 0].map((v) => (
          <Button
            key={v}
            size="sm"
            variant={s.score === v ? "default" : "outline"}
            disabled={busy}
            onClick={() => save(v)}
          >
            {v} ball
          </Button>
        ))}
      </div>
    </article>
  );
}

/** Talabalarning amaliy ishlarini 0–2 ball bilan baholash. */
export function WorkScorer({
  submissions,
  names,
  onScore,
}: {
  submissions: SubmissionRow[];
  names: Record<string, string>;
  onScore: (r: SubmissionScoreRow) => void;
}) {
  const [onlyPending, setOnlyPending] = useState(true);
  const [kind, setKind] = useState<string>("");
  const list = submissions
    .filter((s) => s.kind !== "self-score")
    .filter((s) => !kind || s.kind === kind)
    .filter((s) => !onlyPending || typeof s.score !== "number")
    .slice()
    .reverse();
  const kinds = [...new Set(submissions.filter((s) => s.kind !== "self-score").map((s) => s.kind))];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          className="px-3 py-2 rounded-lg border bg-background"
          aria-label="Ish turi"
        >
          <option value="">Barcha ishlar</option>
          {kinds.map((k) => (
            <option key={k} value={k}>
              {KIND_LABEL[k]}
            </option>
          ))}
        </select>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlyPending}
            onChange={(e) => setOnlyPending(e.target.checked)}
          />
          Faqat baholanmaganlar
        </label>
        <span className="text-muted-foreground">{list.length} ta ish</span>
      </div>
      {list.length ? (
        <div className="grid lg:grid-cols-2 gap-4">
          {list.map((s) => (
            <WorkCard key={s.id} s={s} name={names[s.code] ?? ""} onScore={onScore} />
          ))}
        </div>
      ) : (
        <p className="p-6 text-sm text-muted-foreground">Bu filtr bo'yicha ish yo'q.</p>
      )}
    </div>
  );
}

/** Guruh holati: oxirgi diagnostikada har bir komponent bo'yicha nechta talaba qaysi darajada. */
export function GroupStatus({
  attempts,
  submissions,
}: {
  attempts: Attempt[];
  submissions: SubmissionRow[];
}) {
  const latest = useMemo(() => {
    const m = new Map<string, Attempt>();
    for (const a of [...attempts]
      .filter((x) => x.diag && x.code && x.status !== "sinov")
      .sort((x, y) => (x.completedAt ?? "").localeCompare(y.completedAt ?? "")))
      m.set(a.code, a);
    return [...m.values()];
  }, [attempts]);
  const done = (key: string) =>
    new Set(
      submissions.filter((s) => s.kind === "modul-bajarildi" && s.ref === key).map((s) => s.code),
    ).size;

  return (
    <div className="p-6 rounded-2xl border bg-card shadow-card">
      <h2 className="font-semibold text-lg">Guruh holati: qaysi komponentda orqada qolishmoqda</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Har bir talabaning oxirgi diagnostikasi (kirish, oraliq yoki yakuniy) bo'yicha. Talabalar:{" "}
        {latest.length}. Rubrika bo'yicha baholanmagan topshiriqlarda dastlabki (avtomatik) ball
        olinadi.
      </p>
      {latest.length ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr className="text-left">
                <th className="px-3 py-2">Komponent</th>
                {LEVELS.map((l) => (
                  <th key={l.key} className="px-3 py-2 text-right">
                    {l.short}
                  </th>
                ))}
                <th className="px-3 py-2 text-right">O'rtacha</th>
                <th className="px-3 py-2 text-right">Modulni yakunlagan</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {COMPONENTS.map((c) => {
                const pcts = latest
                  .map((a) => componentPct(a.components[c.key]))
                  .filter(Number.isFinite);
                const avg = pcts.length
                  ? Math.round(pcts.reduce((s, v) => s + v, 0) / pcts.length)
                  : NaN;
                return (
                  <tr key={c.key} className="border-t">
                    <td className="px-3 py-2 font-medium">{c.label}</td>
                    {LEVELS.map((l) => (
                      <td key={l.key} className={`px-3 py-2 text-right ${levelText[l.key]}`}>
                        {pcts.filter((p) => levelInfo(p).key === l.key).length}
                      </td>
                    ))}
                    <td className="px-3 py-2 text-right">
                      {Number.isFinite(avg) ? `${avg}%` : "—"}
                    </td>
                    <td className="px-3 py-2 text-right">{done(c.key)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Hozircha diagnostika natijalari yo'q.</p>
      )}
    </div>
  );
}
