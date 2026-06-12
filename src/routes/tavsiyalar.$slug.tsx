import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { findTavsiya } from "@/data/tavsiyalar";
import { Target, Sparkles, ListChecks, FileText, Gauge, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/tavsiyalar/$slug")({
  head: ({ params }) => {
    const t = findTavsiya(params.slug);
    return {
      meta: [
        { title: t ? `${t.title} — Metodik tavsiyalar` : "Metodik tavsiya" },
        { name: "description", content: t?.short ?? "Metodik tavsiya tafsilotlari." },
      ],
    };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-bold mb-3">Tavsiya topilmadi</h1>
        <Link to="/tavsiyalar" className="text-primary underline">Tavsiyalarga qaytish</Link>
      </div>
    </SiteLayout>
  ),
  loader: ({ params }) => {
    const tavsiya = findTavsiya(params.slug);
    if (!tavsiya) throw notFound();
    return { tavsiya };
  },
  component: Page,
});

function Block({ icon: Icon, title, children, tone = "primary" }: { icon: any; title: string; children: React.ReactNode; tone?: "primary" | "accent" }) {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-card">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground ${tone === "accent" ? "bg-accent" : "bg-gradient-hero"}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="font-display text-xl font-semibold">{title}</h2>
      </div>
      <div className="text-foreground/90 leading-relaxed">{children}</div>
    </div>
  );
}

function Page() {
  const { tavsiya } = Route.useLoaderData();
  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-gradient-soft" />
        <div className="max-w-5xl mx-auto px-6 py-14">
          <Link to="/tavsiyalar" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> Metodik tavsiyalar
          </Link>
          <span className="inline-block px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-medium uppercase tracking-wider mb-4">
            {tavsiya.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">{tavsiya.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">{tavsiya.short}</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-6">
        <Block icon={Target} title="Tavsiyaning maqsadi">
          <p>{tavsiya.maqsad}</p>
        </Block>
        <Block icon={Sparkles} title="Rivojlantiriladigan kompetensiya" tone="accent">
          <p>{tavsiya.kompetensiya}</p>
        </Block>
        <Block icon={ListChecks} title="Metodik algoritm">
          <ol className="space-y-2 list-decimal list-inside">
            {tavsiya.algoritm.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </Block>
        <Block icon={FileText} title="Namunaviy topshiriq" tone="accent">
          <p>{tavsiya.topshiriq}</p>
        </Block>
        <div className="md:col-span-2">
          <Block icon={Gauge} title="Baholash mezoni">
            <ul className="space-y-2 list-disc list-inside">
              {tavsiya.mezon.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </Block>
        </div>
      </section>
    </SiteLayout>
  );
}
