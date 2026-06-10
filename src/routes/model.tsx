import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { Target, BookOpen, Cog, Activity, Award } from "lucide-react";

export const Route = createFileRoute("/model")({
  head: () => ({
    meta: [
      { title: "Metodik model — TIMSS/PISA Platformasi" },
      { name: "description", content: "Bo'lajak boshlang'ich sinf o'qituvchilarini tayyorlashning besh blokli metodik modeli." },
    ],
  }),
  component: Page,
});

const blocks = [
  { icon: Target, title: "Maqsadli blok", desc: "Bo'lajak o'qituvchilarning TIMSS/PISA asosidagi metodik tayyorgarligini shakllantirishning maqsad va vazifalarini belgilaydi." },
  { icon: BookOpen, title: "Mazmuniy blok", desc: "O'quv dasturlari, modullar, nazariy va amaliy materiallar, TIMSS/PISA topshiriqlari va metodik qo'llanmalarni o'z ichiga oladi." },
  { icon: Cog, title: "Jarayonli (texnologik) blok", desc: "Interaktiv ta'lim texnologiyalari, multimediyali resurslar va o'qitish metodlari orqali bilim, ko'nikma va malakalarni shakllantirish." },
  { icon: Activity, title: "Diagnostik-monitoring blok", desc: "Talabalar bilimini muntazam baholash, monitoring qilish va shakllanish dinamikasini kuzatish vositalari." },
  { icon: Award, title: "Natijaviy blok", desc: "Bo'lajak o'qituvchilarning erishilgan metodik tayyorgarlik darajasini aniqlash mezonlari va ko'rsatkichlari." },
];

function Page() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Metodik tizim" title="Besh blokli metodik model" description="Bo'lajak boshlang'ich sinf o'qituvchilarining TIMSS/PISA asosidagi metodik tayyorgarligini rivojlantirish modelining tarkibiy bloklari." />
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {blocks.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="p-7 rounded-2xl border bg-card shadow-card hover:-translate-y-1 transition">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">BLOK {i + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{b.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}
