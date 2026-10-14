import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { AppLink, ModelScheme } from "@/components/ModelScheme";
import { Components36, Levels35 } from "@/components/DissResults";
import { BLOCKS, MODEL_TITLE } from "@/data/model";

export const Route = createFileRoute("/model/")({
  head: () => ({
    meta: [
      { title: "Metodik model — TIMSS/PISA Platformasi" },
      {
        name: "description",
        content:
          "TIMSS, PISA va MKT integratsiyasiga asoslangan adaptiv strukturaviy-funksional metodik model: 6 blok, 5 komponent, ishlash mexanizmi va tajriba-sinov natijalari.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Dissertatsiya, 2.1-rasm"
        title="Metodik model"
        description={`${MODEL_TITLE}. Model 6 blokdan iborat: har bir blok nomini bosib, uning mazmuni, ilmiy asosi va platformadagi vositalarini ko'ring.`}
      />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        <ModelScheme />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BLOCKS.map((b) => (
            <AppLink
              key={b.slug}
              to={`/model/${b.slug}`}
              className="group p-5 rounded-2xl border bg-card shadow-card transition hover:-translate-y-0.5 hover:border-primary"
            >
              <div className="text-xs font-semibold text-accent uppercase tracking-wider">
                {b.n}-blok
              </div>
              <div className="mt-1 text-lg font-semibold group-hover:text-primary">{b.title}</div>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{b.lead}</p>
            </AppLink>
          ))}
        </div>

        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-semibold">Modelning samaradorligi</h2>
            <p className="text-muted-foreground mt-1">
              Tajriba-sinov natijalari (dissertatsiya, 3-bob).{" "}
              <AppLink to="/natijalar" className="text-primary hover:underline">
                Batafsil natijalar →
              </AppLink>
            </p>
          </div>
          <Levels35 />
          <Components36 />
        </div>
      </section>
    </SiteLayout>
  );
}
