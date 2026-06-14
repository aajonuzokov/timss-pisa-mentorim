import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { Target, BookOpen, Cog, Activity, Award, ArrowDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

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
                  {active.full}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-2">
                <h4 className="font-semibold mb-3">Matematik tayyorgarlik komponentlari:</h4>
                <Accordion type="single" collapsible className="w-full">
                  {mathComponents.map((c, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`}>
                      <AccordionTrigger className="text-left font-bold text-foreground">
                        {idx + 1}. {c.name}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm leading-relaxed text-foreground/85">
                        {c.desc}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <p className="mt-5 text-xs text-center italic text-muted-foreground border-t pt-4">
                  TIMSS/PISA va MKT asosidagi matematik tayyorgarlik modeli
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

    </SiteLayout>
  );
}
