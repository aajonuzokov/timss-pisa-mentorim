import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, RefreshCw, Trophy, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type Question = {
  id: string;
  q: string;
  options: string[];
  correctIndex: number;
  explain: string;
  title?: string;
  context?: string;
};

type Props = {
  questions: Question[];
  label?: string;
  pageSize?: number;
  testType?: string;
};

const levelOf = (pct: number) =>
  pct >= 80 ? "A'lo daraja" : pct >= 60 ? "Yaxshi daraja" : pct >= 40 ? "O'rta daraja" : "Quyi daraja — qaytadan urinib ko'ring";

export function Quiz({ questions, label = "Topshiriqlar", pageSize = 10, testType }: Props) {
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString());
  const [participant, setParticipant] = useState({ full_name: "", university: "", course: "" });
  const [saving, setSaving] = useState(false);

  const totalPages = Math.max(1, Math.ceil(questions.length / pageSize));
  const start = page * pageSize;
  const visible = questions.slice(start, start + pageSize);

  const result = useMemo(() => {
    let correct = 0;
    for (const q of questions) {
      if (answers[q.id] === q.correctIndex) correct++;
    }
    const answered = Object.keys(answers).length;
    const total = questions.length;
    const pct = total ? Math.round((correct / total) * 100) : 0;
    return { correct, answered, total, pct };
  }, [answers, questions]);

  const select = (qid: string, idx: number) => {
    if (submitted) return;
    setAnswers((p) => ({ ...p, [qid]: idx }));
  };

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
    setPage(0);
    setStartedAt(new Date().toISOString());
  };

  const participantValid =
    participant.full_name.trim() !== "" && participant.university.trim() !== "" && participant.course.trim() !== "";

  const submit = async () => {
    if (!participantValid) {
      toast.error("Iltimos, F.I.Sh., universitet va kursni kiriting.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("test_results").insert({
      full_name: participant.full_name.trim(),
      university: participant.university.trim(),
      course: participant.course.trim(),
      test_type: testType ?? label,
      score: result.correct,
      total_questions: result.total,
      percentage: result.pct,
      level: levelOf(result.pct),
      answers,
      started_at: startedAt,
      completed_at: new Date().toISOString(),
    });
    setSaving(false);
    setSubmitted(true);
    if (error) {
      console.error("[test_results] save failed", error);
      toast.error("Natijani saqlashda xatolik yuz berdi.");
    } else {
      toast.success("Natija saqlandi");
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl border bg-card shadow-card">
        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">Ishtirokchi ma'lumotlari</div>
        <div className="grid sm:grid-cols-3 gap-3">
          <input required disabled={submitted} maxLength={200} className="px-4 py-2.5 rounded-lg border bg-background" placeholder="F.I.Sh. *" value={participant.full_name} onChange={(e) => setParticipant({ ...participant, full_name: e.target.value })} />
          <input required disabled={submitted} maxLength={200} className="px-4 py-2.5 rounded-lg border bg-background" placeholder="Universitet *" value={participant.university} onChange={(e) => setParticipant({ ...participant, university: e.target.value })} />
          <input required disabled={submitted} maxLength={50} className="px-4 py-2.5 rounded-lg border bg-background" placeholder="Kurs *" value={participant.course} onChange={(e) => setParticipant({ ...participant, course: e.target.value })} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-5 rounded-2xl border bg-card shadow-card">
        <div>
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</div>
          <div className="text-lg font-semibold">
            {result.answered} / {result.total} javob berildi
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            Sahifa {page + 1} / {totalPages}
          </div>
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {visible.map((q, i) => {
          const userIdx = answers[q.id];
          const isAnswered = userIdx !== undefined;
          const showResult = submitted && isAnswered;
          return (
            <div key={q.id} className="p-6 rounded-2xl border bg-card shadow-card">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="text-xs text-muted-foreground font-medium">
                  Savol № {start + i + 1}
                  {q.context && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-accent/15 text-accent">{q.context}</span>
                  )}
                </div>
                {showResult && (userIdx === q.correctIndex ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                ))}
              </div>
              {q.title && <h4 className="font-semibold mb-2">{q.title}</h4>}
              <p className="leading-relaxed mb-4">{q.q}</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {q.options.map((opt, idx) => {
                  const isUser = userIdx === idx;
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
                      className={`text-left px-4 py-3 rounded-xl border transition text-sm ${cls}`}
                    >
                      <span className="font-semibold mr-2">{String.fromCharCode(65 + idx)}.</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <div className="mt-4 p-3 rounded-xl bg-muted text-sm">
                  <span className="font-semibold">Izoh: </span>
                  {q.explain}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-5 rounded-2xl border bg-card shadow-card">
        {!submitted ? (
          <>
            <div className="text-sm text-muted-foreground">
              Barcha sahifalardagi savollarga javob bering, so'ng natijani tekshiring.
            </div>
            <Button onClick={submit} disabled={result.answered === 0 || saving || !participantValid}>
              {saving ? "Saqlanmoqda..." : "Natijani tekshirish"}
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-lg">
                  Natija: {result.correct} / {result.total} ({result.pct}%)
                </div>
                <div className="text-sm text-muted-foreground">
                  {levelOf(result.pct)}
                </div>
              </div>
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
