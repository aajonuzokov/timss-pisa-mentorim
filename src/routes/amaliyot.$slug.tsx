import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, type ReactElement } from "react";
import { ArrowLeft, Printer } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { WorkForm } from "@/components/WorkForm";
import {
  ADAPT_FIELDS,
  ADAPT_ITEMS,
  ERROR_FIELDS,
  LESSON_FIELDS,
  LESSON_STUDY_FIELDS,
  MICRO_CRITERIA,
  MICRO_FIELDS,
  PUPIL_ERRORS,
  TOOLS,
  type ToolSlug,
} from "@/data/amaliyot";

export const Route = createFileRoute("/amaliyot/$slug")({
  head: ({ params }) => {
    const t = TOOLS.find((x) => x.slug === params.slug);
    return {
      meta: [
        { title: t ? `${t.title} — Amaliy metodik ishlar` : "Amaliy metodik ishlar" },
        { name: "description", content: t?.desc ?? "Amaliy metodik ishlar" },
      ],
    };
  },
  loader: ({ params }) => {
    const tool = TOOLS.find((x) => x.slug === params.slug);
    if (!tool) throw notFound();
    return { slug: tool.slug };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-bold mb-3">Sahifa topilmadi</h1>
        <Link to="/amaliyot" className="text-primary underline">
          Amaliy ishlarga qaytish
        </Link>
      </div>
    </SiteLayout>
  ),
  component: Page,
});

function Errors() {
  const [grade, setGrade] = useState(0);
  const [sel, setSel] = useState(PUPIL_ERRORS[0].id);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const list = PUPIL_ERRORS.filter((e) => !grade || e.grade === grade);
  const e = PUPIL_ERRORS.find((x) => x.id === sel)!;
  return (
    <div className="grid lg:grid-cols-[300px_minmax(0,1fr)] gap-6">
      <div className="p-4 rounded-2xl border bg-card h-fit">
        <div className="flex gap-1 mb-3 text-sm">
          {[0, 2, 3, 4].map((g) => (
            <button
              key={g}
              onClick={() => setGrade(g)}
              className={`px-2.5 py-1 rounded-lg border ${grade === g ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}
            >
              {g ? `${g}-sinf` : "Hammasi"}
            </button>
          ))}
        </div>
        <ul className="space-y-1 text-sm max-h-[60vh] overflow-y-auto">
          {list.map((x) => (
            <li key={x.id}>
              <button
                onClick={() => setSel(x.id)}
                className={`w-full text-left px-3 py-2 rounded-lg ${sel === x.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"}`}
              >
                {x.id} · {x.topic}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-4">
        <div className="p-5 rounded-2xl border bg-card shadow-card">
          <div className="text-xs text-muted-foreground">
            {e.id} · {e.grade}-sinf · {e.topic}
          </div>
          <div className="mt-2 grid sm:grid-cols-2 gap-3">
            <div className="rounded-xl border p-3">
              <div className="text-xs text-muted-foreground">Topshiriq</div>
              <div className="font-semibold">{e.task}</div>
            </div>
            <div className="rounded-xl border border-red-500/40 bg-red-500/5 p-3">
              <div className="text-xs text-muted-foreground">O'quvchi javobi</div>
              <div className="font-semibold">{e.pupil}</div>
            </div>
          </div>
        </div>
        <div className="p-5 rounded-2xl border bg-card shadow-card">
          <WorkForm
            key={e.id}
            kind="xato-tahlil"
            refId={e.id}
            fields={ERROR_FIELDS}
            onDone={() => setRevealed((r) => ({ ...r, [e.id]: true }))}
          />
        </div>
        {revealed[e.id] ? (
          <div className="p-5 rounded-2xl border border-primary/30 bg-primary/5 text-sm space-y-2">
            <div>
              <b>To'g'ri javob:</b> {e.correct}
            </div>
            <div>
              <b>Namunaviy diagnoz:</b> {e.diagnosis}
            </div>
            <div>
              <b>Sabab:</b> {e.cause}
            </div>
            <div>
              <b>Keyingi qadam:</b> {e.next}
            </div>
          </div>
        ) : (
          <button
            className="text-sm text-muted-foreground underline"
            onClick={() => setRevealed((r) => ({ ...r, [e.id]: true }))}
          >
            Javob yozmasdan namunaviy diagnozni ko'rish
          </button>
        )}
      </div>
    </div>
  );
}

function Adapt() {
  const [sel, setSel] = useState(ADAPT_ITEMS[0]?.id ?? "");
  const item = ADAPT_ITEMS.find((x) => x.id === sel);
  return (
    <div className="grid lg:grid-cols-[300px_minmax(0,1fr)] gap-6">
      <ul className="p-4 rounded-2xl border bg-card h-fit space-y-1 text-sm max-h-[70vh] overflow-y-auto">
        {ADAPT_ITEMS.map((x) => (
          <li key={x.id}>
            <button
              onClick={() => setSel(x.id)}
              className={`w-full text-left px-3 py-2 rounded-lg ${sel === x.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"}`}
            >
              {x.id} · {x.grade === 15 ? "PISA" : "TIMSS 8-sinf"}
              <div className="text-xs text-muted-foreground line-clamp-1">{x.title ?? x.q}</div>
            </button>
          </li>
        ))}
      </ul>
      {item && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl border bg-card shadow-card">
            <div className="text-xs text-muted-foreground">
              Asl topshiriq · {item.source ?? item.id}
            </div>
            {item.title && <div className="font-semibold mt-1">{item.title}</div>}
            <p className="mt-2 leading-relaxed">{item.q}</p>
          </div>
          <div className="p-5 rounded-2xl border bg-card shadow-card">
            <WorkForm key={item.id} kind="moslashtirish" refId={item.id} fields={ADAPT_FIELDS} />
          </div>
        </div>
      )}
    </div>
  );
}

function Micro() {
  const [self, setSelf] = useState<Record<string, number>>({});
  const [attempt, setAttempt] = useState("1-urinish");
  return (
    <div className="p-5 rounded-2xl border bg-card shadow-card">
      <WorkForm
        key={attempt}
        kind="microteaching"
        refId={attempt}
        fields={MICRO_FIELDS}
        extra={{ self }}
        minFilled={3}
      >
        <div className="flex gap-2 text-sm">
          {["1-urinish", "2-urinish"].map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAttempt(a)}
              className={`px-3 py-1.5 rounded-lg border ${attempt === a ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}
            >
              {a}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr className="text-left">
                <th className="px-3 py-2">Mezon</th>
                <th className="px-3 py-2">0 ball</th>
                <th className="px-3 py-2">1 ball</th>
                <th className="px-3 py-2">2 ball</th>
              </tr>
            </thead>
            <tbody>
              {MICRO_CRITERIA.map((c) => (
                <tr key={c.id} className="border-t align-top">
                  <td className="px-3 py-2 font-medium">{c.label}</td>
                  {c.d.map((d, v) => (
                    <td key={v} className="px-2 py-2">
                      <button
                        type="button"
                        onClick={() => setSelf((p) => ({ ...p, [c.id]: v }))}
                        className={`w-full text-left text-xs rounded-lg border p-2 ${self[c.id] === v ? "border-primary bg-primary/10" : "hover:border-primary/40"}`}
                      >
                        {d}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          O'zingizni har bir mezon bo'yicha baholang; o'qituvchi xuddi shu mezonlar bo'yicha baho
          qo'yadi va farq E-portfolioda ko'rinadi.
        </p>
      </WorkForm>
    </div>
  );
}

const BODY: Record<ToolSlug, () => ReactElement> = {
  xatolar: Errors,
  moslashtirish: Adapt,
  "dars-ishlanmasi": () => (
    <div className="p-5 rounded-2xl border bg-card shadow-card">
      <WorkForm kind="dars-ishlanmasi" refId="" fields={LESSON_FIELDS} minFilled={6} />
    </div>
  ),
  microteaching: Micro,
  "lesson-study": () => (
    <div className="p-5 rounded-2xl border bg-card shadow-card">
      <WorkForm kind="lesson-study" refId="" fields={LESSON_STUDY_FIELDS} minFilled={5} />
    </div>
  ),
};

function Page() {
  const { slug } = Route.useLoaderData() as { slug: ToolSlug };
  const tool = TOOLS.find((t) => t.slug === slug)!;
  const Body = BODY[slug];
  return (
    <SiteLayout>
      <header className="border-b bg-gradient-soft">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <Link
            to="/amaliyot"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary print:hidden"
          >
            <ArrowLeft className="w-4 h-4" /> Amaliy metodik ishlar
          </Link>
          <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-accent">
            {tool.tech} · MKT: {tool.mkt}
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">{tool.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-3xl">{tool.desc}</p>
          <ol className="mt-4 list-decimal pl-5 text-sm space-y-1 max-w-3xl">
            {tool.how.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ol>
          {slug === "dars-ishlanmasi" && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4 print:hidden"
              onClick={() => window.print()}
            >
              <Printer className="w-4 h-4 mr-2" /> Bo'sh shablonni chop etish
            </Button>
          )}
        </div>
      </header>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <Body />
      </section>
    </SiteLayout>
  );
}
