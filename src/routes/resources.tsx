import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { Search, Loader2, BookOpen, GraduationCap, FileText, Library } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Virtual Library — TIMSS / PISA Resources" },
      {
        name: "description",
        content:
          "A virtual academic library of TIMSS, PISA, dissertations, and articles on mathematical literacy.",
      },
      { property: "og:title", content: "TIMSS / PISA Virtual Library" },
      {
        property: "og:description",
        content: "Searchable academic resources: TIMSS, PISA, dissertations, articles.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

type Source = "TIMSS" | "PISA" | "Dissertation" | "Article";

type Resource = {
  id: string;
  title: string;
  authors: string;
  year: number;
  source: Source;
  description: string;
  /** Manbaga havola (migratsiyadan keyin mavjud). */
  url?: string | null;
};

const FILTERS: (Source | "All")[] = ["All", "TIMSS", "PISA", "Dissertation", "Article"];

const sourceStyles: Record<Source, { badge: string; icon: React.ReactNode; ring: string }> = {
  TIMSS: {
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    ring: "ring-blue-500/20",
    icon: <BookOpen className="w-3.5 h-3.5" />,
  },
  PISA: {
    badge: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    ring: "ring-violet-500/20",
    icon: <Library className="w-3.5 h-3.5" />,
  },
  Dissertation: {
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    ring: "ring-emerald-500/20",
    icon: <GraduationCap className="w-3.5 h-3.5" />,
  },
  Article: {
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
    ring: "ring-amber-500/20",
    icon: <FileText className="w-3.5 h-3.5" />,
  },
};

function Page() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [items, setItems] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("year", { ascending: false });
      if (cancelled) return;
      if (error) setError(error.message);
      else setItems((data ?? []) as Resource[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((r) => {
      const matchSource = filter === "All" || r.source === filter;
      const matchQ = !q || r.title.toLowerCase().includes(q);
      return matchSource && matchQ;
    });
  }, [items, query, filter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: items.length };
    for (const r of items) c[r.source] = (c[r.source] ?? 0) + 1;
    return c;
  }, [items]);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Virtual Library"
        title="TIMSS / PISA Academic Resources"
        description="A curated, searchable library of TIMSS and PISA frameworks, dissertations, and peer-reviewed articles on mathematical literacy."
      />

      <section className="max-w-6xl mx-auto px-6 pt-10">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title..."
              className="w-full pl-11 pr-4 py-3 rounded-full border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="text-sm text-muted-foreground">{filtered.length} results</div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm border transition inline-flex items-center gap-2 ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card hover:bg-muted"
                }`}
              >
                <span>{f}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-full ${active ? "bg-primary-foreground/20" : "bg-muted"}`}
                >
                  {counts[f] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading resources...
          </div>
        ) : error ? (
          <div className="text-center py-16 text-destructive">Error: {error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            No matching resources. Try a different search or filter.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((r) => {
              const s = sourceStyles[r.source];
              return (
                <article
                  key={r.id}
                  className={`group flex flex-col p-5 rounded-2xl border bg-card shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition ring-1 ${s.ring}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.badge}`}
                    >
                      {s.icon}
                      {r.source}
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">{r.year}</span>
                  </div>
                  <h3 className="font-semibold leading-snug mb-1.5 line-clamp-3">{r.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{r.authors}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground line-clamp-4">
                    {r.description}
                  </p>
                  {r.url && (
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 text-sm font-medium text-primary hover:underline"
                    >
                      Manbani ochish →
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
