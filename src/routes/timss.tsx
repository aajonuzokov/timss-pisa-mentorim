import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";

export const Route = createFileRoute("/timss")({
  head: () => ({
    meta: [
      { title: "TIMSS topshiriqlari — TIMSS/PISA Platformasi" },
      { name: "description", content: "TIMSSning Bilish, Qo'llash va Mulohaza yuritish kognitiv sohalari bo'yicha namunaviy testlar." },
    ],
  }),
  component: Page,
});

const domains = [
  {
    title: "Bilish (Knowing)",
    desc: "Faktlar, jarayonlar va tushunchalarni eslab qolish, tanish va aniqlash.",
    sample: "Quyidagi sonlardan qaysi biri eng katta? a) 1234  b) 1243  c) 1324  d) 1342",
  },
  {
    title: "Qo'llash (Applying)",
    desc: "Bilimlardan tanish vaziyatlarda foydalanish, masalalarni yechish.",
    sample: "Bog'da 24 ta olma daraxti 6 qatorda joylashgan. Har bir qatorda nechta daraxt bor?",
  },
  {
    title: "Mulohaza yuritish (Reasoning)",
    desc: "Notanish vaziyatlarni tahlil qilish, umumlashtirish va asoslash.",
    sample: "Kvadratning perimetri 36 sm bo'lsa, uning yuzini toping va izohlang.",
  },
];

function Page() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Kognitiv sohalar" title="TIMSS namunaviy topshiriqlari" description="Trends in International Mathematics and Science Study (TIMSS) baholash dasturining uchta kognitiv sohasi bo'yicha topshiriq namunalari." />
      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
        {domains.map((d, i) => (
          <div key={i} className="p-7 rounded-2xl border bg-card shadow-card">
            <div className="text-xs text-accent font-semibold uppercase tracking-wider mb-2">Soha {i + 1}</div>
            <h3 className="text-xl font-semibold mb-2">{d.title}</h3>
            <p className="text-muted-foreground text-sm mb-4">{d.desc}</p>
            <div className="p-4 rounded-xl bg-muted text-sm">
              <div className="font-semibold mb-1">Namuna:</div>
              <p>{d.sample}</p>
            </div>
          </div>
        ))}
      </section>
    </SiteLayout>
  );
}
