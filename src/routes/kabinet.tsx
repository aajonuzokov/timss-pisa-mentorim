import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LogIn,
  LogOut,
  RefreshCw,
  ClipboardCheck,
  Users,
  KeyRound,
  NotebookPen,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { RubricScorer } from "@/components/RubricScorer";
import { GroupStatus, WorkScorer, mergeScores } from "@/components/TeacherWork";
import { PortfolioView, type PortfolioData } from "@/components/PortfolioView";
import { STAGE_LABEL, GROUP_LABEL } from "@/lib/participant";
import { buildAttempts, defaultBanks, type Attempt } from "@/lib/results";
import {
  db,
  rowToRecord,
  rubricMapOf,
  type FeedbackRow,
  type ReflectionRow,
  type ResultRow,
  type RubricRow,
  type SubmissionRow,
  type SubmissionScoreRow,
} from "@/lib/db";
import { fetchAll, loadResults, loadRubric, useTeacher } from "@/lib/teacher";
import { levelInfo, levelText } from "@/lib/levels";

export const Route = createFileRoute("/kabinet")({
  head: () => ({
    meta: [
      { title: "O'qituvchi kabineti — TIMSS/PISA Platformasi" },
      {
        name: "description",
        content:
          "O'qituvchi uchun: diagnostik test javoblarini rubrika bo'yicha baholash, ishtirokchilar E-portfoliosi, izoh va tavsiyalar.",
      },
    ],
  }),
  component: Page,
});

type Data = {
  results: ResultRow[];
  rubric: RubricRow[];
  feedback: FeedbackRow[];
  reflections: ReflectionRow[];
  pins: { code: string; locked_until: string | null }[];
  submissions: SubmissionRow[];
};

const codeOf = (r: ResultRow) => {
  const m = (r.answers as Record<string, { code?: string }> | null)?._meta;
  return typeof m?.code === "string" ? m.code : "";
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"in" | "up">("in");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } =
      mode === "in"
        ? await db.auth.signInWithPassword({ email: email.trim(), password })
        : await db.auth.signUp({ email: email.trim(), password });
    setBusy(false);
    if (error) return toast.error(error.message);
    if (mode === "up")
      toast.success(
        "Hisob yaratildi. Agar tasdiqlash xati kelsa, havolani bosing; so'ng administrator sizni o'qituvchilar ro'yxatiga qo'shadi.",
      );
  };

  return (
    <form
      onSubmit={submit}
      className="max-w-md p-6 rounded-2xl border bg-card shadow-card space-y-4"
    >
      <h2 className="font-semibold text-lg flex items-center gap-2">
        <LogIn className="w-5 h-5 text-primary" />
        {mode === "in" ? "O'qituvchi sifatida kirish" : "Yangi hisob yaratish"}
      </h2>
      <input
        type="email"
        required
        autoComplete="email"
        placeholder="Email"
        aria-label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg border bg-background"
      />
      <input
        type="password"
        required
        minLength={8}
        autoComplete={mode === "in" ? "current-password" : "new-password"}
        placeholder="Parol (kamida 8 belgi)"
        aria-label="Parol"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg border bg-background"
      />
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={busy}>
          {mode === "in" ? "Kirish" : "Ro'yxatdan o'tish"}
        </Button>
        <button
          type="button"
          className="text-sm text-primary hover:underline"
          onClick={() => setMode(mode === "in" ? "up" : "in")}
        >
          {mode === "in" ? "Hisobim yo'q" : "Hisobim bor"}
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        Natijalarni faqat o'qituvchilar ro'yxatiga kiritilgan hisob ko'radi. Ro'yxatdan o'tgach,
        administrator hisobingizni ro'yxatga qo'shadi (O'quv qo'llanma, 3-bo'lim).
      </p>
    </form>
  );
}

function Page() {
  const teacher = useTeacher();
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"baholash" | "ishlar" | "guruh" | "portfolio">("baholash");
  const [scoring, setScoring] = useState<string>("");
  const [onlyPending, setOnlyPending] = useState(true);
  const [selCode, setSelCode] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [results, rubric, feedback, reflections, pins, subs, scores] = await Promise.all([
        loadResults(),
        loadRubric(),
        fetchAll<FeedbackRow>("teacher_feedback", "created_at"),
        fetchAll<ReflectionRow>("portfolio_reflections", "created_at"),
        fetchAll<{ code: string; locked_until: string | null }>("portfolio_pins", "created_at"),
        fetchAll<SubmissionRow>("portfolio_submissions", "created_at"),
        fetchAll<SubmissionScoreRow>("submission_scores", "updated_at"),
      ]);
      setData({
        results,
        rubric,
        feedback,
        reflections,
        pins,
        submissions: mergeScores(subs, scores),
      });
    } catch (e) {
      toast.error(
        e instanceof Error
          ? `Ma'lumot yuklanmadi: ${e.message}. Ma'lumotlar bazasi migratsiyasi qo'llanganini tekshiring.`
          : "Ma'lumot yuklanmadi.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (teacher.isTeacher) void load();
  }, [teacher.isTeacher, load]);

  const attempts = useMemo(
    () =>
      data
        ? buildAttempts(data.results.map(rowToRecord), defaultBanks(), rubricMapOf(data.rubric))
            .attempts
        : [],
    [data],
  );
  const diagAttempts = attempts.filter((a) => a.diag && a.status !== "sinov");
  const shownDiag = diagAttempts.filter(
    (a) => !onlyPending || (a.diag?.rubricCount ?? 0) < a.nItems,
  );
  const codes = useMemo(() => {
    const m = new Map<string, Attempt[]>();
    for (const a of attempts)
      if (a.code && a.status !== "sinov") m.set(a.code, [...(m.get(a.code) ?? []), a]);
    return [...m.entries()].sort((x, y) => x[0].localeCompare(y[0]));
  }, [attempts]);
  const names = useMemo(
    () => Object.fromEntries(codes.map(([c, list]) => [c, list.at(-1)?.full_name ?? ""])),
    [codes],
  );

  const upsertRubric = (row: RubricRow) =>
    setData((d) =>
      d
        ? {
            ...d,
            rubric: [
              ...d.rubric.filter(
                (r) => !(r.result_id === row.result_id && r.item_id === row.item_id),
              ),
              row,
            ],
          }
        : d,
    );

  if (teacher.loading)
    return (
      <SiteLayout>
        <div className="max-w-5xl mx-auto px-6 py-16 text-muted-foreground">Yuklanmoqda…</div>
      </SiteLayout>
    );

  const current = attempts.find((a) => a.id === scoring);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="O'qituvchi"
        title="O'qituvchi kabineti"
        description="Diagnostik test javoblarini Ilova 5 rubrikasi bo'yicha baholash, ishtirokchilar E-portfoliosi, izoh va individual tavsiyalar. Natijalarning to'liq tahlili — Monitoring sahifasida."
      />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {!teacher.session ? (
          <Login />
        ) : !teacher.isTeacher ? (
          <div className="max-w-2xl p-6 rounded-2xl border bg-card shadow-card space-y-3 text-sm">
            <h2 className="font-semibold text-lg">Hisob o'qituvchilar ro'yxatida yo'q</h2>
            <p>
              Siz <b>{teacher.session.user.email}</b> sifatida kirdingiz, lekin bu hisob hali
              o'qituvchilar ro'yxatiga qo'shilmagan. Administrator Lovable Cloud → Database → SQL
              bo'limida quyidagini bajarsin:
            </p>
            <pre className="p-3 rounded-lg bg-muted overflow-x-auto text-xs">
              {`INSERT INTO public.teachers (user_id, email)\nVALUES ('${teacher.session.user.id}', '${teacher.session.user.email}');`}
            </pre>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => teacher.refresh()}>
                <RefreshCw className="w-4 h-4 mr-2" /> Qayta tekshirish
              </Button>
              <Button variant="outline" onClick={() => teacher.signOut()}>
                <LogOut className="w-4 h-4 mr-2" /> Chiqish
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2 print:hidden">
              <Button
                variant={tab === "baholash" ? "default" : "outline"}
                onClick={() => setTab("baholash")}
              >
                <ClipboardCheck className="w-4 h-4 mr-2" /> Rubrika bo'yicha baholash
              </Button>
              <Button
                variant={tab === "ishlar" ? "default" : "outline"}
                onClick={() => setTab("ishlar")}
              >
                <NotebookPen className="w-4 h-4 mr-2" /> Amaliy ishlar
              </Button>
              <Button
                variant={tab === "guruh" ? "default" : "outline"}
                onClick={() => setTab("guruh")}
              >
                <BarChart3 className="w-4 h-4 mr-2" /> Guruh holati
              </Button>
              <Button
                variant={tab === "portfolio" ? "default" : "outline"}
                onClick={() => setTab("portfolio")}
              >
                <Users className="w-4 h-4 mr-2" /> Ishtirokchilar (E-portfolio)
              </Button>
              <Link to="/monitoring" className="text-sm text-primary hover:underline ml-2">
                Monitoring va statistik tahlil →
              </Link>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{teacher.session.user.email}</span>
                <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                  <RefreshCw className="w-4 h-4 mr-1" /> Yangilash
                </Button>
                <Button variant="outline" size="sm" onClick={() => teacher.signOut()}>
                  <LogOut className="w-4 h-4 mr-1" /> Chiqish
                </Button>
              </div>
            </div>

            {!data ? (
              <p className="text-muted-foreground">{loading ? "Ma'lumotlar yuklanmoqda…" : ""}</p>
            ) : tab === "ishlar" ? (
              <WorkScorer
                submissions={data.submissions}
                names={names}
                onScore={(row) =>
                  setData((d) =>
                    d
                      ? {
                          ...d,
                          submissions: d.submissions.map((s) =>
                            s.id === row.submission_id
                              ? {
                                  ...s,
                                  score: row.score,
                                  criteria: row.criteria,
                                  comment: row.comment,
                                }
                              : s,
                          ),
                        }
                      : d,
                  )
                }
              />
            ) : tab === "guruh" ? (
              <GroupStatus attempts={attempts} submissions={data.submissions} />
            ) : tab === "baholash" ? (
              current ? (
                <RubricScorer
                  attempt={current}
                  rubric={data.rubric}
                  onChange={upsertRubric}
                  onBack={() => setScoring("")}
                />
              ) : (
                <div className="p-6 rounded-2xl border bg-card shadow-card">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h2 className="font-semibold text-lg">Diagnostik test javoblari</h2>
                    <label className="text-sm inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={onlyPending}
                        onChange={(e) => setOnlyPending(e.target.checked)}
                      />
                      Faqat to'liq baholanmaganlar
                    </label>
                  </div>
                  {!shownDiag.length ? (
                    <p className="mt-4 text-sm text-muted-foreground">
                      {diagAttempts.length
                        ? "Barcha javoblar baholangan."
                        : "Hozircha diagnostik test topshirilmagan."}
                    </p>
                  ) : (
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr className="text-left">
                            <th className="px-3 py-2">Ishtirokchi</th>
                            <th className="px-3 py-2">Kod</th>
                            <th className="px-3 py-2">Test</th>
                            <th className="px-3 py-2">Bosqich / guruh</th>
                            <th className="px-3 py-2">Sana</th>
                            <th className="px-3 py-2 text-right">Baholangan</th>
                            <th className="px-3 py-2 text-right">Ball</th>
                            <th className="px-3 py-2" />
                          </tr>
                        </thead>
                        <tbody>
                          {shownDiag.map((a) => (
                            <tr key={a.id} className="border-t">
                              <td className="px-3 py-2 font-medium">
                                {a.full_name}
                                {!a.counted && (
                                  <div className="text-xs text-muted-foreground">
                                    qayta topshirish
                                  </div>
                                )}
                              </td>
                              <td className="px-3 py-2 font-mono text-xs">{a.code}</td>
                              <td className="px-3 py-2">{a.testBase}</td>
                              <td className="px-3 py-2">
                                {STAGE_LABEL[a.stage].split(" (")[0]}
                                {a.group && (
                                  <div className="text-xs text-muted-foreground">
                                    {GROUP_LABEL[a.group]}
                                  </div>
                                )}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap">
                                {(a.completedAt ?? "").slice(0, 10)}
                              </td>
                              <td className="px-3 py-2 text-right tabular-nums">
                                {a.diag?.rubricCount}/{a.nItems}
                              </td>
                              <td
                                className={`px-3 py-2 text-right tabular-nums font-medium ${levelText[levelInfo(a.pct).key]}`}
                              >
                                {a.correct}/{a.total}
                              </td>
                              <td className="px-3 py-2 text-right">
                                <Button size="sm" onClick={() => setScoring(a.id)}>
                                  Baholash
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="grid lg:grid-cols-[260px_1fr] gap-6">
                <div className="p-4 rounded-2xl border bg-card shadow-card h-fit max-h-[70vh] overflow-y-auto">
                  <div className="text-xs text-muted-foreground mb-2">
                    Ishtirokchilar: {codes.length}
                  </div>
                  <ul className="space-y-1 text-sm">
                    {codes.map(([c, list]) => (
                      <li key={c}>
                        <button
                          onClick={() => setSelCode(c)}
                          className={`w-full text-left px-3 py-2 rounded-lg ${selCode === c ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                        >
                          <span className="font-mono text-xs">{c}</span>
                          <div className="truncate">{list.at(-1)?.full_name}</div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-6">
                  {selCode ? (
                    <ParticipantPanel
                      key={selCode}
                      code={selCode}
                      data={data}
                      attempts={codes.find(([c]) => c === selCode)?.[1] ?? []}
                      onFeedback={(f) =>
                        setData((d) => (d ? { ...d, feedback: [...d.feedback, f] } : d))
                      }
                      onPinReset={() =>
                        setData((d) =>
                          d ? { ...d, pins: d.pins.filter((p) => p.code !== selCode) } : d,
                        )
                      }
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground p-6">
                      Chapdan ishtirokchini tanlang.
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </SiteLayout>
  );
}

function ParticipantPanel({
  code,
  data,
  attempts,
  onFeedback,
  onPinReset,
}: {
  code: string;
  data: Data;
  attempts: Attempt[];
  onFeedback: (f: FeedbackRow) => void;
  onPinReset: () => void;
}) {
  const [comment, setComment] = useState("");
  const [recs, setRecs] = useState("");
  const [resultId, setResultId] = useState("");
  const [busy, setBusy] = useState(false);
  const ids = new Set(attempts.map((a) => a.id));
  const pData: PortfolioData = {
    results: data.results.filter((r) => codeOf(r) === code),
    rubric: data.rubric.filter((r) => ids.has(r.result_id)),
    reflections: data.reflections.filter((r) => r.code === code),
    feedback: data.feedback.filter((f) => f.code === code),
    submissions: data.submissions.filter((s) => s.code === code),
  };
  const hasPin = data.pins.some((p) => p.code === code);

  const send = async () => {
    if (comment.trim().length < 2) return toast.error("Izoh yozing.");
    setBusy(true);
    const { data: row, error } = await db
      .from("teacher_feedback")
      .insert({
        code,
        result_id: resultId || null,
        comment: comment.trim(),
        recommendations: recs.trim(),
      })
      .select()
      .single();
    setBusy(false);
    if (error) return toast.error("Saqlanmadi: " + error.message);
    onFeedback(row as FeedbackRow);
    setComment("");
    setRecs("");
    toast.success("Izoh portfolioga qo'shildi");
  };

  const resetPin = async () => {
    if (
      !window.confirm(
        `${code} kodining PIN kodi bekor qilinsinmi? Talaba keyingi kirishda yangi PIN o'rnatadi.`,
      )
    )
      return;
    const { error } = await db.from("portfolio_pins").delete().eq("code", code);
    if (error) return toast.error(error.message);
    onPinReset();
    toast.success("PIN bekor qilindi");
  };

  return (
    <>
      <div className="p-6 rounded-2xl border bg-card shadow-card space-y-3">
        <h3 className="font-semibold text-lg">Izoh va individual tavsiya yozish</h3>
        <select
          value={resultId}
          onChange={(e) => setResultId(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
          aria-label="Natija"
        >
          <option value="">Umumiy izoh (muayyan testga bog'lanmagan)</option>
          {attempts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.testBase} · {(a.completedAt ?? "").slice(0, 10)} · {a.correct}/{a.total}
            </option>
          ))}
        </select>
        <textarea
          rows={3}
          maxLength={3000}
          placeholder="Izoh: natija, kuchli tomonlar, e'tibor berish kerak bo'lgan jihatlar"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
        />
        <textarea
          rows={3}
          maxLength={3000}
          placeholder="Individual tavsiyalar: keyingi qadamlar, materiallar, topshiriqlar"
          value={recs}
          onChange={(e) => setRecs(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={send} disabled={busy}>
            Portfolioga qo'shish
          </Button>
          {hasPin && (
            <Button variant="outline" onClick={resetPin}>
              <KeyRound className="w-4 h-4 mr-2" /> PINni bekor qilish
            </Button>
          )}
          {!hasPin && (
            <span className="text-xs text-muted-foreground">
              Talaba portfolioga hali kirmagan (PIN o'rnatilmagan).
            </span>
          )}
        </div>
      </div>
      <PortfolioView code={code} data={pData} />
    </>
  );
}
