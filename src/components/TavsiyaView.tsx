import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import type { Tavsiya } from "@/data/tavsiyalar";
import {
  Target,
  Sparkles,
  ListChecks,
  FileText,
  Gauge,
  ArrowLeft,
  BookMarked,
  Download,
  Eye,
  EyeOff,
  ExternalLink,
  Info,
} from "lucide-react";

function Block({
  icon: Icon,
  title,
  children,
  tone = "primary",
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
  tone?: "primary" | "accent";
}) {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-card hover:shadow-elegant transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground ${
            tone === "accent" ? "bg-accent" : "bg-gradient-hero"
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="font-display text-xl font-semibold">{title}</h2>
      </div>
      <div className="text-foreground/90 leading-relaxed">{children}</div>
    </div>
  );
}

function downloadPdf(t: Tavsiya) {
  const lines = [
    t.title,
    "=".repeat(t.title.length),
    "",
    `Kategoriya: ${t.category}`,
    "",
    "Kompetensiya tavsifi:",
    t.short,
    "",
    "Maqsad:",
    t.maqsad,
    "",
    "Rivojlantiriladigan kompetensiyalar:",
    t.kompetensiya,
    "",
    "Matematik tayyorgarlik bilan bog'liqligi:",
    t.bogliqlik,
    "",
    "Metodik algoritm:",
    ...t.algoritm.map((s, i) => `${i + 1}-qadam. ${s}`),
    "",
    "Namunaviy topshiriq:",
    t.topshiriq,
    "",
    "To'g'ri javob:",
    t.javob,
    "",
    "Baholash mezonlari:",
    ...t.mezonTable.map((m) => `${m.level} (${m.ball}) — ${m.tavsif}`),
    "",
    "Foydalanilgan adabiyotlar:",
    ...t.adabiyotlar.map((a, i) => `${i + 1}. ${a.manba}${a.link ? ` — ${a.link}` : ""}`),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${t.slug}-metodik-tavsiya.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function TavsiyaView({ tavsiya }: { tavsiya: Tavsiya }) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-gradient-soft" />
        <div className="max-w-5xl mx-auto px-6 py-14">
          <Link
            to="/tavsiyalar"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Metodik tavsiyalar
          </Link>
          <span className="inline-block px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-medium uppercase tracking-wider mb-4">
            {tavsiya.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">{tavsiya.title}</h1>
          <p className="mt-3 text-base text-primary/90 font-medium">{tavsiya.kompetensiya}</p>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">{tavsiya.short}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => downloadPdf(tavsiya)} variant="default" className="gap-2">
              <Download className="w-4 h-4" /> Yuklab olish
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link to="/tavsiyalar">
                <ArrowLeft className="w-4 h-4" /> Orqaga qaytish
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-6">
        <Block icon={Info} title="Kompetensiya tavsifi">
          <p>{tavsiya.short}</p>
        </Block>

        <div className="grid md:grid-cols-2 gap-6">
          <Block icon={Target} title="Maqsad">
            <p>{tavsiya.maqsad}</p>
          </Block>
          <Block icon={Sparkles} title="Rivojlantiriladigan kompetensiyalar" tone="accent">
            <p className="mb-3 font-medium text-foreground">{tavsiya.kompetensiya}</p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Matematik tayyorgarlik bilan bog'liqligi: </span>
              {tavsiya.bogliqlik}
            </p>
          </Block>
        </div>

        <Block icon={ListChecks} title="Metodik algoritm">
          <ol className="relative border-l-2 border-primary/30 ml-3 space-y-6 pt-2">
            {tavsiya.algoritm.map((step, i) => (
              <li key={i} className="ml-6">
                <span className="absolute -left-[17px] flex items-center justify-center w-8 h-8 rounded-full bg-gradient-hero text-primary-foreground text-sm font-bold shadow-card">
                  {i + 1}
                </span>
                <div className="rounded-xl bg-muted/40 border p-4 hover:bg-muted/60 transition-colors">
                  <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">
                    {i + 1}-qadam
                  </p>
                  <p>{step}</p>
                </div>
              </li>
            ))}
          </ol>
        </Block>

        <Block icon={FileText} title="Namunaviy topshiriq" tone="accent">
          <div className="rounded-xl border bg-background p-5 mb-4 whitespace-pre-line">
            {tavsiya.topshiriq}
          </div>
          <Button
            onClick={() => setShowAnswer((v) => !v)}
            variant={showAnswer ? "secondary" : "default"}
            className="gap-2"
          >
            {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showAnswer ? "Javobni yashirish" : "To'g'ri javobni ko'rsatish"}
          </Button>
          {showAnswer && (
            <div className="mt-4 rounded-xl border border-accent/40 bg-accent/10 p-5 animate-fade-in">
              <p className="text-xs uppercase tracking-wider text-accent font-semibold mb-2">
                To'g'ri javob va izoh
              </p>
              <p className="whitespace-pre-line">{tavsiya.javob}</p>
            </div>
          )}
        </Block>

        <Block icon={Gauge} title="Baholash mezonlari">
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-muted/60">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Daraja</th>
                  <th className="text-left px-4 py-3 font-semibold">Ball / Foiz</th>
                  <th className="text-left px-4 py-3 font-semibold">Tavsif</th>
                </tr>
              </thead>
              <tbody>
                {tavsiya.mezonTable.map((m, i) => (
                  <tr key={i} className="border-t hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{m.level}</td>
                    <td className="px-4 py-3 text-primary font-semibold">{m.ball}</td>
                    <td className="px-4 py-3 text-foreground/90">{m.tavsif}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>

        <Block icon={BookMarked} title="Foydalanilgan adabiyotlar">
          <ul className="space-y-3">
            {tavsiya.adabiyotlar.map((a, i) => (
              <li key={i} className="flex gap-3 rounded-lg border bg-muted/30 p-3">
                <span className="text-primary font-semibold shrink-0">{i + 1}.</span>
                <div className="flex-1">
                  <p className="text-sm">{a.manba}</p>
                  {a.link && (
                    <a
                      href={a.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1 break-all"
                    >
                      <ExternalLink className="w-3 h-3" /> {a.link}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={() => downloadPdf(tavsiya)} variant="outline" className="gap-2">
              <Download className="w-4 h-4" /> PDF yuklab olish
            </Button>
            <Button asChild variant="ghost" className="gap-2">
              <Link to="/tavsiyalar">
                <ArrowLeft className="w-4 h-4" /> Orqaga qaytish
              </Link>
            </Button>
          </div>
        </Block>
      </section>
    </SiteLayout>
  );
}
