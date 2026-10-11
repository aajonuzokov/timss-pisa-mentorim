import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { KeyRound, LogOut, ShieldCheck } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { PortfolioView, type PortfolioData } from "@/components/PortfolioView";
import { db } from "@/lib/db";
import { isValidCode, loadProfile, normalizeCode } from "@/lib/participant";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "E-portfolio — TIMSS/PISA Platformasi" },
      {
        name: "description",
        content:
          "Ishtirokchining shaxsiy E-portfoliosi: natijalar tarixi, 5 komponent dinamikasi, refleksiya, o'qituvchi izohi va tavsiyalar.",
      },
    ],
  }),
  component: Page,
});

type OpenResult = ({ ok: true; created: boolean } & PortfolioData) | { ok: false; error: string };

function Page() {
  const [code, setCode] = useState("");
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<PortfolioData | null>(null);
  const [created, setCreated] = useState(false);

  useEffect(() => {
    const p = loadProfile();
    if (p.code) setCode(p.code);
  }, []);

  const open = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isValidCode(code)) return setError("Ishtirokchi kodini to'g'ri kiriting.");
    if (!/^\d{4,8}$/.test(pin)) return setError("PIN 4–8 ta raqamdan iborat bo'lishi kerak.");
    setBusy(true);
    const { data: res, error: err } = await db.rpc("portfolio_open", { p_code: code, p_pin: pin });
    setBusy(false);
    if (err) {
      console.error("[portfolio_open]", err);
      return setError(
        "Portfolioni ochib bo'lmadi. Internet aloqasini tekshirib, qayta urinib ko'ring.",
      );
    }
    const r = res as OpenResult;
    if (!r.ok) return setError(r.error);
    setCreated(r.created);
    setData({
      results: r.results ?? [],
      rubric: r.rubric ?? [],
      reflections: r.reflections ?? [],
      feedback: r.feedback ?? [],
    });
  };

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Shaxsiy sahifa"
        title="E-portfolio"
        description="Natijalaringiz tarixi, matematik tayyorgarlikning 5 komponenti bo'yicha dinamika, refleksiyalaringiz, o'qituvchi izohlari va individual tavsiyalar."
      />
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {!data ? (
          <form
            onSubmit={open}
            className="max-w-xl p-6 rounded-2xl border bg-card shadow-card space-y-4"
          >
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary" /> Portfolioga kirish
            </h2>
            <label className="block text-sm">
              <span className="block text-xs text-muted-foreground mb-1">Ishtirokchi kodi</span>
              <input
                className="w-full px-4 py-2.5 rounded-lg border bg-background font-mono tracking-wide"
                value={code}
                maxLength={20}
                onChange={(e) => setCode(normalizeCode(e.target.value))}
                aria-label="Ishtirokchi kodi"
              />
            </label>
            <label className="block text-sm">
              <span className="block text-xs text-muted-foreground mb-1">PIN (4–8 raqam)</span>
              <input
                type="password"
                inputMode="numeric"
                autoComplete="current-password"
                className="w-full px-4 py-2.5 rounded-lg border bg-background tracking-widest"
                value={pin}
                maxLength={8}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                aria-label="PIN"
              />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={busy}>
              {busy ? "Ochilmoqda…" : "Portfolioni ochish"}
            </Button>
            <p className="text-xs text-muted-foreground flex gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              Birinchi kirishda kiritgan PIN kodingizga biriktiriladi — uni eslab qoling. Keyin
              portfolio faqat shu PIN bilan ochiladi. PIN unutilsa, o'qituvchingiz uni bekor qiladi
              va siz yangisini o'rnatasiz.
            </p>
          </form>
        ) : (
          <>
            {created && (
              <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-sm">
                PIN o'rnatildi. Endi portfolio faqat shu kod va PIN bilan ochiladi.
              </div>
            )}
            <div className="flex justify-end print:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setData(null);
                  setPin("");
                }}
              >
                <LogOut className="w-4 h-4 mr-2" /> Chiqish
              </Button>
            </div>
            <PortfolioView code={code} data={data} />
          </>
        )}
      </section>
    </SiteLayout>
  );
}
