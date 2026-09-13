import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { to: "/", label: "Bosh sahifa" },
  { to: "/dolzarblik", label: "Dolzarblik" },
  { to: "/model", label: "Metodik model" },
  { to: "/timss", label: "TIMSS" },
  { to: "/pisa", label: "PISA" },
  { to: "/qollanma", label: "O'quv qo'llanma" },
  { to: "/natijalar", label: "Natijalar" },
  { to: "/monitoring", label: "Monitoring" },
  { to: "/tavsiyalar", label: "Tavsiyalar" },
  { to: "/kutubxona", label: "Kutubxona" },
  { to: "/elektron-talim-resursi", label: "Elektron ta'lim resursi" },
  { to: "/aloqa", label: "Aloqa" },
] as const;

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
          <nav className="hidden xl:flex items-center gap-1 text-sm">
            {navItems.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`px-3 py-1.5 rounded-full transition ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <button
            className="xl:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {open && (
          <nav className="xl:hidden border-t bg-background">
            <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 gap-2 text-sm">
              {navItems.map((n) => {
                const active = pathname === n.to;
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className={`px-3 py-2 rounded-lg ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                  >
                    {n.label}
                  </Link>
                );
              })}
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
              <li><Link to="/timss" className="hover:text-foreground">TIMSS topshiriqlari</Link></li>
              <li><Link to="/pisa" className="hover:text-foreground">PISA topshiriqlari</Link></li>
              <li><Link to="/kutubxona" className="hover:text-foreground">Elektron kutubxona</Link></li>
              <li><Link to="/aloqa" className="hover:text-foreground">Aloqa</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Aloqa</h4>
            <p className="text-muted-foreground">info@timss-pisa.uz</p>
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
