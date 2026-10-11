// Javobni tekshirish: test (variant indeksi) va ochiq javob (ishtirokchi yozgan matn).
// Ochiq javob so'z sifatida emas, qiymat sifatida solishtiriladi: bo'shliq, vergul/nuqta,
// o'lchov birligi va kasr yozuvidagi farqlar natijaga ta'sir qilmaydi.

export type OpenAnswer =
  | { type: "number"; accept: number[]; tol?: number }
  | { type: "between"; min: number; max: number }
  | { type: "set"; accept: number[] }
  | { type: "time"; accept: string[] }
  | { type: "fraction"; accept: string[] };

export type Checkable = {
  options: string[];
  correctIndex: number;
  answer?: OpenAnswer;
};

export type AnswerValue = number | string;

const EPS = 1e-9;

/** "1 276", "12 600" kabi minglik bo'shliqlarini olib tashlaydi (oddiy va bo'linmas bo'shliq). */
const joinThousands = (s: string) => s.replace(/(\d)[\s\u00a0\u202f]+(?=\d{3}(?!\d))/g, "$1");

/** Matndagi barcha sonlarni ajratadi: butun, o'nli (vergul yoki nuqta) va oddiy kasr (a/b). */
export const extractNumbers = (raw: string): number[][] => {
  const s = joinThousands(raw.replace(/[−–—]/g, "-"));
  const out: number[][] = [];
  const re = /-?\d+(?:[.,]\d+)?(?:\s*\/\s*-?\d+(?:[.,]\d+)?)?/g;
  for (const m of s.matchAll(re)) {
    const tok = m[0].replace(/\s+/g, "");
    if (tok.includes("/")) {
      const [p, q] = tok.split("/").map((t) => Number(t.replace(",", ".")));
      if (q) out.push([p / q]);
      continue;
    }
    // Asosiy talqin: vergul — o'nli kasr belgisi. Muqobil: "1,276" — minglik ajratgich.
    const cands = [Number(tok.replace(",", "."))];
    if (/^-?\d{1,3},\d{3}$/.test(tok)) cands.push(Number(tok.replace(",", "")));
    out.push(cands);
  }
  return out;
};

const parseTime = (raw: string): number | undefined => {
  const m = /(\d{1,2})(?:\s*[:.]\s*(\d{2}))?/.exec(raw);
  if (!m) return undefined;
  const h = Number(m[1]);
  const min = m[2] ? Number(m[2]) : 0;
  if (h > 24 || min > 59) return undefined;
  return (h % 24) * 60 + min;
};

const fractionKey = (raw: string): string | undefined => {
  const m = /(-?\d+)\s*\/\s*(\d+)/.exec(raw);
  if (!m) return undefined;
  let p = Number(m[1]);
  let q = Number(m[2]);
  if (!q) return undefined;
  const g = (a: number, b: number): number => (b ? g(b, a % b) : Math.abs(a));
  const d = g(p, q);
  p /= d;
  q /= d;
  return `${p}/${q}`;
};

export const checkOpen = (spec: OpenAnswer, raw: string): boolean => {
  const text = (raw ?? "").trim();
  if (!text) return false;
  switch (spec.type) {
    case "number": {
      const tol = (spec.tol ?? 0) + EPS;
      const first = extractNumbers(text)[0];
      return !!first && first.some((v) => spec.accept.some((a) => Math.abs(v - a) <= tol));
    }
    case "between": {
      const first = extractNumbers(text)[0];
      return !!first && first.some((v) => v > spec.min + EPS && v < spec.max - EPS);
    }
    case "set": {
      // Ro'yxatda vergul ajratgich bo'ladi ("1,2,3"), shuning uchun faqat butun sonlar olinadi.
      const got = new Set([...joinThousands(text).matchAll(/\d+/g)].map((m) => Number(m[0])));
      const want = new Set(spec.accept);
      return got.size === want.size && [...want].every((w) => got.has(w));
    }
    case "time": {
      const t = parseTime(text);
      return t !== undefined && spec.accept.some((a) => parseTime(a) === t);
    }
    case "fraction": {
      const k = fractionKey(text);
      return !!k && spec.accept.some((a) => fractionKey(a) === k);
    }
  }
};

export const isAnswered = (v: AnswerValue | undefined) =>
  v !== undefined && !(typeof v === "string" && v.trim() === "");

/**
 * Test savolida tanlangan variant matni to'g'ri javob matni bilan solishtiriladi
 * (v1 bankidagi takroriy variantlar uchun), ochiq savolda esa qiymat tekshiriladi.
 */
export const isCorrect = (q: Checkable, v: AnswerValue | undefined): boolean => {
  if (!isAnswered(v)) return false;
  if (q.answer) return checkOpen(q.answer, String(v));
  return typeof v === "number" && q.options[v] === q.options[q.correctIndex];
};

/** To'g'ri javobni ko'rsatish uchun matn. */
export const answerText = (q: Checkable): string => {
  if (!q.answer) return q.options[q.correctIndex] ?? "";
  const f = (n: number) => String(n).replace(".", ",");
  const a = q.answer;
  switch (a.type) {
    case "number":
      return a.accept.map(f).join(" yoki ");
    case "between":
      return `${f(a.min)} dan katta va ${f(a.max)} dan kichik istalgan son`;
    case "set":
      return a.accept.map(f).join(", ");
    case "time":
    case "fraction":
      return a.accept.join(" yoki ");
  }
};
