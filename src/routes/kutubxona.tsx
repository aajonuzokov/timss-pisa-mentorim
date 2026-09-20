import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { BookMarked, Search, X, BookOpen, Info, Loader2, FileText, ExternalLink, Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  id: string;
  title: string;
  author: string;
  year: number;
  category: string;
  description: string;
  cover_image: string | null;
  cover_url: string | null;
  pdf_url: string | null;
  source_url: string | null;
};

const categoryColors: Record<string, string> = {
  TIMSS: "from-blue-500 to-indigo-600",
  PISA: "from-violet-500 to-fuchsia-600",
  Methodology: "from-emerald-500 to-teal-600",
  Metodika: "from-emerald-500 to-teal-600",
  Pedagogy: "from-amber-500 to-orange-600",
  Pedagogika: "from-amber-500 to-orange-600",
  "Mathematical Literacy": "from-rose-500 to-pink-600",
  "Matematik savodxonlik": "from-rose-500 to-pink-600",
  Assessment: "from-cyan-500 to-sky-600",
  "Digital Education": "from-indigo-500 to-blue-600",
  Dissertation: "from-slate-600 to-slate-800",
  Dissertatsiyalar: "from-slate-600 to-slate-800",
};


function Cover({ book }: { book: Book }) {
  const gradient = categoryColors[book.category] ?? "from-primary to-accent";
  return (
    <div className={`relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br ${gradient} flex flex-col justify-between p-4 text-white shadow-card`}>
      {(book.cover_image || book.cover_url) ? (
        <img src={book.cover_image || book.cover_url!} alt={book.title} className="absolute inset-0 w-full h-full object-cover" />
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

function resolveUrl(book: Book): string | null {
  return book.pdf_url || book.source_url || null;
}

function openUrl(url: string | null | undefined, label: string) {
  const cleanUrl = typeof url === "string" ? url.trim() : "";
  if (!cleanUrl) {
    toast.error(`${label} uchun havola topilmadi.`);
    return;
  }

  let newWindow: Window | null = null;
  try {
    newWindow = window.open(cleanUrl, "_blank", "noopener,noreferrer");
  } catch {
    toast.error(`${label} ochilmadi. Brauzer havolasini blokladi yoki xatolik yuz berdi.`);
    return;
  }

  if (!newWindow || newWindow.closed) {
    toast.error(`${label} yangi oynada ochilmadi. Popup bloklaganini tekshiring.`);
  }
}

function openSource(book: Book) {
  openUrl(book.pdf_url || book.source_url, "O'qish");
}

function Page() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("Barchasi");
  const [active, setActive] = useState<Book | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    let mounted = true;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("books")
          .select("id, title, author, year, category, description, cover_image, cover_url, pdf_url, source_url, order_index, sort_order")
          .order("order_index", { ascending: true })
          .order("sort_order", { ascending: true })
          .abortSignal(abortController.signal);

        if (!mounted || abortController.signal.aborted) return;

        if (error) {
          setError(error.message);
          setBooks([]);
        } else {
          console.log("[kutubxona] fresh books fetched:", (data ?? []).length);
          setBooks((data ?? []) as Book[]);
        }
      } catch (err) {
        if (!mounted || abortController.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Noma'lum xatolik");
        setBooks([]);
      } finally {
        if (mounted && !abortController.signal.aborted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
      abortController.abort();
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((b) => {
      const matchCat = cat === "Barchasi" || b.category === cat;
      const matchQ =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, cat, books]);

  const categories = useMemo(
    () => ["Barchasi", ...Array.from(new Set(books.map((b) => b.category)))],
    [books],
  );

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

      <section className="max-w-6xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Yuklanmoqda...
          </div>
        ) : error ? (
          <div className="text-center py-16 text-destructive">Xato: {error}</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((b) => {
              const hasPdf = typeof b.pdf_url === "string" && b.pdf_url.trim() !== "";
              const hasSource = typeof b.source_url === "string" && b.source_url.trim() !== "";
              const canOpen = hasPdf || hasSource;
              console.log({
                title: b.title,
                pdf_url: b.pdf_url,
                source_url: b.source_url,
                showPdf: hasPdf,
                showSource: hasSource,
              });
              return (
                <article key={b.id} className="flex flex-col p-5 rounded-2xl border bg-card shadow-card hover:-translate-y-0.5 hover:shadow-elegant transition">
                  <Cover book={b} />
                  <div className="mt-4 flex-1 flex flex-col">
                    <div className="text-xs text-accent font-medium uppercase tracking-wider mb-1">{b.category}</div>
                    <h3 className="font-semibold leading-snug mb-1 line-clamp-2">{b.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{b.author} · {b.year}</p>
                    <p className="text-sm leading-relaxed line-clamp-3 mb-4">{b.description}</p>
                    {canOpen ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        {hasPdf ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted">PDF</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted">📖 Official Source</span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 p-2 rounded-lg bg-muted/60">
                        <Info className="w-3.5 h-3.5" /> Manba tez orada yuklanadi
                      </div>
                    )}
                    <div className="mt-auto flex flex-wrap gap-2">
                      <button
                        onClick={() => setActive(b)}
                        className="flex-1 min-w-[110px] px-3 py-2 rounded-full border text-sm font-medium hover:bg-muted transition"
                      >
                        Batafsil
                      </button>
                      {hasPdf && (
                        <button
                          onClick={() => openUrl(b.pdf_url, "PDF")}
                          className="flex-1 min-w-[110px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
                        >
                          <FileText className="w-4 h-4" /> PDF
                        </button>
                      )}
                      {hasSource && (
                        <a
                          href={b.source_url!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 min-w-[110px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full border text-sm font-medium hover:bg-muted transition"
                        >
                          <ExternalLink className="w-4 h-4" /> Manba
                        </a>
                      )}
                      {hasPdf && (
                        <a
                          href={b.pdf_url!}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 min-w-[110px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full border text-sm font-medium hover:bg-muted transition"
                        >
                          <Download className="w-4 h-4" /> Yuklab olish
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-16 text-muted-foreground">Hech narsa topilmadi. Boshqa kalit so'z yoki kategoriya tanlang.</div>
            )}
          </div>
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
                  <p className="leading-relaxed">{active.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {(() => {
                    const hasPdf = Boolean(active.pdf_url);
                    const hasSource = Boolean(active.source_url);
                    const canOpen = hasPdf || hasSource;
                    return canOpen ? (
                      <>
                        {hasPdf ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">PDF</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">📖 Official Source</span>
                        )}
                        <button
                          onClick={() => openSource(active)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
                        >
                          <BookOpen className="w-4 h-4" /> O'qish
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 rounded-lg bg-muted/60">
                        <Info className="w-4 h-4" /> Manba tez orada yuklanadi
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
