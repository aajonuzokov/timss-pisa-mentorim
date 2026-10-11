import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { Quiz, type Question } from "@/components/Quiz";
import { Brain, Wrench, Lightbulb } from "lucide-react";
import timssData from "@/data/timss.json";

export const Route = createFileRoute("/timss")({
  head: () => ({
    meta: [
      { title: "TIMSS topshiriqlari — TIMSS/PISA Platformasi" },
      {
        name: "description",
        content:
          "TIMSSning Bilish, Qo'llash va Mulohaza yuritish kognitiv sohalari bo'yicha 250 ta test savoli.",
      },
    ],
  }),
  component: Page,
});

type Cat = "knowing" | "applying" | "reasoning";

const cats: { key: Cat; title: string; subtitle: string; desc: string; icon: typeof Brain }[] = [
  {
    key: "knowing",
    title: "Bilish (Knowing)",
    subtitle: "Faktlar va tushunchalar",
    desc: "Faktlar, jarayonlar va tushunchalarni eslab qolish, tanish va aniqlash.",
    icon: Brain,
  },
  {
    key: "applying",
    title: "Qo'llash (Applying)",
    subtitle: "Tanish vaziyatlar",
    desc: "Bilimlardan tanish vaziyatlarda foydalanish, masalalarni yechish va hisoblash.",
    icon: Wrench,
  },
  {
    key: "reasoning",
    title: "Mulohaza yuritish (Reasoning)",
    subtitle: "Tahlil va asoslash",
    desc: "Notanish vaziyatlarni tahlil qilish, umumlashtirish, isbotlash va xulosa chiqarish.",
    icon: Lightbulb,
  },
];

function Page() {
  const [cat, setCat] = useState<Cat>("knowing");
  const all = timssData as Record<Cat, Question[]>;
  const totals = {
    knowing: all.knowing.length,
    applying: all.applying.length,
    reasoning: all.reasoning.length,
  };
  const grandTotal = totals.knowing + totals.applying + totals.reasoning;

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Kognitiv sohalar"
        title={`TIMSS test topshiriqlari (${grandTotal} ta)`}
        description="Trends in International Mathematics and Science Study (TIMSS) baholash dasturining uchta kognitiv sohasi bo'yicha bo'lajak boshlang'ich sinf o'qituvchilariga mo'ljallangan test topshiriqlari."
      />

      <section className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-5">
        {cats.map((c) => {
          const Icon = c.icon;
          const active = cat === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={`text-left p-6 rounded-2xl border bg-card shadow-card transition ${active ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/40"}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{c.subtitle}</div>
                  <div className="font-semibold">{c.title}</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              <div className="mt-3 text-sm font-semibold text-primary">
                {totals[c.key]} ta savol
              </div>
            </button>
          );
        })}
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <Quiz
          key={cat}
          questions={all[cat]}
          label={cats.find((c) => c.key === cat)!.title}
          testKey={cat}
        />
      </section>
    </SiteLayout>
  );
}
