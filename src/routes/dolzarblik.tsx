import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";

export const Route = createFileRoute("/dolzarblik")({
  head: () => ({
    meta: [
      { title: "Tadqiqot dolzarbligi — TIMSS/PISA Platformasi" },
      { name: "description", content: "TIMSS va PISA xalqaro baholash dasturlarining pedagogik ahamiyati va tadqiqotning dolzarbligi." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="I bob" title="Tadqiqot dolzarbligi" />
      <article className="max-w-3xl mx-auto px-6 py-16 prose prose-lg">
        <p className="text-lg leading-relaxed text-foreground">
          Ta'lim sifatini xalqaro standartlar darajasiga olib chiqish bugungi kunning ustuvor vazifalaridan biridir. TIMSS va PISA xalqaro baholash dasturlari o'quvchilarning matematik savodxonligi va mantiqiy fikrlash darajasini baholashda muhim vosita hisoblanadi. Shu sababli bo'lajak boshlang'ich sinf o'qituvchilarini mazkur dasturlar asosida o'qitishga metodik tayyorlash dolzarb ilmiy-pedagogik muammo hisoblanadi.
        </p>
        <div className="mt-10 grid sm:grid-cols-3 gap-4">
          {[
            { n: "1995", l: "TIMSS dasturining boshlanishi" },
            { n: "2000", l: "PISA dasturining boshlanishi" },
            { n: "80+", l: "Ishtirokchi davlatlar" },
          ].map((x, i) => (
            <div key={i} className="p-5 rounded-2xl border bg-card shadow-card">
              <div className="text-2xl font-display font-bold text-gradient">{x.n}</div>
              <div className="text-sm text-muted-foreground mt-1">{x.l}</div>
            </div>
          ))}
        </div>
      </article>
    </SiteLayout>
  );
}
