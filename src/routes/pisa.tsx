import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { Quiz, type Question } from "@/components/Quiz";
import pisaData from "@/data/pisa.json";

export const Route = createFileRoute("/pisa")({
  head: () => ({
    meta: [
      { title: "PISA topshiriqlari — TIMSS/PISA Platformasi" },
      {
        name: "description",
        content:
          "Real hayotiy vaziyatlarga asoslangan 150 ta PISA matematik savodxonlik topshirig'i.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const questions = pisaData as Question[];
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Matematik savodxonlik"
        title={`PISA real hayotiy topshiriqlar (${questions.length} ta)`}
        description="Programme for International Student Assessment (PISA) dasturining shaxsiy, jamiyat, kasbiy va ilmiy kontekstdagi matematik savodxonlik topshiriqlari. Har bir topshiriqda savol, variantlar, to'g'ri javob va izoh keltirilgan."
      />
      <section className="max-w-5xl mx-auto px-6 py-12">
        <Quiz questions={questions} label="PISA topshiriqlari" testKey="pisa" />
      </section>
    </SiteLayout>
  );
}
