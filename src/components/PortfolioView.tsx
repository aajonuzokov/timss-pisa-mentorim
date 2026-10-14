import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  History,
  LineChart,
  NotebookPen,
  MessageSquareText,
  Lightbulb,
  Route as RouteIcon,
  CheckCircle2,
  Briefcase,
} from "lucide-react";
import { buildPath, PLAN_LABEL } from "@/lib/path";
import { KIND_LABEL } from "@/data/amaliyot";
import { PayloadView, refLabel } from "@/components/TeacherWork";
import { ComponentProfile, LevelLegend } from "@/components/DiagnosticReport";
import { TEST_TYPES } from "@/data/bank";
import { COMPONENTS, componentPct, type ComponentKey } from "@/lib/components";
import { levelInfo, levelText, WEAK_MAX } from "@/lib/levels";
import { STAGE_LABEL } from "@/lib/participant";
import { buildAttempts, defaultBanks, type Attempt } from "@/lib/results";
import {
  rowToRecord,
  rubricMapOf,
  type FeedbackRow,
  type ReflectionRow,
  type ResultRow,
  type RubricRow,
  type SubmissionRow,
} from "@/lib/db";

export type PortfolioData = {
  results: ResultRow[];
  rubric: RubricRow[];
  reflections: ReflectionRow[];
  feedback: FeedbackRow[];
  submissions: SubmissionRow[];
};

const TAVSIYA: Record<ComponentKey, { slug: string; title: string }> = {
  bilim: { slug: "knowing", title: "Knowing — matematik bilim" },
  tafakkur: { slug: "reasoning", title: "Reasoning — mulohaza yuritish" },
  metodik: { slug: "mkt", title: "Mathematical Knowledge for Teaching (MKT)" },
  savodxonlik: { slug: "formulate", title: "Formulate — vaziyatni modellashtirish" },
  refleksiya: { slug: "interpret", title: "Interpret — natijani talqin qilish" },
};

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso?.slice(0, 10) ?? "";
  const two = (n: number) => String(n).padStart(2, "0");
  return `${two(d.getDate())}.${two(d.getMonth() + 1)}.${d.getFullYear()}`;
};

const testName = (a: Attempt) => TEST_TYPES[a.testKey] ?? a.testBase;

export const buildPortfolio = (data: PortfolioData) =>
  buildAttempts(data.results.map(rowToRecord), defaultBanks(), rubricMapOf(data.rubric))
    .attempts.filter((a) => a.status !== "sinov")
    .sort((x, y) => (x.completedAt ?? "").localeCompare(y.completedAt ?? ""));

/** Ishtirokchining E-portfoliosi: natijalar tarixi, komponentlar dinamikasi, refleksiya va izohlar. */
export function PortfolioView({ code, data }: { code: string; data: PortfolioData }) {
  const attempts = useMemo(() => buildPortfolio(data), [data]);
  const name = attempts.at(-1)?.full_name ?? "";
  const withComp = attempts.filter((a) => Object.keys(a.components).length);
  const latest = withComp.at(-1);
  const latestDiag = [...attempts].reverse().find((a) => a.diag);
  const path = buildPath(attempts, data.submissions);
  const works = data.submissions.filter((x) => x.kind !== "self-score");
  const selfScores = latestDiag
    ? ((data.submissions.find((x) => x.kind === "self-score" && x.ref === latestDiag.id)?.payload
        .scores ?? null) as Record<string, number> | null)
    : null;
  const selfAcc = (() => {
    if (!selfScores || !latestDiag) return null;
    const diffs = data.rubric
      .filter((r) => r.result_id === latestDiag.id && typeof selfScores[r.item_id] === "number")
      .map((r) => Math.abs(selfScores[r.item_id] - r.score));
    return diffs.length ? diffs.reduce((a, b) => a + b, 0) / diffs.length : null;
  })();
  const weak = latest
    ? COMPONENTS.filter((c) => {
        const v = componentPct(latest.components[c.key]);
        return Number.isFinite(v) && v <= WEAK_MAX;
      })
    : [];
  const resultLabel = (id: string | null) => {
    const a = attempts.find((x) => x.id === id);
    return a ? `${testName(a)}, ${fmtDate(a.completedAt)}` : "";
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl border bg-card shadow-card">
        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          E-portfolio · Kod <span className="font-mono">{code}</span>
        </div>
        <div className="mt-1 text-2xl font-display font-bold">{name || "Ishtirokchi"}</div>
        <div className="mt-3 grid sm:grid-cols-3 gap-3 text-sm">
          <div className="p-4 rounded-xl border">
            <div className="text-muted-foreground">Topshirilgan testlar</div>
            <div className="text-2xl font-bold tabular-nums">{attempts.length}</div>
          </div>
          <div className="p-4 rounded-xl border">
            <div className="text-muted-foreground">Diagnostik test (oxirgi)</div>
            {latestDiag ? (
              <>
                <div className="text-2xl font-bold tabular-nums">
                  {latestDiag.correct} / {latestDiag.total}{" "}
                  <span className={`text-base ${levelText[levelInfo(latestDiag.pct).key]}`}>
                    {levelInfo(latestDiag.pct).short}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {latestDiag.diag!.rubricCount < latestDiag.nItems
                    ? `O'qituvchi baholagan: ${latestDiag.diag!.rubricCount}/${latestDiag.nItems} topshiriq (qolganlari — avtomatik dastlabki ball)`
                    : "O'qituvchi rubrika bo'yicha to'liq baholagan"}
                </div>
              </>
            ) : (
              <div className="text-muted-foreground mt-1">Hali topshirilmagan</div>
            )}
          </div>
          <div className="p-4 rounded-xl border">
            <div className="text-muted-foreground">Refleksiya / o'qituvchi izohi</div>
            <div className="text-2xl font-bold tabular-nums">
              {data.reflections.length} / {data.feedback.length}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-primary/30 bg-primary/5 shadow-card">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <RouteIcon className="w-5 h-5 text-primary" /> Mening yo'lim
        </h3>
        {path ? (
          <>
            <p className="text-sm text-muted-foreground mt-1">
              {testName(path.basis)} ({fmtDate(path.basis.completedAt)}) natijasi asosida. Eng past
              komponentdan boshlang.
              {path.provisional &&
                " O'qituvchi hali barcha topshiriqlarni baholamagan: yo'l dastlabki ball asosida tuzilgan va baholashdan keyin o'zgarishi mumkin."}
            </p>
            <ol className="mt-4 space-y-2">
              {path.steps.map((st, i) => (
                <li
                  key={st.key}
                  className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-3"
                >
                  <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">
                      {st.label}{" "}
                      <span className={`text-sm ${levelText[st.level]}`}>
                        {st.pct}% · {levelInfo(st.pct).short}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">{PLAN_LABEL[st.plan]}</div>
                  </div>
                  {st.done ? (
                    <span className="inline-flex items-center gap-1 text-sm text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Bajarildi
                    </span>
                  ) : (
                    <Link
                      to="/modullar/$slug"
                      params={{ slug: st.key }}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Modulni ochish →
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </>
        ) : (
          <p className="text-sm text-muted-foreground mt-1">
            Yo'l kirish diagnostikasidan keyin tuziladi.{" "}
            <Link to="/sinov" className="text-primary hover:underline">
              Diagnostik testni topshiring
            </Link>
            .
          </p>
        )}
      </div>

      {latest && (
        <div className="p-6 rounded-2xl border bg-card shadow-card">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <LineChart className="w-5 h-5 text-primary" /> Komponentlar dinamikasi
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Har bir test bo'yicha 5 komponentning foizdagi natijasi (vaqt bo'yicha chapdan o'ngga).
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr className="text-left">
                  <th className="px-3 py-2">Komponent</th>
                  {withComp.map((a) => (
                    <th key={a.id} className="px-3 py-2 text-right whitespace-nowrap">
                      {testName(a)}
                      <div className="text-xs font-normal text-muted-foreground">
                        {fmtDate(a.completedAt)}
                        {a.stage !== "mashq" && ` · ${a.stage === "kirish" ? "kirish" : "yakuniy"}`}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {COMPONENTS.map((c) => (
                  <tr key={c.key} className="border-t">
                    <td className="px-3 py-2 font-medium">{c.label}</td>
                    {withComp.map((a) => {
                      const v = componentPct(a.components[c.key]);
                      return (
                        <td
                          key={a.id}
                          className={`px-3 py-2 text-right ${Number.isFinite(v) ? levelText[levelInfo(v).key] : "text-muted-foreground"}`}
                        >
                          {Number.isFinite(v) ? `${v}%` : "—"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <h4 className="font-medium mb-3">
              Oxirgi natija: {testName(latest)}, {fmtDate(latest.completedAt)}
            </h4>
            <ComponentProfile
              scores={latest.components}
              unit={latest.diag ? "to'plangan ball" : "to'g'ri javoblar"}
            />
            <div className="mt-3">
              <LevelLegend points={!!latest.diag} />
            </div>
          </div>
        </div>
      )}

      <div className="p-6 rounded-2xl border bg-card shadow-card">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" /> Individual tavsiyalar
        </h3>
        {data.feedback.some((f) => f.recommendations.trim()) && (
          <ul className="mt-3 space-y-2 text-sm">
            {data.feedback
              .filter((f) => f.recommendations.trim())
              .map((f) => (
                <li key={f.id} className="p-3 rounded-xl border border-primary/30 bg-primary/5">
                  <div className="text-xs text-muted-foreground mb-1">
                    O'qituvchi tavsiyasi · {fmtDate(f.created_at)}
                  </div>
                  <div className="whitespace-pre-line">{f.recommendations}</div>
                </li>
              ))}
          </ul>
        )}
        {weak.length ? (
          <ul className="mt-3 space-y-3 text-sm">
            {weak.map((c) => (
              <li key={c.key}>
                <div className="font-medium">{c.label}</div>
                <p className="text-muted-foreground">{c.tip}</p>
                <Link
                  to="/tavsiyalar/$slug"
                  params={{ slug: TAVSIYA[c.key].slug }}
                  className="text-primary hover:underline"
                >
                  Metodik tavsiya: {TAVSIYA[c.key].title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            {latest
              ? "Oxirgi natijada past darajadagi komponent yo'q. Keyingi qadam: o'rta darajadagi komponentlar bo'yicha topshiriqlarni o'quvchiga tushuntirishni rejalashtiring."
              : "Tavsiyalar birinchi testdan keyin chiqadi."}
          </p>
        )}
      </div>

      <div className="p-6 rounded-2xl border bg-card shadow-card">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <History className="w-5 h-5 text-primary" /> Natijalar tarixi
        </h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr className="text-left">
                <th className="px-3 py-2">Sana</th>
                <th className="px-3 py-2">Test</th>
                <th className="px-3 py-2">Bosqich</th>
                <th className="px-3 py-2 text-right">Natija</th>
                <th className="px-3 py-2">Daraja</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((a) => {
                const lv = levelInfo(a.pct);
                return (
                  <tr key={a.id} className="border-t">
                    <td className="px-3 py-2 whitespace-nowrap">{fmtDate(a.completedAt)}</td>
                    <td className="px-3 py-2">{testName(a)}</td>
                    <td className="px-3 py-2">{STAGE_LABEL[a.stage]}</td>
                    <td className="px-3 py-2 text-right tabular-nums whitespace-nowrap">
                      {a.correct}/{a.total} {a.diag ? "ball" : ""} ({a.pct}%)
                    </td>
                    <td className={`px-3 py-2 font-medium ${levelText[lv.key]}`}>
                      {lv.short}
                      {a.diag && a.diag.rubricCount < a.nItems && (
                        <span className="text-xs text-muted-foreground font-normal">
                          {" "}
                          (dastlabki)
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border bg-card shadow-card">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <NotebookPen className="w-5 h-5 text-primary" /> Refleksiyalarim
          </h3>
          {data.reflections.length ? (
            <ul className="mt-3 space-y-3 text-sm">
              {data.reflections.map((r) => (
                <li key={r.id} className="border-b pb-3 last:border-0">
                  <div className="text-xs text-muted-foreground">
                    {r.test_type} · {fmtDate(r.created_at)}
                  </div>
                  <div className="mt-1">
                    <span className="font-medium">Qiyin bo'ldi: </span>
                    {r.difficulty}
                  </div>
                  <div>
                    <span className="font-medium">Keyingi qadam: </span>
                    {r.next_step}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Refleksiya har bir test natijasi chiqqandan keyin yoziladi.
            </p>
          )}
        </div>
        <div className="p-6 rounded-2xl border bg-card shadow-card">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <MessageSquareText className="w-5 h-5 text-primary" /> O'qituvchi izohlari
          </h3>
          {data.feedback.length ? (
            <ul className="mt-3 space-y-3 text-sm">
              {data.feedback.map((f) => (
                <li key={f.id} className="border-b pb-3 last:border-0">
                  <div className="text-xs text-muted-foreground">
                    {fmtDate(f.created_at)}
                    {f.result_id && resultLabel(f.result_id) && ` · ${resultLabel(f.result_id)}`}
                  </div>
                  <div className="mt-1 whitespace-pre-line">{f.comment}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">Hozircha izoh yo'q.</p>
          )}
        </div>
      </div>

      {works.length > 0 && (
        <div className="p-6 rounded-2xl border bg-card shadow-card">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" /> Ishlarim
          </h3>
          <ul className="mt-3 space-y-3">
            {works
              .slice()
              .reverse()
              .map((w) => (
                <li key={w.id}>
                  <details className="rounded-xl border p-3">
                    <summary className="cursor-pointer text-sm">
                      <span className="font-medium">{KIND_LABEL[w.kind]}</span> · {refLabel(w)} ·{" "}
                      {fmtDate(w.created_at)}
                      {typeof w.score === "number" ? (
                        <span className="ml-2 text-emerald-700 dark:text-emerald-400">
                          {w.score}/2 ball
                        </span>
                      ) : (
                        <span className="ml-2 text-muted-foreground">baholanmagan</span>
                      )}
                    </summary>
                    <div className="mt-3">
                      <PayloadView payload={w.payload} />
                      {w.comment && (
                        <p className="mt-3 rounded-lg bg-primary/5 p-3 text-sm">
                          <b>O'qituvchi izohi:</b> {w.comment}
                        </p>
                      )}
                    </div>
                  </details>
                </li>
              ))}
          </ul>
        </div>
      )}

      {latestDiag && (
        <div className="p-6 rounded-2xl border bg-card shadow-card">
          <h3 className="font-semibold text-lg">
            {testName(latestDiag)}: topshiriqlar bo'yicha baho
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {fmtDate(latestDiag.completedAt)}. Har bir topshiriq 0–2 ball (Ilova 5 rubrikasi).
            {selfAcc !== null &&
              ` O'z-o'zini baholash aniqligi: o'rtacha farq ${selfAcc.toFixed(2).replace(".", ",")} ball (0 — to'liq mos).`}
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr className="text-left">
                  <th className="px-3 py-2">Topshiriq</th>
                  <th className="px-3 py-2 text-right">Ball</th>
                  {selfScores && <th className="px-3 py-2 text-right">O'zim</th>}
                  <th className="px-3 py-2">Izoh</th>
                </tr>
              </thead>
              <tbody>
                {latestDiag.questions.map((q, i) => {
                  const r = data.rubric.find(
                    (x) => x.result_id === latestDiag.id && x.item_id === q.id,
                  );
                  return (
                    <tr key={q.id} className="border-t">
                      <td className="px-3 py-2">
                        {i + 1}. {q.title}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums whitespace-nowrap">
                        {latestDiag.itemPoints[q.id] ?? 0}/2
                        {!r && <span className="text-xs text-muted-foreground"> (avto)</span>}
                      </td>
                      {selfScores && (
                        <td className="px-3 py-2 text-right tabular-nums">
                          {selfScores[q.id] ?? "—"}
                        </td>
                      )}
                      <td className="px-3 py-2 text-muted-foreground">{r?.comment ?? ""}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
