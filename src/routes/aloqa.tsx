import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { Mail, MapPin, User } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/aloqa")({
  head: () => ({
    meta: [
      { title: "Aloqa — TIMSS/PISA Platformasi" },
      { name: "description", content: "Muallif bilan bog'lanish va fikr-mulohazalarni yuborish." },
    ],
  }),
  component: Page,
});

function Page() {
  const [sent, setSent] = useState(false);
  return (
    <SiteLayout>
      <PageHeader eyebrow="Bog'lanish" title="Aloqa" description="Muallif bilan bog'laning yoki fikr-mulohazalaringizni qoldiring." />
      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10">
        <div className="space-y-5">
          <h2 className="text-2xl font-semibold">Muallif ma'lumotlari</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center text-primary-foreground shrink-0"><User className="w-5 h-5" /></div>
              <div>
                <div className="font-semibold">Tadqiqotchi-pedagog</div>
                <div className="text-sm text-muted-foreground">Pedagogika fanlari bo'yicha tadqiqotchi</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center text-primary-foreground shrink-0"><Mail className="w-5 h-5" /></div>
              <div>
                <div className="font-semibold">Elektron pochta</div>
                <a href="mailto:info@timss-pisa.uz" className="text-sm text-primary hover:underline">info@timss-pisa.uz</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center text-primary-foreground shrink-0"><MapPin className="w-5 h-5" /></div>
              <div>
                <div className="font-semibold">Manzil</div>
                <div className="text-sm text-muted-foreground">Toshkent, O'zbekiston</div>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="p-7 rounded-2xl border bg-card shadow-card space-y-4"
        >
          <h2 className="text-xl font-semibold">Xabar yuborish</h2>
          <input required placeholder="Ismingiz" className="w-full px-4 py-2.5 rounded-lg border bg-background" />
          <input required type="email" placeholder="Elektron pochta" className="w-full px-4 py-2.5 rounded-lg border bg-background" />
          <textarea required rows={5} placeholder="Xabar matni" className="w-full px-4 py-2.5 rounded-lg border bg-background resize-none" />
          <button type="submit" className="w-full px-5 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
            Yuborish
          </button>
          {sent && <p className="text-sm text-accent text-center">Xabaringiz uchun rahmat! Tez orada bog'lanamiz.</p>}
        </form>
      </section>
    </SiteLayout>
  );
}
