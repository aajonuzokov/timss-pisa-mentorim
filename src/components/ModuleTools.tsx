import { useState } from "react";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Question } from "@/components/Quiz";
import { answerText, checkOpen, isCorrect, type AnswerValue } from "@/lib/answers";
import type { ConceptCard, Gallery, Scenario } from "@/data/modules";

/** Bazaga yozilmaydigan mashq: har bir savol alohida tekshiriladi va izoh ko'rsatiladi. */
export function PracticeQuiz({ questions }: { questions: Question[] }) {
  const [vals, setVals] = useState<Record<string, AnswerValue>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const right = questions.filter((q) => checked[q.id] && isCorrect(q, vals[q.id])).length;
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Tekshirilgan: {Object.keys(checked).length} / {questions.length} · to'g'ri: {right}
      </div>
      {questions.map((q, i) => {
        const v = vals[q.id];
        const done = checked[q.id];
        const ok = done && isCorrect(q, v);
        return (
          <div key={q.id} className="p-5 rounded-2xl border bg-card" data-qid={q.id}>
            <div className="flex items-start justify-between gap-2">
              <div className="text-xs text-muted-foreground">
                {i + 1}-topshiriq{" "}
                {q.grade ? `· ${q.grade === 15 ? "15 yosh" : `${q.grade}-sinf`}` : ""}{" "}
                {q.source ? `· ${q.source}` : ""}
              </div>
              {done &&
                (ok ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                ))}
            </div>
            {q.title && <div className="font-semibold mt-1">{q.title}</div>}
            <p className="mt-2 leading-relaxed">{q.q}</p>
            {q.figure && (
              <div
                className="my-3 p-3 rounded-xl border bg-white text-slate-900 overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: q.figure }}
              />
            )}
            {q.table && (
              <div className="my-3 overflow-x-auto">
                <table className="text-sm border-collapse">
                  <tbody>
                    {q.table.rows.map((row, ri) => (
                      <tr key={ri}>
                        {row.map((c, ci) => (
                          <td key={ci} className="border px-3 py-1.5 text-center">
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
              <input
                className="mt-3 w-full sm:w-72 px-3 py-2 rounded-lg border bg-background"
                value={typeof v === "string" ? v : ""}
                onChange={(e) => setVals((p) => ({ ...p, [q.id]: e.target.value }))}
                placeholder="Javobingiz"
                aria-label={`${i + 1}-topshiriq javobi`}
              />
            ) : (
              <div className="mt-3 grid sm:grid-cols-2 gap-2">
                {q.options.map((o, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setVals((p) => ({ ...p, [q.id]: idx }))}
                    className={`text-left px-3 py-2 rounded-lg border text-sm ${v === idx ? "border-primary bg-primary/10" : "hover:border-primary/40"}`}
                  >
                    <b className="mr-1">{String.fromCharCode(65 + idx)}.</b> {o}
                  </button>
                ))}
              </div>
            )}
            <div className="mt-3 flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                disabled={v === undefined || v === ""}
                onClick={() => setChecked((p) => ({ ...p, [q.id]: true }))}
              >
                Tekshirish
              </Button>
              {done && !ok && (
                <span className="text-sm">
                  To'g'ri javob: <b>{answerText(q)}</b>
                </span>
              )}
            </div>
            {done && (
              <div className="mt-3 space-y-2 text-sm">
                <p className="rounded-lg bg-muted p-3">
                  <b>Izoh:</b> {q.explain}
                </p>
                {q.teacherGoal && (
                  <p className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                    <b>Bo'lajak o'qituvchi uchun:</b> {q.teacherGoal}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ConceptCards({ cards }: { cards: ConceptCard[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((c) => (
        <article key={c.name} className="p-5 rounded-2xl border bg-card shadow-card">
          <h4 className="font-semibold">{c.name}</h4>
          <p className="mt-2 text-sm">{c.definition}</p>
          <div className="mt-3 text-xs font-semibold text-muted-foreground uppercase">
            Tasvirlar
          </div>
          <ul className="mt-1 list-disc pl-5 text-sm space-y-0.5">
            {c.images.map((im) => (
              <li key={im}>{im}</li>
            ))}
          </ul>
          <p className="mt-3 rounded-lg bg-amber-500/10 border border-amber-500/30 p-2 text-xs">
            <b>Tipik xato:</b> {c.mistake}
          </p>
        </article>
      ))}
    </div>
  );
}

export function SolutionGallery({ items }: { items: Gallery[] }) {
  return (
    <div className="space-y-4">
      {items.map((g) => (
        <article key={g.problem} className="p-5 rounded-2xl border bg-card shadow-card">
          <h4 className="font-semibold">{g.problem}</h4>
          <div className="mt-3 grid md:grid-cols-3 gap-3">
            {g.methods.map((m) => (
              <div key={m.name} className="rounded-xl border p-3 text-sm">
                <div className="font-medium text-primary">{m.name}</div>
                <div className="mt-1">{m.text}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{g.note}</p>
        </article>
      ))}
    </div>
  );
}

/** Modellashtirish trenajyori: Formulate → Employ → Interpret, har bosqichda tekshiruv. */
export function ModelingTrainer({ scenarios }: { scenarios: Scenario[] }) {
  const [si, setSi] = useState(0);
  const s = scenarios[si];
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<Record<number, boolean>>({});
  const [model, setModel] = useState<number | null>(null);
  const [num, setNum] = useState("");
  const [interp, setInterp] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const reset = (i: number) => {
    setSi(i);
    setStep(0);
    setPicked({});
    setModel(null);
    setNum("");
    setInterp(null);
    setMsg(null);
  };

  const checkFormulate = () => {
    const dataOk = s.data.every((d, i) => !!picked[i] === d.needed);
    const modelOk = model === s.modelIndex;
    if (dataOk && modelOk) {
      setMsg({ ok: true, text: "To'g'ri: kerakli ma'lumot ajratildi va model tanlandi." });
      setStep(1);
    } else
      setMsg({
        ok: false,
        text: !dataOk
          ? "Ma'lumotlarni qayta ko'ring: savolga javob berish uchun qaysilari kerak, qaysi biri ortiqcha?"
          : "Model mos emas: vaziyatda miqdorlar qanday bog'langan?",
      });
  };
  const checkEmploy = () => {
    if (checkOpen({ type: "number", accept: [s.employ.answer] }, num)) {
      setMsg({
        ok: true,
        text: `To'g'ri: ${s.employ.answer.toLocaleString("ru-RU")} ${s.employ.unit}.`,
      });
      setStep(2);
    } else setMsg({ ok: false, text: `Hali emas. Ko'rsatma: ${s.employ.hint}.` });
  };
  const checkInterpret = () => {
    if (interp === s.interpret.correct) {
      setMsg({ ok: true, text: s.interpret.why });
      setStep(3);
    } else
      setMsg({
        ok: false,
        text: "Natijani real vaziyat bilan solishtiring: bu javob amalda ishlaydimi?",
      });
  };

  const stepNames = ["Formulate", "Employ", "Interpret"];
  return (
    <div className="p-5 rounded-2xl border bg-card shadow-card">
      <div className="flex flex-wrap gap-2">
        {scenarios.map((x, i) => (
          <button
            key={x.title}
            onClick={() => reset(i)}
            className={`px-3 py-1.5 rounded-lg border text-sm ${i === si ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}
          >
            {x.title}
          </button>
        ))}
      </div>
      <p className="mt-4 leading-relaxed">{s.situation}</p>
      <ol className="mt-4 flex gap-2 text-xs">
        {stepNames.map((n, i) => (
          <li
            key={n}
            className={`px-2.5 py-1 rounded-full border ${step > i ? "bg-emerald-500/10 border-emerald-500/40" : step === i ? "border-primary text-primary" : "text-muted-foreground"}`}
          >
            {i + 1}. {n}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="mt-4 space-y-3 text-sm">
          <div className="font-medium">Savolga javob berish uchun qaysi ma'lumotlar kerak?</div>
          <div className="grid sm:grid-cols-2 gap-2">
            {s.data.map((d, i) => (
              <label key={d.label} className="flex items-center gap-2 rounded-lg border p-2">
                <input
                  type="checkbox"
                  checked={!!picked[i]}
                  onChange={(e) => setPicked((p) => ({ ...p, [i]: e.target.checked }))}
                />
                {d.label}
              </label>
            ))}
          </div>
          <div className="font-medium">Qaysi model vaziyatni to'g'ri ifodalaydi?</div>
          <div className="flex flex-wrap gap-2">
            {s.models.map((m, i) => (
              <button
                key={m}
                type="button"
                onClick={() => setModel(i)}
                className={`px-3 py-1.5 rounded-lg border ${model === i ? "border-primary bg-primary/10" : "hover:border-primary/40"}`}
              >
                {m}
              </button>
            ))}
          </div>
          <Button size="sm" onClick={checkFormulate}>
            Tekshirish
          </Button>
        </div>
      )}
      {step === 1 && (
        <div className="mt-4 space-y-3 text-sm">
          <div className="font-medium">{s.employ.question}</div>
          <div className="flex items-center gap-2">
            <input
              value={num}
              onChange={(e) => setNum(e.target.value)}
              className="w-48 px-3 py-2 rounded-lg border bg-background"
              aria-label="Hisoblash natijasi"
            />
            <span className="text-muted-foreground">{s.employ.unit}</span>
          </div>
          <Button size="sm" onClick={checkEmploy}>
            Tekshirish
          </Button>
        </div>
      )}
      {step === 2 && (
        <div className="mt-4 space-y-3 text-sm">
          <div className="font-medium">{s.interpret.question}</div>
          <div className="space-y-2">
            {s.interpret.options.map((o, i) => (
              <button
                key={o}
                type="button"
                onClick={() => setInterp(i)}
                className={`block w-full text-left px-3 py-2 rounded-lg border ${interp === i ? "border-primary bg-primary/10" : "hover:border-primary/40"}`}
              >
                {o}
              </button>
            ))}
          </div>
          <Button size="sm" onClick={checkInterpret}>
            Tekshirish
          </Button>
        </div>
      )}
      {step === 3 && (
        <div className="mt-4 text-sm font-medium text-emerald-700 dark:text-emerald-400">
          Sikl yakunlandi. Keyingi vaziyatni tanlang.
        </div>
      )}
      {msg && (
        <p
          className={`mt-3 text-sm flex gap-2 rounded-lg p-3 ${msg.ok ? "bg-emerald-500/10" : "bg-amber-500/10"}`}
        >
          <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" /> {msg.text}
        </p>
      )}
    </div>
  );
}
