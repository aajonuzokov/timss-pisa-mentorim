// Tajriba-sinov tahlili uchun statistik funksiyalar (tashqi kutubxonasiz).

export const mean = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : NaN);

/** Tanlanma standart chetlanishi (n − 1). */
export const sd = (xs: number[]) => {
  if (xs.length < 2) return NaN;
  const m = mean(xs);
  return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1));
};

// --- Student t taqsimoti --------------------------------------------------------

const logGamma = (x: number): number => {
  // Lanczos yaqinlashuvi
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x);
  x -= 1;
  let a = c[0];
  const t = x + g + 0.5;
  for (let i = 1; i < g + 2; i++) a += c[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
};

/** Regularizatsiyalangan to'liqmas beta funksiya I_x(a, b) (uzluksiz kasr usuli). */
const betaInc = (x: number, a: number, b: number): number => {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(
    logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x),
  );
  const cf = (xx: number, aa: number, bb: number) => {
    const MAXIT = 200;
    const EPS = 3e-14;
    const FPMIN = 1e-300;
    let c = 1;
    let d = 1 - ((aa + bb) * xx) / (aa + 1);
    if (Math.abs(d) < FPMIN) d = FPMIN;
    d = 1 / d;
    let h = d;
    for (let m = 1; m <= MAXIT; m++) {
      const m2 = 2 * m;
      let an = (m * (bb - m) * xx) / ((aa + m2 - 1) * (aa + m2));
      d = 1 + an * d;
      if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1 + an / c;
      if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d;
      h *= d * c;
      an = (-(aa + m) * (aa + bb + m) * xx) / ((aa + m2) * (aa + m2 + 1));
      d = 1 + an * d;
      if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1 + an / c;
      if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d;
      const del = d * c;
      h *= del;
      if (Math.abs(del - 1) < EPS) break;
    }
    return h;
  };
  return x < (a + 1) / (a + b + 2) ? (bt * cf(x, a, b)) / a : 1 - (bt * cf(1 - x, b, a)) / b;
};

/** Ikki tomonlama p-qiymat: P(|T| ≥ |t|), T ~ t(df). */
export const tTwoSidedP = (t: number, df: number) =>
  df > 0 && Number.isFinite(t) ? betaInc(df / (df + t * t), df / 2, 0.5) : NaN;

/** t taqsimotining kritik qiymati (ikki tomonlama, masalan alpha = 0.05). */
export const tCritical = (df: number, alpha = 0.05) => {
  let lo = 0;
  let hi = 100;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (tTwoSidedP(mid, df) > alpha) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
};

export type PairedResult = {
  n: number;
  meanPre: number;
  meanPost: number;
  meanDiff: number;
  sdDiff: number;
  t: number;
  df: number;
  p: number;
  /** Cohen dz = o'rtacha farq / farqlar standart chetlanishi. */
  dz: number;
  ciLow: number;
  ciHigh: number;
  improved: number;
};

/** Bog'liq tanlanmalar uchun t-mezon (kirish va yakuniy natija). */
export const pairedT = (pre: number[], post: number[]): PairedResult | null => {
  const n = Math.min(pre.length, post.length);
  if (n < 2) return null;
  const diffs = post.slice(0, n).map((v, i) => v - pre[i]);
  const md = mean(diffs);
  const s = sd(diffs);
  const df = n - 1;
  const se = s / Math.sqrt(n);
  const t = se > 0 ? md / se : md === 0 ? 0 : Infinity * Math.sign(md);
  const tc = tCritical(df);
  return {
    n,
    meanPre: mean(pre.slice(0, n)),
    meanPost: mean(post.slice(0, n)),
    meanDiff: md,
    sdDiff: s,
    t,
    df,
    p: se > 0 ? tTwoSidedP(t, df) : md === 0 ? 1 : 0,
    dz: s > 0 ? md / s : NaN,
    ciLow: md - tc * se,
    ciHigh: md + tc * se,
    improved: diffs.filter((d) => d > 0).length,
  };
};

export type WelchResult = {
  nA: number;
  nB: number;
  meanA: number;
  meanB: number;
  t: number;
  df: number;
  p: number;
  /** Cohen d (umumlashtirilgan standart chetlanish bilan). */
  d: number;
};

/** Mustaqil guruhlar uchun Welch t-mezoni (masalan, tajriba va nazorat guruhlari o'sishi). */
export const welchT = (a: number[], b: number[]): WelchResult | null => {
  if (a.length < 2 || b.length < 2) return null;
  const ma = mean(a);
  const mb = mean(b);
  const va = sd(a) ** 2;
  const vb = sd(b) ** 2;
  const se = Math.sqrt(va / a.length + vb / b.length);
  const t = se > 0 ? (ma - mb) / se : 0;
  const df =
    se > 0
      ? (va / a.length + vb / b.length) ** 2 /
        ((va / a.length) ** 2 / (a.length - 1) + (vb / b.length) ** 2 / (b.length - 1))
      : a.length + b.length - 2;
  const sp = Math.sqrt(((a.length - 1) * va + (b.length - 1) * vb) / (a.length + b.length - 2));
  return {
    nA: a.length,
    nB: b.length,
    meanA: ma,
    meanB: mb,
    t,
    df,
    p: se > 0 ? tTwoSidedP(t, df) : 1,
    d: sp > 0 ? (ma - mb) / sp : NaN,
  };
};

// --- Savollar tahlili (klassik test nazariyasi) ----------------------------------

export type ItemStat = {
  id: string;
  /** Qiyinlik indeksi: to'g'ri javoblar ulushi (0–1). */
  p: number;
  /** Ajratish kuchi: savol va qolgan ball o'rtasidagi korrelyatsiya (tuzatilgan nuqtali-biserial). */
  r: number;
  n: number;
};

const corr = (x: number[], y: number[]) => {
  const mx = mean(x);
  const my = mean(y);
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < x.length; i++) {
    sxy += (x[i] - mx) * (y[i] - my);
    sxx += (x[i] - mx) ** 2;
    syy += (y[i] - my) ** 2;
  }
  return sxx > 0 && syy > 0 ? sxy / Math.sqrt(sxx * syy) : NaN;
};

/**
 * matrix[person][item] = ball (dixotomik savolda 0/1, diagnostik testda 0–2).
 * Har bir savol uchun qiyinlik (o'rtacha ball / maksimal ball) va ajratish kuchi,
 * butun test uchun Cronbach alfa (dixotomik savollarda u KR-20 ga teng).
 */
export const itemAnalysis = (ids: string[], matrix: number[][], itemMax = 1) => {
  const n = matrix.length;
  const k = ids.length;
  const totals = matrix.map((row) => row.reduce((s, v) => s + v, 0));
  const popVar = (xs: number[]) => {
    const m = mean(xs);
    return xs.length ? xs.reduce((acc, x) => acc + (x - m) ** 2, 0) / xs.length : NaN;
  };
  let sumItemVar = 0;
  const items: ItemStat[] = ids.map((id, j) => {
    const col = matrix.map((row) => row[j]);
    const rest = totals.map((t, i) => t - col[i]);
    sumItemVar += popVar(col);
    return { id, p: mean(col) / itemMax, r: corr(col, rest), n };
  });
  // Savol dispersiyalari populyatsiya dispersiyasi bo'lgani uchun umumiy ball dispersiyasi ham n ga bo'linadi.
  const varTotal = n > 1 ? popVar(totals) : NaN;
  const kr20 = k > 1 && varTotal > 0 ? (k / (k - 1)) * (1 - sumItemVar / varTotal) : NaN;
  return { items, kr20, n, k };
};

export const fmtP = (p: number) =>
  !Number.isFinite(p) ? "—" : p < 0.001 ? "< 0,001" : p.toFixed(3).replace(".", ",");

export const fmtNum = (x: number, d = 2) =>
  Number.isFinite(x) ? x.toFixed(d).replace(".", ",") : "—";

/** Effekt kattaligi talqini (Cohen me'zonlari). */
export const effectLabel = (d: number) => {
  const a = Math.abs(d);
  if (!Number.isFinite(a)) return "—";
  if (a < 0.2) return "juda kichik";
  if (a < 0.5) return "kichik";
  if (a < 0.8) return "o'rta";
  return "katta";
};
