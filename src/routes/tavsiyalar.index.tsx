import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { categories } from "@/data/tavsiyalar";
import { BookOpen, Compass, GitBranch, GraduationCap, ClipboardList, ArrowRight } from "lucide-react";

const iconMap = { BookOpen, Compass, GitBranch, GraduationCap, ClipboardList } as const;

const directRoutes: Record<string, string> = {
  knowing: "/timss-knowing",
  applying: "/timss-applying",
  reasoning: "/timss-reasoning",
  formulate: "/pisa-formulate",
  employ: "/pisa-employ",
  interpret: "/pisa-interpret",
  modellashtirish: "/mathematical-modeling",
  mkt: "/mkt",
  diagnostika: "/assessment",
};

export const Route = createFileRoute("/tavsiyalar/")({
  head: () => ({
    meta: [
      { title: "Metodik tavsiyalar — TIMSS/PISA Platformasi" },
      { name: "description", content: "TIMSS, PISA, matematik modellashtirish, MKT va diagnostika bo'yicha metodik tavsiyalar to'plami." },
    ],
  }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Akademik resurslar"
        title="Metodik tavsiyalar"
        description="Bo'lajak boshlang'ich sinf o'qituvchilari uchun TIMSS, PISA, matematik modellashtirish, MKT va diagnostika yo'nalishlari bo'yicha ilmiy-metodik tavsiyalar."
      />
      <section className="max-w-7xl mx-auto px-6 py-12 space-y-14">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon as keyof typeof iconMap] ?? BookOpen;
          return (
            <div key={cat.key} className="animate-fade-up">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-hero text-primary-foreground flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">{cat.title}</h2>
                  <p className="text-muted-foreground mt-1 max-w-3xl">{cat.desc}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {cat.items.map((item) => {
                  const target = directRoutes[item.slug];
                  const go = () => {
                    if (target) navigate({ to: target });
                    else navigate({ to: "/tavsiyalar/$slug", params: { slug: item.slug } });
                  };
                  return (
                    <div
                      key={item.slug}
                      role="button"
                      tabIndex={0}
                      onClick={go}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          go();
                        }
                      }}
                      className="group rounded-2xl border bg-card p-6 shadow-card hover:shadow-elegant transition-all hover:-translate-y-1 flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <span className="text-xs uppercase tracking-wider text-accent font-medium mb-2">{cat.title}</span>
                      <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-sm text-muted-foreground flex-1">{item.short}</p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          go();
                        }}
                        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary cursor-pointer self-start hover:underline"
                      >
                        Batafsil <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div className="sr-only">
          <Link to="/timss-knowing">k</Link>
          <Link to="/timss-applying">a</Link>
          <Link to="/timss-reasoning">r</Link>
          <Link to="/pisa-formulate">f</Link>
          <Link to="/pisa-employ">e</Link>
          <Link to="/pisa-interpret">i</Link>
          <Link to="/mathematical-modeling">m</Link>
          <Link to="/mkt">x</Link>
          <Link to="/assessment">d</Link>
        </div>
      </section>
    </SiteLayout>
  );
}
