import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { Target, BookOpen, Cog, Activity, Award, ArrowDown, X, Users, FileText, Lightbulb, FolderKanban, Monitor, BookMarked, BarChart3, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type TexComponent = {
  name: string;
  desc: string;
  timss: string;
  pisa: string;
  mkt: string;
  indicators: string[];
  tools: string[];
  progress: number;
};

const texComponents: TexComponent[] = [
  {
    name: "Matematik bilim",
    desc: "Matematik tushuncha, fakt, qonuniyat va protseduralarni tizimli o'zlashtirish jarayonini ta'minlovchi kognitiv asos. Texnologik blokda bu komponent interaktiv ma'ruza, vizualizatsiya va elektron resurslar orqali shakllantiriladi.",
    timss: "Knowing — matematik faktlar, tushunchalar va protseduralarni bilish domeniga to'liq mos keladi.",
    pisa: "Formulate bosqichining kognitiv tayanchi sifatida xizmat qiladi.",
    mkt: "Subject Matter Knowledge (SMK) — Common Content Knowledge va Specialized Content Knowledge qatlamlari.",
    indicators: [
      "Matematik tushunchalarni to'g'ri ta'riflashi",
      "Qoidalar va formulalardan xatosiz foydalanishi",
      "Matematik terminologiyani izchil qo'llashi",
    ],
    tools: ["Diagnostik test (TIMSS Knowing)", "Interaktiv kvizlar (Mentorim)", "Konseptual xaritalar"],
    progress: 78,
  },
  {
    name: "Matematik tafakkur",
    desc: "Tahlil, sintez, umumlashtirish, isbotlash va nostandart masalalarni yechishga qaratilgan intellektual faoliyat. Texnologik blokda muammoli ta'lim va keys-stadi metodlari orqali rivojlantiriladi.",
    timss: "Reasoning — mantiqiy mulohaza, isbotlash va murakkab kontekstda fikrlash domeniga muvofiq.",
    pisa: "Interpret — matematik natijalarni tahlil qilish va baholash bosqichi bilan bog'liq.",
    mkt: "Specialized Content Knowledge (SMK) va Knowledge of Content and Students (PCK) integratsiyasi.",
    indicators: [
      "Mantiqiy zanjir va isbot qura olishi",
      "Nostandart muammoga strategiya tanlashi",
      "Matematik munosabatlar va qonuniyatlarni aniqlay olishi",
    ],
    tools: ["PISA Reasoning topshiriqlari", "Keys-stadi tahlili", "Refleksiv jurnal (E-Portfolio)"],
    progress: 71,
  },
  {
    name: "Matematik savodxonlik",
    desc: "Real hayotiy kontekstdagi vaziyatlarni matematik tarjima qilish, modellashtirish va talqin etish qobiliyati. Mazkur komponent matematik modellashtirish jarayonini (Formulate → Employ → Interpret siklini) o'z tarkibida qamrab oladi.",
    timss: "Applying — matematik bilimlarni yangi va amaliy vaziyatlarda qo'llash domeni.",
    pisa: "Formulate · Employ · Interpret — matematik savodxonlikning to'liq jarayonli sikli, modellashtirish bosqichini ham qamrab oladi.",
    mkt: "PCK — Knowledge of Content and Teaching: amaliy kontekstli topshiriqlarni o'qitishga moslashtirish.",
    indicators: [
      "Real vaziyatni matematik modelga aylantirishi (Formulate)",
      "Modelni qo'llab natija olishi (Employ)",
      "Natijani amaliy kontekstda talqin qilishi (Interpret)",
      "Modellashtirish siklini to'liq amalga oshirishi",
    ],
    tools: ["PISA kontekstli topshiriqlar banki", "Loyiha metodi natijalari", "Mentorim — modellashtirish topshiriqlari"],
    progress: 74,
  },
  {
    name: "Matematik-metodik kompetentlik",
    desc: "Matematik mazmunni pedagogik transformatsiya qilish, topshiriqlar loyihalash, o'quvchilar xatolarini tahlil qilish va metodik qaror qabul qilish qobiliyati. Texnologik blokning yakuniy integrativ natijasi.",
    timss: "Knowing · Applying · Reasoning — uchta kognitiv domen integratsiyasi asosida metodik qarorlar.",
    pisa: "Formulate · Employ · Interpret — to'liq sikl bo'yicha o'quvchilarning matematik savodxonligini rivojlantirish metodikasi.",
    mkt: "Pedagogical Content Knowledge (PCK): Knowledge of Content and Students, Teaching va Curriculum — SMK → PCK transformatsiyasi.",
    indicators: [
      "TIMSS/PISA standartlariga mos topshiriq loyihalashi",
      "O'quvchilar tipik xatolarini tahlil qila olishi",
      "Differensial metodik strategiyani tanlay olishi",
      "E-Portfolio orqali kasbiy refleksiyani amalga oshirishi",
    ],
    tools: ["Metodik loyiha himoyasi", "E-Portfolio ekspert bahosi", "Mentorim — kasbiy diagnostika"],
    progress: 68,
  },
];

const texSections: { icon: typeof Users; title: string; desc: string }[] = [
  { icon: Users, title: "Interaktiv metodlar", desc: "Hamkorlikda o'qitish, dialogik muloqot, didaktik o'yinlar orqali talabaning faol o'rganish pozitsiyasini ta'minlash." },
  { icon: FileText, title: "TIMSS/PISA topshiriqlari", desc: "Xalqaro baholash dasturlari standartlariga muvofiq tuzilgan kognitiv va kontekstli topshiriqlar banki." },
  { icon: BookMarked, title: "Keys-stadi", desc: "Real pedagogik vaziyatlarni tahlil qilish orqali metodik qaror qabul qilish ko'nikmasini shakllantirish." },
  { icon: Lightbulb, title: "Muammoli ta'lim", desc: "Talabani matematik muammo qo'yish, gipoteza ilgari surish va isbotlash bosqichlariga jalb etish." },
  { icon: FolderKanban, title: "Loyiha metodi", desc: "Integrativ matematik-metodik loyihalar orqali modellashtirish va tadqiqotchilik faoliyatini rivojlantirish." },
  { icon: Monitor, title: "Mentorim platformasi", desc: "Raqamli o'quv-metodik muhit: topshiriqlar, diagnostika, monitoring va mentor-talaba o'zaro aloqasi." },
  { icon: BookOpen, title: "E-Portfolio", desc: "Talabaning matematik-metodik tayyorgarligi dinamikasini aks ettiruvchi elektron kasbiy portfolio." },
];

const flowSteps: { icon: typeof Activity; label: string }[] = [
  { icon: BookOpen, label: "O'quv faoliyati" },
  { icon: Monitor, label: "Mentorim platformasi" },
  { icon: BookMarked, label: "E-Portfolio" },
  { icon: Activity, label: "Diagnostika" },
  { icon: BarChart3, label: "Feedback" },
  { icon: RefreshCw, label: "Korreksiya" },
  { icon: CheckCircle2, label: "Natija" },
];

type MathComponent = {
  name: string;
  desc: string;
  timss: string;
  pisa: string;
  mkt: string;
  indicators: string[];
};

const mathComponents: MathComponent[] = [
  {
    name: "Matematik bilim",
    desc: "Talabaning matematik tushunchalar, qonuniyatlar, amallar va protseduralar haqidagi bilimlarini ifodalaydi. Ushbu komponent matematik tayyorgarlikning kognitiv asosini tashkil etadi.",
    timss: "Knowing",
    pisa: "Formulate bosqichining boshlang'ich elementi",
    mkt: "Matematik mazmunni o'quvchilarga tushunarli shaklda izohlash uchun zarur bilim bazasi.",
    indicators: [
      "Matematik tushunchalarni bilishi",
      "Formulalar va qoidalarni qo'llashi",
      "Matematik terminologiyadan foydalanishi",
    ],
  },
  {
    name: "Matematik tafakkur",
    desc: "Muammolarni tahlil qilish, umumlashtirish, taqqoslash va mantiqiy xulosalar chiqarish qobiliyatlarini aks ettiradi.",
    timss: "Reasoning",
    pisa: "Interpret",
    mkt: "O'quvchilarning fikrlash jarayonlarini tushunish va ularni rivojlantirish metodikasini tanlash.",
    indicators: [
      "Mantiqiy xulosa chiqarish",
      "Isbotlash elementlaridan foydalanish",
      "Matematik munosabatlarni aniqlash",
    ],
  },
  {
    name: "Matematik savodxonlik",
    desc: "Real hayotiy vaziyatlarni matematik jihatdan tushunish va talqin qilish qobiliyatidir.",
    timss: "Applying",
    pisa: "Formulate, Employ, Interpret",
    mkt: "Matematik mazmunni amaliy vaziyatlar bilan bog'lab o'qitish.",
    indicators: [
      "Real vaziyatlarni matematiklashtirish",
      "Matematik natijalarni talqin qilish",
      "Hayotiy masalalarni yechish",
    ],
  },
  {
    name: "Matematik modellashtirish",
    desc: "Real muammolarni matematik modelga o'tkazish, model asosida yechim topish va natijalarni amaliy vaziyatga qayta tatbiq etish jarayonlarini qamrab oladi.",
    timss: "Applying, Reasoning",
    pisa: "Formulate, Employ",
    mkt: "Matematik modellarni boshlang'ich sinf o'quvchilariga mos metodik topshiriqlarga aylantirish.",
    indicators: [
      "Model tuzish",
      "Model asosida yechim ishlab chiqish",
      "Natijalarni amaliyotga tatbiq etish",
    ],
  },
  {
    name: "Matematik-metodik kompetentlik",
    desc: "Matematik bilimlarni pedagogik faoliyat mazmuniga transformatsiya qilish qobiliyatini ifodalaydi.",
    timss: "Knowing, Applying, Reasoning",
    pisa: "Formulate, Employ, Interpret",
    mkt: "SMK → PCK transformatsiyasi asosida matematik mazmunni o'qitish texnologiyasiga aylantirish.",
    indicators: [
      "Topshiriqlar loyihalash",
      "O'quvchilar xatolarini tahlil qilish",
      "Metodik qarorlar qabul qilish",
    ],
  },
  {
    name: "Refleksiv faoliyat",
    desc: "Talabaning o'z o'quv va kasbiy faoliyatini tahlil qilish, baholash va takomillashtirishga qaratilgan faoliyatidir.",
    timss: "Reasoning",
    pisa: "Interpret",
    mkt: "Kasbiy faoliyat natijalarini qayta ko'rib chiqish va metodik rivojlanishni rejalashtirish.",
    indicators: [
      "O'z faoliyatini tahlil qilish",
      "Xatolar ustida ishlash",
      "Individual rivojlanish trayektoriyasini belgilash",
    ],
  },
];

export const Route = createFileRoute("/model")({
  head: () => ({
    meta: [
      { title: "Metodik model — TIMSS/PISA Platformasi" },
      { name: "description", content: "Bo'lajak boshlang'ich sinf o'qituvchilarini tayyorlashning besh blokli metodik modeli." },
    ],
  }),
  component: Page,
});

type Block = {
  icon: typeof Target;
  title: string;
  desc: string;
  full: string;
  components: string[];
};

const blocks: Block[] = [
  {
    icon: Target,
    title: "Maqsadli blok",
    desc: "Bo'lajak o'qituvchilarning TIMSS/PISA asosida metodik tayyorgarligini rivojlantirishning maqsadi, vazifalari, tamoyillari va pedagogik shart-sharoitlarini belgilaydi.",
    full: "Mazkur blok bo'lajak boshlang'ich sinf o'qituvchilarining TIMSS va PISA xalqaro baholash dasturlari asosida o'qitishga metodik tayyorgarligini rivojlantirishning maqsadi, vazifalari, tamoyillari va pedagogik shart-sharoitlarini belgilaydi. Blokning asosiy maqsadi talabalarda matematik savodxonlik, metodik kompetentlik hamda xalqaro baholash dasturlari talablariga mos kasbiy tayyorgarlikni shakllantirishdan iborat.",
    components: ["Strategik maqsad", "Pedagogik vazifalar", "TIMSS/PISA kompetensiyalari", "Kasbiy rivojlanish ko'rsatkichlari", "Kutilayotgan natijalar"],
  },
  {
    icon: BookOpen,
    title: "Mazmuniy blok",
    desc: "O'quv dasturlari, modullar, TIMSS/PISA topshiriqlari banki, nazariy-amaliy materiallar va metodik qo'llanmalarni qamrab oladi.",
    full: "Mazmuniy blok bo'lajak boshlang'ich sinf o'qituvchilarining TIMSS va PISA xalqaro baholash dasturlari asosida metodik tayyorgarligini rivojlantirish jarayonining ilmiy-nazariy va amaliy mazmunini belgilaydi. Blok matematik savodxonlikni shakllantirishga qaratilgan kognitiv sohalar (bilish, qo'llash, mulohaza yuritish) hamda mazmuniy sohalar (sonlar, geometriya, algebra, ma'lumotlar va ehtimollik) bo'yicha tizimlashtirilgan o'quv materiallari, modullar, integrativ kurslar va xalqaro standartlarga muvofiqlashtirilgan topshiriqlar bankini o'z ichiga oladi.",
    components: ["O'quv dasturi va modullar", "Nazariy-metodik materiallar", "TIMSS/PISA topshiriqlari banki", "Kognitiv va mazmuniy sohalar", "Metodik qo'llanmalar va resurslar"],
  },
  {
    icon: Cog,
    title: "Jarayonli (texnologik) blok",
    desc: "Interaktiv ta'lim texnologiyalari, multimediyali resurslar va o'qitish metodlari orqali bilim, ko'nikma va malakalarni shakllantirish.",
    full: "Jarayonli blok ta'lim jarayonini tashkil etishning shakllari, metodlari va vositalarini o'z ichiga oladi. Interaktiv metodlar (muammoli ta'lim, loyiha metodi, keys-stadi), multimediyali elektron resurslar, animatsiyalar, video darslar va raqamli platformalardan foydalanish orqali talabalarning faol bilim olishi ta'minlanadi. Texnologik blok zamonaviy axborot-kommunikatsiya texnologiyalari va an'anaviy pedagogik metodlarni uyg'unlashtirgan holda qo'llaniladi.",
    components: ["Interaktiv metodlar", "Multimediyali resurslar", "Raqamli platformalar", "Ta'lim shakllari"],
  },
  {
    icon: Activity,
    title: "Diagnostik-monitoring blok",
    desc: "Talabalar bilimini muntazam baholash, monitoring qilish va shakllanish dinamikasini kuzatish vositalari.",
    full: "Diagnostik-monitoring blok talabalarning metodik tayyorgarligini bosqichma-bosqich baholash, kuzatish va tahlil qilish tizimini ifodalaydi. Kirish, joriy, oraliq va yakuniy nazorat shakllari, test topshiriqlari, kuzatuv jadvallari hamda dinamikani aks ettiruvchi diagrammalar yordamida har bir talaba rivojlanishining individual trayektoriyasi aniqlanadi.",
    components: ["Kirish diagnostikasi", "Joriy monitoring", "Oraliq baholash", "Yakuniy nazorat"],
  },
  {
    icon: Award,
    title: "Natijaviy blok",
    desc: "Bo'lajak o'qituvchilarning erishilgan metodik tayyorgarlik darajasini aniqlash mezonlari va ko'rsatkichlari.",
    full: "Natijaviy blok ta'lim jarayonining samaradorligini baholash mezonlari, ko'rsatkichlar va darajalar tizimini o'z ichiga oladi. Bo'lajak o'qituvchilarning metodik tayyorgarligi quyi, o'rta va yuqori darajalarda aniqlanadi. Har bir daraja bo'yicha nazariy bilim, amaliy ko'nikma, kreativ fikrlash va TIMSS/PISA topshiriqlarini yechish malakasi mezonlari orqali baholanadi.",
    components: ["Baholash mezonlari", "Tayyorgarlik darajalari", "Sifat ko'rsatkichlari", "Yakuniy natijalar"],
  },
];

function Page() {
  const [active, setActive] = useState<Block | null>(null);

  return (
    <SiteLayout>
      <PageHeader eyebrow="Metodik tizim" title="Besh blokli metodik model" description="Bo'lajak boshlang'ich sinf o'qituvchilarining TIMSS/PISA asosidagi metodik tayyorgarligini rivojlantirish modelining tarkibiy bloklari." />

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {blocks.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="p-7 rounded-2xl border bg-card shadow-card hover:-translate-y-1 transition flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">BLOK {i + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{b.title}</h3>
                <p className="text-muted-foreground leading-relaxed flex-1">{b.desc}</p>
                <Button variant="outline" className="mt-5 self-start" onClick={() => setActive(b)}>
                  Batafsil
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Bloklar orasidagi bog'liqlik sxemasi</h2>
          <p className="text-muted-foreground">Metodik modelning bosqichma-bosqich ketma-ketligi</p>
        </div>

        <div className="flex flex-col items-center gap-3">
          {blocks.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="w-full flex flex-col items-center">
                <div className="w-full max-w-md p-5 rounded-2xl border bg-card shadow-card flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground font-medium mb-0.5">BOSQICH {i + 1}</div>
                    <div className="font-semibold">{b.title}</div>
                  </div>
                </div>
                {i < blocks.length - 1 && (
                  <ArrowDown className="w-7 h-7 text-primary my-2 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {active && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground">
                    <active.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">METODIK BLOK</div>
                    <DialogTitle className="text-2xl">{active.title}</DialogTitle>
                  </div>
                </div>
                <DialogDescription className="text-base leading-relaxed pt-2 text-foreground/80">
                  {active.title === "Mazmuniy blok"
                    ? "Mazmuniy blok bo'lajak boshlang'ich sinf o'qituvchilarining matematik tayyorgarligini rivojlantirishga xizmat qiluvchi nazariy, amaliy va metodik mazmunni birlashtiradi. Blok TIMSS va PISA xalqaro baholash dasturlari kompetensiyalari hamda Mathematical Knowledge for Teaching (MKT) yondashuvi integratsiyasi asosida shakllantirilgan."
                    : active.full}
                </DialogDescription>
              </DialogHeader>
              {active.title === "Mazmuniy blok" ? (
                <div className="mt-2">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="timss-content">
                      <AccordionTrigger className="text-left font-bold">TIMSS mazmuniy sohalari</AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm">
                        {[
                          ["Sonlar", "Natural, butun, ratsional sonlar, ular ustida amallar va sonli munosabatlar."],
                          ["Algebra", "Ifoda, tenglama, funksiya va qonuniyatlar bilan ishlash."],
                          ["Geometriya", "Shakllar, fazoviy munosabatlar, o'lchov va geometrik xossalar."],
                          ["Ma'lumotlar va ehtimollik", "Ma'lumotlarni to'plash, taqdim etish, tahlil qilish va ehtimollik baholash."],
                        ].map(([n, d]) => (
                          <div key={n} className="rounded-lg border p-3"><div className="font-semibold mb-1">{n}</div><p className="text-foreground/80">{d}</p></div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="timss-cog">
                      <AccordionTrigger className="text-left font-bold">TIMSS kognitiv domenlari</AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm">
                        {[
                          ["Knowing", "Matematik faktlar, tushunchalar va protseduralarni bilish."],
                          ["Applying", "Bilimlarni tanish va yangi vaziyatlarda qo'llash."],
                          ["Reasoning", "Mantiqiy fikrlash, tahlil qilish va nostandart masalalarni yechish."],
                        ].map(([n, d]) => (
                          <div key={n} className="rounded-lg border p-3"><Badge className="mb-1">{n}</Badge><p className="text-foreground/80">{d}</p></div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="pisa-comp">
                      <AccordionTrigger className="text-left font-bold">PISA matematik savodxonlik kompetensiyalari</AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm">
                        {[
                          ["Formulate", "Real vaziyatni matematik shaklga keltirish va modellashtirish."],
                          ["Employ", "Matematik tushuncha, fakt, protsedura va mulohazalarni qo'llash."],
                          ["Interpret", "Matematik natijalarni real kontekstda talqin qilish va baholash."],
                        ].map(([n, d]) => (
                          <div key={n} className="rounded-lg border p-3"><Badge variant="secondary" className="mb-1">{n}</Badge><p className="text-foreground/80">{d}</p></div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="mkt">
                      <AccordionTrigger className="text-left font-bold">MKT (Mathematical Knowledge for Teaching)</AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm">
                        {[
                          ["Subject Matter Knowledge (SMK)", "O'qituvchining matematik mazmunni chuqur va tizimli bilishi: umumiy, ixtisoslashgan va gorizontal matematik bilimlar."],
                          ["Pedagogical Content Knowledge (PCK)", "Matematik mazmunni o'quvchilarga moslab o'qitish bilimi: o'quvchini tushunish, o'qitish va o'quv dasturi bilan bog'liq bilimlar."],
                        ].map(([n, d]) => (
                          <div key={n} className="rounded-lg border border-dashed p-3"><Badge variant="outline" className="mb-1">{n}</Badge><p className="text-foreground/80">{d}</p></div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="math-prep">
                      <AccordionTrigger className="text-left font-bold">Matematik tayyorgarlik komponentlari</AccordionTrigger>
                      <AccordionContent>
                        <Accordion type="single" collapsible className="w-full">
                          {[
                            ["Matematik bilim", "Matematik tushunchalar, qonuniyatlar va usullar haqidagi tizimli bilimlar majmuasi bo'lib, bo'lajak o'qituvchining kasbiy faoliyati uchun nazariy asos vazifasini bajaradi. Mazkur komponent TIMSS Knowing domeni hamda MKTning Subject Matter Knowledge qismi bilan bog'liq."],
                            ["Matematik tafakkur", "Mantiqiy fikrlash, tahlil, sintez, umumlashtirish va isbotlash qobiliyatlarini qamrab oluvchi intellektual faoliyatdir. U TIMSS Reasoning domeni va PISA Interpret kompetensiyasi bilan uzviy bog'langan."],
                            ["Matematik savodxonlik", "Real hayotiy vaziyatlarni matematik nuqtai nazardan tushunish, tahlil qilish va talqin etish qobiliyatidir. PISA matematik savodxonlik konsepsiyasi va TIMSS Applying domeni asosida shakllanadi."],
                            ["Matematik modellashtirish", "Real muammoni matematik modelga aylantirish, yechim topish va natijani amaliy kontekstga qaytarish jarayonidir. Komponent PISA Formulate-Employ-Interpret siklini to'liq aks ettiradi."],
                            ["Matematik-metodik kompetentlik", "Matematik bilimlarni pedagogik mazmunga transformatsiya qilish va o'qitish texnologiyalariga aylantirish qobiliyatidir. MKTning Pedagogical Content Knowledge sohasi bilan bevosita bog'liq."],
                            ["Refleksiv faoliyat", "Talabaning o'z o'quv va kasbiy faoliyatini tahlil qilish, baholash hamda takomillashtirish jarayonidir. Bu komponent o'qituvchining uzluksiz kasbiy rivojlanishini ta'minlaydi."],
                          ].map(([n, d], i) => (
                            <AccordionItem key={n} value={`mp-${i}`}>
                              <AccordionTrigger className="text-left font-bold">{i + 1}. {n}</AccordionTrigger>
                              <AccordionContent className="text-sm text-foreground/85 leading-relaxed">{d}</AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <p className="mt-4 text-xs text-center italic text-muted-foreground border-t pt-4">
                    TIMSS/PISA va MKT asosidagi matematik tayyorgarlik modeli
                  </p>
                </div>
              ) : active.title === "Jarayonli (texnologik) blok" ? (
                <div className="mt-2 space-y-6">
                  <div>
                    <h4 className="font-bold text-base mb-1">Texnologik blokning matematik tayyorgarlik komponentlari</h4>
                    <p className="text-xs text-muted-foreground mb-3">TIMSS + PISA + MKT integratsiyasi asosida (Matematik modellashtirish — Matematik savodxonlik tarkibida).</p>
                    <Accordion type="single" collapsible className="w-full">
                      {texComponents.map((c, idx) => (
                        <AccordionItem key={idx} value={`tex-${idx}`}>
                          <AccordionTrigger className="text-left font-bold">
                            <div className="flex-1 pr-3">
                              <div>{idx + 1}. {c.name}</div>
                              <div className="mt-2 flex items-center gap-2">
                                <Progress value={c.progress} className="h-1.5 flex-1" />
                                <span className="text-xs font-medium text-muted-foreground tabular-nums">{c.progress}%</span>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="text-sm leading-relaxed text-foreground/85 space-y-4">
                            <div>
                              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Ilmiy tavsif</div>
                              <p>{c.desc}</p>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-3">
                              <div className="rounded-lg border bg-primary/5 p-3">
                                <Badge className="mb-2">TIMSS</Badge>
                                <p className="text-sm">{c.timss}</p>
                              </div>
                              <div className="rounded-lg border bg-secondary/40 p-3">
                                <Badge variant="secondary" className="mb-2">PISA</Badge>
                                <p className="text-sm">{c.pisa}</p>
                              </div>
                            </div>
                            <div className="rounded-lg border border-dashed p-3">
                              <Badge variant="outline" className="mb-2">MKT (SMK → PCK)</Badge>
                              <p className="text-sm">{c.mkt}</p>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Indikatorlar</div>
                                <ul className="list-disc pl-5 space-y-1">
                                  {c.indicators.map((it, i) => <li key={i}>{it}</li>)}
                                </ul>
                              </div>
                              <div>
                                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Baholash vositalari</div>
                                <ul className="list-disc pl-5 space-y-1">
                                  {c.tools.map((it, i) => <li key={i}>{it}</li>)}
                                </ul>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>

                  <div>
                    <h4 className="font-bold text-base mb-3">Texnologik blok tarkibiy bo'limlari</h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {texSections.map((s, i) => {
                        const Icon = s.icon;
                        return (
                          <div key={i} className="rounded-xl border p-3 bg-card hover:border-primary/50 transition">
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center text-primary-foreground">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="font-semibold text-sm">{s.title}</div>
                            </div>
                            <p className="text-xs text-foreground/75 leading-relaxed">{s.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-secondary/30 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">TIMSS · PISA · MKT integratsiyasi</div>
                    <div className="grid sm:grid-cols-3 gap-3 text-xs">
                      <div className="rounded-lg bg-background/60 border p-2">
                        <div className="font-semibold mb-1">TIMSS kompetensiyalari</div>
                        <div className="flex flex-wrap gap-1"><Badge variant="outline">Knowing</Badge><Badge variant="outline">Applying</Badge><Badge variant="outline">Reasoning</Badge></div>
                      </div>
                      <div className="rounded-lg bg-background/60 border p-2">
                        <div className="font-semibold mb-1">PISA jarayonlari</div>
                        <div className="flex flex-wrap gap-1"><Badge variant="outline">Formulate</Badge><Badge variant="outline">Employ</Badge><Badge variant="outline">Interpret</Badge></div>
                      </div>
                      <div className="rounded-lg bg-background/60 border p-2">
                        <div className="font-semibold mb-1">MKT tarkiblari</div>
                        <div className="flex flex-wrap gap-1"><Badge variant="outline">SMK</Badge><Badge variant="outline">PCK</Badge></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-base mb-1">Texnologik → Diagnostik-monitoring oqimi</h4>
                    <p className="text-xs text-muted-foreground mb-3">Jarayonli blokdan diagnostik-monitoring blokiga o'tuvchi metodik sikl.</p>
                    <div className="rounded-xl border bg-card p-4">
                      <div className="flex flex-col items-center gap-1.5">
                        {flowSteps.map((st, i) => {
                          const Icon = st.icon;
                          return (
                            <div key={i} className="w-full flex flex-col items-center">
                              <div className="w-full max-w-xs rounded-lg border bg-background px-3 py-2 flex items-center gap-2 shadow-sm">
                                <div className="w-7 h-7 rounded-md bg-gradient-hero flex items-center justify-center text-primary-foreground">
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-sm font-medium">{st.label}</span>
                              </div>
                              {i < flowSteps.length - 1 && <ArrowDown className="w-4 h-4 text-primary my-0.5" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-base mb-3">Statistik monitoring paneli</h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {texComponents.map((c, i) => (
                        <div key={i} className="rounded-lg border p-3 bg-card">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold">{c.name}</span>
                            <span className="text-xs tabular-nums text-muted-foreground">{c.progress}%</span>
                          </div>
                          <Progress value={c.progress} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-center italic text-muted-foreground border-t pt-4">
                    Jarayonli (texnologik) blok — TIMSS, PISA va MKT integratsiyasi asosida ishlab chiqilgan PhD dissertatsiya modelining tarkibiy qismi
                  </p>
                </div>
              ) : (
              <div className="mt-2">
                <h4 className="font-semibold mb-3 text-base">
                  Bo'lajak boshlang'ich sinf o'qituvchilarining matematik tayyorgarligi komponentlari
                </h4>
                <Accordion type="single" collapsible className="w-full">
                  {mathComponents.map((c, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`}>
                      <AccordionTrigger className="text-left font-bold text-foreground">
                        {idx + 1}. {c.name}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm leading-relaxed text-foreground/85 space-y-4">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                            Komponent tavsifi
                          </div>
                          <p>{c.desc}</p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div className="rounded-lg border bg-primary/5 p-3">
                            <Badge className="mb-2">TIMSS</Badge>
                            <p className="text-sm">{c.timss}</p>
                          </div>
                          <div className="rounded-lg border bg-secondary/40 p-3">
                            <Badge variant="secondary" className="mb-2">PISA</Badge>
                            <p className="text-sm">{c.pisa}</p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-dashed p-3">
                          <Badge variant="outline" className="mb-2">MKT transformatsiyasi</Badge>
                          <p className="text-sm">{c.mkt}</p>
                        </div>
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                            Diagnostik indikatorlar
                          </div>
                          <ul className="list-disc pl-5 space-y-1">
                            {c.indicators.map((it, i) => (
                              <li key={i}>{it}</li>
                            ))}
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <div className="mt-6 rounded-xl border bg-gradient-to-br from-primary/5 to-secondary/30 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">
                    Ilmiy-metodik asos
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/85">
                    Mazkur komponentlar TIMSS va PISA xalqaro baholash dasturlari kompetensiyalari hamda Mathematical Knowledge for Teaching (MKT) transformatsiya mexanizmi integratsiyasi asosida ishlab chiqilgan bo'lib, bo'lajak boshlang'ich sinf o'qituvchilarining matematik tayyorgarligi modelining tarkibiy qismlarini tashkil etadi.
                  </p>
                </div>
                <p className="mt-4 text-xs text-center italic text-muted-foreground border-t pt-4">
                  TIMSS/PISA va MKT asosidagi matematik tayyorgarlik modeli
                </p>
              </div>
              )}

            </>
          )}
        </DialogContent>
      </Dialog>

    </SiteLayout>
  );
}
