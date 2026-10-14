import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { Components36, Final37, Levels35 } from "@/components/DissResults";
import { CHI2_FINAL, DISS_SAMPLE, TABLE_3_6, fmt } from "@/data/dissResults";

export const Route = createFileRoute("/natijalar")({
  head: () => ({
    meta: [
      { title: "Tajriba-sinov natijalari — TIMSS/PISA Platformasi" },
      {
        name: "description",
        content:
          "Pedagogik tajriba-sinov natijalari: 360 talaba, darajalar dinamikasi, 5 komponent bo'yicha t-mezon, Cohen d va χ².",
      },
    ],
  }),
  component: Page,
});

const dMin = Math.min(...TABLE_3_6.map((r) => r.d));
const dMax = Math.max(...TABLE_3_6.map((r) => r.d));

function Page() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="III bob"
        title="Tajriba-sinov natijalari"
        description="Yakuniy diagnostikada tajriba guruhida yuqori darajadagi talabalar 45%, nazorat guruhida 20% bo'ldi; farq 25 foiz punkt va statistik ahamiyatli."
      />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              n: String(DISS_SAMPLE.total),
              l: `talaba: ${DISS_SAMPLE.tg} TG va ${DISS_SAMPLE.ng} NG`,
            },
            { n: "45% / 20%", l: "yuqori daraja, yakuniy: TG / NG" },
            {
              n: fmt(CHI2_FINAL.chi2, 3),
              l: `Pearson χ², df = ${CHI2_FINAL.df}, p ${CHI2_FINAL.p}`,
            },
            { n: `${fmt(dMin, 3)}–${fmt(dMax, 2)}`, l: "Cohen d, 5 komponent (katta effekt)" },
          ].map((s) => (
            <div key={s.l} className="p-5 rounded-2xl border bg-card shadow-card">
              <div className="text-2xl md:text-3xl font-display font-bold text-gradient tabular-nums">
                {s.n}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="p-5 rounded-2xl border bg-card text-sm leading-relaxed">
          Tajriba-sinov {DISS_SAMPLE.universities.join(", ")} {DISS_SAMPLE.course} ishtirokida
          o'tkazildi. Matematik tayyorgarlik Ilova 1 diagnostik testi (40 ball) va Ilova 5 rubrikasi
          bo'yicha baholandi: past 0–20, o'rta 21–30, yuqori 31–40 ball. Aniqlovchi bosqichda
          guruhlar taqsimoti deyarli bir xil edi (TG: 40,0 / 45,0 / 15,0%; NG: 38,9 / 46,1 / 15,0%).
        </div>

        <Levels35 />
        <Components36 />
        <Final37 />

        <div className="p-5 rounded-2xl border border-primary/30 bg-primary/5 text-sm leading-relaxed">
          Bu sahifadagi raqamlar dissertatsiyaning 3.5–3.7-jadvallaridan olingan. Platformada
          qatnashgan talabalarning haqiqiy natijalari, darajalar taqsimoti va komponentlar bo'yicha
          tahlil{" "}
          <Link to="/monitoring" className="text-primary font-medium hover:underline">
            Monitoring
          </Link>{" "}
          bo'limida ko'rinadi.
        </div>
      </section>
    </SiteLayout>
  );
}
