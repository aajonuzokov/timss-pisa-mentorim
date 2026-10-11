import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { Mail, MapPin, User } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Muallif elektron pochtasi. */
const CONTACT_EMAIL = "info@timss-pisa.uz";

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
  const [state, setState] = useState<"idle" | "sending" | "sent" | "mail">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    // "feedback" jadvali migratsiya qo'llangandan keyin mavjud bo'ladi; tiplar keyin yangilanadi.
    const { error } = await (
      supabase as unknown as {
        from: (t: string) => { insert: (v: object) => Promise<{ error: unknown }> };
      }
    )
      .from("feedback")
      .insert({ name: form.name.trim(), email: form.email.trim(), message: form.message.trim() });
    if (!error) {
      setState("sent");
      setForm({ name: "", email: "", message: "" });
      return;
    }
    // Jadval hali yo'q yoki aloqa uzilgan: pochta dasturi orqali yuborishni taklif qilamiz.
    setState("mail");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      "Platforma bo'yicha xabar",
    )}&body=${encodeURIComponent(`${form.message}\n\n${form.name} <${form.email}>`)}`;
  };
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Bog'lanish"
        title="Aloqa"
        description="Muallif bilan bog'laning yoki fikr-mulohazalaringizni qoldiring."
      />
      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10">
        <div className="space-y-5">
          <h2 className="text-2xl font-semibold">Muallif ma'lumotlari</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center text-primary-foreground shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold">Tadqiqotchi-pedagog</div>
                <div className="text-sm text-muted-foreground">
                  Pedagogika fanlari bo'yicha tadqiqotchi
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center text-primary-foreground shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold">Elektron pochta</div>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-sm text-primary hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center text-primary-foreground shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold">Manzil</div>
                <div className="text-sm text-muted-foreground">Toshkent, O'zbekiston</div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="p-7 rounded-2xl border bg-card shadow-card space-y-4">
          <h2 className="text-xl font-semibold">Xabar yuborish</h2>
          <input
            required
            maxLength={200}
            placeholder="Ismingiz"
            aria-label="Ismingiz"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border bg-background"
          />
          <input
            required
            type="email"
            maxLength={200}
            placeholder="Elektron pochta"
            aria-label="Elektron pochta"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border bg-background"
          />
          <textarea
            required
            rows={5}
            maxLength={3000}
            placeholder="Xabar matni"
            aria-label="Xabar matni"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border bg-background resize-none"
          />
          <button
            type="submit"
            disabled={state === "sending"}
            className="w-full px-5 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-60"
          >
            {state === "sending" ? "Yuborilmoqda…" : "Yuborish"}
          </button>
          {state === "sent" && (
            <p className="text-sm text-emerald-700 text-center">
              Xabaringiz qabul qilindi. Rahmat!
            </p>
          )}
          {state === "mail" && (
            <p className="text-sm text-muted-foreground text-center">
              Xabar pochta dasturingiz orqali yuborish uchun tayyorlandi. Agar dastur ochilmasa,{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
                {CONTACT_EMAIL}
              </a>{" "}
              manziliga yozing.
            </p>
          )}
        </form>
      </section>
    </SiteLayout>
  );
}
