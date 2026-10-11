import { useMemo, useState } from "react";
import { FlaskConical, Sigma } from "lucide-react";
import { TEST_TYPES, familyOf, isDiag, type TestKey } from "@/data/bank";
import type { Attempt } from "@/lib/results";
import { COMPONENTS, type ComponentKey } from "@/lib/components";
import { diagItemById } from "@/data/diag";
import { GROUP_LABEL, type Group } from "@/lib/participant";
import { LEVELS, levelInfo } from "@/lib/levels";
import {
  effectLabel,
  fmtNum,
  fmtP,
  itemAnalysis,
  mean,
  pairedT,
  sd,
  welchT,
  type PairedResult,
} from "@/lib/stats";

const FAMILY_LABEL = (f: string) =>
  f === "diag"
    ? "Diagnostik test, Ilova 1 (A → B)"
    : f === "sinov"
      ? "Rasmiy topshiriqlar sinov testi (A → B)"
      : (TEST_TYPES[f as TestKey] ?? f);

type Pair = {
  personKey: string;
  group: Group;
  pre: number;
  post: number;
  preA: Attempt;
  postA: Attempt;
};

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
          preA: v.pre,
          postA: v.post,
        });
      else if (v.pre) preOnly++;
      else postOnly++;
    }
    out.push({ family, pairs, preOnly, postOnly });
  }
  return out.sort(
    (a, b) =>
      Number(b.family === "diag") - Number(a.family === "diag") || b.pairs.length - a.pairs.length,
  );
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
    const itemMax = group[0].itemMax;
    const matrix = group.map((a) => qs.map((q) => a.itemPoints[q.id] ?? 0));
    return {
      version,
      itemMax,
      ...itemAnalysis(
        qs.map((q) => q.id),
        matrix,
        itemMax,
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
              <div className="text-muted-foreground">
                Ishonchlilik ({res.itemMax > 1 ? "Cronbach alfa" : "KR-20"})
              </div>
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
                    <th className="px-3 py-2 text-right">
                      {res.itemMax > 1 ? "Qiyinlik (o'rtacha ball, %)" : "Qiyinlik (to'g'ri %)"}
                    </th>
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
                        <td className="px-3 py-2 font-medium">
                          {diagItemById.get(it.id)
                            ? `${diagItemById.get(it.id)!.n}. ${diagItemById.get(it.id)!.title}`
                            : it.id}
                        </td>
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
            Qiyinlik — savol bo'yicha o'rtacha ball maksimal ballga nisbatan (dixotomik savolda —
            to'g'ri javob berganlar ulushi); ajratish kuchi — savol bali bilan qolgan savollar
            yig'indisi orasidagi korrelyatsiya (≥ 0,20 — yaxshi). Cronbach alfa dixotomik savollarda
            KR-20 ga teng.
            {isDiag(test) &&
              " Diagnostik testda ballar o'qituvchi rubrikasi bo'yicha (baholanmagan topshiriqlarda — avtomatik dastlabki ball)."}
          </p>
        </>
      )}
    </div>
  );
}

/** Komponent bo'yicha qiymat: diagnostik testda — ball, boshqa testlarda — foiz. */
const compVal = (a: Attempt, k: ComponentKey) => {
  const c = a.components[k];
  if (!c || !c.max) return NaN;
  return a.diag ? c.score : (c.score / c.max) * 100;
};

const ms = (xs: number[]) => (xs.length ? `${fmtNum(mean(xs), 2)} ± ${fmtNum(sd(xs), 2)}` : "—");

/**
 * Komponentlar kesimida natijalar (dissertatsiyadagi 3.6-jadval ko'rinishida): har bir bosqichda
 * tajriba va nazorat guruhlarining M ± SD, Welch t-mezoni va Cohen d; guruhlar bo'lmasa —
 * kirish va yakuniy natija juftlari.
 */
export function ComponentAnalysis({ attempts }: { attempts: Attempt[] }) {
  const families = useMemo(() => buildPairs(attempts), [attempts]);
  const [sel, setSel] = useState<string>("");
  const fam = families.find((f) => f.family === sel) ?? families[0];
  const counted = useMemo(
    () =>
      attempts.filter(
        (a) => a.counted && a.stage !== "mashq" && fam && familyOf(a.testKey) === fam.family,
      ),
    [attempts, fam],
  );
  if (!fam) return null;
  const isPoints = counted.some((a) => a.diag);
  const unit = isPoints ? "ball" : "%";
  const comps = COMPONENTS.filter((c) => counted.some((a) => a.components[c.key]?.max));
  const maxOf = (k: ComponentKey) => counted.find((a) => a.components[k]?.max)?.components[k]?.max;
  const hasGroups =
    counted.some((a) => a.group === "tajriba") && counted.some((a) => a.group === "nazorat");
  const vals = (k: ComponentKey, stage: "kirish" | "yakuniy", g?: Group) =>
    counted
      .filter((a) => a.stage === stage && (g === undefined || a.group === g))
      .map((a) => compVal(a, k))
      .filter(Number.isFinite);

  return (
    <div className="p-6 rounded-2xl border bg-card shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="font-semibold text-lg">Komponentlar kesimida natijalar</h2>
        {families.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {families.map((f) => (
              <button
                key={f.family}
                onClick={() => setSel(f.family)}
                className={`px-3 py-1.5 rounded-lg border text-sm ${f.family === fam.family ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}
              >
                {FAMILY_LABEL(f.family)}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground mt-1">
        {FAMILY_LABEL(fam.family)}. Qiymatlar: M ± SD ({unit}).{" "}
        {hasGroups
          ? "Har bir bosqichda tajriba (TG) va nazorat (NG) guruhlari Welch t-mezoni bilan taqqoslanadi; kirish bosqichidagi taqqoslash guruhlarning boshlang'ich tengligini ko'rsatadi."
          : "Guruhlar belgilanmagan: kirish va yakuniy natijalar bir ishtirokchi bo'yicha juftlab taqqoslanadi."}
      </p>
      <div className="mt-4 overflow-x-auto">
        {hasGroups ? (
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr className="text-left">
                <th className="px-3 py-2">Komponent</th>
                <th className="px-3 py-2">Bosqich</th>
                <th className="px-3 py-2 text-right">TG</th>
                <th className="px-3 py-2 text-right">NG</th>
                <th className="px-3 py-2 text-right">t</th>
                <th className="px-3 py-2 text-right">p</th>
                <th className="px-3 py-2 text-right">Cohen d</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {comps.flatMap((c) =>
                (["kirish", "yakuniy"] as const).map((st, i) => {
                  const tg = vals(c.key, st, "tajriba");
                  const ng = vals(c.key, st, "nazorat");
                  const w = welchT(tg, ng);
                  return (
                    <tr key={c.key + st} className={i === 0 ? "border-t" : ""}>
                      <td className="px-3 py-2 font-medium">
                        {i === 0 && (
                          <>
                            {c.label}
                            {isPoints && (
                              <span className="text-muted-foreground font-normal">
                                {" "}
                                (max {maxOf(c.key)})
                              </span>
                            )}
                          </>
                        )}
                      </td>
                      <td className="px-3 py-2">{st === "kirish" ? "Kirish" : "Yakuniy"}</td>
                      <td className="px-3 py-2 text-right whitespace-nowrap">
                        {ms(tg)} <span className="text-muted-foreground">n={tg.length}</span>
                      </td>
                      <td className="px-3 py-2 text-right whitespace-nowrap">
                        {ms(ng)} <span className="text-muted-foreground">n={ng.length}</span>
                      </td>
                      <td className="px-3 py-2 text-right">{w ? fmtNum(w.t, 2) : "—"}</td>
                      <td className="px-3 py-2 text-right">{w ? fmtP(w.p) : "—"}</td>
                      <td className="px-3 py-2 text-right whitespace-nowrap">
                        {w ? `${fmtNum(w.d, 2)} (${effectLabel(w.d)})` : "—"}
                      </td>
                    </tr>
                  );
                }),
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr className="text-left">
                <th className="px-3 py-2">Komponent</th>
                <th className="px-3 py-2 text-right">n</th>
                <th className="px-3 py-2 text-right">Kirish</th>
                <th className="px-3 py-2 text-right">Yakuniy</th>
                <th className="px-3 py-2 text-right">t</th>
                <th className="px-3 py-2 text-right">p</th>
                <th className="px-3 py-2 text-right">dz</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {comps.map((c) => {
                const ps = fam.pairs
                  .map((p) => [compVal(p.preA, c.key), compVal(p.postA, c.key)])
                  .filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b));
                const pre = ps.map((p) => p[0]);
                const post = ps.map((p) => p[1]);
                const r = pairedT(pre, post);
                return (
                  <tr key={c.key} className="border-t">
                    <td className="px-3 py-2 font-medium">
                      {c.label}
                      {isPoints && (
                        <span className="text-muted-foreground font-normal">
                          {" "}
                          (max {maxOf(c.key)})
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">{ps.length}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">{ms(pre)}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">{ms(post)}</td>
                    <td className="px-3 py-2 text-right">{r ? fmtNum(r.t, 2) : "—"}</td>
                    <td className="px-3 py-2 text-right">{r ? fmtP(r.p) : "—"}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">
                      {r ? `${fmtNum(r.dz, 2)} (${effectLabel(r.dz)})` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {!counted.length && (
        <p className="mt-3 text-sm text-muted-foreground">
          Bu test bo'yicha kirish yoki yakuniy bosqichdagi hisobga olinadigan urinish yo'q.
        </p>
      )}
    </div>
  );
}
