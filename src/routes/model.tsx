import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { Target, BookOpen, Cog, Activity, Award, ArrowDown, X, Users, FileText, Lightbulb, FolderKanban, Monitor, BookMarked, BarChart3, RefreshCw, CheckCircle2, MessageSquare, TrendingUp, FileDown, GraduationCap, UserCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

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

type DiagComponent = {
  name: string;
  criteria: number;
  indicators: number;
  score: number;
  criteriaList: string[];
  indicatorsList: string[];
  results: string;
};

const diagComponents: DiagComponent[] = [
  {
    name: "Matematik bilim",
    criteria: 4,
    indicators: 12,
    score: 78,
    criteriaList: ["Tushunchalarni bilish", "Faktlar va qoidalar", "Protseduralarni qo'llash", "Terminologiya"],
    indicatorsList: ["Ta'riflarni to'g'ri ifodalash", "Formulalarni tanlash", "Hisoblash aniqligi", "Belgilashlar bilan ishlash"],
    results: "Talabalar TIMSS Knowing domeni bo'yicha o'rtacha 78% ko'rsatkichga erishgan.",
  },
  {
    name: "Matematik tafakkur",
    criteria: 3,
    indicators: 10,
    score: 71,
    criteriaList: ["Mantiqiy mulohaza", "Tahlil va sintez", "Isbotlash"],
    indicatorsList: ["Zanjirli xulosa qurishi", "Nostandart yechim topishi", "Qonuniyatlarni umumlashtirishi"],
    results: "TIMSS Reasoning domeni bo'yicha rivojlanish dinamikasi ijobiy.",
  },
  {
    name: "Matematik savodxonlik",
    criteria: 3,
    indicators: 11,
    score: 74,
    criteriaList: ["Formulate", "Employ", "Interpret"],
    indicatorsList: ["Real vaziyatni modelga aylantirishi", "Modelni qo'llab natija olishi", "Natijani talqin qilishi"],
    results: "PISA matematik savodxonlik ko'rsatkichi yetarli darajada.",
  },
  {
    name: "Matematik-metodik kompetentlik",
    criteria: 4,
    indicators: 13,
    score: 68,
    criteriaList: ["Topshiriq loyihalash", "Xatolar tahlili", "Metodik qaror", "Refleksiya"],
    indicatorsList: ["TIMSS/PISA topshiriqlari yaratishi", "Differensial metodika tanlashi", "E-Portfolio yuritishi", "Kasbiy o'zini baholashi"],
    results: "MKT (SMK → PCK) transformatsiyasi bosqichida.",
  },
];

const diagLevels: { color: string; dot: string; name: string; range: string; min: number; max: number }[] = [
  { color: "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300", dot: "bg-rose-500", name: "Past daraja", range: "0–55%", min: 0, max: 55 },
  { color: "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300", dot: "bg-amber-500", name: "O'rta daraja", range: "56–70%", min: 56, max: 70 },
  { color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500", name: "Yetarli daraja", range: "71–85%", min: 71, max: 85 },
  { color: "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300", dot: "bg-blue-500", name: "Yuqori daraja", range: "86–100%", min: 86, max: 100 },
];

const portfolioItems: { label: string; value: number }[] = [
  { label: "Bajarilgan topshiriqlar", value: 82 },
  { label: "Loyiha ishlari", value: 70 },
  { label: "TIMSS topshiriqlari", value: 76 },
  { label: "PISA topshiriqlari", value: 72 },
  { label: "Refleksiv yozuvlar", value: 65 },
  { label: "Sertifikatlar", value: 58 },
];

const feedbackTimeline: { from: string; to: string; date: string; text: string; icon: typeof Users }[] = [
  { from: "O'qituvchi", to: "Talaba", date: "Sentabr", text: "Boshlang'ich diagnostika natijalari bo'yicha individual tavsiyalar.", icon: GraduationCap },
  { from: "Talaba", to: "O'qituvchi", date: "Oktabr", text: "Modellashtirish topshiriqlari bo'yicha savol va refleksiya.", icon: UserCheck },
  { from: "Mentor", to: "Talaba", date: "Noyabr", text: "E-Portfolio ekspertizasi va PISA topshiriqlariga korreksiya.", icon: Sparkles },
  { from: "O'qituvchi", to: "Talaba", date: "Dekabr", text: "Oraliq diagnostika: reasoning domeni bo'yicha treninglar.", icon: GraduationCap },
  { from: "Mentor", to: "Talaba", date: "Yanvar", text: "Yakuniy diagnostika oldidan metodik loyiha himoyasi tavsiyalari.", icon: Sparkles },
];

const monitoringData = [
  { stage: "Boshlang'ich", bilim: 52, tafakkur: 48, savodxonlik: 50, metodik: 44 },
  { stage: "Oraliq", bilim: 66, tafakkur: 60, savodxonlik: 63, metodik: 56 },
  { stage: "Yakuniy", bilim: 78, tafakkur: 71, savodxonlik: 74, metodik: 68 },
];

const avgScore = Math.round(diagComponents.reduce((s, c) => s + c.score, 0) / diagComponents.length);
const currentLevel = diagLevels.find((l) => avgScore >= l.min && avgScore <= l.max) ?? diagLevels[0];


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
        <DialogContent className={`${active?.title === "Diagnostik-monitoring blok" ? "max-w-6xl" : "max-w-2xl"} max-h-[90vh] overflow-y-auto`}>
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
              ) : active.title === "Diagnostik-monitoring blok" ? (
                <DiagnosticView />
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

function DiagnosticView() {
  const [reportOpen, setReportOpen] = useState(false);

  const downloadSvg = () => {
    const svg = document.getElementById("diag-chart-svg");
    if (!svg) return;
    const serializer = new XMLSerializer();
    const src = serializer.serializeToString(svg);
    const blob = new Blob([src], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diagnostik-monitoring.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-2 space-y-6">
      <p className="text-sm text-foreground/80 leading-relaxed border-l-4 border-primary/40 pl-3 italic">
        Mazkur blok matematik tayyorgarlikning matematik bilim, matematik tafakkur, matematik savodxonlik va
        matematik-metodik kompetentlik komponentlarini baholash, monitoring qilish hamda rivojlanish
        dinamikasini kuzatishga xizmat qiladi.
      </p>

      {/* 1. Baholash mezonlari */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center text-primary-foreground text-xs font-bold">1</div>
          <h4 className="font-bold text-base">Baholash mezonlari</h4>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          {diagComponents.map((c, i) => (
            <div key={i} className="rounded-xl border p-3 bg-card hover:border-primary/50 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-sm">{c.name}</div>
                <Badge variant="outline" className="tabular-nums">{c.score}%</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                <div>Mezonlar: <span className="font-semibold text-foreground">{c.criteria}</span></div>
                <div>Indikatorlar: <span className="font-semibold text-foreground">{c.indicators}</span></div>
              </div>
              <Progress value={c.score} className="h-1.5" />
            </div>
          ))}
        </div>
        <Accordion type="single" collapsible className="w-full">
          {diagComponents.map((c, i) => (
            <AccordionItem key={i} value={`diag-${i}`}>
              <AccordionTrigger className="text-left font-semibold text-sm">
                {c.name} — batafsil
              </AccordionTrigger>
              <AccordionContent className="text-sm space-y-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Mezonlar</div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.criteriaList.map((x, j) => <Badge key={j} variant="secondary">{x}</Badge>)}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Indikatorlar</div>
                  <ul className="list-disc pl-5 space-y-0.5 text-foreground/85">
                    {c.indicatorsList.map((x, j) => <li key={j}>{x}</li>)}
                  </ul>
                </div>
                <div className="rounded-lg border bg-primary/5 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">Baholash natijalari</div>
                  <p className="text-foreground/85">{c.results}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* 2. Rivojlanish darajalari */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center text-primary-foreground text-xs font-bold">2</div>
          <h4 className="font-bold text-base">Rivojlanish darajalari</h4>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
          {diagLevels.map((l, i) => {
            const active = l.name === currentLevel.name;
            return (
              <div key={i} className={`rounded-xl border p-3 transition ${l.color} ${active ? "ring-2 ring-offset-2 ring-primary shadow-md scale-[1.02]" : "opacity-70 hover:opacity-100"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${l.dot}`} />
                  <span className="font-semibold text-sm">{l.name}</span>
                </div>
                <div className="text-xs tabular-nums">{l.range}</div>
                {active && <div className="mt-2 text-xs font-semibold">← Joriy natija: {avgScore}%</div>}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. E-Portfolio */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center text-primary-foreground text-xs font-bold">3</div>
          <h4 className="font-bold text-base">E-Portfolio</h4>
        </div>
        <div className="rounded-xl border p-4 bg-gradient-to-br from-primary/5 to-secondary/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Talaba elektron portfoliosi</span>
            </div>
            <Badge className="tabular-nums">
              {Math.round(portfolioItems.reduce((s, p) => s + p.value, 0) / portfolioItems.length)}%
            </Badge>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {portfolioItems.map((p, i) => (
              <div key={i} className="rounded-lg bg-background/70 border p-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium">{p.label}</span>
                  <span className="text-xs tabular-nums text-muted-foreground">{p.value}%</span>
                </div>
                <Progress value={p.value} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Feedback mexanizmi */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center text-primary-foreground text-xs font-bold">4</div>
          <h4 className="font-bold text-base">Feedback mexanizmi</h4>
        </div>
        <div className="grid sm:grid-cols-3 gap-2 mb-3">
          {[
            ["O'qituvchi", "Talaba"],
            ["Talaba", "O'qituvchi"],
            ["Mentor", "Talaba"],
          ].map(([a, b], i) => (
            <div key={i} className="rounded-lg border p-2.5 bg-card text-center text-xs font-medium">
              <span>{a}</span> <span className="text-primary">→</span> <span>{b}</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Feedback tarixi</div>
          <ol className="relative border-l-2 border-primary/30 ml-2 space-y-4">
            {feedbackTimeline.map((f, i) => {
              const Icon = f.icon;
              return (
                <li key={i} className="ml-4">
                  <span className="absolute -left-[11px] w-5 h-5 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground">
                    <Icon className="w-3 h-3" />
                  </span>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge variant="outline" className="text-[10px]">{f.date}</Badge>
                    <span className="text-xs font-semibold">{f.from} <span className="text-primary">→</span> {f.to}</span>
                  </div>
                  <p className="text-sm text-foreground/85">{f.text}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* 5. Statistik monitoring */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center text-primary-foreground text-xs font-bold">5</div>
          <h4 className="font-bold text-base">Statistik monitoring — o'sish dinamikasi</h4>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monitoringData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="stage" fontSize={11} />
                <YAxis fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="bilim" name="Bilim" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="tafakkur" name="Tafakkur" stroke="#8b5cf6" strokeWidth={2} />
                <Line type="monotone" dataKey="savodxonlik" name="Savodxonlik" stroke="#06b6d4" strokeWidth={2} />
                <Line type="monotone" dataKey="metodik" name="Metodik kompetentlik" stroke="#ec4899" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
            {monitoringData.map((s, i) => (
              <div key={i} className="rounded-lg border bg-background/60 p-2">
                <div className="font-semibold">{s.stage} diagnostika</div>
                <div className="text-muted-foreground tabular-nums">
                  o'rtacha {Math.round((s.bilim + s.tafakkur + s.savodxonlik + s.metodik) / 4)}%
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-end">
            <Button variant="outline" size="sm" onClick={downloadSvg}>
              <FileDown className="w-3.5 h-3.5 mr-1.5" /> SVG eksport
            </Button>
          </div>
          <div id="diag-chart-svg-wrap" className="hidden">
            <svg id="diag-chart-svg" xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300">
              <rect width="600" height="300" fill="white"/>
              <text x="20" y="30" fontFamily="Manrope" fontSize="14" fontWeight="700">Diagnostik-monitoring dinamikasi</text>
              {monitoringData.map((s, i) => (
                <text key={i} x={100 + i * 180} y="280" fontSize="12" textAnchor="middle">{s.stage}</text>
              ))}
              {(["bilim","tafakkur","savodxonlik","metodik"] as const).map((k, ki) => {
                const colors = ["#3b82f6","#8b5cf6","#06b6d4","#ec4899"];
                const pts = monitoringData.map((s, i) => `${100 + i * 180},${260 - s[k] * 2}`).join(" ");
                return <polyline key={k} fill="none" stroke={colors[ki]} strokeWidth="2" points={pts} />;
              })}
            </svg>
          </div>
        </div>
      </section>

      {/* 6. Analitik hisobot */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center text-primary-foreground text-xs font-bold">6</div>
          <h4 className="font-bold text-base">Analitik hisobot</h4>
        </div>
        <div className="rounded-xl border p-4 bg-card flex items-center justify-between flex-wrap gap-3">
          <div className="text-sm text-foreground/80">
            Talaba matematik tayyorgarligining barcha komponentlari, darajalari va rivojlanish
            dinamikasini o'z ichiga oluvchi to'liq analitik hisobotni yarating.
          </div>
          <Button onClick={() => setReportOpen(true)}>
            <FileText className="w-4 h-4 mr-2" /> Hisobot yaratish
          </Button>
        </div>
      </section>

      <p className="text-xs text-center italic text-muted-foreground border-t pt-4">
        Diagnostik-monitoring blok — PhD dissertatsiya doirasida ishlab chiqilgan matematik
        tayyorgarlikni baholash va kuzatish tizimi (TIMSS · PISA · MKT integratsiyasi)
      </p>

      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Analitik hisobot — PDF ko'rinishi</DialogTitle>
            <DialogDescription>
              Bo'lajak boshlang'ich sinf o'qituvchisining matematik tayyorgarligi bo'yicha diagnostik hisobot
            </DialogDescription>
          </DialogHeader>
          <div id="report-preview" className="bg-white text-black rounded-lg border p-6 space-y-5 text-sm font-serif">
            <div className="text-center border-b pb-3">
              <div className="text-xs uppercase tracking-widest text-gray-500">Diagnostik-monitoring tizimi</div>
              <div className="text-lg font-bold mt-1">Matematik tayyorgarlik analitik hisoboti</div>
              <div className="text-xs text-gray-600 mt-1">TIMSS · PISA · MKT integratsiyasi asosida</div>
            </div>
            <div>
              <div className="font-bold mb-2">1. Komponentlar natijalari</div>
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Komponent</th>
                    <th className="border p-2">Mezonlar</th>
                    <th className="border p-2">Indikatorlar</th>
                    <th className="border p-2">Natija (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {diagComponents.map((c, i) => (
                    <tr key={i}>
                      <td className="border p-2">{c.name}</td>
                      <td className="border p-2 text-center">{c.criteria}</td>
                      <td className="border p-2 text-center">{c.indicators}</td>
                      <td className="border p-2 text-center font-semibold">{c.score}%</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="border p-2">O'rtacha</td>
                    <td className="border p-2 text-center">—</td>
                    <td className="border p-2 text-center">—</td>
                    <td className="border p-2 text-center">{avgScore}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <div className="font-bold mb-2">2. Rivojlanish darajasi</div>
              <p>Joriy o'rtacha ko'rsatkich: <b>{avgScore}%</b> — <b>{currentLevel.name}</b> ({currentLevel.range}).</p>
            </div>
            <div>
              <div className="font-bold mb-2">3. Rivojlanish dinamikasi</div>
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Bosqich</th>
                    <th className="border p-2">Bilim</th>
                    <th className="border p-2">Tafakkur</th>
                    <th className="border p-2">Savodxonlik</th>
                    <th className="border p-2">Metodik</th>
                  </tr>
                </thead>
                <tbody>
                  {monitoringData.map((s, i) => (
                    <tr key={i}>
                      <td className="border p-2 font-medium">{s.stage}</td>
                      <td className="border p-2 text-center">{s.bilim}%</td>
                      <td className="border p-2 text-center">{s.tafakkur}%</td>
                      <td className="border p-2 text-center">{s.savodxonlik}%</td>
                      <td className="border p-2 text-center">{s.metodik}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <div className="font-bold mb-2">4. Tavsiyalar</div>
              <ul className="list-disc pl-5 space-y-1">
                <li>Matematik-metodik kompetentlik komponenti bo'yicha qo'shimcha PCK modullarini kiritish.</li>
                <li>PISA Interpret bosqichi bo'yicha refleksiv topshiriqlar sonini oshirish.</li>
                <li>E-Portfolio doirasida sertifikatlar va loyihalar ulushini kengaytirish.</li>
                <li>Mentorlik tizimini kuchaytirish va feedback davriyligini oylik rejimga o'tkazish.</li>
              </ul>
            </div>
            <div className="text-xs text-gray-500 border-t pt-2 text-right">
              Hisobot avtomatik shakllantirildi — diagnostik-monitoring tizimi
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setReportOpen(false)}>Yopish</Button>
            <Button onClick={() => window.print()}>
              <FileDown className="w-4 h-4 mr-2" /> PDF yuklab olish
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

