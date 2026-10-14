import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, ClipboardList, Dumbbell, NotebookPen, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { AppLink } from "@/components/ModelScheme";
import { WorkForm } from "@/components/WorkForm";
import {
  ConceptCards,
  ModelingTrainer,
  PracticeQuiz,
  SolutionGallery,
} from "@/components/ModuleTools";
import {
  COMPLETE_FIELDS,
  MODULES,
  VARIATIV_MODUL,
  findModule,
  type Module,
} from "@/data/modules";
import { BANK_R1 } from "@/lib/results";

export const Route = createFileRoute("/modullar/$slug")({
  head: ({ params }) => {
    const m = findModule(params.slug);
    return {
      meta: [
        { title: m ? `${m.title} — ${VARIATIV_MODUL}` : VARIATIV_MODUL },
        { name: "description", content: m?.goal ?? VARIATIV_MODUL },
      ],
    };
  },
  loader: ({ params }) => {
    const mod = findModule(params.slug);
    if (!mod) throw notFound();
    return { mod };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-bold mb-3">Modul topilmadi</h1>
        <Link to="/modullar" className="text-primary underline">
          Modullarga qaytish
        </Link>
      </div>
    </SiteLayout>
  ),
  component: Page,
});

const practiceFor = (m: Module) => {
  if (!m.practice) return [];
  const all = BANK_R1[m.practice.from] ?? [];
  const g4 = all.filter((q) => q.grade === 4);
  return [...g4, ...all.filter((q) => q.grade !== 4)].slice(0, m.practice.count);
};

function Step({
  n,
  id,
  icon: Icon,
  title,
  children,
}: {
  n: number;
  id: string;
  icon: typeof BookOpen;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t pt-10">
      <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-3 mb-4">
        <span className="w-9 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">
          {n}
        </span>
        <Icon className="w-5 h-5 text-primary" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function Page() {
  const { mod } = Route.useLoaderData() as { mod: Module };
  const questions = practiceFor(mod);
  const i = MODULES.findIndex((m) => m.key === mod.key);
  const next = MODULES[i + 1];

  return (
    <SiteLayout>
      <header className="border-b bg-gradient-soft">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <Link
            to="/modullar"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" /> {VARIATIV_MODUL}
          </Link>
          <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-accent">
            {mod.n}-modul · {mod.links}
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">{mod.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground max-w-3xl">{mod.goal}</p>
          <nav className="mt-6 flex flex-wrap gap-2 text-sm">
            {["Nazariya", "Namunaviy tahlil", "Mashq", "Metodik topshiriq", "Refleksiya"].map(
              (s, k) => (
                <a
                  key={s}
                  href={`#q${k + 1}`}
                  className="rounded-full border bg-background px-3 py-1 hover:border-primary"
                >
                  {k + 1}. {s}
                </a>
              ),
            )}
          </nav>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        <Step n={1} id="q1" icon={BookOpen} title="Nazariya">
          <div className="space-y-4 leading-relaxed">
            {mod.theory.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          {mod.cards && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Tushuncha kartalari</h3>
              <ConceptCards cards={mod.cards} />
            </div>
          )}
          <p className="mt-4 text-sm">
            Batafsil:{" "}
            <Link
              to="/tavsiyalar/$slug"
              params={{ slug: mod.tavsiya.slug }}
              className="text-primary hover:underline"
            >
              {mod.tavsiya.title} bo'yicha metodik tavsiya
            </Link>
          </p>
        </Step>

        <Step n={2} id="q2" icon={Sparkles} title="Namunaviy tahlil">
          <div className="p-5 rounded-2xl border bg-card shadow-card">
            <h3 className="font-semibold">{mod.example.title}</h3>
            <p className="mt-2 font-medium">{mod.example.task}</p>
            <ol className="mt-3 list-decimal pl-5 space-y-1.5 text-sm">
              {mod.example.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <p className="mt-4 border-l-4 border-primary bg-muted/60 px-4 py-3 text-sm">
              {mod.example.comment}
            </p>
          </div>
          {mod.gallery && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Bir masala — ko'p yechim</h3>
              <SolutionGallery items={mod.gallery} />
            </div>
          )}
        </Step>

        <Step n={3} id="q3" icon={Dumbbell} title="Mashq">
          {mod.scenarios && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Modellashtirish trenajyori</h3>
              <ModelingTrainer scenarios={mod.scenarios} />
            </div>
          )}
          {questions.length > 0 && (
            <>
              <p className="text-sm text-muted-foreground mb-3">
                {mod.practice?.note}. Javoblar bazaga yozilmaydi: har bir topshiriqni tekshirib,
                izohni o'qing.
              </p>
              <PracticeQuiz questions={questions} />
            </>
          )}
          {mod.key === "metodik" && (
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                [
                  "/amaliyot/xatolar",
                  "O'quvchi ishlari banki",
                  "18 ta tipik xato: diagnoz, sabab, keyingi qadam",
                ],
                [
                  "/amaliyot/moslashtirish",
                  "Topshiriqni moslashtirish",
                  "TIMSS 8-sinf va PISA topshirig'ini boshlang'ich sinfga moslash",
                ],
                [
                  "/amaliyot/dars-ishlanmasi",
                  "Dars ishlanmasi",
                  "TIMSS/PISA topshirig'i asosida dars rejasi",
                ],
                [
                  "/amaliyot/microteaching",
                  "Microteaching",
                  "Qisqa dars fragmenti, rubrika va feedback",
                ],
              ].map(([to, t, d]) => (
                <AppLink
                  key={to}
                  to={to}
                  className="p-4 rounded-xl border bg-card hover:border-primary"
                >
                  <div className="font-semibold">{t}</div>
                  <div className="text-sm text-muted-foreground">{d}</div>
                </AppLink>
              ))}
            </div>
          )}
          {mod.key === "refleksiya" && (
            <p className="text-sm leading-relaxed">
              Bu modulda mashq — o'z ishingizni baholash. Diagnostik testlardan keyin har bir
              topshiriqqa o'zingiz 0–2 ball qo'yasiz; E-portfolioda o'qituvchi bahosi bilan farqni
              ko'rasiz.{" "}
              <AppLink to="/sinov" className="text-primary hover:underline">
                Oraliq diagnostikani topshirish →
              </AppLink>
            </p>
          )}
        </Step>

        <Step n={4} id="q4" icon={ClipboardList} title="Metodik topshiriq">
          <p className="mb-4">{mod.methodTask.prompt}</p>
          <div className="p-5 rounded-2xl border bg-card shadow-card">
            <WorkForm
              kind={mod.key === "refleksiya" ? "maqsad" : "modul-metodik"}
              refId={mod.key}
              fields={mod.methodTask.fields}
              minFilled={mod.key === "refleksiya" ? 2 : undefined}
            />
          </div>
        </Step>

        <Step n={5} id="q5" icon={NotebookPen} title="Refleksiya va modulni yakunlash">
          <div className="p-5 rounded-2xl border bg-card shadow-card">
            <WorkForm
              kind="modul-bajarildi"
              refId={mod.key}
              submitLabel="Modulni yakunladim"
              fields={COMPLETE_FIELDS}
            />
          </div>
          {next && (
            <AppLink
              to={`/modullar/${next.key}`}
              className="mt-6 inline-block text-primary font-medium hover:underline"
            >
              Keyingi modul: {next.title} →
            </AppLink>
          )}
        </Step>
      </div>
    </SiteLayout>
  );
}
