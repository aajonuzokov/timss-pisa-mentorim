import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Printer, RefreshCw, Hourglass } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ParticipantForm, isParticipantValid } from "@/components/ParticipantForm";
import { ReflectionForm } from "@/components/ReflectionForm";
import { TEST_TYPES, versionOf, withVersion, type TestKey } from "@/data/bank";
import { DIAG_BLOCKS, DIAG_MAX, type DiagAnswer, type DiagItem } from "@/data/diag";
import { autoPoints, isDiagAnswered, scoreDiag } from "@/lib/diagScore";
import { COMPONENT_LABEL } from "@/lib/components";
import { pctOf } from "@/lib/levels";
import { newResultId, saveResult } from "@/lib/saveResult";
import {
  META_KEY,
  clearDraft,
  emptyParticipant,
  generateCode,
  loadDraft,
  loadProfile,
  saveDraft,
  saveProfile,
  type Meta,
  type Participant,
  type Stage,
} from "@/lib/participant";

type Props = {
  items: DiagItem[];
  testKey: TestKey;
  stage: Stage;
  label: string;
  /** Natijadan keyin namunaviy javob va rubrikani ko'rsatish (yakuniy testda). */
  showKey?: boolean;
};

type SaveState = "idle" | "saving" | "saved" | "error";

const TEXT_MAX = 1500;

/** Dissertatsiyaning diagnostik testi: 20 ta ochiq topshiriq, 0–2 ball, jami 40 ball. */
export function DiagTest({ items, testKey, stage, label, showKey = false }: Props) {
  const [answers, setAnswers] = useState<Record<string, DiagAnswer>>({});
  const [participant, setParticipant] = useState<Participant>(emptyParticipant);
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString());
  const [completedAt, setCompletedAt] = useState("");
  const [resultId, setResultId] = useState("");
  const [restored, setRestored] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const draftKey = `${testKey}:${stage}`;
  const testType = withVersion(TEST_TYPES[testKey], versionOf(testKey));

  useEffect(() => {
    const prof = loadProfile();
    setParticipant({ ...prof, code: prof.code || generateCode() });
    const d = loadDraft<DiagAnswer>(draftKey);
    if (d && Object.keys(d.answers).length) {
      setAnswers(d.answers);
      setStartedAt(d.startedAt);
      setRestored(Object.values(d.answers).filter(isDiagAnswered).length);
    }
    setHydrated(true);
  }, [draftKey]);

  useEffect(() => {
    if (hydrated) saveProfile(participant);
  }, [participant, hydrated]);

  useEffect(() => {
    if (!hydrated || submitted || !Object.keys(answers).length) return;
    saveDraft(draftKey, { answers, startedAt, page: 0, savedAt: new Date().toISOString() });
  }, [answers, startedAt, hydrated, submitted, draftKey]);

  const score = useMemo(() => scoreDiag(items, answers), [items, answers]);
  const autoMax = items.reduce((s, it) => s + (it.auto?.points ?? 0), 0);
  const empty = items.length - score.answered;
  const participantValid = isParticipantValid(participant);

  const set = (id: string, patch: Partial<DiagAnswer>) => {
    if (submitted) return;
    setAnswers((p) => ({ ...p, [id]: { ...p[id], ...patch } }));
  };

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const save = async (doneAt: string, id: string) => {
    setSaveState("saving");
    const clean = Object.fromEntries(
      items
        .filter((it) => isDiagAnswered(answers[it.id]))
        .map((it) => {
          const a = answers[it.id];
          return [
            it.id,
            {
              ...(a.j?.trim() ? { j: a.j.trim().slice(0, 100) } : {}),
              ...(a.t?.trim() ? { t: a.t.trim().slice(0, TEXT_MAX) } : {}),
            },
          ];
        }),
    );
    const { error } = await saveResult({
      id,
      full_name: participant.full_name.trim(),
      university: participant.university.trim(),
      course: participant.course,
      test_type: testType,
      // Dastlabki ball: faqat avtomatik tekshiriladigan qismlar. Yakuniy ball — o'qituvchi rubrikasi.
      score: score.auto,
      total_questions: DIAG_MAX,
      percentage: pctOf(score.auto, DIAG_MAX),
      level: "Baholash kutilmoqda",
      answers: {
        ...clean,
        [META_KEY]: {
          code: participant.code,
          stage,
          group: participant.group,
          consent: participant.consent,
          v: 1,
        } satisfies Meta,
      },
      started_at: startedAt,
      completed_at: doneAt,
    });
    if (error) {
      console.error("[test_results] save failed", error);
      setSaveState("error");
      toast.error('Javoblar saqlanmadi. Internetni tekshirib, "Qayta yuborish"ni bosing.');
    } else {
      setSaveState("saved");
      clearDraft(draftKey);
      toast.success("Javoblar saqlandi");
    }
  };

  const submit = async () => {
    setTriedSubmit(true);
    if (!participantValid) {
      toast.error(
        participant.consent
          ? "Iltimos, F.I.Sh., universitet, kurs va ishtirokchi kodini to'g'ri kiriting."
          : "Natijani yuborish uchun ma'lumotlardan foydalanishga rozilik belgilang.",
      );
      scrollTop();
      return;
    }
    if (score.answered === 0) {
      toast.error("Hali birorta topshiriqqa javob yozilmagan.");
      return;
    }
    if (
      empty > 0 &&
      !window.confirm(`${empty} ta topshiriq bo'sh qoldi (0 ball). Javoblarni baribir yuborasizmi?`)
    )
      return;
    const doneAt = new Date().toISOString();
    const id = newResultId();
    setCompletedAt(doneAt);
    setResultId(id);
    setSubmitted(true);
    scrollTop();
    await save(doneAt, id);
  };

  const reset = () => {
    clearDraft(draftKey);
    setAnswers({});
    setRestored(0);
    setSubmitted(false);
    setTriedSubmit(false);
    setSaveState("idle");
    setStartedAt(new Date().toISOString());
    scrollTop();
  };

  return (
    <div className="space-y-6" ref={topRef}>
      {submitted && (
        <>
          {saveState === "error" && (
            <div className="p-4 rounded-2xl border border-red-500/40 bg-red-500/10 flex flex-col sm:flex-row sm:items-center gap-3 justify-between print:hidden">
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                Javoblar hali saqlanmadi. Sahifani yopmang va qayta yuboring.
              </div>
              <Button size="sm" onClick={() => save(completedAt, resultId)}>
                Qayta yuborish
              </Button>
            </div>
          )}
          <div className="p-6 rounded-2xl border bg-card shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Javoblar qabul qilindi · {label}
                </div>
                <div className="mt-2 flex items-center gap-2 text-lg font-semibold">
                  <Hourglass className="w-5 h-5 text-amber-600" /> O'qituvchi baholashi kutilmoqda
                </div>
                <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                  Test 20 ta topshiriqdan iborat, har biri 0–2 ball (jami 40 ball). Hisoblash
                  natijalari avtomatik tekshirildi:{" "}
                  <b>
                    {score.auto} / {autoMax} ball
                  </b>
                  . Yechimning asoslanishi, metodik va refleksiv javoblarni o'qituvchi
                  dissertatsiyadagi baholash rubrikasi (Ilova 5) bo'yicha baholaydi. Yakuniy ball,
                  daraja (past 0–20, o'rta 21–30, yuqori 31–40) va 5 komponent bo'yicha profil{" "}
                  <Link to="/portfolio" className="text-primary hover:underline">
                    E-portfolio
                  </Link>{" "}
                  sahifasida chiqadi.
                </p>
                <div className="mt-3 text-sm text-muted-foreground">
                  {participant.full_name} · Kod:{" "}
                  <span className="font-mono">{participant.code}</span> · Javob berilgan:{" "}
                  {score.answered}/{items.length}
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
          {saveState === "saved" && (
            <ReflectionForm code={participant.code} resultId={resultId} testType={testType} />
          )}
        </>
      )}

      {!submitted && (
        <ParticipantForm
          participant={participant}
          setParticipant={setParticipant}
          stage={stage}
          setStage={() => undefined}
          fixedStage={stage}
          triedSubmit={triedSubmit}
        />
      )}

      {!submitted && restored > 0 && (
        <div className="p-4 rounded-2xl border border-primary/30 bg-primary/5 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>Avvalgi urinishingizdagi {restored} ta javob tiklandi.</span>
          <Button variant="outline" size="sm" onClick={reset}>
            Boshidan boshlash
          </Button>
        </div>
      )}

      {DIAG_BLOCKS.map((b) => {
        const list = items.filter((it) => it.block === b.n);
        if (!list.length) return null;
        return (
          <section key={b.n} className="space-y-4">
            <h3 className="font-semibold text-lg pt-2">
              {b.title}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                · {COMPONENT_LABEL[b.component]} · {list.length * 2} ball
              </span>
            </h3>
            {list.map((it) => {
              const a = answers[it.id] ?? {};
              const ap = autoPoints(it, a);
              return (
                <div
                  key={it.id}
                  data-qid={it.id}
                  className="p-6 rounded-2xl border bg-card shadow-card break-inside-avoid"
                >
                  <div className="text-xs text-muted-foreground font-medium mb-2">
                    {it.n}-topshiriq · 0–2 ball
                  </div>
                  <h4 className="font-semibold mb-2">{it.title}</h4>
                  <p className="leading-relaxed">{it.q}</p>
                  {it.parts && (
                    <ol className="mt-2 list-decimal pl-5 text-sm space-y-0.5">
                      {it.parts.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ol>
                  )}
                  {it.auto && (
                    <label className="block mt-4 text-sm">
                      <span className="block text-xs text-muted-foreground mb-1">
                        {it.auto.label}
                      </span>
                      <input
                        type="text"
                        maxLength={100}
                        disabled={submitted}
                        value={a.j ?? ""}
                        onChange={(e) => set(it.id, { j: e.target.value })}
                        aria-label={`${it.n}-topshiriq: qisqa javob`}
                        className="w-full sm:w-80 px-4 py-2.5 rounded-lg border bg-background"
                      />
                    </label>
                  )}
                  <label className="block mt-3 text-sm">
                    <span className="block text-xs text-muted-foreground mb-1">
                      {it.auto ? "Yechim va izoh" : "Javobingiz"}
                    </span>
                    <textarea
                      rows={it.auto ? 3 : 5}
                      maxLength={TEXT_MAX}
                      disabled={submitted}
                      value={a.t ?? ""}
                      onChange={(e) => set(it.id, { t: e.target.value })}
                      aria-label={`${it.n}-topshiriq: javob`}
                      className="w-full px-3 py-2 rounded-lg border bg-background"
                    />
                  </label>
                  {submitted && it.auto && (
                    <p className="mt-2 text-sm flex items-center gap-1.5">
                      {ap ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                      )}
                      Hisoblash qismi: {ap ? `to'g'ri (+${ap} dastlabki ball)` : "mos kelmadi"}
                      {showKey && ` · To'g'ri javob: ${it.auto.shown}`}
                    </p>
                  )}
                  {submitted && showKey && (
                    <div className="mt-3 p-3 rounded-xl bg-muted text-sm space-y-2">
                      <div>
                        <span className="font-semibold">Kutiladigan javob: </span>
                        {it.expected}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        2 ball — {it.rubric[0]} 1 ball — {it.rubric[1]}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        );
      })}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-5 rounded-2xl border bg-card shadow-card print:hidden">
        {!submitted ? (
          <>
            <div className="text-sm text-muted-foreground">
              Javob yozilgan: <b>{score.answered}</b> / {items.length}. Javoblar shu qurilmada
              avtomatik saqlanib boradi.
            </div>
            <Button onClick={submit} disabled={saveState === "saving"}>
              Javoblarni yuborish
            </Button>
          </>
        ) : (
          <>
            <div className="text-sm text-muted-foreground">
              Testni qayta topshirsangiz, monitoringda birinchi to'liq urinish hisobga olinadi.
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
