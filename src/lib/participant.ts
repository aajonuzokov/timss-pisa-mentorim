// Ishtirokchi profili va tadqiqot metamaʼlumotlari.
// Ma'lumotlar bazasi sxemasini o'zgartirmaslik uchun kod, bosqich, guruh va rozilik
// test_results.answers ichidagi "_meta" kalitiga yoziladi.

export type Stage = "mashq" | "kirish" | "oraliq" | "yakuniy";
export type Group = "" | "tajriba" | "nazorat";

export const STAGE_LABEL: Record<Stage, string> = {
  mashq: "Mashq",
  kirish: "Kirish testi (tajribadan oldin)",
  oraliq: "Oraliq diagnostika (tajriba davomida)",
  yakuniy: "Yakuniy test (tajribadan keyin)",
};

export const GROUP_LABEL: Record<Group, string> = {
  "": "Belgilanmagan",
  tajriba: "Tajriba guruhi",
  nazorat: "Nazorat guruhi",
};

export type Participant = {
  full_name: string;
  university: string;
  course: string;
  code: string;
  group: Group;
  consent: boolean;
};

export type Meta = {
  code: string;
  stage: Stage;
  group: Group;
  consent: boolean;
  /** Meta formatining versiyasi. */
  v: 1;
};

export const META_KEY = "_meta";

const PROFILE_KEY = "mentorim:participant";
const DRAFT_PREFIX = "mentorim:draft:";

/** Brauzer xotirasi ba'zi holatlarda (yashirin rejim, cheklov) ishlamaydi — xatoni yutamiz. */
const storage = {
  get(key: string): string | null {
    try {
      return typeof window === "undefined" ? null : window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* e'tiborsiz */
    }
  },
  remove(key: string) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* e'tiborsiz */
    }
  },
};

/** O'qishda adashtirmaydigan belgilar: 0/O, 1/I/L yo'q. */
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export const generateCode = () => {
  const bytes = new Uint8Array(6);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  return "M-" + [...bytes].map((b) => ALPHABET[b % ALPHABET.length]).join("");
};

/** Kodni bir xil ko'rinishga keltirish: katta harf, bo'shliqsiz, faqat harf/raqam/chiziqcha. */
export const normalizeCode = (c: string) =>
  c
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^A-Z0-9-]/g, "")
    .slice(0, 20);

export const emptyParticipant = (): Participant => ({
  full_name: "",
  university: "",
  course: "",
  code: "",
  group: "",
  consent: false,
});

export const loadProfile = (): Participant => {
  const raw = storage.get(PROFILE_KEY);
  if (!raw) return emptyParticipant();
  try {
    return { ...emptyParticipant(), ...JSON.parse(raw) };
  } catch {
    return emptyParticipant();
  }
};

export const saveProfile = (p: Participant) => storage.set(PROFILE_KEY, JSON.stringify(p));

export type Draft<T = number | string> = {
  answers: Record<string, T>;
  startedAt: string;
  page: number;
  savedAt: string;
};

export const loadDraft = <T = number | string>(key: string): Draft<T> | null => {
  const raw = storage.get(DRAFT_PREFIX + key);
  if (!raw) return null;
  try {
    const d = JSON.parse(raw) as Draft<T>;
    return d && typeof d.answers === "object" ? d : null;
  } catch {
    return null;
  }
};

export const saveDraft = <T>(key: string, d: Draft<T>) =>
  storage.set(DRAFT_PREFIX + key, JSON.stringify(d));

export const clearDraft = (key: string) => storage.remove(DRAFT_PREFIX + key);

export const isValidCode = (c: string) => /^[A-Z0-9][A-Z0-9-]{2,19}$/.test(c);

/** Saqlangan javoblardan metamaʼlumotni ajratish (eski yozuvlarda yo'q). */
export const readMeta = (answers: Record<string, unknown>): Partial<Meta> => {
  const m = answers?.[META_KEY];
  return m && typeof m === "object" ? (m as Partial<Meta>) : {};
};
