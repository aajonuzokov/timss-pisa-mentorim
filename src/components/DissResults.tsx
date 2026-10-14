import {
  Bar,
  BarChart,
  CartesianGrid,
  ErrorBar,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHI2_FINAL, DISS_SAMPLE, TABLE_3_5, TABLE_3_6, TABLE_3_7, fmt } from "@/data/dissResults";

const SHORT: Record<string, string> = {
  bilim: "Bilim",
  tafakkur: "Tafakkur",
  metodik: "MKT",
  savodxonlik: "Savodxonlik",
  refleksiya: "Refleksiya",
};

const C_PAST = "#ef4444";
const C_ORTA = "#f59e0b";
const C_YUQ = "#10b981";

/** 3.5-jadval: darajalar taqsimoti, 100% ga to'ldirilgan gorizontal ustunlar. */
export function Levels35() {
  const data = TABLE_3_5.map((r) => ({ ...r, name: `${r.group} · ${r.stage.toLowerCase()}` }));
  return (
    <figure className="p-6 rounded-2xl border bg-card shadow-card">
      <figcaption className="mb-1 font-semibold">
        TGda yuqori daraja 15% dan 45% gacha oshdi, NGda 15% dan 20% gacha
      </figcaption>
      <p className="text-sm text-muted-foreground mb-4">
        3.5-jadval. Aniqlovchi va yakuniy bosqichlarda matematik tayyorgarlik darajalari, %
      </p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 24, right: 16 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v: number) => `${fmt(v)}%`} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="past" name="Past" stackId="a" fill={C_PAST} />
            <Bar dataKey="orta" name="O'rta" stackId="a" fill={C_ORTA} />
            <Bar dataKey="yuqori" name="Yuqori" stackId="a" fill={C_YUQ} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr className="text-left">
              <th className="px-3 py-2">Guruh</th>
              <th className="px-3 py-2">Bosqich</th>
              <th className="px-3 py-2 text-right">Past, %</th>
              <th className="px-3 py-2 text-right">O'rta, %</th>
              <th className="px-3 py-2 text-right">Yuqori, %</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {TABLE_3_5.map((r) => (
              <tr key={r.group + r.stage} className="border-t">
                <td className="px-3 py-2 font-medium">{r.group}</td>
                <td className="px-3 py-2">{r.stage}</td>
                <td className="px-3 py-2 text-right">{fmt(r.past)}</td>
                <td className="px-3 py-2 text-right">{fmt(r.orta)}</td>
                <td className="px-3 py-2 text-right">{fmt(r.yuqori)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

/** 3.6-jadval: komponentlar bo'yicha TG va NG o'rtachasi (± SD), t va Cohen d. */
export function Components36() {
  const data = TABLE_3_6.map((r) => ({
    name: SHORT[r.key],
    TG: r.tgM,
    NG: r.ngM,
    tgSD: r.tgSD,
    ngSD: r.ngSD,
  }));
  return (
    <figure className="p-6 rounded-2xl border bg-card shadow-card">
      <figcaption className="mb-1 font-semibold">
        TG barcha 5 komponentda NGdan yuqori; eng katta farq savodxonlik va refleksiyada
      </figcaption>
      <p className="text-sm text-muted-foreground mb-4">
        3.6-jadval. Yakuniy natijalar, o'rtacha ball ± standart og'ish
      </p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 0, right: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={[0, 35]} />
            <Tooltip formatter={(v: number) => fmt(v, 2)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="TG" name="Tajriba guruhi" fill="var(--primary)">
              <ErrorBar dataKey="tgSD" width={4} stroke="#334155" />
            </Bar>
            <Bar dataKey="NG" name="Nazorat guruhi" fill="#94a3b8">
              <ErrorBar dataKey="ngSD" width={4} stroke="#334155" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr className="text-left">
              <th className="px-3 py-2">Komponent</th>
              <th className="px-3 py-2 text-right">TG (M ± SD)</th>
              <th className="px-3 py-2 text-right">NG (M ± SD)</th>
              <th className="px-3 py-2 text-right">Farq</th>
              <th className="px-3 py-2 text-right">t</th>
              <th className="px-3 py-2 text-right">p</th>
              <th className="px-3 py-2 text-right">Cohen d</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {TABLE_3_6.map((r) => (
              <tr key={r.key} className="border-t">
                <td className="px-3 py-2 font-medium">{r.label}</td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {fmt(r.tgM, 2)} ± {fmt(r.tgSD, 2)}
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {fmt(r.ngM, 2)} ± {fmt(r.ngSD, 2)}
                </td>
                <td className="px-3 py-2 text-right">{fmt(r.tgM - r.ngM, 2)}</td>
                <td className="px-3 py-2 text-right">{fmt(r.t, 2)}</td>
                <td className="px-3 py-2 text-right whitespace-nowrap">&lt; 0,001</td>
                <td className="px-3 py-2 text-right">{fmt(r.d, 3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Studentning mustaqil tanlanmalar uchun t-mezoni; TG = {DISS_SAMPLE.tg}, NG ={" "}
        {DISS_SAMPLE.ng}. Cohen d ≥ 0,8 — katta effekt.
      </p>
    </figure>
  );
}

/** 3.7-jadval va χ² mezoni. */
export function Final37() {
  return (
    <figure className="p-6 rounded-2xl border bg-card shadow-card">
      <figcaption className="mb-1 font-semibold">
        Yakuniy taqsimotdagi farq statistik ahamiyatli: χ² = {fmt(CHI2_FINAL.chi2, 3)}, df ={" "}
        {CHI2_FINAL.df}, p {CHI2_FINAL.p}
      </figcaption>
      <p className="text-sm text-muted-foreground mb-4">
        3.7-jadval. Yakuniy diagnostika natijalari, talabalar soni (ulushi)
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr className="text-left">
              <th className="px-3 py-2">Guruh</th>
              <th className="px-3 py-2 text-right">Talabalar</th>
              <th className="px-3 py-2 text-right">Past</th>
              <th className="px-3 py-2 text-right">O'rta</th>
              <th className="px-3 py-2 text-right">Yuqori</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {TABLE_3_7.map((r) => (
              <tr key={r.group} className={`border-t ${r.group === "Jami" ? "font-semibold" : ""}`}>
                <td className="px-3 py-2">{r.group}</td>
                <td className="px-3 py-2 text-right">{r.n}</td>
                {[r.past, r.orta, r.yuqori].map((v, i) => (
                  <td key={i} className="px-3 py-2 text-right">
                    {v} ({fmt((v / r.n) * 100)}%)
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
