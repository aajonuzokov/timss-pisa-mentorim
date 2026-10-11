import { Link } from "@tanstack/react-router";
import { Printer, TrendingUp, Target, BookOpen, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROCESS_LABEL, TEST_TAVSIYA, TOPICS, isPisa, isReleased, type TestKey } from "@/data/bank";
import type { AnswerValue } from "@/lib/answers";
import { diagnose, splitStrengths, type BankQuestion, type Row } from "@/lib/diagnostics";
import { LEVELS, levelClass, levelInfo, levelText } from "@/lib/levels";

type Props = {
  testKey: TestKey;
  testLabel: string;
  questions: BankQuestion[];
  answers: Record<string, AnswerValue>;
  participant: { full_name: string; university: string; course: string };
  completedAt: string;
};

export function Bars({ rows }: { rows: Row[] }) {
  return (
    <div className="space-y-3">
      {rows.map((r) => {
        const lv = levelInfo(r.pct);
        return (
          <div key={r.key}>
            <div className="flex items-baseline justify-between gap-3 text-sm mb-1">
              <span className="font-medium">{r.label}</span>
              <span className="text-muted-foreground tabular-nums whitespace-nowrap">
                {r.correct}/{r.total} ·{" "}
                <span className={`font-semibold ${levelText[lv.key]}`}>{r.pct}%</span>
              </span>
            </div>
            <div
              className="h-2.5 rounded-full bg-muted overflow-hidden"
              role="img"
              aria-label={`${r.label}: ${r.pct}%`}
            >
              <div
                className={`h-full rounded-full ${levelClass[lv.key]}`}
                style={{ width: `${Math.max(r.pct, 2)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function LevelLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
      {LEVELS.map((l, i) => (
        <span key={l.key} className="inline-flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${levelClass[l.key]}`} />
          {l.short} ({i === 0 ? `≥ ${l.min}%` : `${l.min}–${LEVELS[i - 1].min - 1}%`})
        </span>
      ))}
    </div>
  );
}

export function DiagnosticReport({
  testKey,
  testLabel,
  questions,
  answers,
  participant,
  completedAt,
}: Props) {
  const d = diagnose(questions, answers);
  const lv = levelInfo(d.pct);
  const { strong, weak } = splitStrengths(d.byTopic);
  const tavsiya = TEST_TAVSIYA[testKey];
  const processRows = d.byProcess.map((r) => ({ ...r, label: PROCESS_LABEL[r.key] ?? r.key }));
  const weakFormulate = processRows.some((r) => r.key === "formulate" && r.pct < 60);
  const dt = new Date(completedAt);
  const two = (n: number) => String(n).padStart(2, "0");
  const date = `${two(dt.getDate())}.${two(dt.getMonth() + 1)}.${dt.getFullYear()}, ${two(dt.getHours())}:${two(dt.getMinutes())}`;

  return (
    <div className="diagnostic-report space-y-5">
      <div className="p-6 rounded-2xl border bg-card shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Diagnostik natija · {testLabel}
            </div>
            <div className="mt-1 text-3xl font-display font-bold tabular-nums">
              {d.correct} / {d.total} <span className={levelText[lv.key]}>({d.pct}%)</span>
            </div>
            <div className={`mt-1 font-semibold ${levelText[lv.key]}`}>{lv.label}</div>
            <div className="mt-3 text-sm text-muted-foreground">
              {participant.full_name} · {participant.university} ·{" "}
              {participant.course === "Magistratura"
                ? participant.course
                : `${participant.course}-kurs`}
              <br />
              {date}
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="print:hidden shrink-0"
          >
            <Printer className="w-4 h-4 mr-2" /> Chop etish / PDF
          </Button>
        </div>
      </div>

      <div className="p-6 rounded-2xl border bg-card shadow-card">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" /> Mavzular bo'yicha diagnostika
        </h3>
        <p className="text-sm text-muted-foreground mt-1 mb-5">
          Eng past natijali mavzular yuqorida. Har bir mavzu bo'yicha to'g'ri javoblar ulushi.
        </p>
        <Bars rows={d.byTopic} />
        <div className="mt-5">
          <LevelLegend />
        </div>
      </div>

      {isPisa(testKey) && (
        <div className="p-6 rounded-2xl border bg-card shadow-card">
          <h3 className="font-semibold text-lg">PISA jarayonlari bo'yicha</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-5">
            {isReleased(testKey)
              ? "Jarayonlar bo'yicha tasnif loyiha muallifi tomonidan tasdiqlangan."
              : "Savollar bankidagi tasdiqlangan tasnif asosida. Interpret jarayoni bo'yicha savollar bankda hozircha yo'q, shuning uchun u baholanmagan."}
          </p>
          <Bars rows={processRows} />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl border bg-card shadow-card">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" /> Kuchli tomonlar
          </h3>
          {strong.length ? (
            <ul className="mt-3 space-y-1.5 text-sm">
              {strong.map((r) => (
                <li key={r.key} className="flex justify-between gap-3">
                  <span>{r.label}</span>
                  <span className="tabular-nums text-muted-foreground">{r.pct}%</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Hozircha 80% va undan yuqori natijali mavzu yo'q.
            </p>
          )}
        </div>
        <div className="p-6 rounded-2xl border bg-card shadow-card">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Metodik tavsiyalar
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                to="/tavsiyalar/$slug"
                params={{ slug: tavsiya.slug }}
                className="text-primary font-medium hover:underline"
              >
                {tavsiya.title}
              </Link>{" "}
              — ushbu test yo'nalishi bo'yicha metodik tavsiya.
            </li>
            {weakFormulate && (
              <li>
                <Link
                  to="/tavsiyalar/$slug"
                  params={{ slug: "formulate" }}
                  className="text-primary font-medium hover:underline"
                >
                  Formulate kompetensiyasi
                </Link>{" "}
                — vaziyatni matematik modelga o'tkazish bo'yicha.
              </li>
            )}
            <li>
              <Link
                to="/tavsiyalar/$slug"
                params={{ slug: "mkt" }}
                className="text-primary font-medium hover:underline"
              >
                Mathematical Knowledge for Teaching (MKT)
              </Link>{" "}
              — mavzuni o'quvchiga tushuntirish nuqtai nazaridan.
            </li>
          </ul>
        </div>
      </div>

      <div className="p-6 rounded-2xl border bg-card shadow-card">
        <h3 className="font-semibold text-lg">Rivojlantirish kerak bo'lgan mavzular</h3>
        {weak.length ? (
          <ol className="mt-4 space-y-4">
            {weak.map((r, i) => (
              <li key={r.key} className="flex gap-3">
                <span className="w-7 h-7 shrink-0 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                  {i + 1}
                </span>
                <div>
                  <div className="font-medium">
                    {r.label}{" "}
                    <span className="text-muted-foreground font-normal tabular-nums">
                      — {r.correct}/{r.total} ({r.pct}%)
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{TOPICS[r.key]?.tip}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Barcha mavzularda natija 60% dan yuqori. Keyingi qadam: xatolar bo'lgan savollarning
            izohlarini ko'rib chiqing va shu mavzularni o'quvchiga qanday tushuntirishingizni
            rejalashtiring.
          </p>
        )}
        <p className="mt-5 text-xs text-muted-foreground flex gap-1.5">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          {isReleased(testKey)
            ? "Diagnostika IEA (TIMSS) va OECD (PISA) ochiq e'lon qilgan namunaviy topshiriqlar asosida o'zbek tiliga moslashtirilgan to'plam (r1) bo'yicha tuzilgan. U rasmiy TIMSS/PISA natijasi hisoblanmaydi: topshiriqlar bo'lajak o'qituvchilarni shunday talablarga mos dars tashkil etishga tayyorlash uchun berilgan."
            : "Diagnostika ushbu platformaning tadqiqot uchun ishlab chiqilgan savollar banki (versiya v2) asosida tuzilgan va rasmiy TIMSS/PISA natijasi hisoblanmaydi."}
        </p>
      </div>
    </div>
  );
}
