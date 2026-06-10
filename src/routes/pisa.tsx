import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";

export const Route = createFileRoute("/pisa")({
  head: () => ({
    meta: [
      { title: "PISA topshiriqlari — TIMSS/PISA Platformasi" },
      { name: "description", content: "Real hayotiy vaziyatlarga asoslangan PISA matematik savodxonlik topshiriqlari." },
    ],
  }),
  component: Page,
});

const tasks = [
  {
    title: "Pitsani bo'lishtirish",
    context: "Kundalik hayot",
    text: "Pitsa 8 ta teng bo'lakka bo'lingan. Olim 3 bo'lak, Nodira 2 bo'lak yedi. Pitsaning necha foizi qoldi?",
  },
  {
    title: "Avtobus jadvali",
    context: "Jamoat",
    text: "Avtobus har 15 daqiqada qatnaydi. Birinchi avtobus 06:30 da jo'naydi. 09:00 gacha nechta avtobus jo'naydi?",
  },
  {
    title: "Xarid byudjeti",
    context: "Moliyaviy",
    text: "Daftar 4500 so'm, qalam 1500 so'm. 30 000 so'm bilan eng ko'pi bilan nechta daftar va qalam to'plamini sotib olish mumkin?",
  },
  {
    title: "Suv tejash",
    context: "Atrof-muhit",
    text: "Oilada kuniga 240 litr suv ishlatiladi. 15% tejalsa, bir oyda qancha litr suv tejaladi?",
  },
];

function Page() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Matematik savodxonlik" title="PISA topshiriqlari" description="Programme for International Student Assessment (PISA) dasturining real hayotiy vaziyatlarga asoslangan matematik topshiriqlari." />
      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-6">
        {tasks.map((t, i) => (
          <div key={i} className="p-7 rounded-2xl border bg-card shadow-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs px-2.5 py-1 rounded-full bg-accent/15 text-accent font-medium">{t.context}</span>
              <span className="text-xs text-muted-foreground">№ {i + 1}</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{t.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{t.text}</p>
          </div>
        ))}
      </section>
    </SiteLayout>
  );
}
