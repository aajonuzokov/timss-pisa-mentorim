import timssData from "@/data/timss.json";
import pisaData from "@/data/pisa.json";
import released from "@/data/released.json";
import { allTavsiyalar } from "@/data/tavsiyalar";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FolderKanban,
  GraduationCap,
  Library,
  Lightbulb,
  LineChart,
  NotebookPen,
  Sigma,
  UserRoundCheck,
  Users,
  Microscope,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { AppLink } from "@/components/ModelScheme";
import { BLOCKS, MODEL_TITLE } from "@/data/model";
import { COMPONENTS } from "@/lib/components";
import { DIAG_FORMS } from "@/data/diag";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TIMSS-PISA Mentorim — Elektron ta'lim resursi" },
      {
        name: "description",
        content:
          "Xalqaro baholash dasturlari asosida bo'lajak boshlang'ich sinf o'qituvchilarining matematik tayyorgarligini takomillashtirish elektron ta'lim resursi (DGU-38123).",
      },
      { property: "og:title", content: "TIMSS-PISA Mentorim — Elektron ta'lim resursi" },
      {
        property: "og:description",
        content:
          "TIMSS, PISA va MKT integratsiyasi asosida matematik tayyorgarlikni diagnostika qilish, rivojlantirish va monitoring qilish platformasi.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Home,
});

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
  {
    n: String(DIAG_FORMS.A.length + DIAG_FORMS.B.length),
    label: "Diagnostik test topshiriqlari (A va B)",
  },
  { n: String(allTavsiyalar.length), label: "Metodik tavsiyalar" },
  { n: "5", label: "Komponent bo'yicha o'quv modullari" },
];

const contents = [
  ["yol", "O'quv yo'li"],
  ["dolzarblik", "Dolzarblik"],
  ["maqsad", "Maqsad va vazifalar"],
  ["komponentlar", "5 komponent"],
  ["model", "Metodik model"],
  ["imkoniyatlar", "Platforma imkoniyatlari"],
  ["foydalanuvchilar", "Foydalanuvchilar"],
  ["tartib", "Foydalanish tartibi"],
  ["mualliflar", "Mualliflar va guvohnoma"],
] as const;

const path = [
  {
    n: "Kirish diagnostikasi",
    d: "Ilova 1 testi (A shakl), 20 topshiriq, 40 ball",
    to: "/sinov",
    icon: ClipboardCheck,
  },
  {
    n: "Nazariya va tavsiyalar",
    d: "Komponent modullari: past va o'rta darajadagilardan boshlang",
    to: "/modullar",
    icon: BookOpen,
  },
  {
    n: "Mashq va amaliyot",
    d: "TIMSS/PISA topshiriqlari, o'quvchi ishlari tahlili",
    to: "/amaliyot",
    icon: Sigma,
  },
  {
    n: "Refleksiya va E-portfolio",
    d: "Natijalar dinamikasi, o'qituvchi izohi, Mening yo'lim",
    to: "/portfolio",
    icon: NotebookPen,
  },
  {
    n: "Yakuniy test",
    d: "Ilova 1 testi (B shakl), o'sishni ko'ring",
    to: "/sinov",
    icon: LineChart,
  },
];

const tasks = [
  "Matematik tayyorgarlikning tarkibiy komponentlarini yagona tizim asosida integratsiyalash",
  "TIMSS va PISA kompetensiyalarini o'quv mazmuniga moslashtirish",
  "MKT modeli asosida matematik bilimlarni metodik faoliyatga transformatsiya qilish mexanizmlarini ishlab chiqish",
  "Xalqaro baholash talablariga mos didaktik vositalar va topshiriqlar tizimini takomillashtirish",
  "Talabalarning individual rivojlanish trayektoriyasini adaptiv ta'lim muhiti orqali qo'llab-quvvatlash",
  "Matematik tayyorgarlikning rivojlanish dinamikasini diagnostika va monitoring qilish",
];

const capabilities = [
  {
    icon: ClipboardCheck,
    label: "Diagnostik testlar",
    text: "Kirish, oraliq va yakuniy diagnostika",
    to: "/sinov",
  },
  {
    icon: BookOpen,
    label: "Variativ modul",
    text: "5 komponent bo'yicha o'quv modullari",
    to: "/modullar",
  },
  {
    icon: Microscope,
    label: "Amaliy metodik ishlar",
    text: "Xatolar tahlili, moslashtirish, microteaching",
    to: "/amaliyot",
  },
  {
    icon: Sigma,
    label: "Topshiriqlar banki",
    text: "TIMSS, PISA va rasmiy namunaviy topshiriqlar",
    to: "/rasmiy",
  },
  {
    icon: FolderKanban,
    label: "E-portfolio",
    text: "Natijalar tarixi, refleksiya, o'qituvchi izohi",
    to: "/portfolio",
  },
  {
    icon: LineChart,
    label: "Monitoring",
    text: "Dashboard va Learning Analytics (o'qituvchi uchun)",
    to: "/monitoring",
  },
  {
    icon: Lightbulb,
    label: "Metodik tavsiyalar",
    text: "Knowing–Reasoning, Formulate–Interpret, MKT",
    to: "/tavsiyalar",
  },
  {
    icon: Library,
    label: "Elektron kutubxona",
    text: "Adabiyotlar va ilmiy manbalar",
    to: "/kutubxona",
  },
];

const laws = [
  ["O'RQ-637", "2020-yil 23-sentabr", "\"Ta'lim to'g'risida\"gi Qonun"],
  [
    "PF-21",
    "2026-yil 16-fevral",
    "Mamlakat taraqqiyotining 2030-yilgacha ustuvor yo'nalishlari doirasida islohotlarni davom ettirish to'g'risidagi Farmon",
  ],
  [
    "PF-5847",
    "2019-yil 8-oktabr",
    "Oliy ta'lim tizimini 2030-yilgacha rivojlantirish konsepsiyasi",
  ],
  [
    "VMQ-997",
    "2018-yil 8-dekabr",
    "Ta'lim sifatini xalqaro baholash mezonlari asosida takomillashtirishning tashkiliy asoslari (Vazirlar Mahkamasi qarori)",
  ],
];

function H2({ n, title }: { n: number; title: string }) {
  return (
    <div className="mb-5 flex items-start gap-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
        {String(n).padStart(2, "0")}
      </span>
      <h2 className="pt-0.5 text-2xl font-semibold leading-tight md:text-3xl">{title}</h2>
    </div>
  );
}

function Home() {
  return (
    <SiteLayout>
      <header className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-gradient-soft" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 grid lg:grid-cols-[minmax(0,1fr)_380px] gap-10 items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1.5 text-xs font-semibold uppercase text-accent">
              <GraduationCap className="h-4 w-4" /> Elektron ta'lim resursi · DGU-38123
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Xalqaro baholash dasturlari asosida bo'lajak boshlang'ich sinf o'qituvchilarining{" "}
              <span className="text-gradient">matematik tayyorgarligini</span> takomillashtirish
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-2xl">
              TIMSS, PISA va MKT integratsiyasi asosida matematik bilim, tafakkur, savodxonlik,
              matematik-metodik kompetentlik va refleksiv faoliyatni diagnostika qilish,
              rivojlantirish va monitoring qilish platformasi.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <AppLink
                to="/sinov"
                className="px-5 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 shadow-elegant inline-flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4" /> Talabaman
              </AppLink>
              <AppLink
                to="/kabinet"
                className="px-5 py-3 rounded-full border bg-card hover:bg-muted font-medium inline-flex items-center gap-2"
              >
                <UserRoundCheck className="w-4 h-4" /> O'qituvchiman
              </AppLink>
              <AppLink
                to="/model"
                className="px-5 py-3 rounded-full border bg-card hover:bg-muted font-medium inline-flex items-center gap-2"
              >
                <Users className="w-4 h-4" /> Tadqiqotchiman
              </AppLink>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1 border-t pt-4 text-sm">
              <span className="text-muted-foreground">Mualliflar</span>
              <span className="font-semibold">Abdusattarova Z.A.</span>
              <span className="font-semibold">Xamzayev X.</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="p-4 rounded-2xl bg-card border shadow-card">
                <div className="text-2xl md:text-3xl font-display font-bold text-gradient">
                  {s.n}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="lg:hidden sticky top-[57px] z-40 border-b bg-background/95 backdrop-blur">
        <nav
          aria-label="Sahifa mundarijasi"
          className="max-w-7xl mx-auto px-4 py-2 flex gap-2 overflow-x-auto"
        >
          {contents.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="shrink-0 rounded-full border px-3 py-1 text-xs hover:border-primary"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 py-12 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 text-xs font-semibold uppercase text-accent">Mundarija</p>
          <nav aria-label="Sahifa mundarijasi" className="border-l">
            {contents.map(([id, label], i) => (
              <a
                key={id}
                href={`#${id}`}
                className="block border-l-2 border-transparent px-4 py-2 text-sm text-muted-foreground transition hover:border-primary hover:bg-muted hover:text-foreground"
              >
                {i + 1}. {label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 space-y-16">
          <section id="yol" className="scroll-mt-28">
            <H2 n={1} title="O'quv yo'li: beshta qadam" />
            <ol className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {path.map((p, i) => (
                <li key={p.n}>
                  <AppLink
                    to={p.to}
                    className="group block h-full rounded-2xl border bg-card p-4 shadow-card transition hover:border-primary"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        {i + 1}
                      </span>
                      <p.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="mt-3 font-semibold group-hover:text-primary">{p.n}</div>
                    <p className="mt-1 text-xs text-muted-foreground">{p.d}</p>
                  </AppLink>
                </li>
              ))}
            </ol>
          </section>

          <section id="dolzarblik" className="scroll-mt-28 border-t pt-12">
            <H2 n={2} title="Tadqiqot mavzusining dolzarbligi" />
            <div className="space-y-4 leading-8 text-muted-foreground md:text-lg">
              <p>
                Bugungi matematika ta'limining natijadorligi o'quvchining formulalar va qoidalarni
                bilishi bilan emas, balki bilimlarini turli vaziyatlarda qo'llay olishi, matematik
                fikrlashi, muammoni tahlil qilishi va yechimni asoslay olishi bilan belgilanmoqda.
                TIMSS va PISA xalqaro baholash dasturlari aynan shu jihatlarni — bilimni qo'llash,
                mulohaza yuritish, muammoni hal etish va natijani talqin qilishni baholaydi.
              </p>
              <p>
                Bu yondashuv bo'lajak boshlang'ich sinf o'qituvchisidan matematik bilim bilan birga
                o'quvchilarning matematik tafakkurini rivojlantirish, amaliy topshiriqlarni tanlash
                va ularning yechimlarini tahlil qilishga oid metodik ko'nikmalarni ham talab etadi.
                Mathematical Knowledge for Teaching (MKT) konsepsiyasi (Ball, Thames, Phelps)
                o'qituvchining matematik bilimini uni o'qitish faoliyati bilan bog'liq holda ko'rib
                chiqishga imkon beradi.
              </p>
              <p>
                Pedagogika oliy ta'lim muassasalarida TIMSS va PISA bo'yicha ayrim ishlanmalar
                mavjud bo'lsa-da, ularni integratsiyalashgan holda metodik tayyorgarlik tizimiga
                tatbiq etish, matematik savodxonlikka yo'naltirilgan kasbiy kompetensiyalarni
                rivojlantirish va raqamli resurslar asosida individual rivojlanish trayektoriyasini
                shakllantirish yetarlicha tadqiq etilmagan. Aniqlovchi tajribada talabalarning 40%
                ga yaqini past, atigi 15% i yuqori darajada bo'lgan.
              </p>
            </div>
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              {laws.map(([n, d, t]) => (
                <div key={n} className="rounded-lg border bg-card p-4 text-sm">
                  <div className="font-semibold">
                    {n} <span className="font-normal text-muted-foreground">· {d}</span>
                  </div>
                  <div className="mt-1 text-muted-foreground">{t}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 max-w-md">
              {[
                ["1995", "TIMSS dasturining boshlanishi"],
                ["2000", "PISA dasturining boshlanishi"],
              ].map(([n, l]) => (
                <div key={n} className="p-4 rounded-2xl border bg-card shadow-card">
                  <div className="text-2xl font-display font-bold text-gradient">{n}</div>
                  <div className="text-sm text-muted-foreground mt-1">{l}</div>
                </div>
              ))}
            </div>
          </section>

          <section id="maqsad" className="scroll-mt-28 border-t pt-12">
            <H2 n={3} title="Maqsad va vazifalar" />
            <div className="border-l-4 border-primary bg-muted px-6 py-5 text-lg leading-8">
              Bo'lajak boshlang'ich sinf o'qituvchilarining matematik tayyorgarligini TIMSS, PISA
              kompetensiyalari va MKT modeli integratsiyasi asosida rivojlantirish.
            </div>
            <ul className="mt-5 grid gap-3 md:grid-cols-2">
              {tasks.map((t) => (
                <li
                  key={t}
                  className="flex gap-3 rounded-lg border bg-card p-4 text-sm leading-6 shadow-card"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  {t}
                </li>
              ))}
            </ul>
          </section>

          <section id="komponentlar" className="scroll-mt-28 border-t pt-12">
            <H2 n={4} title="Matematik tayyorgarlikning 5 komponenti" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {COMPONENTS.map((c, i) => (
                <AppLink
                  key={c.key}
                  to={`/modullar/${c.key}`}
                  className="group rounded-2xl border bg-card p-5 shadow-card transition hover:border-primary"
                >
                  <div className="text-xs font-semibold text-accent">{i + 1}-komponent</div>
                  <div className="mt-1 font-semibold group-hover:text-primary">{c.label}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{c.tip}</p>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                    Modulga o'tish <ArrowRight className="w-3 h-3" />
                  </div>
                </AppLink>
              ))}
            </div>
          </section>

          <section id="model" className="scroll-mt-28 border-t pt-12">
            <H2 n={5} title="Metodik model" />
            <p className="leading-7 text-muted-foreground">{MODEL_TITLE}.</p>
            <ol className="mt-5 flex flex-wrap items-center gap-2">
              {BLOCKS.map((b, i) => (
                <li key={b.slug} className="flex items-center gap-2">
                  <AppLink
                    to={`/model/${b.slug}`}
                    className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold uppercase text-primary-foreground hover:opacity-90"
                  >
                    {b.title}
                  </AppLink>
                  {i < BLOCKS.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </li>
              ))}
            </ol>
            <AppLink
              to="/model"
              className="mt-5 inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Model sxemasini ko'rish <ArrowRight className="w-4 h-4" />
            </AppLink>
          </section>

          <section id="imkoniyatlar" className="scroll-mt-28 border-t pt-12">
            <H2 n={6} title="Platforma imkoniyatlari" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {capabilities.map(({ icon: Icon, label, text, to }) => (
                <AppLink
                  key={label}
                  to={to}
                  className="rounded-lg border bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:border-primary"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="mt-3 font-semibold">{label}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{text}</p>
                </AppLink>
              ))}
            </div>
          </section>

          <section id="foydalanuvchilar" className="scroll-mt-28 border-t pt-12">
            <H2 n={7} title="Foydalanuvchilar" />
            <div className="grid gap-5 md:grid-cols-3">
              {[
                [
                  GraduationCap,
                  "Talabalar",
                  "Boshlang'ich ta'lim yo'nalishida tahsil olayotgan bo'lajak o'qituvchilar: diagnostika, modullar, E-portfolio.",
                ],
                [
                  UserRoundCheck,
                  "Professor-o'qituvchilar",
                  "Matematika metodikasi fanlarini olib boruvchilar: rubrika bo'yicha baholash, izoh, monitoring.",
                ],
                [
                  Users,
                  "Tadqiqotchilar",
                  "Xalqaro baholash va matematik savodxonlikni o'rganuvchilar: model, natijalar, statistik tahlil.",
                ],
              ].map(([Icon, title, text]) => {
                const I = Icon as typeof GraduationCap;
                return (
                  <article
                    key={title as string}
                    className="rounded-lg border bg-card p-6 shadow-card"
                  >
                    <I className="mb-4 h-8 w-8 text-primary" />
                    <h3 className="font-semibold">{title as string}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{text as string}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section id="tartib" className="scroll-mt-28 border-t pt-12">
            <H2 n={8} title="Foydalanish tartibi" />
            <ol className="space-y-4">
              {[
                "Tajriba-sinov bo'limida kirish diagnostikasini topshiring va ishtirokchi kodini yozib oling.",
                "E-portfolioni kod va PIN bilan oching: \"Mening yo'lim\"da sizga tayinlangan modullar ko'rinadi.",
                "Modullarni bajaring: nazariya, namunaviy tahlil, mashq, metodik topshiriq va refleksiya.",
                "Amaliy metodik ishlarni topshiring: o'quvchi xatolari tahlili, topshiriqni moslashtirish, microteaching.",
                "Oraliq va yakuniy diagnostikani xuddi shu kod bilan topshiring va dinamikangizni E-portfolioda kuzating.",
              ].map((step, i) => (
                <li key={step} className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary font-semibold text-primary">
                    {i + 1}
                  </span>
                  <span className="leading-6">{step}</span>
                </li>
              ))}
            </ol>
            <AppLink
              to="/qollanma"
              className="mt-5 inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              To'liq o'quv qo'llanma <ArrowRight className="w-4 h-4" />
            </AppLink>
          </section>

          <section id="mualliflar" className="scroll-mt-28 border-t pt-12">
            <H2 n={9} title="Mualliflar va guvohnoma" />
            <div className="grid gap-5 sm:grid-cols-3">
              <article className="rounded-lg border bg-gradient-card p-6 shadow-card">
                <p className="text-xs font-semibold uppercase text-accent">Muallif</p>
                <h3 className="mt-2 text-xl font-semibold">Abdusattarova Z.A.</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Ilmiy-metodik mazmun muallifi.
                </p>
              </article>
              <article className="rounded-lg border bg-gradient-card p-6 shadow-card">
                <p className="text-xs font-semibold uppercase text-accent">Muallif</p>
                <h3 className="mt-2 text-xl font-semibold">Xamzayev X.</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Elektron ta'lim resursini ishlab chiqish muallifi.
                </p>
              </article>
              <article className="rounded-lg border bg-gradient-card p-6 shadow-card">
                <p className="text-xs font-semibold uppercase text-accent">Guvohnoma</p>
                <h3 className="mt-2 text-xl font-semibold">DGU-38123</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  "TIMSS-PISA Mentorim" elektron ta'lim resursi 2024-yil 10-mayda ro'yxatdan
                  o'tkazilgan, 2024-yil 17-mayda davlat reyestriga kiritilgan.
                </p>
              </article>
            </div>
            <AppLink
              to="/aloqa"
              className="mt-5 inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Bog'lanish <ArrowRight className="w-4 h-4" />
            </AppLink>
          </section>
        </main>
      </div>
    </SiteLayout>
  );
}
