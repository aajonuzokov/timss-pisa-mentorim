import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { Target, BookOpen, Cog, Activity, Award, ArrowDown, X, Users, FileText, Lightbulb, FolderKanban, Monitor, BookMarked, BarChart3, RefreshCw, CheckCircle2, MessageSquare, TrendingUp, FileDown, GraduationCap, UserCheck, Sparkles, Brain, Layers, Compass, Repeat, Trophy, CalendarClock, Wand2, ArrowRight, ClipboardList, Gauge, Radar as RadarIcon, Rocket, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from "recharts";

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
    name: "Matematik savodxonlik (matematik modellashtirish ko'nikmalarini o'z ichiga oladi)",
    desc: "Real hayotiy vaziyatlarni matematik jihatdan tushunish, tahlil qilish va talqin qilish qobiliyati. Mazkur komponent matematik modellashtirish jarayonini — Formulate → Employ → Interpret siklini — mustaqil komponent sifatida emas, balki matematik savodxonlikning tarkibiy ko'nikmasi sifatida qamrab oladi.",
    timss: "Applying, Reasoning",
    pisa: "Formulate, Employ, Interpret",
    mkt: "Matematik mazmunni amaliy vaziyatlar bilan bog'lab o'qitish; matematik modellarni boshlang'ich sinf o'quvchilariga mos metodik topshiriqlarga aylantirish.",
    indicators: [
      "Real vaziyatlarni matematiklashtirish (Formulate)",
      "Matematik model tuzish va yechim ishlab chiqish (Employ)",
      "Natijalarni talqin qilish va amaliyotga tatbiq etish (Interpret)",
      "Modellashtirish siklini yaxlit amalga oshirish",
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
                            ["Matematik savodxonlik (matematik modellashtirish ko'nikmalarini o'z ichiga oladi)", "Real hayotiy vaziyatlarni matematik nuqtai nazardan tushunish, tahlil qilish va talqin etish qobiliyatidir. Matematik modellashtirish mustaqil komponent emas, balki ushbu komponentning tarkibiy ko'nikmasi sifatida PISA Formulate–Employ–Interpret siklini to'liq aks ettiradi."],
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

// ============================================================
// Diagnostic-Monitoring Academic Learning Analytics Dashboard
// ============================================================

type ReadinessComp = {
  key: string;
  name: string;
  icon: typeof Brain;
  score: number;
  indicators: number;
  assessments: number;
  criteria: string[];
  indicatorList: string[];
  tools: string[];
  recommendation: string;
};

const readinessComponents: ReadinessComp[] = [
  { key: "knowledge", name: "Matematik bilim", icon: BookOpen, score: 82, indicators: 12, assessments: 8,
    criteria: ["Tushunchalarni bilish", "Faktlar va qoidalar", "Protseduralar", "Terminologiya"],
    indicatorList: ["Ta'riflarni to'g'ri ifodalash", "Formulalar tanlovi", "Hisoblash aniqligi"],
    tools: ["TIMSS Knowing test", "Interaktiv kvizlar", "Konseptual xaritalar"],
    recommendation: "Bilim darajasi yuqori — chuqurlashtirilgan modullarni tavsiya etamiz." },
  { key: "thinking", name: "Matematik tafakkur", icon: Brain, score: 71, indicators: 10, assessments: 6,
    criteria: ["Mantiqiy mulohaza", "Tahlil va sintez", "Isbotlash"],
    indicatorList: ["Zanjirli xulosa", "Nostandart yechim", "Umumlashtirish"],
    tools: ["TIMSS Reasoning", "Keys-stadi", "Refleksiv jurnal"],
    recommendation: "Reasoning kompetensiyasini TIMSS Level-3 topshiriqlari orqali mustahkamlash." },
  { key: "literacy", name: "Matematik savodxonlik (matematik modellashtirish ko'nikmalari bilan)", icon: Compass, score: 72, indicators: 20, assessments: 12,
    criteria: ["Formulate", "Employ", "Interpret", "Modellashtirish sikli"],
    indicatorList: ["Real vaziyatni matematik modelga aylantirish (Formulate)", "Modelni qo'llab yechim olish (Employ)", "Natijani talqin qilish (Interpret)", "Modelni validatsiyalash va amaliyotga tatbiq etish"],
    tools: ["PISA kontekstli banklar", "Loyiha metodi", "Mentorim modellashtirish topshiriqlari", "Simulyatsiya modullari"],
    recommendation: "Formulate va Interpret bosqichlari bo'yicha kontekstli hamda refleksiv modellashtirish topshiriqlari sonini oshirish." },
  { key: "mmk", name: "Matematik-metodik kompetentlik", icon: GraduationCap, score: 68, indicators: 13, assessments: 6,
    criteria: ["Topshiriq loyihalash", "Xatolar tahlili", "Metodik qaror", "Refleksiya"],
    indicatorList: ["TIMSS/PISA loyihalash", "Differensial metodika", "Kasbiy refleksiya"],
    tools: ["Metodik loyiha himoyasi", "E-Portfolio", "Mentorim diagnostika"],
    recommendation: "SMK → PCK transformatsiyasi bo'yicha modullarni kengaytirish." },
  { key: "reflective", name: "Refleksiv kompetentlik", icon: RefreshCw, score: 65, indicators: 8, assessments: 5,
    criteria: ["Metakognitsiya", "Kasbiy o'z-o'zini baholash", "Rivojlanish rejasi"],
    indicatorList: ["Faoliyat tahlili", "Xatolar ustida ishlash", "Rivojlanish trayektoriyasi"],
    tools: ["E-Portfolio yozuvlari", "Refleksiv esse", "Mentor sessiyalari"],
    recommendation: "Oylik refleksiv sessiyalarni majburiy formatga o'tkazish." },
];

const levelOf = (score: number) =>
  score >= 71
    ? { label: "Yuqori", color: "text-emerald-700", bg: "bg-emerald-50", ring: "ring-emerald-200", dot: "bg-emerald-500" }
    : score >= 56
    ? { label: "O'rta", color: "text-amber-700", bg: "bg-amber-50", ring: "ring-amber-200", dot: "bg-amber-500" }
    : { label: "Past", color: "text-rose-700", bg: "bg-rose-50", ring: "ring-rose-200", dot: "bg-rose-500" };

const summaryCards: { icon: typeof Target; title: string; text: string; tone: string }[] = [
  { icon: Target, title: "Maqsad", text: "Matematik tayyorgarlikning bosqichma-bosqich diagnostikasi va monitoringi.", tone: "from-blue-500/10 to-blue-500/0 border-blue-200" },
  { icon: ClipboardList, title: "Baholash obyektlari", text: "6 ta matematik tayyorgarlik komponenti, 63 indikator, 37 baholash.", tone: "from-indigo-500/10 to-indigo-500/0 border-indigo-200" },
  { icon: Gauge, title: "Monitoring strategiyasi", text: "Kirish → Oraliq → Yakuniy formativ va summativ baholash sikli.", tone: "from-violet-500/10 to-violet-500/0 border-violet-200" },
  { icon: Trophy, title: "Kutilayotgan natija", text: "TIMSS · PISA · MKT standartlariga muvofiq metodik kompetentlik.", tone: "from-fuchsia-500/10 to-fuchsia-500/0 border-fuchsia-200" },
];

const digitalEnv: { icon: typeof Monitor; title: string; status: string; state: "active" | "sync" | "ready" }[] = [
  { icon: FolderKanban, title: "E-Portfolio", status: "82% to'ldirilgan", state: "active" },
  { icon: MessageSquare, title: "Feedback tizimi", status: "12 ta yangi izoh", state: "sync" },
  { icon: BookMarked, title: "Baholash tarixi", status: "37 ta yozuv", state: "ready" },
  { icon: BarChart3, title: "Learning Analytics", status: "Real-time", state: "active" },
  { icon: Monitor, title: "Mentorim Dashboard", status: "Ulangan", state: "active" },
];

const stateStyle = {
  active: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  sync: "bg-amber-500/10 text-amber-700 border-amber-200",
  ready: "bg-blue-500/10 text-blue-700 border-blue-200",
};

const timelineStages: { key: "initial" | "mid" | "final"; label: string; date: string; icon: typeof CalendarClock; status: string; score: number }[] = [
  { key: "initial", label: "Kirish diagnostikasi", date: "Sentabr", icon: Rocket, status: "Yakunlangan", score: 55 },
  { key: "mid", label: "Oraliq monitoring", date: "Dekabr", icon: Activity, status: "Yakunlangan", score: 65 },
  { key: "final", label: "Yakuniy nazorat", date: "May", icon: ShieldCheck, status: "Jarayonda", score: 73 },
];

const timelineChartData = [
  { stage: "Kirish", score: 55 },
  { stage: "1-oraliq", score: 60 },
  { stage: "Oraliq", score: 65 },
  { stage: "2-oraliq", score: 69 },
  { stage: "Yakuniy", score: 73 },
];

const timssPisaBarData = [
  { name: "Knowing / Formulate", TIMSS: 82, PISA: 74 },
  { name: "Applying / Employ", TIMSS: 74, PISA: 71 },
  { name: "Reasoning / Interpret", TIMSS: 71, PISA: 68 },
];

const competencyFlow: { title: string; items: string[]; icon: typeof Award; accent: string }[] = [
  { title: "TIMSS", items: ["Knowing", "Applying", "Reasoning"], icon: BookOpen, accent: "from-blue-600 to-blue-500" },
  { title: "PISA", items: ["Formulate", "Employ", "Interpret"], icon: Compass, accent: "from-indigo-600 to-indigo-500" },
  { title: "MKT", items: ["SMK", "PCK"], icon: Brain, accent: "from-violet-600 to-violet-500" },
  { title: "Matematik tayyorgarlik", items: ["6 komponent", "Integrativ natija"], icon: Award, accent: "from-fuchsia-600 to-purple-600" },
];

function DiagnosticView() {
  const [reportOpen, setReportOpen] = useState(false);
  const avg = Math.round(readinessComponents.reduce((s, c) => s + c.score, 0) / readinessComponents.length);
  const totalIndicators = readinessComponents.reduce((s, c) => s + c.indicators, 0);
  const totalAssessments = readinessComponents.reduce((s, c) => s + c.assessments, 0);
  const radarData = readinessComponents.map((c) => ({ subject: c.name.replace("Matematik ", "M. "), score: c.score, full: 100 }));

  const aiRecs = readinessComponents
    .slice()
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((c) => ({ name: c.name, text: c.recommendation, score: c.score }));

  return (
    <div className="mt-2 space-y-8 text-slate-800">
      {/* Header stat strip */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 grid place-items-center text-white shadow-md">
              <Gauge className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-widest text-indigo-700">Academic Learning Analytics</div>
              <div className="text-lg font-bold truncate">Diagnostik-monitoring dashboard</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <StatCell label="Umumiy ball" value={`${avg}%`} tone="text-blue-700" />
            <StatCell label="Indikatorlar" value={totalIndicators} tone="text-indigo-700" />
            <StatCell label="Baholashlar" value={totalAssessments} tone="text-violet-700" />
          </div>
        </div>
      </div>

      {/* Section 1: Academic Summary */}
      <Section n={1} title="Akademik xulosa" icon={ClipboardList}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {summaryCards.map((s, i) => (
            <div key={i} className={`rounded-2xl border bg-gradient-to-br ${s.tone} p-4 shadow-sm hover:shadow-md transition`}>
              <div className="w-9 h-9 rounded-lg bg-white/80 grid place-items-center text-indigo-700 shadow-sm mb-3">
                <s.icon className="w-4.5 h-4.5" />
              </div>
              <div className="font-semibold text-sm mb-1">{s.title}</div>
              <p className="text-xs text-slate-600 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 2: Readiness Dashboard */}
      <Section n={2} title="Matematik tayyorgarlik dashboard" icon={Gauge}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {readinessComponents.map((c) => {
            const lv = levelOf(c.score);
            const Icon = c.icon;
            return (
              <div key={c.key} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-lg hover:border-indigo-200 transition">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-100 to-violet-100 grid place-items-center text-indigo-700">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{c.name}</div>
                    <div className={`text-[11px] font-medium ${lv.color}`}>{lv.label} daraja</div>
                  </div>
                  <div className="text-lg font-bold tabular-nums text-slate-900">{c.score}%</div>
                </div>
                <Progress value={c.score} className="h-2 mb-3" />
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="rounded-md bg-slate-50 border border-slate-100 px-2 py-1.5">
                    <div className="text-slate-500">Indikatorlar</div>
                    <div className="font-semibold text-slate-800">{c.indicators}</div>
                  </div>
                  <div className="rounded-md bg-slate-50 border border-slate-100 px-2 py-1.5">
                    <div className="text-slate-500">Baholashlar</div>
                    <div className="font-semibold text-slate-800">{c.assessments}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Section 3: Competency Framework */}
      <Section n={3} title="Kompetentlik freymvorki" icon={Layers}>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-stretch">
            {competencyFlow.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="contents">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                    <div className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1 text-white text-xs font-semibold bg-gradient-to-r ${f.accent} shadow-sm mb-2`}>
                      <Icon className="w-3.5 h-3.5" /> {f.title}
                    </div>
                    <ul className="space-y-1">
                      {f.items.map((it) => (
                        <li key={it} className="text-xs text-slate-700 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {i < competencyFlow.length - 1 && (
                    <div className="hidden lg:flex items-center justify-center text-indigo-400">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-2 justify-center text-[11px] text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-violet-500" />
            TIMSS · PISA · MKT integratsiyasi asosidagi matematik tayyorgarlik modeli
          </div>
        </div>
      </Section>

      {/* Section 4: Learning Analytics */}
      <Section n={4} title="Learning Analytics" icon={BarChart3}>
        <div className="grid lg:grid-cols-2 gap-3">
          <ChartCard title="Komponentlar radar" icon={RadarIcon}>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#475569" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: "#94a3b8" }} />
                <Radar name="Natija" dataKey="score" stroke="#6366f1" fill="#818cf8" fillOpacity={0.45} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="TIMSS vs PISA natijalari" icon={BarChart3}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={timssPisaBarData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#475569" }} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} domain={[0, 100]} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="TIMSS" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="PISA" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Vaqt bo'yicha o'sish dinamikasi" icon={TrendingUp} className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={timelineChartData} margin={{ top: 8, right: 16, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="stage" tick={{ fontSize: 11, fill: "#475569" }} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} domain={[0, 100]} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Line type="monotone" dataKey="score" stroke="url(#lineGrad)" strokeWidth={3} dot={{ r: 4, fill: "#6366f1" }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </Section>

      {/* Section 5: Diagnostic Indicators */}
      <Section n={5} title="Diagnostik indikatorlar" icon={ClipboardList}>
        <div className="rounded-2xl border border-slate-200 bg-white p-2">
          <Accordion type="single" collapsible className="w-full">
            {readinessComponents.map((c, i) => {
              const lv = levelOf(c.score);
              const Icon = c.icon;
              return (
                <AccordionItem key={c.key} value={`ri-${i}`} className="border-b last:border-b-0">
                  <AccordionTrigger className="px-3 hover:no-underline">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-violet-100 grid place-items-center text-indigo-700 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-sm truncate">{c.name}</span>
                      <Badge variant="outline" className={`ml-auto mr-3 ${lv.color} border-current/30`}>{lv.label} · {c.score}%</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <IndicatorBlock title="Baholash mezonlari" items={c.criteria} tone="bg-blue-50 border-blue-100 text-blue-700" />
                      <IndicatorBlock title="Indikatorlar" items={c.indicatorList} tone="bg-indigo-50 border-indigo-100 text-indigo-700" />
                      <IndicatorBlock title="Baholash vositalari" items={c.tools} tone="bg-violet-50 border-violet-100 text-violet-700" />
                      <div className="rounded-lg border border-fuchsia-100 bg-fuchsia-50 p-3">
                        <div className="text-[11px] font-semibold uppercase tracking-wide text-fuchsia-700 mb-1.5 flex items-center gap-1.5">
                          <Wand2 className="w-3.5 h-3.5" /> Tavsiya
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{c.recommendation}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </Section>

      {/* Section 6: Monitoring Timeline */}
      <Section n={6} title="Monitoring vaqt jadvali" icon={CalendarClock}>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="relative">
            <div className="absolute left-0 right-0 top-6 h-0.5 bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-500 rounded-full" />
            <div className="grid grid-cols-3 gap-4 relative">
              {timelineStages.map((s) => {
                const Icon = s.icon;
                const done = s.status === "Yakunlangan";
                return (
                  <div key={s.key} className="text-center">
                    <div className={`w-12 h-12 mx-auto rounded-full grid place-items-center shadow-md ring-4 ring-white ${done ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white" : "bg-white border-2 border-violet-400 text-violet-600"}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="mt-3 text-sm font-semibold">{s.label}</div>
                    <div className="text-[11px] text-slate-500">{s.date}</div>
                    <Badge variant="outline" className={`mt-2 ${done ? "text-emerald-700 border-emerald-200 bg-emerald-50" : "text-amber-700 border-amber-200 bg-amber-50"}`}>
                      {s.status} · {s.score}%
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* Section 7: Digital Environment */}
      <Section n={7} title="Raqamli muhit" icon={Monitor}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {digitalEnv.map((d, i) => {
            const Icon = d.icon;
            return (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-100 to-violet-100 grid place-items-center text-indigo-700">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${stateStyle[d.state]}`}>
                    {d.state === "active" ? "● Faol" : d.state === "sync" ? "◐ Sync" : "○ Tayyor"}
                  </span>
                </div>
                <div className="text-sm font-semibold mb-0.5">{d.title}</div>
                <div className="text-[11px] text-slate-500">{d.status}</div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Section 8: AI Recommendations */}
      <Section n={8} title="AI tavsiyalari" icon={Wand2}>
        <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 grid place-items-center text-white shadow-md">
              <Zap className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="text-sm font-semibold">Avtomatik shakllantirilgan tavsiyalar</div>
              <div className="text-[11px] text-slate-500">Baholash natijalari asosida — eng past 3 komponent</div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {aiRecs.map((r, i) => (
              <div key={i} className="rounded-xl bg-white border border-violet-100 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-gradient-to-r from-violet-600 to-indigo-600">Tavsiya {i + 1}</Badge>
                  <span className="text-xs font-bold text-slate-800 tabular-nums">{r.score}%</span>
                </div>
                <div className="text-sm font-semibold mb-1.5">{r.name}</div>
                <p className="text-xs text-slate-600 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setReportOpen(true)} className="bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90">
              <FileText className="w-4 h-4 mr-2" /> Analitik hisobot
            </Button>
          </div>
        </div>
      </Section>

      <p className="text-[11px] text-center italic text-slate-500 border-t pt-4">
        Diagnostik-monitoring dashboard — PhD dissertatsiya doirasidagi TIMSS · PISA · MKT integratsiyasi
      </p>

      {/* Report modal (unchanged) */}
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
                    <th className="border p-2">Indikatorlar</th>
                    <th className="border p-2">Baholashlar</th>
                    <th className="border p-2">Natija (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {readinessComponents.map((c) => (
                    <tr key={c.key}>
                      <td className="border p-2">{c.name}</td>
                      <td className="border p-2 text-center">{c.indicators}</td>
                      <td className="border p-2 text-center">{c.assessments}</td>
                      <td className="border p-2 text-center font-semibold">{c.score}%</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="border p-2">O'rtacha</td>
                    <td className="border p-2 text-center">{totalIndicators}</td>
                    <td className="border p-2 text-center">{totalAssessments}</td>
                    <td className="border p-2 text-center">{avg}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <div className="font-bold mb-2">2. AI tavsiyalari</div>
              <ul className="list-disc pl-5 space-y-1">
                {aiRecs.map((r, i) => (
                  <li key={i}><b>{r.name}</b> — {r.text}</li>
                ))}
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

function Section({ n, title, icon: Icon, children }: { n: number; title: string; icon: typeof Target; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white grid place-items-center text-xs font-bold shadow-md">
          {n}
        </div>
        <div className="flex items-center gap-2">
          <Icon className="w-4.5 h-4.5 text-indigo-600" />
          <h4 className="font-bold text-base text-slate-900">{title}</h4>
        </div>
      </div>
      {children}
    </section>
  );
}

function StatCell({ label, value, tone }: { label: string; value: string | number; tone: string }) {
  return (
    <div className="rounded-xl bg-white/80 backdrop-blur border border-white shadow-sm px-3 py-2">
      <div className={`text-lg font-bold tabular-nums ${tone}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">{label}</div>
    </div>
  );
}

function ChartCard({ title, icon: Icon, children, className }: { title: string; icon: typeof BarChart3; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${className ?? ""}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-indigo-600" />
        <div className="text-sm font-semibold text-slate-800">{title}</div>
      </div>
      {children}
    </div>
  );
}

function IndicatorBlock({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  return (
    <div className={`rounded-lg border p-3 ${tone.split(" ").filter(c => c.startsWith("bg-") || c.startsWith("border-")).join(" ")}`}>
      <div className={`text-[11px] font-semibold uppercase tracking-wide mb-1.5 ${tone.split(" ").filter(c => c.startsWith("text-")).join(" ")}`}>
        {title}
      </div>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}


