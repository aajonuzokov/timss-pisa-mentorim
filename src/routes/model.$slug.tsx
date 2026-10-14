import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Printer } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { AppLink } from "@/components/ModelScheme";
import { Components36, Final37, Levels35 } from "@/components/DissResults";
import { BLOCKS, MODEL_TITLE, findBlock, type Block, type Item } from "@/data/model";

export const Route = createFileRoute("/model/$slug")({
  head: ({ params }) => {
    const b = findBlock(params.slug);
    return {
      meta: [
        { title: b ? `${b.title} — Metodik model` : "Metodik model" },
        { name: "description", content: b?.lead ?? MODEL_TITLE },
      ],
    };
  },
  loader: ({ params }) => {
    const block = findBlock(params.slug);
    if (!block) throw notFound();
    return { block };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-bold mb-3">Blok topilmadi</h1>
        <Link to="/model" className="text-primary underline">
          Modelga qaytish
        </Link>
      </div>
    </SiteLayout>
  ),
  component: Page,
});

function Links({ links }: { links?: Item["links"] }) {
  if (!links?.length) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-2 print:hidden">
      {links.map((l) =>
        l.status === "ishlaydi" ? (
          <AppLink
            key={l.label + l.to}
            to={l.to}
            className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/10"
          >
            {l.label} <ArrowRight className="w-3 h-3" />
          </AppLink>
        ) : (
          <span
            key={l.label + l.to}
            className="inline-flex items-center rounded-full border border-dashed px-3 py-1 text-xs text-muted-foreground"
          >
            {l.label} — rejada
          </span>
        ),
      )}
    </div>
  );
}

function BlockBody({ block }: { block: Block }) {
  return (
    <div className="space-y-10">
      {block.sections.map((s) => (
        <section key={s.title} className="break-inside-avoid">
          <h2 className="text-xl md:text-2xl font-semibold mb-3">{s.title}</h2>
          {s.lead && <p className="leading-relaxed mb-4">{s.lead}</p>}
          {s.items && (
            <div className="grid md:grid-cols-2 gap-4">
              {s.items.map((it) => (
                <article key={it.name} className="p-5 rounded-2xl border bg-card shadow-card">
                  <h3 className="font-semibold">{it.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {it.text}
                    {it.source && <span className="ml-1 text-foreground/70">{it.source}</span>}
                  </p>
                  <Links links={it.links} />
                </article>
              ))}
            </div>
          )}
          {s.steps && (
            <ol
              className={`grid sm:grid-cols-2 gap-3 ${s.steps.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
            >
              {s.steps.map((st, i) => (
                <li key={st.name} className="p-4 rounded-xl border bg-card">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="font-semibold">{st.name}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{st.text}</p>
                  <Links links={st.links} />
                </li>
              ))}
            </ol>
          )}
          {s.table && (
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr className="text-left">
                    {s.table.head.map((h) => (
                      <th key={h} className="px-3 py-2 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.table.rows.map((r, i) => (
                    <tr key={i} className="border-t align-top">
                      {r.map((c, j) => (
                        <td key={j} className={`px-3 py-2 ${j === 0 ? "font-medium" : ""}`}>
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {s.note && (
            <p className="mt-4 border-l-4 border-primary bg-muted/60 px-4 py-3 text-sm leading-relaxed">
              {s.note}
            </p>
          )}
        </section>
      ))}
    </div>
  );
}

function Page() {
  const { block } = Route.useLoaderData() as { block: Block };
  const i = BLOCKS.findIndex((b) => b.slug === block.slug);
  const prev = BLOCKS[i - 1];
  const next = BLOCKS[i + 1];
  return (
    <SiteLayout>
      <header className="border-b bg-gradient-soft">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <Link
            to="/model"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary print:hidden"
          >
            <ArrowLeft className="w-4 h-4" /> Model sxemasi
          </Link>
          <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-accent">
            {block.n}-blok · {MODEL_TITLE}
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">{block.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground max-w-3xl">
            {block.lead}
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">Manbalar: {block.sources}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="print:hidden"
            >
              <Printer className="w-4 h-4 mr-2" /> Chop etish / PDF
            </Button>
          </div>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        <BlockBody block={block} />
        {block.slug === "natijaviy" && (
          <section className="space-y-5">
            <h2 className="text-xl md:text-2xl font-semibold">Tajriba-sinov dalili</h2>
            <Levels35 />
            <Components36 />
            <Final37 />
          </section>
        )}
        {block.slug === "diagnostik" && (
          <section className="space-y-5">
            <h2 className="text-xl md:text-2xl font-semibold">
              Diagnostika natijasi (dissertatsiya)
            </h2>
            <Levels35 />
          </section>
        )}
        <nav className="flex justify-between gap-3 border-t pt-6 print:hidden">
          {prev ? (
            <AppLink to={`/model/${prev.slug}`} className="text-sm text-primary hover:underline">
              ← {prev.title}
            </AppLink>
          ) : (
            <span />
          )}
          {next && (
            <AppLink to={`/model/${next.slug}`} className="text-sm text-primary hover:underline">
              {next.title} →
            </AppLink>
          )}
        </nav>
      </div>
    </SiteLayout>
  );
}
