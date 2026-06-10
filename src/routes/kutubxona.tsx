import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { BookMarked } from "lucide-react";

export const Route = createFileRoute("/kutubxona")({
  head: () => ({
    meta: [
      { title: "Elektron kutubxona — TIMSS/PISA Platformasi" },
      { name: "description", content: "TIMSS, PISA va matematika metodikasiga oid adabiyotlar ro'yxati va annotatsiyalari." },
    ],
  }),
  component: Page,
});

const books = [
  {
    title: "TIMSS 2023 Assessment Frameworks",
    author: "Mullis I.V.S., Martin M.O.",
    year: 2021,
    category: "TIMSS",
    annotation:
      "TIMSS xalqaro baholash dasturining mazmuniy va kognitiv sohalari, baholash mezonlari hamda metodologik asoslarini yorituvchi asosiy hujjat.",
  },
  {
    title: "PISA 2022 Mathematics Framework",
    author: "OECD",
    year: 2022,
    category: "PISA",
    annotation:
      "PISA matematik savodxonlik konsepsiyasi, baholash tamoyillari va topshiriqlar tizimining tavsifi.",
  },
  {
    title: "TIMSS Encyclopedia: Education Policy and Curriculum",
    author: "IEA",
    year: 2023,
    category: "TIMSS",
    annotation:
      "TIMSS tadqiqotlarida ishtirok etuvchi mamlakatlarning ta'lim tizimi va o'quv dasturlariga oid ma'lumotlar.",
  },
  {
    title: "PISA 2022 Results",
    author: "OECD",
    year: 2023,
    category: "PISA",
    annotation:
      "PISA natijalari, mamlakatlar kesimidagi tahlillar va matematik savodxonlik ko'rsatkichlari.",
  },
  {
    title: "Boshlang'ich sinflarda matematika o'qitish metodikasi",
    author: "Jumayev M.E.",
    year: 2020,
    category: "Metodika",
    annotation: "Boshlang'ich sinflarda matematika ta'limining nazariy va metodik asoslari.",
  },
  {
    title: "Matematika o'qitish metodikasi",
    author: "Bikbayeva N.U.",
    year: 2021,
    category: "Metodika",
    annotation: "Matematik ta'lim jarayonini tashkil etishning zamonaviy metodlari.",
  },
  {
    title: "Matematik savodxonlikni shakllantirish",
    author: "Abdullayeva B.",
    year: 2019,
    category: "Metodika",
    annotation: "O'quvchilarning matematik savodxonligini rivojlantirish usullari.",
  },
  {
    title: "Pedagogik texnologiyalar",
    author: "Tolipov O'.",
    year: 2020,
    category: "Pedagogika",
    annotation: "Zamonaviy pedagogik texnologiyalar va ularning amaliy qo'llanilishi.",
  },
  {
    title: "Kompetensiyaviy yondashuv asoslari",
    author: "Muslimov N.",
    year: 2021,
    category: "Pedagogika",
    annotation: "Kompetensiyaviy ta'limni tashkil etishning nazariy asoslari.",
  },
  {
    title: "Xalqaro baholash dasturlari metodikasi",
    author: "Raximov A.",
    year: 2022,
    category: "Metodika",
    annotation:
      "TIMSS, PISA va PIRLS dasturlarini o'qitish amaliyotiga integratsiyalash masalalari.",
  },
  {
    title: "Educational Assessment in Mathematics",
    author: "Webb N.",
    year: 2018,
    category: "Baholash",
    annotation: "Matematik baholashning xalqaro tajribalari.",
  },
  {
    title: "Mathematics Education and Assessment",
    author: "Stacey K.",
    year: 2019,
    category: "Baholash",
    annotation: "Matematik ta'lim va baholashning zamonaviy yondashuvlari.",
  },
  {
    title: "Teaching Mathematics in Primary Schools",
    author: "Haylock D.",
    year: 2020,
    category: "Metodika",
    annotation: "Boshlang'ich ta'limda matematika o'qitish metodlari.",
  },
  {
    title: "Digital Learning in Mathematics Education",
    author: "Keengwe J.",
    year: 2021,
    category: "Raqamli ta'lim",
    annotation: "Raqamli texnologiyalar asosida matematika ta'limini tashkil etish.",
  },
  {
    title:
      "Bo'lajak boshlang'ich sinf o'qituvchilarining matematik tayyorgarligini oshirish metodikasi",
    author: "Dissertatsiya muallifi",
    year: 2026,
    category: "Dissertatsiya",
    annotation:
      "TIMSS/PISA asosida metodik tayyorgarlikni takomillashtirishga bag'ishlangan tadqiqot natijalari.",
  },
];

function Page() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Adabiyotlar"
        title="Elektron kutubxona"
        description="TIMSS, PISA va boshlang'ich matematika metodikasiga oid tanlangan adabiyotlar va ularning qisqacha annotatsiyalari."
      />
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-5">
        {books.map((b, i) => (
          <article
            key={i}
            className="flex gap-4 p-6 rounded-2xl border bg-card shadow-card hover:-translate-y-0.5 hover:shadow-elegant transition"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground shrink-0">
              <BookMarked className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-accent font-medium uppercase tracking-wider mb-1">
                {b.category}
              </div>
              <h3 className="font-semibold leading-snug mb-1">{b.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {b.author} · {b.year}
              </p>
              <p className="text-sm leading-relaxed">{b.annotation}</p>
            </div>
          </article>
        ))}
      </section>
    </SiteLayout>
  );
}
