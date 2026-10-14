import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Microscope, Route as RouteIcon } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { AppLink } from "@/components/ModelScheme";
import { MODULES, VARIATIV_MODUL } from "@/data/modules";

export const Route = createFileRoute("/modullar/")({
  head: () => ({
    meta: [
      { title: "Variativ modul — TIMSS/PISA Platformasi" },
      {
        name: "description",
        content: `"${VARIATIV_MODUL}" variativ moduli: matematik tayyorgarlikning 5 komponenti bo'yicha o'quv modullari.`,
      },
    ],
  }),
  component: Page,
});

const STEPS = ["Nazariya", "Namunaviy tahlil", "Mashq", "Metodik topshiriq", "Refleksiya"];

function Page() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Variativ modul"
        title={VARIATIV_MODUL}
        description={
          "Matematik tayyorgarlikning 5 komponenti bo'yicha o'quv modullari. Har bir modul bir xil 5 qadamdan iborat; qaysi moduldan boshlash kerakligini E-portfoliodagi \"Mening yo'lim\" ko'rsatadi."
        }
      />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        <div className="grid md:grid-cols-[minmax(0,1fr)_320px] gap-6">
          <div className="p-5 rounded-2xl border bg-card shadow-card">
            <h2 className="font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> Har bir modul tuzilishi
            </h2>
            <ol className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              {STEPS.map((s, i) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="rounded-full border px-3 py-1">
                    {i + 1}. {s}
                  </span>
                  {i < STEPS.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </li>
              ))}
            </ol>
          </div>
          <AppLink
            to="/portfolio"
            className="p-5 rounded-2xl border border-primary/30 bg-primary/5 shadow-card hover:border-primary"
          >
            <div className="font-semibold flex items-center gap-2">
              <RouteIcon className="w-5 h-5 text-primary" /> Mening yo'lim
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Kirish diagnostikasi natijangizga qarab qaysi modul to'liq, qaysi biri qisqa
              bajarilishi kerakligini ko'ring.
            </p>
          </AppLink>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map((m) => (
            <AppLink
              key={m.key}
              to={`/modullar/${m.key}`}
              className="group p-5 rounded-2xl border bg-card shadow-card transition hover:-translate-y-0.5 hover:border-primary"
            >
              <div className="text-xs font-semibold text-accent uppercase tracking-wide">
                {m.n}-modul · {m.links}
              </div>
              <div className="mt-1 text-lg font-semibold group-hover:text-primary">{m.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{m.goal}</p>
            </AppLink>
          ))}
          <AppLink
            to="/amaliyot"
            className="group p-5 rounded-2xl border border-dashed bg-card shadow-card transition hover:border-primary"
          >
            <div className="text-xs font-semibold text-accent uppercase tracking-wide">
              Amaliyot
            </div>
            <div className="mt-1 text-lg font-semibold group-hover:text-primary flex items-center gap-2">
              <Microscope className="w-5 h-5" /> Amaliy metodik ishlar
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              O'quvchi xatolari tahlili, topshiriqni moslashtirish, dars ishlanmasi, Microteaching
              va Lesson Study.
            </p>
          </AppLink>
        </div>
      </section>
    </SiteLayout>
  );
}
