import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { BookMarked } from "lucide-react";

export const Route = createFileRoute("/kutubxona")({
  head: () => ({
    meta: [
      { title: "Elektron kutubxona — TIMSS/PISA Platformasi" },
      { name: "description", content: "TIMSS, PISA va matematika metodikasiga oid adabiyotlar ro'yxati." },
    ],
  }),
  component: Page,
});

const books = [
  { title: "TIMSS 2023 Assessment Frameworks", author: "Mullis I.V.S., Martin M.O.", year: 2021, category: "TIMSS" },
  { title: "PISA 2022 Mathematics Framework", author: "OECD", year: 2022, category: "PISA" },
  { title: "Boshlang'ich sinflarda matematika o'qitish metodikasi", author: "Jumayev M.E.", year: 2020, category: "Metodika" },
  { title: "Matematik savodxonlikni shakllantirish", author: "Abdullayeva B.", year: 2019, category: "Metodika" },
  { title: "International Mathematical Olympiad Problems", author: "Andreescu T.", year: 2018, category: "Topshiriqlar" },
  { title: "Pedagogik tadqiqot metodologiyasi", author: "Mavlonova R.", year: 2021, category: "Pedagogika" },
];

function Page() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Adabiyotlar" title="Elektron kutubxona" description="TIMSS, PISA va boshlang'ich matematika metodikasiga oid tanlangan adabiyotlar." />
      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-5">
        {books.map((b, i) => (
          <div key={i} className="flex gap-4 p-6 rounded-2xl border bg-card shadow-card hover:-translate-y-0.5 transition">
            <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground shrink-0">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-accent font-medium uppercase tracking-wider mb-1">{b.category}</div>
              <h3 className="font-semibold leading-snug mb-1">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.author} · {b.year}</p>
            </div>
          </div>
        ))}
      </section>
    </SiteLayout>
  );
}
