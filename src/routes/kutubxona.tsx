import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { BookMarked, Download, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/kutubxona")({
  head: () => ({
    meta: [
      { title: "Elektron kutubxona — TIMSS/PISA Platformasi" },
      { name: "description", content: "TIMSS, PISA va matematika metodikasiga oid adabiyotlar, qidiruv va kategoriya filtri." },
    ],
  }),
  component: Page,
});

type Book = {
  title: string;
  author: string;
  year: number;
  category: string;
  annotation: string;
  cover?: string;
};

const books: Book[] = [
  { title: "TIMSS 2023 Assessment Frameworks", author: "Mullis I.V.S., Martin M.O.", year: 2021, category: "TIMSS", annotation: "TIMSS xalqaro baholash dasturining mazmuniy va kognitiv sohalari, baholash mezonlari hamda metodologik asoslarini yorituvchi asosiy hujjat." },
  { title: "PISA 2022 Mathematics Framework", author: "OECD", year: 2022, category: "PISA", annotation: "PISA matematik savodxonlik konsepsiyasi, baholash tamoyillari va topshiriqlar tizimining tavsifi." },
  { title: "TIMSS Encyclopedia: Education Policy and Curriculum", author: "IEA", year: 2023, category: "TIMSS", annotation: "TIMSS tadqiqotlarida ishtirok etuvchi mamlakatlarning ta'lim tizimi va o'quv dasturlariga oid ma'lumotlar." },
  { title: "PISA 2022 Results", author: "OECD", year: 2023, category: "PISA", annotation: "PISA natijalari, mamlakatlar kesimidagi tahlillar va matematik savodxonlik ko'rsatkichlari." },
  { title: "Boshlang'ich sinflarda matematika o'qitish metodikasi", author: "Jumayev M.E.", year: 2020, category: "Metodika", annotation: "Boshlang'ich sinflarda matematika ta'limining nazariy va metodik asoslari." },
  { title: "Matematika o'qitish metodikasi", author: "Bikbayeva N.U.", year: 2021, category: "Metodika", annotation: "Matematik ta'lim jarayonini tashkil etishning zamonaviy metodlari." },
  { title: "Matematik savodxonlikni shakllantirish", author: "Abdullayeva B.", year: 2019, category: "Matematik savodxonlik", annotation: "O'quvchilarning matematik savodxonligini rivojlantirish usullari." },
  { title: "Pedagogik texnologiyalar", author: "Tolipov O'.", year: 2020, category: "Pedagogika", annotation: "Zamonaviy pedagogik texnologiyalar va ularning amaliy qo'llanilishi." },
  { title: "Kompetensiyaviy yondashuv asoslari", author: "Muslimov N.", year: 2021, category: "Pedagogika", annotation: "Kompetensiyaviy ta'limni tashkil etishning nazariy asoslari." },
  { title: "Xalqaro baholash dasturlari metodikasi", author: "Raximov A.", year: 2022, category: "Metodika", annotation: "TIMSS, PISA va PIRLS dasturlarini o'qitish amaliyotiga integratsiyalash masalalari." },
  { title: "Educational Assessment in Mathematics", author: "Webb N.", year: 2018, category: "Matematik savodxonlik", annotation: "Matematik baholashning xalqaro tajribalari." },
  { title: "Mathematics Education and Assessment", author: "Stacey K.", year: 2019, category: "Matematik savodxonlik", annotation: "Matematik ta'lim va baholashning zamonaviy yondashuvlari." },
  { title: "Teaching Mathematics in Primary Schools", author: "Haylock D.", year: 2020, category: "Metodika", annotation: "Boshlang'ich ta'limda matematika o'qitish metodlari." },
  { title: "Digital Learning in Mathematics Education", author: "Keengwe J.", year: 2021, category: "Metodika", annotation: "Raqamli texnologiyalar asosida matematika ta'limini tashkil etish." },
  { title: "Bo'lajak boshlang'ich sinf o'qituvchilarining matematik tayyorgarligini oshirish metodikasi", author: "Dissertatsiya muallifi", year: 2026, category: "Dissertatsiyalar", annotation: "TIMSS/PISA asosida metodik tayyorgarlikni takomillashtirishga bag'ishlangan tadqiqot natijalari." },
];

const categories = ["Barchasi", "TIMSS", "PISA", "Metodika", "Pedagogika", "Matematik savodxonlik", "Dissertatsiyalar"] as const;

const categoryColors: Record<string, string> = {
  TIMSS: "from-blue-500 to-indigo-600",
  PISA: "from-violet-500 to-fuchsia-600",
  Metodika: "from-emerald-500 to-teal-600",
  Pedagogika: "from-amber-500 to-orange-600",
  "Matematik savodxonlik": "from-rose-500 to-pink-600",
  Dissertatsiyalar: "from-slate-600 to-slate-800",
};

function Cover({ book }: { book: Book }) {
  const gradient = categoryColors[book.category] ?? "from-primary to-accent";
  return (
    <div className={`relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br ${gradient} flex flex-col justify-between p-4 text-white shadow-card`}>
      {book.cover ? (
        <img src={book.cover} alt={book.title} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <>
          <div className="text-[10px] uppercase tracking-widest opacity-80">{book.category}</div>
          <div className="font-display font-semibold text-sm leading-tight line-clamp-5">{book.title}</div>
          <div className="text-xs opacity-90">{book.year}</div>
          <BookMarked className="absolute top-3 right-3 w-4 h-4 opacity-60" />
        </>
      )}
    </div>
  );
}

function Page() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<(typeof categories)[number]>("Barchasi");
  const [active, setActive] = useState<Book | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((b) => {
      const matchCat = cat === "Barchasi" || b.category === cat;
      const matchQ = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, cat]);

  return (
    <SiteLayout>
      <PageHeader eyebrow="Adabiyotlar" title="Elektron kutubxona" description="TIMSS, PISA va boshlang'ich matematika metodikasiga oid tanlangan adabiyotlar." />

      <section className="max-w-6xl mx-auto px-6 pt-10">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Kitob nomi yoki muallif bo'yicha qidiring..."
              className="w-full pl-11 pr-4 py-3 rounded-full border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="text-sm text-muted-foreground">{filtered.length} ta natija</div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((c) => {
            const activeCat = cat === c;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-1.5 rounded-full text-sm border transition ${activeCat ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted"}`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((b, i) => (
          <article key={i} className="flex flex-col p-5 rounded-2xl border bg-card shadow-card hover:-translate-y-0.5 hover:shadow-elegant transition">
            <Cover book={b} />
            <div className="mt-4 flex-1 flex flex-col">
              <div className="text-xs text-accent font-medium uppercase tracking-wider mb-1">{b.category}</div>
              <h3 className="font-semibold leading-snug mb-1 line-clamp-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{b.author} · {b.year}</p>
              <p className="text-sm leading-relaxed line-clamp-3 mb-4">{b.annotation}</p>
              <div className="mt-auto flex gap-2">
                <button
                  onClick={() => setActive(b)}
                  className="flex-1 px-3 py-2 rounded-full border text-sm font-medium hover:bg-muted transition"
                >
                  Batafsil
                </button>
                <button className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
                  <Download className="w-4 h-4" /> PDF
                </button>
              </div>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-muted-foreground">Hech narsa topilmadi. Boshqa kalit so'z yoki kategoriya tanlang.</div>
        )}
      </section>

      {active && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setActive(null)}>
          <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-elegant" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between p-6 border-b">
              <div>
                <div className="text-xs text-accent font-medium uppercase tracking-wider mb-1">{active.category}</div>
                <h3 className="text-xl font-semibold">{active.title}</h3>
              </div>
              <button onClick={() => setActive(null)} className="p-2 rounded-lg hover:bg-muted shrink-0" aria-label="Yopish">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 grid sm:grid-cols-[160px_1fr] gap-6">
              <div className="w-40"><Cover book={active} /></div>
              <div className="space-y-3 text-sm">
                <div><span className="text-muted-foreground">Muallif: </span><span className="font-medium">{active.author}</span></div>
                <div><span className="text-muted-foreground">Nashr yili: </span><span className="font-medium">{active.year}</span></div>
                <div><span className="text-muted-foreground">Kategoriya: </span><span className="font-medium">{active.category}</span></div>
                <div>
                  <div className="text-muted-foreground mb-1">Annotatsiya:</div>
                  <p className="leading-relaxed">{active.annotation}</p>
                </div>
                <button className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
                  <Download className="w-4 h-4" /> PDF yuklab olish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
