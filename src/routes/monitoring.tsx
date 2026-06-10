import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/monitoring")({
  head: () => ({
    meta: [
      { title: "Monitoring — TIMSS/PISA Platformasi" },
      { name: "description", content: "Talabalar natijalarini kiritish va o'zlashtirish dinamikasini kuzatish." },
    ],
  }),
  component: Page,
});

type Row = { name: string; timss: number; pisa: number; total: number };

const initial: Row[] = [
  { name: "Aliyeva D.", timss: 85, pisa: 78, total: 0 },
  { name: "Karimov S.", timss: 72, pisa: 80, total: 0 },
  { name: "Yusupova M.", timss: 90, pisa: 88, total: 0 },
].map((r) => ({ ...r, total: Math.round((r.timss + r.pisa) / 2) }));

function Page() {
  const [rows, setRows] = useState<Row[]>(initial);
  const [form, setForm] = useState({ name: "", timss: "", pisa: "" });

  const add = () => {
    const t = Number(form.timss);
    const p = Number(form.pisa);
    if (!form.name || isNaN(t) || isNaN(p)) return;
    setRows([...rows, { name: form.name, timss: t, pisa: p, total: Math.round((t + p) / 2) }]);
    setForm({ name: "", timss: "", pisa: "" });
  };

  const remove = (i: number) => setRows(rows.filter((_, idx) => idx !== i));

  const avg = rows.length ? Math.round(rows.reduce((s, r) => s + r.total, 0) / rows.length) : 0;

  return (
    <SiteLayout>
      <PageHeader eyebrow="Kuzatuv" title="Talabalar monitoringi" description="Talabalar natijalarini kiriting va o'zlashtirish dinamikasini kuzating." />
      <section className="max-w-5xl mx-auto px-6 py-16 space-y-8">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border bg-card shadow-card">
            <div className="text-sm text-muted-foreground">Jami talabalar</div>
            <div className="text-3xl font-display font-bold mt-1">{rows.length}</div>
          </div>
          <div className="p-5 rounded-2xl border bg-card shadow-card">
            <div className="text-sm text-muted-foreground">O'rtacha ball</div>
            <div className="text-3xl font-display font-bold mt-1 text-gradient">{avg}</div>
          </div>
          <div className="p-5 rounded-2xl border bg-card shadow-card">
            <div className="text-sm text-muted-foreground">Yuqori daraja (≥80)</div>
            <div className="text-3xl font-display font-bold mt-1">{rows.filter((r) => r.total >= 80).length}</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl border bg-card shadow-card">
          <h3 className="font-semibold mb-4">Yangi natija qo'shish</h3>
          <div className="grid sm:grid-cols-4 gap-3">
            <input className="px-4 py-2.5 rounded-lg border bg-background" placeholder="Talaba ismi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="px-4 py-2.5 rounded-lg border bg-background" placeholder="TIMSS ball" value={form.timss} onChange={(e) => setForm({ ...form, timss: e.target.value })} />
            <input className="px-4 py-2.5 rounded-lg border bg-background" placeholder="PISA ball" value={form.pisa} onChange={(e) => setForm({ ...form, pisa: e.target.value })} />
            <button onClick={add} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90">
              <Plus className="w-4 h-4" /> Qo'shish
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border bg-card shadow-card">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold">Talaba</th>
                <th className="px-4 py-3 font-semibold">TIMSS</th>
                <th className="px-4 py-3 font-semibold">PISA</th>
                <th className="px-4 py-3 font-semibold">O'rtacha</th>
                <th className="px-4 py-3 font-semibold">Daraja</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3">{r.timss}</td>
                  <td className="px-4 py-3">{r.pisa}</td>
                  <td className="px-4 py-3 font-semibold">{r.total}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${r.total >= 80 ? "bg-accent/15 text-accent" : r.total >= 60 ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {r.total >= 80 ? "Yuqori" : r.total >= 60 ? "O'rta" : "Past"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => remove(i)} className="p-1.5 rounded hover:bg-muted text-muted-foreground" aria-label="O'chirish">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </SiteLayout>
  );
}
