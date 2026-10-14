import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

type NavLink = { to: string; label: string };
type NavGroup = { label: string; to?: string; items?: NavLink[] };

// Menyu guruhlari: 7 ta yuqori band, qolganlari ochiladigan ro'yxatda.
export const navGroups: NavGroup[] = [
  { label: "Bosh sahifa", to: "/" },
  {
    label: "O'rganish",
    items: [
      { to: "/modullar", label: "Variativ modul (5 komponent)" },
      { to: "/amaliyot", label: "Amaliy metodik ishlar" },
      { to: "/tavsiyalar", label: "Metodik tavsiyalar" },
      { to: "/qollanma", label: "O'quv qo'llanma" },
      { to: "/kutubxona", label: "Elektron kutubxona" },
    ],
  },
  {
    label: "Topshiriqlar",
    items: [
      { to: "/timss", label: "TIMSS" },
      { to: "/pisa", label: "PISA" },
      { to: "/rasmiy", label: "Rasmiy namunaviy topshiriqlar" },
    ],
  },
  {
    label: "Tajriba-sinov",
    items: [
      { to: "/sinov", label: "Diagnostik testlar" },
      { to: "/portfolio", label: "E-portfolio" },
    ],
  },
  {
    label: "Ilmiy asos",
    items: [
      { to: "/model", label: "Metodik model" },
      { to: "/natijalar", label: "Tajriba-sinov natijalari" },
      { to: "/resources", label: "Ilmiy manbalar" },
    ],
  },
  {
    label: "O'qituvchi",
    items: [
      { to: "/kabinet", label: "O'qituvchi kabineti" },
      { to: "/monitoring", label: "Monitoring" },
    ],
  },
  { label: "Aloqa", to: "/aloqa" },
];

const isActive = (pathname: string, to: string) =>
  to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(to + "/");

const groupActive = (pathname: string, g: NavGroup) =>
  g.to ? isActive(pathname, g.to) : (g.items ?? []).some((i) => isActive(pathname, i.to));

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-primary-foreground font-bold bg-gradient-hero">T</div>
            <span className="font-display text-lg font-semibold hidden sm:inline">TIMSS·PISA</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-1 text-sm" aria-label="Asosiy menyu">
            {navGroups.map((g) => {
              const active = groupActive(pathname, g);
              const cls = `px-3 py-1.5 rounded-full transition inline-flex items-center gap-1 ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`;
              if (g.to)
                return (
                  <Link key={g.label} to={g.to as "/"} className={cls}>
                    {g.label}
                  </Link>
                );
              return (
                <div key={g.label} className="relative group">
                  <button type="button" className={cls} aria-haspopup="true">
                    {g.label} <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <div className="hidden group-hover:block group-focus-within:block absolute left-0 top-full pt-2 min-w-56">
                    <div className="rounded-xl border bg-popover p-1.5 shadow-elegant">
                      {(g.items ?? []).map((i) => (
                        <Link
                          key={i.to}
                          to={i.to as "/"}
                          className={`block rounded-lg px-3 py-2 ${isActive(pathname, i.to) ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"}`}
                        >
                          {i.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
          <button
            className="lg:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setOpen(!open)}
            aria-label="Menyu"
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {open && (
          <nav className="lg:hidden border-t bg-background max-h-[80vh] overflow-y-auto" aria-label="Asosiy menyu">
            <div className="max-w-7xl mx-auto px-4 py-3 space-y-3 text-sm">
              {navGroups.map((g) =>
                g.to ? (
                  <Link
                    key={g.label}
                    to={g.to as "/"}
                    onClick={() => setOpen(false)}
                    className={`block px-3 py-2 rounded-lg font-medium ${isActive(pathname, g.to) ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                  >
                    {g.label}
                  </Link>
                ) : (
                  <div key={g.label}>
                    <div className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {g.label}
                    </div>
                    <div className="mt-1 grid grid-cols-2 gap-1">
                      {(g.items ?? []).map((i) => (
                        <Link
                          key={i.to}
                          to={i.to as "/"}
                          onClick={() => setOpen(false)}
                          className={`px-3 py-2 rounded-lg ${isActive(pathname, i.to) ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                        >
                          {i.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t mt-16">
        <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero" />
              <span className="font-display text-lg font-semibold">TIMSS·PISA</span>
            </div>
            <p className="text-muted-foreground">Bo'lajak boshlang'ich sinf o'qituvchilari uchun metodik ta'lim platformasi.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Bo'limlar</h4>
            <ul className="space-y-1.5 text-muted-foreground">
              <li><Link to="/sinov" className="hover:text-foreground">Diagnostik testlar</Link></li>
              <li><Link to="/model" className="hover:text-foreground">Metodik model</Link></li>
              <li><Link to="/timss" className="hover:text-foreground">TIMSS topshiriqlari</Link></li>
              <li><Link to="/pisa" className="hover:text-foreground">PISA topshiriqlari</Link></li>
              <li><Link to="/kutubxona" className="hover:text-foreground">Elektron kutubxona</Link></li>
              <li><Link to="/aloqa" className="hover:text-foreground">Aloqa</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Aloqa</h4>
            <p className="text-muted-foreground">info@timss-pisa.uz</p>
            <p className="text-muted-foreground mt-1">DGU-38123-son guvohnoma, 2024-yil 10-may</p>
            <p className="text-muted-foreground mt-1">© 2026 TIMSS/PISA Metodik Platformasi</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function PageHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="absolute inset-0 -z-10 bg-gradient-soft" />
      <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl bg-gradient-hero" />
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        {eyebrow && <span className="inline-block px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-medium uppercase tracking-wider mb-4">{eyebrow}</span>}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-4xl">{title}</h1>
        {description && <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{description}</p>}
      </div>
    </section>
  );
}
