import timssData from "@/data/timss.json";
import pisaData from "@/data/pisa.json";
import released from "@/data/released.json";
import { allTavsiyalar } from "@/data/tavsiyalar";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { BookOpen, Target, FlaskConical, BarChart3, Library, Mail } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TIMSS/PISA Metodik Ta'lim Platformasi" },
      {
        name: "description",
        content:
          "Bo'lajak boshlang'ich sinf o'qituvchilarining TIMSS va PISA xalqaro baholash dasturlari asosida metodik tayyorgarligini rivojlantirish platformasi.",
      },
    ],
  }),
  component: Home,
});

// Raqamlar ma'lumot fayllaridan hisoblanadi.
const bankCount = (o: Record<string, unknown[]>) =>
  Object.values(o).reduce((n, v) => n + v.length, 0);
const stats = [
  {
    n: String(bankCount(timssData as Record<string, unknown[]>)),
    label: "TIMSS mashq topshiriqlari",
  },
  { n: String((pisaData as unknown[]).length), label: "PISA mashq topshiriqlari" },
  {
    n: String(bankCount(released as Record<string, unknown[]>)),
    label: "Rasmiy namunaviy topshiriqlar",
  },
  { n: String(allTavsiyalar.length), label: "Metodik tavsiyalar" },
];

const sections = [
  {
    to: "/dolzarblik",
    icon: Target,
    title: "Tadqiqot dolzarbligi",
    desc: "Xalqaro baholashning pedagogik ahamiyati.",
  },
  {
    to: "/model",
    icon: FlaskConical,
    title: "Metodik model",
    desc: "Besh blokli ilmiy-metodik tizim.",
  },
  {
    to: "/timss",
    icon: BookOpen,
    title: "TIMSS topshiriqlari",
    desc: "Kognitiv sohalar bo'yicha testlar.",
  },
  {
    to: "/pisa",
    icon: BookOpen,
    title: "PISA topshiriqlari",
    desc: "Real hayotiy matematik vaziyatlar.",
  },
  {
    to: "/natijalar",
    icon: BarChart3,
    title: "Tajriba natijalari",
    desc: "Statistik tahlil va diagrammalar.",
  },
  {
    to: "/kutubxona",
    icon: Library,
    title: "Elektron kutubxona",
    desc: "Tegishli adabiyotlar to'plami.",
  },
] as const;

function Home() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-soft" />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl animate-float bg-gradient-hero" />
        <div
          className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl animate-float bg-gradient-hero"
          style={{ animationDelay: "2s" }}
        />
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/15 text-accent text-xs font-medium tracking-wider uppercase mb-6">
              Ilmiy-ta'limiy platforma
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] mb-6">
              Bo'lajak boshlang'ich sinf o'qituvchilarining{" "}
              <span className="italic text-gradient">matematik tayyorgarligini</span> TIMSS/PISA
              asosida rivojlantirish
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
              Ushbu elektron ta'lim platformasi bo'lajak boshlang'ich sinf o'qituvchilarining TIMSS
              va PISA xalqaro baholash dasturlari asosida o'qitishga metodik tayyorgarligini
              rivojlantirish maqsadida ishlab chiqilgan. Platformada metodik model, o'quv
              materiallari, test topshiriqlari, tajriba-sinov natijalari va monitoring vositalari
              jamlangan.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/model"
                className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition shadow-elegant"
              >
                Metodik model bilan tanishish
              </Link>
              <Link
                to="/timss"
                className="px-6 py-3 rounded-full border bg-card hover:bg-muted transition font-medium"
              >
                Test topshiriqlari
              </Link>
            </div>
          </div>
          <div
            className="grid grid-cols-2 gap-4 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            {stats.map((s, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card border shadow-card">
                <div className="text-3xl md:text-4xl font-display font-bold mb-1 text-gradient">
                  {s.n}
                </div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-2xl mb-12">
          <span className="text-sm text-accent font-medium tracking-wider uppercase">
            Platforma bo'limlari
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3">Kompleks ilmiy-metodik muhit</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sections.map((s, i) => {
            const Icon = s.icon;
            return (
              <Link
                key={i}
                to={s.to}
                className="group p-7 rounded-2xl border bg-card hover:-translate-y-1 hover:border-primary transition-all shadow-card"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-hero opacity-95" />
        <div className="max-w-4xl mx-auto px-6 text-center text-primary-foreground">
          <Mail className="w-10 h-10 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
            Hamkorlikka tayyormiz
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Ta'lim sifatini xalqaro standartlar darajasiga olib chiqishda hamkorlik qiling.
          </p>
          <Link
            to="/aloqa"
            className="inline-block px-7 py-3 rounded-full bg-background text-foreground font-medium hover:opacity-90 transition"
          >
            Bog'lanish
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
