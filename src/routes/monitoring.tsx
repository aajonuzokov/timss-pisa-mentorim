import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Upload,
  Download,
  ShieldCheck,
  Users,
  ListChecks,
  Gauge,
  FilterX,
  DatabaseZap,
} from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Bars, ComponentProfile, LevelLegend } from "@/components/DiagnosticReport";
import { TEST_TYPES, isDiag, isPisa, topicLabel, PROCESS_LABEL, type TestKey } from "@/data/bank";
import { answerText, isAnswered } from "@/lib/answers";
import {
  ComponentAnalysis,
  ComponentDynamics,
  ItemAnalysis,
  PrePostAnalysis,
  SelfAccuracy,
} from "@/components/ResearchAnalysis";
import { COMPONENTS, componentPct, type ComponentScores } from "@/lib/components";
import { rowToRecord, rubricMapOf } from "@/lib/db";
import { fetchAll, loadResults, loadRubric, useTeacher } from "@/lib/teacher";
import type { SubmissionRow } from "@/lib/db";
import { GROUP_LABEL, STAGE_LABEL } from "@/lib/participant";
import {
  buildAttempts,
  defaultBanks,
  isCorrect,
  loadBankV1,
  neededVersions,
  parseCsv,
  type Attempt,
  type RubricMap,
} from "@/lib/results";
import { LEVELS, levelInfo, levelText, pctOf } from "@/lib/levels";
import type { Row } from "@/lib/diagnostics";

export const Route = createFileRoute("/monitoring")({
  head: () => ({
    meta: [
      { title: "Monitoring — TIMSS/PISA Platformasi" },
      {
        name: "description",
        content:
          "Test natijalari eksportini yuklab, guruh diagnostikasi va ishtirokchilar monitoringini ko'rish.",
      },
    ],
  }),
  component: Page,
});

/** Tajriba-sinov rejasidagi ishtirokchilar soni (dissertatsiya: 180 TG + 180 NG). */
const PLANNED_PARTICIPANTS = 360;

const TEST_ORDER: TestKey[] = [
  "diag-a",
  "diag-o",
  "diag-b",
  "knowing",
  "applying",
  "reasoning",
  "pisa",
  "r-knowing",
  "r-applying",
  "r-reasoning",
  "r-pisa",
  "sinov-a",
  "sinov-b",
];

const STATUS_LABEL: Record<Attempt["status"], string> = {
  toliq: "To'liq",
  "toliq-emas": "To'liq emas",
  sinov: "Texnik sinov",
};

const groupRows = (
  attempts: Attempt[],
  keyOf: (q: Attempt["questions"][number]) => string | undefined,
  labelOf: (k: string) => string,
): Row[] => {
  const acc = new Map<string, { correct: number; total: number }>();
  for (const a of attempts)
    for (const q of a.questions) {
      // Oddiy testda javobsiz savollar hisobga olinmaydi; diagnostik testda bo'sh javob 0 ball.
      if (!a.diag && !isAnswered(a.answers[q.id])) continue;
      const k = keyOf(q);
      if (!k) continue;
      const cur = acc.get(k) ?? { correct: 0, total: 0 };
      cur.total += a.itemMax;
      cur.correct += a.itemPoints[q.id] ?? 0;
      acc.set(k, cur);
    }
  return [...acc.entries()]
    .map(([key, v]) => ({ key, label: labelOf(key), ...v, pct: pctOf(v.correct, v.total) }))
    .sort((x, y) => x.pct - y.pct);
};

const topicKey = (q: Attempt["questions"][number]) => q.topic ?? undefined;

const csvCell = (v: string | number) => {
  const s = String(v ?? "");
  return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

function Page() {
  const [attempts, setAttempts] = useState<Attempt[] | null>(null);
  const [fileName, setFileName] = useState("");
  const [skipped, setSkipped] = useState(0);
  const [error, setError] = useState("");
  const [excludeTest, setExcludeTest] = useState(true);
  const [onlyComplete, setOnlyComplete] = useState(true);
  const [onlyCounted, setOnlyCounted] = useState(true);
  const [test, setTest] = useState<TestKey>("diag-a");
  const [loadingDb, setLoadingDb] = useState(false);
  const teacher = useTeacher();
  const [selfMap, setSelfMap] = useState<Map<string, Record<string, number>> | null>(null);
  const [rubricMap, setRubricMap] = useState<RubricMap>(new Map());

  const build = async (rows: Record<string, string>[], rubric?: RubricMap) => {
    const banks = defaultBanks();
    if (neededVersions(rows).has("v1")) banks.v1 = await loadBankV1();
    const built = buildAttempts(rows, banks, rubric);
    setAttempts(built.attempts);
    setSkipped(built.skipped);
  };

  const onFile = async (file: File) => {
    setError("");
    try {
      const rows = parseCsv(await file.text());
      if (!rows.length || !("answers" in rows[0]) || !("test_type" in rows[0])) {
        throw new Error(
          "Fayl test_results jadvali eksportiga o'xshamaydi (answers va test_type ustunlari topilmadi).",
        );
      }
      await build(rows);
      setFileName(file.name);
    } catch (e) {
      setAttempts(null);
      setError(e instanceof Error ? e.message : "Faylni o'qib bo'lmadi.");
    }
  };

  const onDb = async () => {
    setError("");
    setLoadingDb(true);
    try {
      const [rows, rubric, subs] = await Promise.all([
        loadResults(),
        loadRubric(),
        fetchAll<SubmissionRow>("portfolio_submissions", "created_at").catch(() => []),
      ]);
      const rm = rubricMapOf(rubric);
      setRubricMap(rm);
      setSelfMap(
        new Map(
          subs
            .filter((x) => x.kind === "self-score")
            .map((x) => [x.ref, (x.payload.scores ?? {}) as Record<string, number>]),
        ),
      );
      await build(rows.map(rowToRecord), rm);
      setFileName(`Bazadan: ${rows.length} ta yozuv, ${new Date().toLocaleTimeString()}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bazadan o'qib bo'lmadi.");
    } finally {
      setLoadingDb(false);
    }
  };

  const included = useMemo(
    () =>
      (attempts ?? []).filter(
        (a) =>
          !(excludeTest && a.status === "sinov") &&
          !(onlyComplete && a.status === "toliq-emas") &&
          !(onlyCounted && a.status === "toliq" && !a.counted),
      ),
    [attempts, excludeTest, onlyComplete, onlyCounted],
  );

  const stats = useMemo(() => {
    const people = new Set(included.map((a) => a.personKey));
    const allPeople = new Set(
      (attempts ?? []).filter((a) => a.status !== "sinov").map((a) => a.personKey),
    );
    const avg = included.length
      ? Math.round(included.reduce((s, a) => s + a.pct, 0) / included.length)
      : 0;
    const perTest = TEST_ORDER.map((k) => {
      const list = included.filter((a) => a.testKey === k);
      const levels = LEVELS.map((l) => list.filter((a) => levelInfo(a.pct).key === l.key).length);
      return {
        key: k,
        count: list.length,
        avg: list.length ? Math.round(list.reduce((s, a) => s + a.pct, 0) / list.length) : 0,
        avgPoints: list.length ? list.reduce((s, a) => s + a.correct, 0) / list.length : 0,
        max: list[0]?.total ?? 0,
        levels,
      };
    }).filter((t) => t.count > 0 || isDiag(t.key));
    return { people: people.size, allPeople: allPeople.size, avg, perTest };
  }, [included, attempts]);

  const forTest = included.filter((a) => a.testKey === test);
  const groupComponents = useMemo(() => {
    const acc: ComponentScores = {};
    for (const a of forTest)
      for (const [k, v] of Object.entries(a.components) as [
        keyof ComponentScores,
        { score: number; max: number },
      ][]) {
        const c = (acc[k] ??= { score: 0, max: 0 });
        c.score += v.score;
        c.max += v.max;
      }
    return acc;
  }, [forTest]);
  const visibleTests = TEST_ORDER.filter(
    (k) => isDiag(k) || (attempts ?? []).some((a) => a.testKey === k),
  );
  const topicRows = groupRows(forTest, topicKey, topicLabel);
  const processRows = isPisa(test)
    ? groupRows(
        forTest,
        (q) => q.process,
        (k) => PROCESS_LABEL[k] ?? k,
      )
    : [];

  const hardest = useMemo(() => {
    const byQ = new Map<
      string,
      {
        q: Attempt["questions"][number];
        n: number;
        ok: number;
        wrong: Map<string, number>;
        max: number;
      }
    >();
    for (const a of forTest)
      for (const q of a.questions) {
        const ch = a.answers[q.id];
        if (!a.diag && !isAnswered(ch)) continue;
        const key = `${a.version}|${q.id}`;
        const cur = byQ.get(key) ?? { q, n: 0, ok: 0, wrong: new Map(), max: a.itemMax };
        cur.n++;
        if (a.diag) cur.ok += a.itemPoints[q.id] ?? 0;
        else if (isCorrect(q, ch)) cur.ok++;
        else {
          const w = typeof ch === "string" ? ch.trim() : String(ch);
          cur.wrong.set(w, (cur.wrong.get(w) ?? 0) + 1);
        }
        byQ.set(key, cur);
      }
    return [...byQ.values()]
      .filter((x) => x.n >= Math.min(3, forTest.length))
      .map((x) => {
        const top = [...x.wrong.entries()].sort((a, b) => b[1] - a[1])[0];
        return {
          ...x,
          pct: pctOf(x.ok, x.n * x.max),
          commonWrong: top ? (x.q.answer ? top[0] : x.q.options[Number(top[0])]) : "",
        };
      })
      .filter((x) => x.pct < 100)
      .sort((a, b) => a.pct - b.pct || b.n - a.n)
      .slice(0, 10);
  }, [forTest]);

  const exportSummary = () => {
    const topics = [
      ...new Set(included.flatMap((a) => a.questions.map((q) => q.topic).filter(Boolean))),
    ] as string[];
    const header = [
      "F.I.Sh.",
      "Kod",
      "Bosqich",
      "Guruh",
      "Hisobga olingan",
      "Universitet",
      "Kurs",
      "Test",
      "Bank versiyasi",
      "Holat",
      "To'g'ri",
      "Javob berilgan",
      "Jami",
      "Foiz",
      "Daraja",
      "Yakunlangan",
      ...COMPONENTS.map((c) => `${c.short} (%)`),
      "Avtomatik ball",
      "Rubrika bilan baholangan",
      ...topics.map(topicLabel),
    ];
    const lines = included.map((a) => {
      const perTopic = topics.map((t) => {
        const qs = a.questions.filter(
          (q) => q.topic === t && (a.diag || isAnswered(a.answers[q.id])),
        );
        return qs.length
          ? pctOf(
              qs.reduce((s, q) => s + (a.itemPoints[q.id] ?? 0), 0),
              qs.length * a.itemMax,
            )
          : "";
      });
      return [
        a.full_name,
        a.code,
        STAGE_LABEL[a.stage],
        GROUP_LABEL[a.group],
        a.counted ? "ha" : "yo'q",
        a.university,
        a.course,
        a.testBase,
        a.version,
        STATUS_LABEL[a.status],
        a.correct,
        a.answered,
        a.total,
        a.pct,
        levelInfo(a.pct).short,
        a.completedAt,
        ...COMPONENTS.map((c) => {
          const v = componentPct(a.components[c.key]);
          return Number.isFinite(v) ? v : "";
        }),
        a.diag ? a.diag.auto : "",
        a.diag ? `${a.diag.rubricCount}/${a.nItems}` : "",
        ...perTopic,
      ];
    });
    const csv = "\uFEFF" + [header, ...lines].map((l) => l.map(csvCell).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `monitoring-tahlil-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Kuzatuv"
        title="Talabalar monitoringi"
        description="Platformada yig'ilgan test natijalari bo'yicha guruh diagnostikasi: ishtirokchilar, darajalar, mavzular va eng qiyin savollar."
      />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 p-6 rounded-2xl border bg-card shadow-card">
            <h2 className="font-semibold text-lg">Natijalar faylini yuklang</h2>
            <ol className="mt-3 text-sm text-muted-foreground list-decimal pl-5 space-y-1">
              <li>
                Lovable loyihasida Cloud → Database → <code>test_results</code> jadvalini oching.
              </li>
              <li>Jadvalni CSV formatda eksport qiling.</li>
              <li>Faylni shu yerga yuklang.</li>
            </ol>
            <label className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium cursor-pointer hover:opacity-90">
              <Upload className="w-4 h-4" /> CSV faylni tanlash
              <input
                type="file"
                accept=".csv,text/csv"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void onFile(f);
                  e.target.value = "";
                }}
              />
            </label>
            {teacher.isTeacher && (
              <Button className="mt-5 ml-3" variant="outline" onClick={onDb} disabled={loadingDb}>
                <DatabaseZap className="w-4 h-4 mr-2" />
                {loadingDb ? "Yuklanmoqda…" : "Bazadan jonli yuklash"}
              </Button>
            )}
            {fileName && <span className="ml-3 text-sm text-muted-foreground">{fileName}</span>}
            {!teacher.loading && !teacher.isTeacher && (
              <p className="mt-3 text-sm">
                O'qituvchi sifatida{" "}
                <Link to="/kabinet" className="text-primary hover:underline">
                  kabinetga kirsangiz
                </Link>
                , natijalar CSV eksportisiz, bazadan to'g'ridan-to'g'ri va rubrika ballari bilan
                yuklanadi.
              </p>
            )}
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <p className="mt-4 text-xs text-muted-foreground flex gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              Fayl faqat shu brauzerda qayta ishlanadi va hech qayerga yuborilmaydi. Natijalarni
              bazadan faqat ro'yxatga kiritilgan o'qituvchi o'qiy oladi, shuning uchun
              ishtirokchilarning shaxsiy ma'lumotlari himoyalangan. CSV faylda o'qituvchi rubrikasi
              bo'lmaydi: diagnostik test ochiq javoblari avtomatik dastlabki ball bilan hisoblanadi.
            </p>
          </div>
          <div className="p-6 rounded-2xl border bg-card shadow-card">
            <div className="text-sm text-muted-foreground">Tajriba-sinov rejasi</div>
            <div className="mt-1 text-3xl font-display font-bold tabular-nums">
              {attempts ? stats.allPeople : "—"}{" "}
              <span className="text-lg text-muted-foreground font-normal">
                / {PLANNED_PARTICIPANTS}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">ishtirokchi qatnashdi</div>
            <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{
                  width: `${Math.min(100, ((attempts ? stats.allPeople : 0) / PLANNED_PARTICIPANTS) * 100)}%`,
                }}
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Texnik sinov yozuvlarisiz, kamida bitta testni yuborgan noyob ishtirokchilar.
            </p>
          </div>
        </div>

        {attempts && (
          <>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={excludeTest}
                  onChange={(e) => setExcludeTest(e.target.checked)}
                />
                Texnik sinov yozuvlarini chiqarib tashlash
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={onlyComplete}
                  onChange={(e) => setOnlyComplete(e.target.checked)}
                />
                Faqat to'liq yechilgan testlar
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={onlyCounted}
                  onChange={(e) => setOnlyCounted(e.target.checked)}
                />
                Qayta topshirishlarni hisobga olmaslik (birinchi to'liq urinish)
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={exportSummary}
                disabled={!included.length}
                className="ml-auto"
              >
                <Download className="w-4 h-4 mr-2" /> Tahlilni CSV yuklab olish
              </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Users, label: "Ishtirokchilar", value: stats.people },
                { icon: ListChecks, label: "Tahlildagi urinishlar", value: included.length },
                {
                  icon: Gauge,
                  label: "O'rtacha natija",
                  value: included.length ? `${stats.avg}%` : "—",
                },
                {
                  icon: FilterX,
                  label: "Chiqarib tashlangan",
                  value: attempts.length - included.length + skipped,
                },
              ].map((s) => (
                <div key={s.label} className="p-5 rounded-2xl border bg-card shadow-card">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <s.icon className="w-4 h-4" /> {s.label}
                  </div>
                  <div className="text-3xl font-display font-bold mt-1 tabular-nums">{s.value}</div>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto rounded-2xl border bg-card shadow-card">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-semibold">Test</th>
                    <th className="px-4 py-3 font-semibold text-right">Urinishlar</th>
                    <th className="px-4 py-3 font-semibold text-right">O'rtacha</th>
                    {LEVELS.map((l) => (
                      <th key={l.key} className="px-4 py-3 font-semibold text-right">
                        {l.short}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.perTest.map((t) => (
                    <tr key={t.key} className="border-t">
                      <td className="px-4 py-3 font-medium">{TEST_TYPES[t.key]}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{t.count}</td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {t.count ? `${t.avg}%` : "—"}
                        {t.count > 0 && isDiag(t.key) && (
                          <div className="text-xs text-muted-foreground">
                            {t.avgPoints.toFixed(1).replace(".", ",")} / {t.max} ball
                          </div>
                        )}
                      </td>
                      {t.levels.map((n, i) => (
                        <td key={i} className="px-4 py-3 text-right tabular-nums">
                          {n}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 rounded-2xl border bg-card shadow-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="font-semibold text-lg">Guruh diagnostikasi</h2>
                <div className="flex flex-wrap gap-2">
                  {visibleTests.map((k) => (
                    <button
                      key={k}
                      onClick={() => setTest(k)}
                      className={`px-3 py-1.5 rounded-lg border text-sm ${test === k ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}
                    >
                      {TEST_TYPES[k]}
                    </button>
                  ))}
                </div>
              </div>
              {forTest.length ? (
                <div className="mt-5 grid lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-medium mb-1">Matematik tayyorgarlik komponentlari</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {forTest.length} ta urinish bo'yicha umumiy profil.
                    </p>
                    <ComponentProfile
                      scores={groupComponents}
                      unit={isDiag(test) ? "to'plangan ball" : "to'g'ri javoblar"}
                    />
                    <div className="mt-4">
                      <LevelLegend points={isDiag(test)} />
                    </div>
                    {!isDiag(test) && (
                      <div className="mt-8">
                        <h3 className="font-medium mb-1">
                          Mavzular bo'yicha to'g'ri javoblar ulushi
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Eng past natijali mavzular yuqorida.
                        </p>
                        <Bars rows={topicRows} />
                      </div>
                    )}
                    {isPisa(test) && processRows.length > 0 && (
                      <div className="mt-8">
                        <h3 className="font-medium mb-3">PISA jarayonlari</h3>
                        <Bars rows={processRows} />
                        {test === "pisa" && (
                          <p className="mt-3 text-xs text-muted-foreground">
                            v2 bankida Interpret jarayoni bo'yicha savollar yo'q; ular rasmiy
                            topshiriqlar bo'limida bor.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Eng qiyin 10 ta savol</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {isDiag(test)
                        ? "O'rtacha bali eng past bo'lgan topshiriqlar (maksimal ballga nisbatan)."
                        : "To'g'ri javoblar ulushi eng past bo'lgan savollar va eng ko'p tanlangan xato javob."}
                    </p>
                    {!hardest.length && (
                      <p className="text-sm text-muted-foreground">
                        Barcha savollarga to'g'ri javob berilgan.
                      </p>
                    )}
                    <ol className="space-y-3 text-sm">
                      {hardest.map((h) => (
                        <li key={`${h.q.id}-${h.n}`} className="border-b pb-3 last:border-0">
                          <div className="flex justify-between gap-3">
                            <span className="font-medium">
                              {h.q.title && isDiag(test) ? h.q.title : h.q.id} ·{" "}
                              {topicLabel(h.q.topic ?? "")}
                            </span>
                            <span
                              className={`tabular-nums font-semibold ${levelText[levelInfo(h.pct).key]}`}
                            >
                              {h.max > 1
                                ? `${(h.ok / h.n).toFixed(1).replace(".", ",")}/${h.max} ball`
                                : `${h.ok}/${h.n}`}{" "}
                              ({h.pct}%)
                            </span>
                          </div>
                          <p className="text-muted-foreground mt-0.5">{h.q.q}</p>
                          {h.commonWrong && (
                            <p className="text-xs mt-1">
                              To'g'ri: <b>{answerText(h.q)}</b> · Ko'p tanlangan xato:{" "}
                              <b>{h.commonWrong}</b>
                            </p>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  Bu test bo'yicha tanlangan filtrlarga mos urinish yo'q.
                </p>
              )}
            </div>

            <PrePostAnalysis attempts={attempts.filter((a) => a.status !== "sinov")} />

            <ComponentAnalysis attempts={attempts.filter((a) => a.status !== "sinov")} />

            <ComponentDynamics attempts={attempts.filter((a) => a.status !== "sinov")} />

            {selfMap && (
              <SelfAccuracy
                attempts={attempts.filter((a) => a.status !== "sinov")}
                selfScores={selfMap}
                rubric={rubricMap}
              />
            )}

            <ItemAnalysis attempts={attempts.filter((a) => a.status !== "sinov")} test={test} />

            <div className="overflow-x-auto rounded-2xl border bg-card shadow-card">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-semibold">Ishtirokchi</th>
                    <th className="px-4 py-3 font-semibold">Kod</th>
                    <th className="px-4 py-3 font-semibold">Bosqich</th>
                    <th className="px-4 py-3 font-semibold">Universitet</th>
                    <th className="px-4 py-3 font-semibold">Kurs</th>
                    <th className="px-4 py-3 font-semibold">Test</th>
                    <th className="px-4 py-3 font-semibold text-right">Natija</th>
                    <th className="px-4 py-3 font-semibold">Daraja</th>
                    <th className="px-4 py-3 font-semibold">Holat</th>
                    <th className="px-4 py-3 font-semibold">Sana</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((a) => {
                    const lv = levelInfo(a.pct);
                    const shown = included.includes(a);
                    return (
                      <tr key={a.id} className={`border-t ${shown ? "" : "opacity-50"}`}>
                        <td className="px-4 py-3 font-medium">{a.full_name}</td>
                        <td className="px-4 py-3 font-mono text-xs">{a.code || "—"}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {STAGE_LABEL[a.stage].split(" (")[0]}
                          {a.group && (
                            <div className="text-xs text-muted-foreground">
                              {GROUP_LABEL[a.group]}
                            </div>
                          )}
                          {a.status === "toliq" && !a.counted && (
                            <div className="text-xs text-muted-foreground">qayta topshirish</div>
                          )}
                        </td>
                        <td className="px-4 py-3">{a.university}</td>
                        <td className="px-4 py-3">{a.course}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {a.testBase}{" "}
                          <span className="text-xs text-muted-foreground">{a.version}</span>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">
                          {a.correct}/{a.total} ({a.pct}%)
                          {a.answered < a.nItems && (
                            <div className="text-xs text-muted-foreground">
                              {a.answered} ta javob
                            </div>
                          )}
                          {a.diag && (
                            <div className="text-xs text-muted-foreground">
                              rubrika: {a.diag.rubricCount}/{a.nItems}
                            </div>
                          )}
                        </td>
                        <td className={`px-4 py-3 font-medium ${levelText[lv.key]}`}>{lv.short}</td>
                        <td className="px-4 py-3">{STATUS_LABEL[a.status]}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                          {(a.completedAt ?? "").slice(0, 10)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground">
              Ballar savollar bankiga qarab qayta hisoblangan. v1 bankidagi to'g'ri javobi ikki
              marta yozilgan savollarda ikkala nusxa ham to'g'ri deb olinadi, shuning uchun ayrim v1
              natijalari bazadagi saqlangan balldan yuqori bo'lishi mumkin. Xira qatorlar tahlilga
              kiritilmagan.
            </p>
          </>
        )}
      </section>
    </SiteLayout>
  );
}
