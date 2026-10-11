import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  GraduationCap,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TEST_TYPES, versionOf, withVersion, type TestKey } from "@/data/bank";
import {
  answerText,
  isAnswered,
  isCorrect,
  type AnswerValue,
  type OpenAnswer,
} from "@/lib/answers";
import { levelOf, pctOf } from "@/lib/levels";
import { DiagnosticReport } from "@/components/DiagnosticReport";

export type Question = {
  id: string;
  q: string;
  options: string[];
  correctIndex: number;
  explain: string;
  title?: string;
  context?: string;
  topic?: string;
  process?: string;
  /** Ochiq javobli savol: ishtirokchi javobni yozadi. */
  answer?: OpenAnswer;
  /** Rasm (SVG, platforma ichida tayyorlangan). */
  figure?: string;
  table?: { rows: string[][] };
  grade?: number;
  source?: string;
  adaptation?: string;
  intlPct?: number;
  studentGoal?: string;
  teacherGoal?: string;
  lessonUse?: string;
};

type Props = {
  questions: Question[];
  testKey: TestKey;
  label?: string;
  pageSize?: number;
};

const COURSES = ["1", "2", "3", "4", "Magistratura"];

type SaveState = "idle" | "saving" | "saved" | "error";

export function Quiz({ questions, testKey, label = "Topshiriqlar", pageSize = 10 }: Props) {
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [submitted, setSubmitted] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString());
  const [completedAt, setCompletedAt] = useState<string>("");
  const [participant, setParticipant] = useState({ full_name: "", university: "", course: "" });
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const topRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.max(1, Math.ceil(questions.length / pageSize));
  const start = page * pageSize;
  const visible = questions.slice(start, start + pageSize);

  const result = useMemo(() => {
    let correct = 0;
    for (const q of questions) if (isCorrect(q, answers[q.id])) correct++;
    const answered = questions.filter((q) => isAnswered(answers[q.id])).length;
    const total = questions.length;
    return { correct, answered, total, pct: pctOf(correct, total) };
  }, [answers, questions]);

  const remaining = result.total - result.answered;
  const firstUnanswered = questions.findIndex((q) => !isAnswered(answers[q.id]));

  const participantValid =
    participant.full_name.trim().length >= 3 &&
    participant.university.trim() !== "" &&
    participant.course !== "";

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const select = (qid: string, idx: AnswerValue) => {
    if (submitted) return;
    setAnswers((p) => ({ ...p, [qid]: idx }));
  };

  const goTo = (p: number) => {
    setPage(p);
    scrollTop();
  };

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
    setTriedSubmit(false);
    setSaveState("idle");
    setPage(0);
    setStartedAt(new Date().toISOString());
    scrollTop();
  };

  const save = async (doneAt: string) => {
    setSaveState("saving");
    const { error } = await supabase.from("test_results").insert({
      full_name: participant.full_name.trim(),
      university: participant.university.trim(),
      course: participant.course,
      test_type: withVersion(TEST_TYPES[testKey], versionOf(testKey)),
      score: result.correct,
      total_questions: result.total,
      percentage: result.pct,
      level: levelOf(result.pct),
      answers,
      started_at: startedAt,
      completed_at: doneAt,
    });
    if (error) {
      console.error("[test_results] save failed", error);
      setSaveState("error");
      toast.error(
        'Natija saqlanmadi. Internet aloqasini tekshirib, "Qayta yuborish" tugmasini bosing.',
      );
    } else {
      setSaveState("saved");
      toast.success("Natija saqlandi");
    }
  };

  const submit = async () => {
    setTriedSubmit(true);
    if (!participantValid) {
      toast.error("Iltimos, F.I.Sh., universitet va kursni kiriting.");
      scrollTop();
      return;
    }
    if (remaining > 0) {
      toast.error(`Hali ${remaining} ta savolga javob berilmagan.`);
      return;
    }
    const doneAt = new Date().toISOString();
    setCompletedAt(doneAt);
    setSubmitted(true);
    scrollTop();
    await save(doneAt);
  };

  return (
    <div className="space-y-6" ref={topRef}>
      {submitted && (
        <>
          {saveState === "error" && (
            <div className="p-4 rounded-2xl border border-red-500/40 bg-red-500/10 flex flex-col sm:flex-row sm:items-center gap-3 justify-between print:hidden">
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                Natija hali saqlanmadi. Sahifani yopmang va qayta yuboring.
              </div>
              <Button size="sm" onClick={() => save(completedAt)}>
                Qayta yuborish
              </Button>
            </div>
          )}
          <DiagnosticReport
            testKey={testKey}
            testLabel={label}
            questions={questions}
            answers={answers}
            participant={participant}
            completedAt={completedAt}
          />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl border bg-card shadow-card print:hidden">
            <div className="text-sm text-muted-foreground">
              {saveState === "saved" && "Natija saqlandi. "}
              Quyida har bir savol bo'yicha to'g'ri javob va izohni ko'rishingiz mumkin.
            </div>
            <Button variant="outline" onClick={reset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Qaytadan
            </Button>
          </div>
        </>
      )}

      {!submitted && (
        <div
          className={`p-5 rounded-2xl border bg-card shadow-card ${triedSubmit && !participantValid ? "border-red-500" : ""}`}
        >
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">
            Ishtirokchi ma'lumotlari
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <input
              required
              maxLength={200}
              className="px-4 py-2.5 rounded-lg border bg-background"
              placeholder="F.I.Sh. *"
              aria-label="F.I.Sh."
              value={participant.full_name}
              onChange={(e) => setParticipant({ ...participant, full_name: e.target.value })}
            />
            <input
              required
              maxLength={200}
              className="px-4 py-2.5 rounded-lg border bg-background"
              placeholder="Universitet *"
              aria-label="Universitet"
              value={participant.university}
              onChange={(e) => setParticipant({ ...participant, university: e.target.value })}
            />
            <select
              required
              className="px-4 py-2.5 rounded-lg border bg-background"
              aria-label="Kurs"
              value={participant.course}
              onChange={(e) => setParticipant({ ...participant, course: e.target.value })}
            >
              <option value="">Kurs *</option>
              {COURSES.map((c) => (
                <option key={c} value={c}>
                  {c === "Magistratura" ? c : `${c}-kurs`}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-5 rounded-2xl border bg-card shadow-card print:hidden">
        <div>
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {label}
          </div>
          <div className="text-lg font-semibold">
            {result.answered} / {result.total} javob berildi
          </div>
          <div className="mt-2 h-1.5 w-48 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${(result.answered / Math.max(1, result.total)) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            Sahifa {page + 1} / {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => goTo(page - 1)}
            aria-label="Oldingi sahifa"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => goTo(page + 1)}
            aria-label="Keyingi sahifa"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4 print:hidden">
        {visible.map((q, i) => {
          const userVal = answers[q.id];
          const answeredQ = isAnswered(userVal);
          const ok = isCorrect(q, userVal);
          const showResult = submitted && answeredQ;
          const missing = triedSubmit && !submitted && !answeredQ;
          return (
            <div
              key={q.id}
              data-qid={q.id}
              className={`p-6 rounded-2xl border bg-card shadow-card ${missing ? "border-red-500" : ""}`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="text-xs text-muted-foreground font-medium">
                  Savol № {start + i + 1}
                  {q.context && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-accent/15 text-accent">
                      {q.context}
                    </span>
                  )}
                  {missing && <span className="ml-2 text-red-600">Javob berilmagan</span>}
                </div>
                {showResult &&
                  (ok ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  ))}
              </div>
              {(q.grade || q.source) && (
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-2">
                  {q.grade && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted">
                      <GraduationCap className="w-3.5 h-3.5" />
                      {q.grade === 15 ? "15 yosh" : `${q.grade}-sinf`}
                    </span>
                  )}
                  {q.source && <span>{q.source}</span>}
                </div>
              )}
              {q.title && <h4 className="font-semibold mb-2">{q.title}</h4>}
              <p className="leading-relaxed mb-4">{q.q}</p>
              {q.figure && (
                <div
                  className="mb-4 p-3 rounded-xl border bg-white text-slate-900 overflow-x-auto"
                  // Rasm platforma ichida tayyorlangan statik SVG (foydalanuvchi kiritmaydi).
                  dangerouslySetInnerHTML={{ __html: q.figure }}
                />
              )}
              {q.table && (
                <div className="mb-4 overflow-x-auto">
                  <table className="text-sm border-collapse">
                    <tbody>
                      {q.table.rows.map((row, ri) => (
                        <tr key={ri}>
                          {row.map((c, ci) => (
                            <td
                              key={ci}
                              className={`border px-3 py-1.5 text-center tabular-nums ${ci === 0 ? "font-semibold bg-muted text-left" : ""}`}
                            >
                              {c}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {q.answer ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    inputMode="text"
                    maxLength={100}
                    disabled={submitted}
                    aria-label={`Savol ${start + i + 1} uchun javob`}
                    placeholder="Javobingizni yozing"
                    value={typeof userVal === "string" ? userVal : ""}
                    onChange={(e) => select(q.id, e.target.value)}
                    className={`w-full sm:w-80 px-4 py-2.5 rounded-lg border bg-background ${
                      submitted
                        ? ok
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-red-500 bg-red-500/10"
                        : ""
                    }`}
                  />
                  {submitted && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">To'g'ri javob: </span>
                      <span className="font-semibold">{answerText(q)}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-2">
                  {q.options.map((opt, idx) => {
                    const isUser = userVal === idx;
                    const isCorrect = idx === q.correctIndex;
                    let cls = "border-border hover:border-primary/40 hover:bg-muted/50";
                    if (submitted) {
                      if (isCorrect) cls = "border-emerald-500 bg-emerald-500/10";
                      else if (isUser) cls = "border-red-500 bg-red-500/10";
                      else cls = "border-border opacity-70";
                    } else if (isUser) {
                      cls = "border-primary bg-primary/10";
                    }
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => select(q.id, idx)}
                        disabled={submitted}
                        aria-pressed={isUser}
                        className={`text-left px-4 py-3 rounded-xl border transition text-sm ${cls}`}
                      >
                        <span className="font-semibold mr-2">{String.fromCharCode(65 + idx)}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}
              {submitted && (
                <div className="mt-4 p-3 rounded-xl bg-muted text-sm">
                  <span className="font-semibold">Izoh: </span>
                  {q.explain}
                </div>
              )}
              {submitted && (q.studentGoal || q.teacherGoal || q.lessonUse) && (
                <dl className="mt-3 grid md:grid-cols-3 gap-3 text-sm">
                  {[
                    ["Bu topshiriqning o'quvchi uchun maqsadi", q.studentGoal],
                    ["Bo'lajak o'qituvchi uchun metodik maqsadi", q.teacherGoal],
                    ["O'qituvchi ushbu topshiriqdan darsda qanday foydalanadi", q.lessonUse],
                  ].map(([t, v]) =>
                    v ? (
                      <div key={t} className="p-3 rounded-xl border border-primary/20 bg-primary/5">
                        <dt className="text-xs font-semibold text-primary mb-1">{t}</dt>
                        <dd className="leading-relaxed">{v}</dd>
                      </div>
                    ) : null,
                  )}
                </dl>
              )}
              {submitted && q.adaptation && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Moslashtirish: {q.adaptation}
                  {q.intlPct !== undefined && ` · Xalqaro o'rtacha natija: ${q.intlPct}%`}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-5 rounded-2xl border bg-card shadow-card print:hidden">
        {!submitted ? (
          <>
            <div className="text-sm text-muted-foreground">
              {remaining > 0 ? (
                <>
                  Natijani tekshirish uchun barcha savollarga javob bering. Javob berilmagan:{" "}
                  <b>{remaining} ta</b>.
                </>
              ) : (
                "Barcha savollarga javob berildi. Natijani tekshirishingiz mumkin."
              )}
            </div>
            <div className="flex gap-2">
              {remaining > 0 && firstUnanswered >= 0 && (
                <Button
                  variant="outline"
                  onClick={() => goTo(Math.floor(firstUnanswered / pageSize))}
                >
                  Javobsiz savolga o'tish
                </Button>
              )}
              {page < totalPages - 1 ? (
                <Button onClick={() => goTo(page + 1)}>Keyingi sahifa</Button>
              ) : (
                <Button onClick={submit} disabled={saveState === "saving"}>
                  Natijani tekshirish
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="text-sm text-muted-foreground">
              Yana bir bor urinib ko'rish uchun testni qaytadan boshlang.
            </div>
            <Button variant="outline" onClick={reset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Qaytadan
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
