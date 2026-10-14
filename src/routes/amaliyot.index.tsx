import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { AppLink } from "@/components/ModelScheme";
import { TOOLS } from "@/data/amaliyot";

export const Route = createFileRoute("/amaliyot/")({
  head: () => ({
    meta: [
      { title: "Amaliy metodik ishlar — TIMSS/PISA Platformasi" },
      {
        name: "description",
        content:
          "O'quvchi xatolari tahlili, topshiriqni moslashtirish, dars ishlanmasi, Microteaching va Lesson Study: matematik-metodik kompetentlikni rivojlantirish.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Texnologik blok · MKT"
        title="Amaliy metodik ishlar"
        description="Matematik mazmunni o'qitish faoliyatiga aylantirish mashqlari. Har bir ish ishtirokchi kodingiz bilan E-portfolioga yuboriladi, o'qituvchi 0–2 ball bilan baholaydi va izoh yozadi."
      />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOLS.map((t) => (
          <AppLink
            key={t.slug}
            to={`/amaliyot/${t.slug}`}
            className="group p-5 rounded-2xl border bg-card shadow-card transition hover:-translate-y-0.5 hover:border-primary"
          >
            <div className="text-xs font-semibold text-accent uppercase tracking-wide">
              {t.tech}
            </div>
            <div className="mt-1 text-lg font-semibold group-hover:text-primary">{t.title}</div>
            <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
            <div className="mt-3 text-xs text-muted-foreground">MKT: {t.mkt}</div>
          </AppLink>
        ))}
      </section>
    </SiteLayout>
  );
}
