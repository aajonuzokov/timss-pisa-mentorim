import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Microscope, Route as RouteIcon } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { AppLink } from "@/components/ModelScheme";
import { COMPONENT_LABEL } from "@/lib/components";
import { MODULE_HOURS, MODULES, VARIATIV_MODUL } from "@/data/modules";

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

const STEPS = [
  "Nazariya",
  "Namunaviy tahlil",
  "Mashq",
  "Metodik topshiriq",
  "Ijodiy-tadqiqotchilik",
  "Refleksiya",
];

function Page() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Variativ modul"
        title={VARIATIV_MODUL}
        description={`Matematik tayyorgarlikning 5 komponentiga mos 5 tarkibiy modul. Hajmi ${MODULE_HOURS.total} soat: ${MODULE_HOURS.practice} soat amaliy mashg'ulot, ${MODULE_HOURS.independent} soat mustaqil ta'lim. Qaysi moduldan boshlash kerakligini E-portfoliodagi "Mening yo'lim" ko'rsatadi.`}
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
            <p className="mt-3 text-sm text-muted-foreground">
              Avtoreferatdagi tuzilma: nazariy qism va metodik tavsiyalar → TIMSS va PISA tipidagi
              topshiriqlar → amaliy metodik ishlar (o'quvchi xatolarini tahlil qilish, topshiriqni
              moslashtirish, Microteaching) → refleksiya va E-Portfolio. Topshiriqlar daraja
              bo'yicha tabaqalashtirilgan: past darajaga qo'llab-quvvatlovchi, o'rta darajaga
              rivojlantiruvchi, yuqori darajaga ijodiy-tadqiqotchilik topshiriqlari.
            </p>
          </div>
          <AppLink
            to="/portfolio"
            className="p-5 rounded-2xl border border-primary/30 bg-primary/5 shadow-card hover:border-primary"
          >
            <div className="font-semibold flex items-center gap-2">
              <RouteIcon className="w-5 h-5 text-primary" /> Mening yo'lim
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Kirish diagnostikasi natijangizga qarab har bir modul uchun yo'lingizni ko'ring:
              qo'llab-quvvatlovchi, rivojlantiruvchi yoki ijodiy-tadqiqotchilik.
            </p>
          </AppLink>
        </div>

        <figure className="p-5 rounded-2xl border bg-card shadow-card">
          <figcaption className="font-semibold mb-3">
            Variativ modulning tuzilmasi (avtoreferat, 1-jadval)
          </figcaption>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr className="text-left">
                  <th className="px-3 py-2">Tarkibiy modul</th>
                  <th className="px-3 py-2">Xalqaro asos</th>
                  <th className="px-3 py-2">Asosiy mazmun va amaliy faoliyat</th>
                  <th className="px-3 py-2">Rivojlanadigan komponent</th>
                </tr>
              </thead>
              <tbody>
                {MODULES.map((m) => (
                  <tr key={m.key} className="border-t align-top">
                    <td className="px-3 py-2 font-medium">
                      <AppLink to={`/modullar/${m.key}`} className="hover:text-primary">
                        {m.n}-modul. {m.title}
                      </AppLink>
                    </td>
                    <td className="px-3 py-2">{m.basis}</td>
                    <td className="px-3 py-2">{m.activity}</td>
                    <td className="px-3 py-2">
                      {COMPONENT_LABEL[m.key].replace(/ va .*| \(MKT\)/, "")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </figure>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map((m) => (
            <AppLink
              key={m.key}
              to={`/modullar/${m.key}`}
              className="group p-5 rounded-2xl border bg-card shadow-card transition hover:-translate-y-0.5 hover:border-primary"
            >
              <div className="text-xs font-semibold text-accent uppercase tracking-wide">
                {m.n}-modul · {m.basis}
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
