import { useMemo, useState } from "react";
import { FlaskConical, Sigma } from "lucide-react";
import { TEST_TYPES, familyOf, type TestKey } from "@/data/bank";
import type { Attempt } from "@/lib/results";
import { isCorrect } from "@/lib/answers";
import { GROUP_LABEL, type Group } from "@/lib/participant";
import { LEVELS, levelInfo } from "@/lib/levels";
import {
  effectLabel,
  fmtNum,
  fmtP,
  itemAnalysis,
  pairedT,
  welchT,
  type PairedResult,
} from "@/lib/stats";

const FAMILY_LABEL = (f: string) =>
  f === "sinov" ? "Tajriba-sinov testi (A → B)" : (TEST_TYPES[f as TestKey] ?? f);

type Pair = { personKey: string; group: Group; pre: number; post: number };

const buildPairs = (attempts: Attempt[]) => {
  const byFamily = new Map<string, Map<string, { pre?: Attempt; post?: Attempt }>>();
  for (const a of attempts) {
    if (!a.counted || a.stage === "mashq") continue;
    const fam = familyOf(a.testKey);
    const people = byFamily.get(fam) ?? new Map();
    const cur = people.get(a.personKey) ?? {};
    if (a.stage === "kirish") cur.pre = a;
    else cur.post = a;
    people.set(a.personKey, cur);
    byFamily.set(fam, people);
  }
  const out: { family: string; pairs: Pair[]; preOnly: number; postOnly: number }[] = [];
  for (const [family, people] of byFamily) {
    const pairs: Pair[] = [];
    let preOnly = 0;
    let postOnly = 0;
    for (const [personKey, v] of people) {
      if (v.pre && v.post)
        pairs.push({
          personKey,
          group: v.post.group || v.pre.group,
          pre: v.pre.pct,
          post: v.post.pct,
        });
      else if (v.pre) preOnly++;
      else postOnly++;
    }
    out.push({ family, pairs, preOnly, postOnly });
  }
  return out.sort((a, b) => b.pairs.length - a.pairs.length);
};

function PairedRow({ label, r }: { label: string; r: PairedResult | null }) {
  if (!r)
    return (
      <tr className="border-t">
        <td className="px-3 py-2 font-medium">{label}</td>
        <td colSpan={8} className="px-3 py-2 text-muted-foreground">
          Juftliklar yetarli emas (kamida 2 ta kerak).
        </td>
      </tr>
    );
  return (
    <tr className="border-t tabular-nums">
      <td className="px-3 py-2 font-medium">{label}</td>
      <td className="px-3 py-2 text-right">{r.n}</td>
      <td className="px-3 py-2 text-right">{fmtNum(r.meanPre, 1)}%</td>
      <td className="px-3 py-2 text-right">{fmtNum(r.meanPost, 1)}%</td>
      <td className="px-3 py-2 text-right font-semibold">
        {r.meanDiff >= 0 ? "+" : ""}
        {fmtNum(r.meanDiff, 1)}
      </td>
      <td className="px-3 py-2 text-right whitespace-nowrap">
        [{fmtNum(r.ciLow, 1)}; {fmtNum(r.ciHigh, 1)}]
      </td>
      <td className="px-3 py-2 text-right whitespace-nowrap">
        t({r.df}) = {fmtNum(r.t, 2)}
      </td>
      <td className="px-3 py-2 text-right">{fmtP(r.p)}</td>
      <td className="px-3 py-2 text-right whitespace-nowrap">
        {fmtNum(r.dz, 2)} ({effectLabel(r.dz)})
      </td>
    </tr>
  );
}

export function PrePostAnalysis({ attempts }: { attempts: Attempt[] }) {
  const families = useMemo(() => buildPairs(attempts), [attempts]);

  return (
    <div className="p-6 rounded-2xl border bg-card shadow-card">
      <h2 className="font-semibold text-lg flex items-center gap-2">
        <FlaskConical className="w-5 h-5 text-primary" /> Tajriba-sinov: kirish va yakuniy natijalar
      </h2>
      <p className="text-sm text-muted-foreground mt-1">
        Bir ishtirokchining (kod bo'yicha) kirish va yakuniy testdagi birinchi to'liq urinishlari
        juftlanadi. Bog'liq tanlanmalar uchun Styudent t-mezoni, 95% ishonch oralig'i va Cohen dz
        effekt kattaligi hisoblanadi.
      </p>
      {!families.length || families.every((f) => !f.pairs.length) ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Hozircha juftliklar yo'q. Ishtirokchilar{" "}
          <span className="font-medium">Tajriba-sinov</span> bo'limida avval kirish, so'ng yakuniy
          testni bir xil kod bilan topshirgach, natija shu yerda chiqadi.
          {families.length > 0 &&
            ` Hozir faqat kirish: ${families.reduce((s, f) => s + f.preOnly, 0)}, faqat yakuniy: ${families.reduce((s, f) => s + f.postOnly, 0)}.`}
        </p>
      ) : (
        families
          .filter((f) => f.pairs.length)
          .map((f) => {
            const all = pairedT(
              f.pairs.map((p) => p.pre),
              f.pairs.map((p) => p.post),
            );
            const groups = (["tajriba", "nazorat"] as Group[]).filter((g) =>
              f.pairs.some((p) => p.group === g),
            );
            const gain = (g: Group) =>
              f.pairs.filter((p) => p.group === g).map((p) => p.post - p.pre);
            const welch = groups.length === 2 ? welchT(gain("tajriba"), gain("nazorat")) : null;
            const lvl = (vals: number[]) =>
              LEVELS.map((l) => vals.filter((v) => levelInfo(v).key === l.key).length);
            const preL = lvl(f.pairs.map((p) => p.pre));
            const postL = lvl(f.pairs.map((p) => p.post));
            const n = f.pairs.length;
            return (
              <div key={f.family} className="mt-6">
                <h3 className="font-medium">{FAMILY_LABEL(f.family)}</h3>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr className="text-left">
                        <th className="px-3 py-2">Guruh</th>
                        <th className="px-3 py-2 text-right">n</th>
                        <th className="px-3 py-2 text-right">Kirish</th>
                        <th className="px-3 py-2 text-right">Yakuniy</th>
                        <th className="px-3 py-2 text-right">O'sish (p.p.)</th>
                        <th className="px-3 py-2 text-right">95% IO</th>
                        <th className="px-3 py-2 text-right">t</th>
                        <th className="px-3 py-2 text-right">p</th>
                        <th className="px-3 py-2 text-right">dz</th>
                      </tr>
                    </thead>
                    <tbody>
                      <PairedRow label="Barcha ishtirokchilar" r={all} />
                      {groups.map((g) => {
                        const ps = f.pairs.filter((p) => p.group === g);
                        return (
                          <PairedRow
                            key={g}
                            label={GROUP_LABEL[g]}
                            r={pairedT(
                              ps.map((p) => p.pre),
                              ps.map((p) => p.post),
                            )}
                          />
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {welch && (
                  <p className="mt-3 text-sm">
                    Tajriba va nazorat guruhlari o'sishi farqi (Welch t-mezoni): t(
                    {fmtNum(welch.df, 1)}) = {fmtNum(welch.t, 2)}, p = {fmtP(welch.p)}, Cohen d ={" "}
                    {fmtNum(welch.d, 2)} ({effectLabel(welch.d)}).
                  </p>
                )}
                <div className="mt-4 overflow-x-auto">
                  <table className="text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-3 py-2 text-left">Daraja</th>
                        {LEVELS.map((l) => (
                          <th key={l.key} className="px-3 py-2 text-right">
                            {l.short}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="tabular-nums">
                      {[
                        ["Kirish", preL],
                        ["Yakuniy", postL],
                      ].map(([name, arr]) => (
                        <tr key={name as string} className="border-t">
                          <td className="px-3 py-2 font-medium">{name as string}</td>
                          {(arr as number[]).map((c, i) => (
                            <td key={i} className="px-3 py-2 text-right">
                              {c} ({Math.round((c / n) * 100)}%)
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {all && `${all.improved} / ${all.n} ishtirokchining natijasi oshgan. `}
                  Juftlanmagan: faqat kirish — {f.preOnly}, faqat yakuniy — {f.postOnly}. n &lt; 30
                  bo'lsa, t-mezon natijasini ehtiyotkorlik bilan talqin qiling.
                </p>
              </div>
            );
          })
      )}
    </div>
  );
}

export function ItemAnalysis({ attempts, test }: { attempts: Attempt[]; test: TestKey }) {
  const [open, setOpen] = useState(false);
  const res = useMemo(() => {
    const list = attempts.filter((a) => a.testKey === test && a.counted);
    if (list.length < 2) return null;
    // Bir test turli bank versiyalarida bo'lishi mumkin: eng ko'p ishlatilgan versiya olinadi.
    const byVer = new Map<string, Attempt[]>();
    for (const a of list) byVer.set(a.version, [...(byVer.get(a.version) ?? []), a]);
    const [version, group] = [...byVer.entries()].sort((a, b) => b[1].length - a[1].length)[0];
    const qs = group[0].questions;
    const matrix = group.map((a) => qs.map((q) => (isCorrect(q, a.answers[q.id]) ? 1 : 0)));
    return {
      version,
      ...itemAnalysis(
        qs.map((q) => q.id),
        matrix,
      ),
    };
  }, [attempts, test]);

  return (
    <div className="p-6 rounded-2xl border bg-card shadow-card">
      <h2 className="font-semibold text-lg flex items-center gap-2">
        <Sigma className="w-5 h-5 text-primary" /> Test sifati tahlili · {TEST_TYPES[test]}
      </h2>
      {!res ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Tahlil uchun kamida 2 ta hisobga olinadigan to'liq urinish kerak (ishonchli natija uchun
          30 va undan ko'p).
        </p>
      ) : (
        <>
          <div className="mt-3 grid sm:grid-cols-3 gap-3 text-sm">
            <div className="p-4 rounded-xl border">
              <div className="text-muted-foreground">Ishonchlilik (KR-20)</div>
              <div className="text-2xl font-bold tabular-nums">{fmtNum(res.kr20, 2)}</div>
              <div className="text-xs text-muted-foreground">≥ 0,70 — qoniqarli</div>
            </div>
            <div className="p-4 rounded-xl border">
              <div className="text-muted-foreground">Urinishlar / savollar</div>
              <div className="text-2xl font-bold tabular-nums">
                {res.n} / {res.k}
              </div>
              <div className="text-xs text-muted-foreground">bank versiyasi {res.version}</div>
            </div>
            <div className="p-4 rounded-xl border">
              <div className="text-muted-foreground">Qayta ko'rib chiqish kerak</div>
              <div className="text-2xl font-bold tabular-nums">
                {res.items.filter((it) => it.p < 0.2 || it.p > 0.9 || !(it.r >= 0.2)).length}
              </div>
              <div className="text-xs text-muted-foreground">
                juda oson/qiyin yoki ajratish kuchi past
              </div>
            </div>
          </div>
          {res.n < 30 && (
            <p className="mt-3 text-xs text-amber-700 dark:text-amber-400">
              Urinishlar soni 30 dan kam: ko'rsatkichlar taxminiy.
            </p>
          )}
          <button
            className="mt-4 text-sm text-primary hover:underline"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Savollar jadvalini yashirish" : "Har bir savol bo'yicha jadvalni ko'rsatish"}
          </button>
          {open && (
            <div className="mt-3 overflow-x-auto max-h-[480px]">
              <table className="w-full text-sm">
                <thead className="bg-muted sticky top-0">
                  <tr className="text-left">
                    <th className="px-3 py-2">Savol</th>
                    <th className="px-3 py-2 text-right">Qiyinlik (to'g'ri %)</th>
                    <th className="px-3 py-2 text-right">Ajratish kuchi (r)</th>
                    <th className="px-3 py-2">Xulosa</th>
                  </tr>
                </thead>
                <tbody className="tabular-nums">
                  {res.items.map((it) => {
                    const notes = [
                      it.p < 0.2 && "juda qiyin",
                      it.p > 0.9 && "juda oson",
                      !(it.r >= 0.2) && "ajratish kuchi past",
                    ].filter(Boolean);
                    return (
                      <tr key={it.id} className="border-t">
                        <td className="px-3 py-2 font-medium">{it.id}</td>
                        <td className="px-3 py-2 text-right">{Math.round(it.p * 100)}%</td>
                        <td className="px-3 py-2 text-right">{fmtNum(it.r, 2)}</td>
                        <td
                          className={`px-3 py-2 ${notes.length ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground"}`}
                        >
                          {notes.length ? notes.join(", ") : "yaxshi"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Qiyinlik — savolga to'g'ri javob berganlar ulushi; ajratish kuchi — savol natijasi bilan
            qolgan savollar yig'indisi orasidagi korrelyatsiya (≥ 0,20 — yaxshi). KR-20 — dixotomik
            savollar uchun Cronbach alfa.
          </p>
        </>
      )}
    </div>
  );
}
