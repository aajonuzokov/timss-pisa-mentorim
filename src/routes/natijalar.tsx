import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";

export const Route = createFileRoute("/natijalar")({
  head: () => ({
    meta: [
      { title: "Tajriba-sinov natijalari — TIMSS/PISA Platformasi" },
      { name: "description", content: "Pedagogik tajriba-sinov ishlarining statistik natijalari va tahlili." },
    ],
  }),
  component: Page,
});

const data = [
  { label: "Past", before: 35, after: 8 },
  { label: "O'rta", before: 45, after: 32 },
  { label: "Yuqori", before: 20, after: 60 },
];

function Page() {
  const max = 100;
  return (
    <SiteLayout>
      <PageHeader eyebrow="III bob" title="Tajriba-sinov natijalari" description="Pedagogik tajriba-sinov ishlarining mazmuni, tashkil etilishi va statistik natijalari." />
      <section className="max-w-5xl mx-auto px-6 py-16 space-y-12">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Bilim darajasi dinamikasi</h2>
          <p className="text-muted-foreground mb-8">Eksperiment guruhidagi talabalarning metodik tayyorgarlik darajasi (%).</p>
          <div className="p-6 rounded-2xl border bg-card shadow-card">
            <div className="space-y-6">
              {data.map((d, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{d.label} daraja</span>
                    <span className="text-muted-foreground">{d.before}% → {d.after}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Tajribadan oldin</div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-muted-foreground/40" style={{ width: `${(d.before / max) * 100}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Tajribadan keyin</div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-gradient-hero" style={{ width: `${(d.after / max) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { n: "+40%", l: "Yuqori darajadagi talabalar o'sishi" },
            { n: "186", l: "Tajriba ishtirokchilari" },
            { n: "12 oy", l: "Tajriba muddati" },
          ].map((s, i) => (
            <div key={i} className="p-6 rounded-2xl border bg-card shadow-card text-center">
              <div className="text-3xl font-display font-bold text-gradient mb-1">{s.n}</div>
              <div className="text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
