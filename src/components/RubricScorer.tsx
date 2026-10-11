import { useState } from "react";
import { CheckCircle2, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DIAG_BLOCKS, DIAG_FORMS, type DiagItem } from "@/data/diag";
import { asDiagAnswer, autoPoints, scoreDiag } from "@/lib/diagScore";
import { COMPONENT_LABEL } from "@/lib/components";
import { levelInfo, levelText, pctOf } from "@/lib/levels";
import { STAGE_LABEL } from "@/lib/participant";
import { db, type RubricRow } from "@/lib/db";
import type { Attempt } from "@/lib/results";

type Props = {
  attempt: Attempt;
  rubric: RubricRow[];
  onChange: (row: RubricRow) => void;
  onBack: () => void;
};

const itemsOf = (a: Attempt): DiagItem[] => (a.testKey === "diag-b" ? DIAG_FORMS.B : DIAG_FORMS.A);

/** Diagnostik test javoblarini Ilova 5 rubrikasi bo'yicha 0–2 ball bilan baholash. */
export function RubricScorer({ attempt, rubric, onChange, onBack }: Props) {
  const items = itemsOf(attempt);
  const mine = rubric.filter((r) => r.result_id === attempt.id);
  const scores = Object.fromEntries(mine.map((r) => [r.item_id, r.score]));
  const comments = Object.fromEntries(mine.map((r) => [r.item_id, r.comment ?? ""]));
  const [draft, setDraft] = useState<Record<string, string>>(comments);
  const [saving, setSaving] = useState("");
  const res = scoreDiag(items, attempt.answers as Record<string, unknown>, scores);
  const lv = levelInfo(pctOf(res.total, 40));

  const save = async (item: DiagItem, score: number) => {
    setSaving(item.id);
    const row: RubricRow = {
      result_id: attempt.id,
      item_id: item.id,
      score,
      comment: (draft[item.id] ?? "").trim() || null,
      updated_at: new Date().toISOString(),
    };
    const { error } = await db.from("rubric_scores").upsert(row);
    setSaving("");
    if (error) {
      console.error("[rubric_scores]", error);
      toast.error("Ball saqlanmadi: " + error.message);
      return;
    }
    onChange(row);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="sticky bottom-4 z-10 p-4 order-last rounded-2xl border bg-card/95 backdrop-blur shadow-card flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <button
            onClick={onBack}
            className="text-sm text-primary hover:underline inline-flex items-center"
          >
            <ChevronLeft className="w-4 h-4" /> Ro'yxatga qaytish
          </button>
          <div className="font-semibold mt-1">
            {attempt.full_name} · <span className="font-mono">{attempt.code}</span> ·{" "}
            {attempt.testBase} · {STAGE_LABEL[attempt.stage]}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold tabular-nums">
            {res.total} / 40 <span className={`text-base ${levelText[lv.key]}`}>{lv.label}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Baholangan: {res.rubricCount}/20 · avtomatik dastlabki ball: {res.auto}
          </div>
        </div>
      </div>

      {DIAG_BLOCKS.map((b) => (
        <section key={b.n} className="space-y-3">
          <h3 className="font-semibold">
            {b.title}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              · {COMPONENT_LABEL[b.component]}
            </span>
          </h3>
          {items
            .filter((it) => it.block === b.n)
            .map((it) => {
              const a = asDiagAnswer(attempt.answers[it.id]);
              const ap = autoPoints(it, a);
              const cur = scores[it.id];
              return (
                <div
                  key={it.id}
                  className="p-5 rounded-2xl border bg-card shadow-card"
                  data-qid={it.id}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-medium">
                      {it.n}. {it.title}
                    </div>
                    {typeof cur === "number" && (
                      <span className="inline-flex items-center gap-1 text-sm text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> {cur} ball
                      </span>
                    )}
                  </div>
                  <details className="mt-1 text-sm text-muted-foreground">
                    <summary className="cursor-pointer">
                      Topshiriq matni va kutiladigan javob
                    </summary>
                    <p className="mt-2">{it.q}</p>
                    {it.parts && (
                      <ol className="list-decimal pl-5">
                        {it.parts.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ol>
                    )}
                    <p className="mt-2">
                      <b>Kutiladigan javob:</b> {it.expected}
                    </p>
                  </details>
                  <div className="mt-3 p-3 rounded-xl bg-muted text-sm space-y-1">
                    {it.auto && (
                      <div>
                        <span className="text-muted-foreground">Qisqa javob: </span>
                        <b>{a.j || "—"}</b>{" "}
                        <span
                          className={
                            ap
                              ? "text-emerald-700 dark:text-emerald-400"
                              : "text-amber-700 dark:text-amber-400"
                          }
                        >
                          ({ap ? `to'g'ri, avtomatik ${ap} ball` : `kutilgan: ${it.auto.shown}`})
                        </span>
                      </div>
                    )}
                    <div className="whitespace-pre-line">
                      {a.t?.trim() ? (
                        a.t
                      ) : (
                        <span className="text-muted-foreground">Izoh yozilmagan.</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 grid md:grid-cols-3 gap-2">
                    {[2, 1, 0].map((sc, i) => (
                      <button
                        key={sc}
                        disabled={saving === it.id}
                        onClick={() => save(it, sc)}
                        className={`text-left p-3 rounded-xl border text-xs transition ${cur === sc ? "border-primary bg-primary/10 ring-2 ring-primary/20" : "hover:border-primary/40"}`}
                      >
                        <div className="text-sm font-semibold mb-0.5">{sc} ball</div>
                        {it.rubric[i]}
                      </button>
                    ))}
                  </div>
                  <input
                    className="mt-2 w-full px-3 py-2 rounded-lg border bg-background text-sm"
                    placeholder="Izoh (ixtiyoriy, talabaga portfolioda ko'rinadi; ball tugmasini bosganda saqlanadi)"
                    maxLength={1000}
                    value={draft[it.id] ?? ""}
                    onChange={(e) => setDraft((d) => ({ ...d, [it.id]: e.target.value }))}
                    onBlur={() => {
                      if (
                        typeof cur === "number" &&
                        (draft[it.id] ?? "") !== (comments[it.id] ?? "")
                      )
                        void save(it, cur);
                    }}
                  />
                </div>
              );
            })}
        </section>
      ))}
      <Button variant="outline" onClick={onBack}>
        <ChevronLeft className="w-4 h-4 mr-1" /> Ro'yxatga qaytish
      </Button>
    </div>
  );
}
