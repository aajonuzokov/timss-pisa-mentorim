import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Library,
  Lightbulb,
  ListChecks,
  MonitorCheck,
  Sigma,
  Target,
  UserRoundCheck,
  Users,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/elektron-talim-resursi")({
  head: () => ({
    meta: [
      {
        title: "Elektron ta’lim resursi — TIMSS/PISA",
      },
      {
        name: "description",
        content:
          "TIMSS va PISA asosida bo‘lajak boshlang‘ich sinf o‘qituvchilarining metodik tayyorgarligini takomillashtirish elektron resursi.",
      },
      {
        property: "og:title",
        content: "Elektron ta’lim resursi — TIMSS/PISA",
      },
      {
        property: "og:description",
        content:
          "Matematika ta’limi, TIMSS, PISA, MKT, diagnostika va monitoring bo‘yicha ilmiy-metodik elektron resurs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ElectronicResourcePage,
});

const contents = [
  ["haqida", "Elektron ta’lim resursi haqida"],
  ["maqsad", "Resursning maqsadi"],
  ["vazifalar", "Resursning vazifalari"],
  ["yonalishlar", "Asosiy ilmiy-metodik yo‘nalishlar"],
  ["timss", "TIMSS"],
  ["pisa", "PISA"],
  ["mkt", "Mathematical Knowledge for Teaching (MKT)"],
  ["savodxonlik", "Matematik savodxonlik"],
  ["fikrlash", "Matematik fikrlash"],
  ["tayyorgarlik", "Metodik tayyorgarlik"],
  ["diagnostika", "Diagnostika va monitoring"],
  ["imkoniyatlar", "Platformaning asosiy imkoniyatlari"],
  ["foydalanuvchilar", "Foydalanuvchilar"],
  ["foydalanish", "Elektron resursdan foydalanish tartibi"],
  ["mualliflar", "Mualliflar haqida"],
] as const;

const directions = [
  {
    icon: BookOpen,
    title: "Xalqaro baholash mazmuni",
    text: "TIMSSning mazmuniy va kognitiv sohalari hamda PISAning matematik savodxonlik kompetensiyalarini o‘rganish.",
  },
  {
    icon: Brain,
    title: "Kasbiy-metodik bilim",
    text: "Matematik bilimlarni o‘qitish mazmuni, usullari va o‘quvchi tafakkuriga mos pedagogik qarorlar bilan bog‘lash.",
  },
  {
    icon: Activity,
    title: "Amaliy va refleksiv faoliyat",
    text: "Muammoli vaziyatlarni yechish, natijalarni tahlil qilish va o‘z metodik faoliyatini muntazam takomillashtirish.",
  },
] as const;

const capabilities = [
  { icon: BookOpen, label: "O‘quv materiallari", to: "/qollanma" },
  { icon: ClipboardCheck, label: "TIMSS topshiriqlari", to: "/timss" },
  { icon: Sigma, label: "PISA topshiriqlari", to: "/pisa" },
  { icon: Lightbulb, label: "Metodik tavsiyalar", to: "/tavsiyalar" },
  { icon: Library, label: "Elektron kutubxona", to: "/kutubxona" },
  { icon: BarChart3, label: "Natijalar tahlili", to: "/natijalar" },
] as const;

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-5 flex items-start gap-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
        {number}
      </span>
      <h2 className="pt-0.5 text-2xl font-semibold leading-tight md:text-3xl">{title}</h2>
    </div>
  );
}

function ElectronicResourcePage() {
  return (
    <SiteLayout>
      <header className="border-b bg-gradient-soft">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1.5 text-xs font-semibold uppercase text-accent">
            <GraduationCap className="h-4 w-4" />
            Ilmiy-metodik elektron nashr
          </div>
          <h1 className="max-w-6xl text-3xl font-bold leading-tight md:text-5xl">
            Xalqaro baholash dasturlari asosida bo‘lajak boshlang‘ich sinf o‘qituvchilarining metodik tayyorgarligini takomillashtirish (matematika fani misolida)
          </h1>
          <p className="mt-6 text-xl font-semibold text-primary md:text-2xl">Elektron ta’lim resursi</p>
          <div className="mt-7 flex flex-wrap gap-x-8 gap-y-2 border-t pt-5 text-sm">
            <span className="text-muted-foreground">Mualliflar</span>
            <span className="font-semibold">Abdusattarova Z.A.</span>
            <span className="font-semibold">Xamzayev X.</span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[260px_minmax(0,1fr)] lg:py-16">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 text-xs font-semibold uppercase text-accent">Mundarija</p>
          <nav aria-label="Sahifa mundarijasi" className="max-h-[70vh] overflow-y-auto border-l">
            {contents.map(([id, label], index) => (
              <a
                key={id}
                href={`#${id}`}
                className="block border-l-2 border-transparent px-4 py-2 text-sm text-muted-foreground transition hover:border-primary hover:bg-muted hover:text-foreground"
              >
                {index + 1}. {label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 space-y-16">
          <section id="haqida" className="scroll-mt-24">
            <SectionHeading number="01" title="Elektron ta’lim resursi haqida" />
            <div className="space-y-5 text-base leading-8 text-muted-foreground md:text-lg">
              <p>
                Mazkur elektron ta’lim resursi bo‘lajak boshlang‘ich sinf o‘qituvchilarining matematika fanini o‘qitishga doir metodik tayyorgarligini takomillashtirish, matematik savodxonligini rivojlantirish hamda xalqaro baholash dasturlari talablariga mos kasbiy kompetensiyalarini shakllantirishga xizmat qiladi.
              </p>
              <p>
                Elektron ta’lim resursining mazmuni TIMSS va PISA xalqaro baholash dasturlarining mazmuniy va kompetensiyaviy yondashuvlari asosida tashkil etilgan. Resursda matematik bilimlarni qo‘llash, matematik fikrlash, muammoli vaziyatlarni tahlil qilish, matematik savodxonlikni rivojlantirish va matematika fanini o‘qitish metodikasini takomillashtirishga yo‘naltirilgan materiallar jamlangan.
              </p>
              <p>
                Platformada o‘quv materiallari, test topshiriqlari, amaliy mashg‘ulotlar, metodik tavsiyalar, videomateriallar, elektron kutubxona, diagnostika, monitoring va natijalarni tahlil qilish vositalari mavjud.
              </p>
            </div>
          </section>

          <section id="maqsad" className="scroll-mt-24 border-t pt-12">
            <SectionHeading number="02" title="Resursning maqsadi" />
            <div className="border-l-4 border-primary bg-muted px-6 py-5 text-lg leading-8">
              Bo‘lajak boshlang‘ich sinf o‘qituvchilarining matematika fanini o‘qitishga oid bilim, ko‘nikma va kasbiy kompetensiyalarini TIMSS, PISA hamda MKT yondashuvlari asosida izchil rivojlantirish.
            </div>
          </section>

          <section id="vazifalar" className="scroll-mt-24 border-t pt-12">
            <SectionHeading number="03" title="Resursning vazifalari" />
            <ul className="grid gap-3 md:grid-cols-2">
              {[
                "Xalqaro baholash dasturlarining ilmiy va amaliy asoslarini yoritish",
                "Matematik bilimlarni real vaziyatlarda qo‘llash ko‘nikmalarini rivojlantirish",
                "Topshiriqlarni tahlil qilish va tuzish metodikasini o‘rgatish",
                "Metodik qaror qabul qilish va refleksiv faoliyatni qo‘llab-quvvatlash",
                "Tayyorgarlik darajasini diagnostika va monitoring qilish",
                "Mustaqil ta’lim uchun raqamli resurslardan foydalanishni kengaytirish",
              ].map((task) => (
                <li key={task} className="flex gap-3 rounded-lg border bg-card p-4 text-sm leading-6 shadow-card">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  {task}
                </li>
              ))}
            </ul>
          </section>

          <section id="yonalishlar" className="scroll-mt-24 border-t pt-12">
            <SectionHeading number="04" title="Asosiy ilmiy-metodik yo‘nalishlar" />
            <div className="grid gap-5 md:grid-cols-3">
              {directions.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-lg border bg-card p-6 shadow-card">
                  <Icon className="mb-4 h-8 w-8 text-primary" />
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="timss" className="scroll-mt-24 border-t pt-12">
            <SectionHeading number="05" title="TIMSS" />
            <p className="leading-7 text-muted-foreground">
              TIMSS yo‘nalishi matematika mazmunini sonlar, algebraik ifodalar, geometriya, o‘lchash va ma’lumotlar bilan ishlash doirasida o‘rganishga xizmat qiladi. Topshiriqlar bilish, qo‘llash va mulohaza yuritish kognitiv sohalari bo‘yicha tuzilgan.
            </p>
            <Link to="/timss" className="mt-5 inline-flex items-center gap-2 font-semibold text-primary hover:underline">
              TIMSS topshiriqlariga o‘tish <span aria-hidden="true">→</span>
            </Link>
          </section>

          <section id="pisa" className="scroll-mt-24 border-t pt-12">
            <SectionHeading number="06" title="PISA" />
            <p className="leading-7 text-muted-foreground">
              PISA materiallari matematikani real hayotiy vaziyatlarda qo‘llashga qaratilgan. Ularda vaziyatni matematik shakllantirish, matematik vositalarni qo‘llash, olingan natijalarni talqin qilish va baholash jarayonlari yoritiladi.
            </p>
            <Link to="/pisa" className="mt-5 inline-flex items-center gap-2 font-semibold text-primary hover:underline">
              PISA topshiriqlariga o‘tish <span aria-hidden="true">→</span>
            </Link>
          </section>

          <section id="mkt" className="scroll-mt-24 border-t pt-12">
            <SectionHeading number="07" title="Mathematical Knowledge for Teaching (MKT)" />
            <p className="leading-7 text-muted-foreground">
              MKT matematika mazmunini bilish bilan birga uni o‘quvchiga tushunarli yetkazish, yechim usullarini taqqoslash, xatolar sababini aniqlash va ta’lim vaziyatiga mos metodni tanlashga zarur kasbiy bilimlar tizimini ifodalaydi.
            </p>
          </section>

          <section id="savodxonlik" className="scroll-mt-24 border-t pt-12">
            <SectionHeading number="08" title="Matematik savodxonlik" />
            <p className="leading-7 text-muted-foreground">
              Matematik savodxonlik shaxsning turli kontekstlardagi muammoni matematik ifodalashi, asoslangan yechim topishi va natijani hayotiy vaziyatga qayta talqin qila olishini qamrab oladi. Matematik modellashtirish ushbu komponent tarkibida o‘rganiladi.
            </p>
          </section>

          <section id="fikrlash" className="scroll-mt-24 border-t pt-12">
            <SectionHeading number="09" title="Matematik fikrlash" />
            <p className="leading-7 text-muted-foreground">
              Matematik fikrlash tahlil qilish, umumlashtirish, qonuniyatni aniqlash, dalillash, bir necha yechimni baholash va mantiqiy xulosa chiqarish jarayonlarini rivojlantiradi. Resursdagi muammoli topshiriqlar bu faoliyatlarni bosqichma-bosqich qo‘llab-quvvatlaydi.
            </p>
          </section>

          <section id="tayyorgarlik" className="scroll-mt-24 border-t pt-12">
            <SectionHeading number="10" title="Metodik tayyorgarlik" />
            <p className="leading-7 text-muted-foreground">
              Metodik tayyorgarlik matematik bilim, matematik fikrlash, matematik savodxonlik, metodik kompetentlik va refleksiv faoliyatning o‘zaro bog‘liq rivojlanishiga asoslanadi. O‘qituvchi mazmunni tanlash, darsni loyihalash, o‘quv natijasini baholash va keyingi faoliyatni rejalashtirishga tayyorlanadi.
            </p>
            <Link to="/model" className="mt-5 inline-flex items-center gap-2 font-semibold text-primary hover:underline">
              Metodik modelni ko‘rish <span aria-hidden="true">→</span>
            </Link>
          </section>

          <section id="diagnostika" className="scroll-mt-24 border-t pt-12">
            <SectionHeading number="11" title="Diagnostika va monitoring" />
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-lg border bg-card p-6 shadow-card">
                <MonitorCheck className="mb-3 h-7 w-7 text-primary" />
                <h3 className="font-semibold">Boshlang‘ich diagnostika</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Tinglovchining tayanch bilimlari va metodik ehtiyojlarini aniqlashga yordam beradi.</p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-card">
                <BarChart3 className="mb-3 h-7 w-7 text-accent" />
                <h3 className="font-semibold">Dinamik monitoring</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Natijalar o‘zgarishini kuzatish, tahlil qilish va rivojlanish yo‘nalishini belgilash imkonini beradi.</p>
              </div>
            </div>
            <Link to="/monitoring" className="mt-5 inline-flex items-center gap-2 font-semibold text-primary hover:underline">
              Monitoring vositasiga o‘tish <span aria-hidden="true">→</span>
            </Link>
          </section>

          <section id="imkoniyatlar" className="scroll-mt-24 border-t pt-12">
            <SectionHeading number="12" title="Platformaning asosiy imkoniyatlari" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {capabilities.map(({ icon: Icon, label, to }) => (
                <Link key={label} to={to} className="flex items-center gap-4 rounded-lg border bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:border-primary">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-semibold">{label}</span>
                </Link>
              ))}
            </div>
          </section>

          <section id="foydalanuvchilar" className="scroll-mt-24 border-t pt-12">
            <SectionHeading number="13" title="Foydalanuvchilar" />
            <div className="grid gap-5 md:grid-cols-3">
              {[
                [GraduationCap, "Talabalar", "Boshlang‘ich ta’lim yo‘nalishida tahsil olayotgan bo‘lajak o‘qituvchilar."],
                [UserRoundCheck, "Professor-o‘qituvchilar", "Matematika metodikasi va pedagogika fanlarini olib boruvchi mutaxassislar."],
                [Users, "Tadqiqotchilar", "Xalqaro baholash, matematik savodxonlik va metodik ta’limni o‘rganuvchilar."],
              ].map(([Icon, title, text]) => {
                const UserIcon = Icon as typeof GraduationCap;
                return (
                  <article key={title as string} className="rounded-lg border bg-card p-6 shadow-card">
                    <UserIcon className="mb-4 h-8 w-8 text-primary" />
                    <h3 className="font-semibold">{title as string}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{text as string}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section id="foydalanish" className="scroll-mt-24 border-t pt-12">
            <SectionHeading number="14" title="Elektron resursdan foydalanish tartibi" />
            <ol className="space-y-4">
              {[
                "Tegishli nazariy va metodik material bilan tanishing.",
                "TIMSS yoki PISA topshiriqlarini tanlab, mustaqil bajaring.",
                "Javob va metodik izohlarni tahlil qiling.",
                "Diagnostika natijalarini monitoring ko‘rsatkichlari bilan solishtiring.",
                "Metodik tavsiyalar asosida individual rivojlanish yo‘nalishini belgilang.",
              ].map((step, index) => (
                <li key={step} className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary font-semibold text-primary">{index + 1}</span>
                  <span className="leading-6">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section id="mualliflar" className="scroll-mt-24 border-t pt-12">
            <SectionHeading number="15" title="Mualliflar haqida" />
            <div className="grid gap-5 sm:grid-cols-2">
              <article className="rounded-lg border bg-gradient-card p-6 shadow-card">
                <p className="text-xs font-semibold uppercase text-accent">Muallif</p>
                <h3 className="mt-2 text-xl font-semibold">Abdusattarova Z.A.</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Elektron ta’lim resursining ilmiy-metodik mazmuni muallifi.</p>
              </article>
              <article className="rounded-lg border bg-gradient-card p-6 shadow-card">
                <p className="text-xs font-semibold uppercase text-accent">Muallif</p>
                <h3 className="mt-2 text-xl font-semibold">Xamzayev X.</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Elektron ta’lim resursini ishlab chiqish muallifi.</p>
              </article>
            </div>
          </section>

          <div className="flex items-start gap-3 border-t pt-8 text-sm leading-6 text-muted-foreground">
            <ListChecks className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            Resursdagi bo‘limlar nazariy bilimni amaliy topshiriq, tahlil, diagnostika va refleksiya bilan uzviy bog‘lash tamoyiliga asoslanadi.
          </div>
        </main>
      </div>
    </SiteLayout>
  );
}