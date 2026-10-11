import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Brain, Wrench, Lightbulb, Globe2, Info } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { Quiz, type Question } from "@/components/Quiz";
import type { TestKey } from "@/data/bank";
import released from "@/data/released.json";

export const Route = createFileRoute("/rasmiy")({
  head: () => ({
    meta: [
      { title: "Rasmiy namunaviy topshiriqlar — TIMSS/PISA Platformasi" },
      {
        name: "description",
        content:
          "IEA (TIMSS) va OECD (PISA) ochiq e'lon qilgan namunaviy topshiriqlar asosida o'zbek tiliga moslashtirilgan topshiriqlar va ularning metodik tahlili.",
      },
    ],
  }),
  component: Page,
});

type Key = "knowing" | "applying" | "reasoning" | "pisa";
const data = released as unknown as Record<Key, Question[]>;

const tabs: { key: Key; testKey: TestKey; title: string; desc: string; icon: typeof Brain }[] = [
  {
    key: "knowing",
    testKey: "r-knowing",
    title: "TIMSS · Bilish",
    desc: "4- va 8-sinf: faktlar, tushunchalar va hisoblash.",
    icon: Brain,
  },
  {
    key: "applying",
    testKey: "r-applying",
    title: "TIMSS · Qo'llash",
    desc: "4- va 8-sinf: tanish vaziyatlarda masala yechish.",
    icon: Wrench,
  },
  {
    key: "reasoning",
    testKey: "r-reasoning",
    title: "TIMSS · Mulohaza",
    desc: "4- va 8-sinf: ko'p bosqichli fikrlash, umumlashtirish.",
    icon: Lightbulb,
  },
  {
    key: "pisa",
    testKey: "r-pisa",
    title: "PISA",
    desc: "15 yosh: Formulate, Employ, Interpret jarayonlari.",
    icon: Globe2,
  },
];

function Page() {
  const [tab, setTab] = useState<Key>("knowing");
  const total = tabs.reduce((n, t) => n + data[t.key].length, 0);
  const cur = tabs.find((t) => t.key === tab)!;

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Rasmiy namunaviy topshiriqlar"
        title={`TIMSS va PISA namunaviy topshiriqlari (${total} ta)`}
        description="IEA (TIMSS) va OECD (PISA) ochiq e'lon qilgan (released) topshiriqlar asosida o'zbek tiliga moslashtirilgan to'plam. Har bir topshiriqdan keyin uning o'quvchi uchun maqsadi, bo'lajak o'qituvchi uchun metodik maqsadi va darsda qo'llash usuli ko'rsatiladi."
      />

      <section className="max-w-6xl mx-auto px-6 pt-8">
        <div className="p-5 rounded-2xl border border-primary/30 bg-primary/5 text-sm leading-relaxed flex gap-3">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p>
              <b>Chegara:</b> TIMSS 4- va 8-sinf o'quvchilarini, PISA esa 15 yoshli o'quvchilarni
              baholaydi. Bu bo'limda topshiriqlar bo'lajak o'qituvchilarni baholash uchun emas,
              balki ularni TIMSS/PISA talablariga mos dars tashkil etishga tayyorlash uchun
              beriladi: avval topshiriqni o'quvchi o'rnida yechasiz, so'ng uning metodik tahlili
              bilan tanishasiz.
            </p>
            <p className="text-muted-foreground">
              Topshiriqlar so'zma-so'z tarjima emas: mazmuni va raqamlari saqlangan holda
              moslashtirilgan, ayrim rasmlar qayta chizilgan. Javobi son bo'lgan topshiriqlarda
              javob yoziladi, qolganlarida variant tanlanadi. Natija rasmiy TIMSS/PISA natijasi
              hisoblanmaydi. Released topshiriqlar notijorat, ta'lim va tadqiqot maqsadida
              ishlatiladi.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`text-left p-5 rounded-2xl border bg-card shadow-card transition ${active ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/40"}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-semibold">{t.title}</div>
              </div>
              <p className="text-sm text-muted-foreground">{t.desc}</p>
              <div className="mt-2 text-sm font-semibold text-primary">
                {data[t.key].length} ta topshiriq
              </div>
            </button>
          );
        })}
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <Quiz key={tab} questions={data[tab]} label={cur.title} testKey={cur.testKey} />
      </section>
    </SiteLayout>
  );
}
