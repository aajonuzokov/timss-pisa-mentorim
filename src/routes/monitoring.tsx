import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Upload, Download, ShieldCheck, Users, ListChecks, Gauge, FilterX } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Bars, LevelLegend } from "@/components/DiagnosticReport";
import { BANK_VERSION, TEST_TYPES, topicLabel, PROCESS_LABEL, type TestKey } from "@/data/bank";
import {
  BANK_V2,
  buildAttempts,
  isCorrect,
  loadBankV1,
  neededVersions,
  parseCsv,
  type Attempt,
  type Bank,
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

/** Tajriba-sinov rejasidagi ishtirokchilar soni. */
const PLANNED_PARTICIPANTS = 186;

const TEST_ORDER: TestKey[] = ["knowing", "applying", "reasoning", "pisa"];

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
      if (a.answers[q.id] === undefined) continue;
      const k = keyOf(q);
      if (!k) continue;
      const cur = acc.get(k) ?? { correct: 0, total: 0 };
      cur.total++;
      if (isCorrect(q, a.answers[q.id])) cur.correct++;
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
  const [test, setTest] = useState<TestKey>("knowing");

  const onFile = async (file: File) => {
    setError("");
    try {
      const rows = parseCsv(await file.text());
      if (!rows.length || !("answers" in rows[0]) || !("test_type" in rows[0])) {
        throw new Error(
          "Fayl test_results jadvali eksportiga o'xshamaydi (answers va test_type ustunlari topilmadi).",
        );
      }
      const banks: Record<string, Bank> = { [BANK_VERSION]: BANK_V2 };
      if (neededVersions(rows).has("v1")) banks.v1 = await loadBankV1();
      const built = buildAttempts(rows, banks);
      setAttempts(built.attempts);
      setSkipped(built.skipped);
      setFileName(file.name);
    } catch (e) {
      setAttempts(null);
      setError(e instanceof Error ? e.message : "Faylni o'qib bo'lmadi.");
    }
  };

  const included = useMemo(
    () =>
      (attempts ?? []).filter(
        (a) =>
          !(excludeTest && a.status === "sinov") && !(onlyComplete && a.status === "toliq-emas"),
      ),
    [attempts, excludeTest, onlyComplete],
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
        levels,
      };
    });
    return { people: people.size, allPeople: allPeople.size, avg, perTest };
  }, [included, attempts]);

  const forTest = included.filter((a) => a.testKey === test);
  const topicRows = groupRows(forTest, topicKey, topicLabel);
  const processRows =
    test === "pisa"
      ? groupRows(
          forTest,
          (q) => q.process,
          (k) => PROCESS_LABEL[k] ?? k,
        )
      : [];

  const hardest = useMemo(() => {
    const byQ = new Map<
      string,
      { q: Attempt["questions"][number]; n: number; ok: number; wrong: Map<number, number> }
    >();
    for (const a of forTest)
      for (const q of a.questions) {
        const ch = a.answers[q.id];
        if (ch === undefined) continue;
        const key = `${a.version}|${q.id}`;
        const cur = byQ.get(key) ?? { q, n: 0, ok: 0, wrong: new Map() };
        cur.n++;
        if (isCorrect(q, ch)) cur.ok++;
        else cur.wrong.set(ch, (cur.wrong.get(ch) ?? 0) + 1);
        byQ.set(key, cur);
      }
    return [...byQ.values()]
      .filter((x) => x.n >= Math.min(3, forTest.length))
      .map((x) => {
        const top = [...x.wrong.entries()].sort((a, b) => b[1] - a[1])[0];
        return { ...x, pct: pctOf(x.ok, x.n), commonWrong: top ? x.q.options[top[0]] : "" };
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
      ...topics.map(topicLabel),
    ];
    const lines = included.map((a) => {
      const perTopic = topics.map((t) => {
        const qs = a.questions.filter((q) => q.topic === t && a.answers[q.id] !== undefined);
        return qs.length
          ? pctOf(qs.filter((q) => isCorrect(q, a.answers[q.id])).length, qs.length)
          : "";
      });
      return [
        a.full_name,
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
            {fileName && <span className="ml-3 text-sm text-muted-foreground">{fileName}</span>}
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <p className="mt-4 text-xs text-muted-foreground flex gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              Fayl faqat shu brauzerda qayta ishlanadi va hech qayerga yuborilmaydi. Natijalar
              bazadan ochiq o'qilmaydi, shuning uchun ishtirokchilarning shaxsiy ma'lumotlari
              himoyalangan.
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
                  {TEST_ORDER.map((k) => (
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
                    <h3 className="font-medium mb-1">Mavzular bo'yicha to'g'ri javoblar ulushi</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {forTest.length} ta urinish. Eng past natijali mavzular yuqorida.
                    </p>
                    <Bars rows={topicRows} />
                    <div className="mt-4">
                      <LevelLegend />
                    </div>
                    {test === "pisa" && processRows.length > 0 && (
                      <div className="mt-8">
                        <h3 className="font-medium mb-3">PISA jarayonlari</h3>
                        <Bars rows={processRows} />
                        <p className="mt-3 text-xs text-muted-foreground">
                          Interpret jarayoni bo'yicha savollar bankda hozircha yo'q.
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Eng qiyin 10 ta savol</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      To'g'ri javoblar ulushi eng past bo'lgan savollar va eng ko'p tanlangan xato
                      javob.
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
                              {h.q.id} · {topicLabel(h.q.topic ?? "")}
                            </span>
                            <span
                              className={`tabular-nums font-semibold ${levelText[levelInfo(h.pct).key]}`}
                            >
                              {h.ok}/{h.n} ({h.pct}%)
                            </span>
                          </div>
                          <p className="text-muted-foreground mt-0.5">{h.q.q}</p>
                          {h.commonWrong && (
                            <p className="text-xs mt-1">
                              To'g'ri: <b>{h.q.options[h.q.correctIndex]}</b> · Ko'p tanlangan xato:{" "}
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

            <div className="overflow-x-auto rounded-2xl border bg-card shadow-card">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-semibold">Ishtirokchi</th>
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
                        <td className="px-4 py-3">{a.university}</td>
                        <td className="px-4 py-3">{a.course}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {a.testBase}{" "}
                          <span className="text-xs text-muted-foreground">{a.version}</span>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">
                          {a.correct}/{a.total} ({a.pct}%)
                          {a.answered < a.total && (
                            <div className="text-xs text-muted-foreground">
                              {a.answered} ta javob
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
