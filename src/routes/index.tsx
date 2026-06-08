import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TIMSS/PISA Metodik Resurs — Boshlang'ich sinf o'qituvchilari uchun" },
      { name: "description", content: "Bo'lajak boshlang'ich sinf o'qituvchilarini TIMSS/PISA integratsiyalashgan xalqaro baholash dasturi asosida o'qitishga metodik tayyorgarligini takomillashtirish bo'yicha multimediyali elektron ta'lim resursi." },
      { property: "og:title", content: "TIMSS/PISA Metodik Resurs" },
      { property: "og:description", content: "Multimediyali elektron ta'lim resursi: 100+ animatsiya, 250+ test, 15+ video va boshqalar." },
    ],
  }),
  component: Home,
});

const stats = [
  { n: "100+", label: "Animatsiya" },
  { n: "250", label: "TIMSS testlari" },
  { n: "130", label: "Mavzuli rasm" },
  { n: "40+", label: "Mustahkamlash mashqlari" },
  { n: "15+", label: "Video dars" },
  { n: "15", label: "Audio dars" },
  { n: "15", label: "Qiziqarli ma'lumotlar" },
  { n: "10", label: "Mantiqiy savollar" },
];

const features = [
  { title: "TIMSS/PISA tasnifi", desc: "Xalqaro baholash dasturining to'liq tasnifi va tuzilishi bilan tanishuv.", icon: "📊" },
  { title: "Test formatlari", desc: "Barcha test turlari va ularning formatlari bo'yicha batafsil ko'rsatmalar.", icon: "📝" },
  { title: "Yechish bo'yicha yo'riqnoma", desc: "TIMSS/PISA testlarini samarali yechish bo'yicha bosqichma-bosqich qo'llanma.", icon: "🎯" },
  { title: "Interaktiv animatsiyalar", desc: "100 dan ortiq animatsiya orqali murakkab tushunchalarni sodda tushuntirish.", icon: "🎬" },
  { title: "Video va audio darslar", desc: "Multimediya formatda dars materiallari — ko'rib va eshitib o'rganing.", icon: "🎧" },
  { title: "Kreativ fikrlash", desc: "130 ta mavzuli rasm orqali o'quvchilarning kreativ fikrlashini rivojlantirish.", icon: "🎨" },
];

function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-primary-foreground font-bold" style={{ background: "var(--gradient-hero)" }}>T</div>
            <span className="font-display text-xl font-semibold">TIMSS·PISA</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#resurs" className="hover:text-foreground transition">Resurs</a>
            <a href="#imkoniyatlar" className="hover:text-foreground transition">Imkoniyatlar</a>
            <a href="#tadqiqot" className="hover:text-foreground transition">Tadqiqot</a>
            <a href="#aloqa" className="hover:text-foreground transition">Aloqa</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-soft)" }} />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl animate-float" style={{ background: "var(--gradient-hero)" }} />
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-xs font-medium tracking-wider uppercase mb-6">
              Pedagogik tadqiqot · Dissertatsiya
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
              Bo'lajak o'qituvchilar uchun{" "}
              <span className="italic" style={{ backgroundImage: "var(--gradient-hero)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                TIMSS/PISA
              </span>{" "}
              metodik resursi
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
              Boshlang'ich sinf o'qituvchilarini xalqaro baholash dasturi asosida o'qitishga metodik tayyorgarligini takomillashtirish maqsadida yaratilgan multimediyali elektron ta'lim resursi.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#resurs" className="px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition" style={{ boxShadow: "var(--shadow-elegant)" }}>
                Resurs bilan tanishish
              </a>
              <a href="#tadqiqot" className="px-7 py-3.5 rounded-full border border-border bg-card hover:bg-muted transition font-medium">
                Tadqiqot natijalari
              </a>
            </div>
          </div>
          <div className="relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="grid grid-cols-2 gap-4">
              {stats.slice(0, 4).map((s, i) => (
                <div key={i} className="p-6 rounded-2xl bg-card border" style={{ boxShadow: "var(--shadow-card)" }}>
                  <div className="text-4xl font-display font-bold mb-1" style={{ backgroundImage: "var(--gradient-hero)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                    {s.n}
                  </div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section id="resurs" className="border-y bg-card">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Resurs tarkibi</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">Multimediyali elektron axborot resursida quyidagi materiallar o'rin olgan:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="group p-6 rounded-2xl border bg-background hover:border-primary transition">
                <div className="text-5xl font-display font-bold mb-2 group-hover:scale-105 transition-transform origin-left">{s.n}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="imkoniyatlar" className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-2xl mb-16">
          <span className="text-sm text-accent font-medium tracking-wider uppercase">Imkoniyatlar</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">Nimalarni o'z ichiga oladi?</h2>
          <p className="text-lg text-muted-foreground">Bo'lajak o'qituvchilarning metodik tayyorgarligini har tomonlama takomillashtirishga qaratilgan kompleks ta'lim muhiti.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-8 rounded-3xl border bg-card hover:-translate-y-1 transition-all duration-300" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Research */}
      <section id="tadqiqot" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 -z-10 opacity-90 bg-foreground" />
        <div className="max-w-5xl mx-auto px-6 text-background">
          <span className="text-sm font-medium tracking-wider uppercase opacity-70">III bob</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-8 text-background">
            Tajriba-sinov ishlarining tashkil etilishi va natijalari
          </h2>
          <div className="grid md:grid-cols-2 gap-10 text-lg leading-relaxed opacity-90">
            <p>
              Dissertatsiyaning uchinchi bobida pedagogik tajriba-sinov ishlarining mazmuni va uni tashkil etish masalalari yoritilgan. Tadqiqot doirasida bo'lajak boshlang'ich sinf o'qituvchilari ishtirokida keng qamrovli sinovlar o'tkazilgan.
            </p>
            <p>
              Tajriba-sinov natijalari multimediyali elektron resursning bo'lajak o'qituvchilarning TIMSS/PISA baholash dasturi asosida o'qitishga metodik tayyorgarligini sezilarli darajada oshirganini ko'rsatdi.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="aloqa" className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ta'lim sifatini birga oshiramiz</h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          Ushbu metodik resurs orqali bo'lajak o'qituvchilarni zamonaviy xalqaro baholash standartlariga moslashtirishga hissa qo'shing.
        </p>
        <a href="mailto:info@example.uz" className="inline-block px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium" style={{ boxShadow: "var(--shadow-elegant)" }}>
          Bog'lanish
        </a>
      </section>

      <footer className="border-t py-10 text-center text-sm text-muted-foreground">
        © 2026 · TIMSS/PISA metodik resurs · Pedagogika fanlari bo'yicha tadqiqot
      </footer>
    </div>
  );
}
