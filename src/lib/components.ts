// Bo'lajak boshlang'ich sinf o'qituvchisi matematik tayyorgarligining 5 komponenti
// (dissertatsiya, 2.1-band va Ilova 5). Har bir topshiriq bitta komponentga tegishli.

import type { TestKey } from "@/data/bank";

export type ComponentKey = "bilim" | "tafakkur" | "metodik" | "savodxonlik" | "refleksiya";

export const COMPONENTS: { key: ComponentKey; label: string; short: string; tip: string }[] = [
  {
    key: "bilim",
    label: "Matematik bilim",
    short: "Bilim",
    tip: "Tushunchalar ta'rifi, sonlar va figuralar xossalarini takrorlang; har bir tushunchaga o'quvchi tushunadigan misol tuzing.",
  },
  {
    key: "tafakkur",
    label: "Matematik tafakkur va qo'llash",
    short: "Tafakkur",
    tip: "Masalani kamida ikki usulda yeching, har bir qadamni asoslang va o'quvchi xatosining sababini tushuntirishni mashq qiling.",
  },
  {
    key: "metodik",
    label: "Matematik-metodik kompetentlik (MKT)",
    short: "MKT",
    tip: "Mavzuni o'quvchiga tushuntirish ketma-ketligini, ko'rgazmali vositani va o'quvchining tipik xatolariga javobingizni rejalang.",
  },
  {
    key: "savodxonlik",
    label: "Matematik savodxonlik va modellashtirish",
    short: "Savodxonlik",
    tip: "Real vaziyatni matematik modelga keltiring (Formulate), hisoblang (Employ) va natijani vaziyat nuqtai nazaridan talqin qiling (Interpret).",
  },
  {
    key: "refleksiya",
    label: "Refleksiv faoliyat",
    short: "Refleksiya",
    tip: "Har bir testdan keyin nima qiyin bo'lganini va keyingi qadamingizni yozing; o'z yechimingizni o'quvchi ko'zi bilan baholang.",
  },
];

export const COMPONENT_LABEL = Object.fromEntries(
  COMPONENTS.map((c) => [c.key, c.label]),
) as Record<ComponentKey, string>;

/** Bank testlari uchun komponent: TIMSS Bilish — bilim; Qo'llash va Mulohaza — tafakkur; PISA — savodxonlik. */
export const componentOf = (
  testKey: TestKey,
  q: { id: string; component?: ComponentKey },
): ComponentKey | undefined => {
  if (q.component) return q.component;
  if (testKey === "knowing" || testKey === "r-knowing") return "bilim";
  if (testKey === "pisa" || testKey === "r-pisa") return "savodxonlik";
  if (["applying", "reasoning", "r-applying", "r-reasoning"].includes(testKey)) return "tafakkur";
  if (testKey.startsWith("sinov-")) {
    if (q.id.startsWith("RK-")) return "bilim";
    if (q.id.startsWith("RP-")) return "savodxonlik";
    return "tafakkur";
  }
  return undefined;
};

export type ComponentScores = Partial<Record<ComponentKey, { score: number; max: number }>>;

export const componentPct = (c?: { score: number; max: number }) =>
  c && c.max ? Math.round((c.score / c.max) * 100) : NaN;
