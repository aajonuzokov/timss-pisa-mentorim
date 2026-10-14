// Dissertatsiyaning diagnostik testi (Ilova 1) va baholash rubrikasi (Ilova 5).
// A shakl — dissertatsiyadagi test (kirish, aniqlovchi bosqich).
// B shakl — parallel variant (yakuniy bosqich): har bir topshiriq A dagi juftining
// bloki, komponenti, kognitiv talabi va baholash mezoni bilan bir xil, faqat sonlar
// va vaziyat boshqa. Har bir topshiriq 0–2 ball, jami 40 ball.

import type { OpenAnswer } from "@/lib/answers";
import type { ComponentKey } from "@/lib/components";
import { ORALIQ } from "@/data/diagOraliq";

export const DIAG_VERSION = "d1";
export const DIAG_MAX = 40;

export type DiagBlock = { n: number; title: string; component: ComponentKey };

export const DIAG_BLOCKS: DiagBlock[] = [
  { n: 1, title: "I blok. Knowing — matematik bilim", component: "bilim" },
  { n: 2, title: "II blok. Applying — matematik bilimlarni qo'llash", component: "tafakkur" },
  { n: 3, title: "III blok. Reasoning — matematik tafakkur va mulohaza", component: "tafakkur" },
  { n: 4, title: "IV blok. MKT — matematik-metodik kompetentlik", component: "metodik" },
  {
    n: 5,
    title: "V blok. Formulate–Employ — modellashtirish va qo'llash",
    component: "savodxonlik",
  },
  {
    n: 6,
    title: "VI blok. Interpret–Reflect — talqin va refleksiv faoliyat",
    component: "refleksiya",
  },
];

/** Avtomatik tekshiriladigan son javob: to'g'ri bo'lsa `points` ball dastlabki baho sifatida qo'yiladi. */
export type DiagAuto =
  | { kind: "open"; answer: OpenAnswer; points: 1 | 2; label: string; shown: string }
  | { kind: "factor"; n: number; points: 1 | 2; label: string; shown: string };

export type DiagItem = {
  id: string;
  n: number;
  block: number;
  component: ComponentKey;
  title: string;
  q: string;
  parts?: string[];
  expected: string;
  /** Rubrika: [2 ball, 1 ball, 0 ball] mezonlari. */
  rubric: [string, string, string];
  auto?: DiagAuto;
};

const R0 = "Javob noto'g'ri yoki javob berilmagan.";

const A: DiagItem[] = [
  {
    id: "DA-1",
    n: 1,
    block: 1,
    component: "bilim",
    title: "O'nli kasrlarni taqqoslash",
    q: "Boshlang'ich sinf o'quvchisi 0,4 va 0,35 sonlarini taqqoslashda: \"35 > 4, shuning uchun 0,35 > 0,4\" deb javob berdi. O'quvchining xatosini aniqlang va to'g'ri javobni izohlang.",
    expected:
      "0,4 = 0,40; 0,40 > 0,35. Demak, 0,4 > 0,35. O'quvchi xatosi kasr qismlarini taqqoslashda raqamlar soniga emas, ularning xona qiymatiga e'tibor bermaganligi bilan bog'liq.",
    rubric: [
      "O'quvchi xatosini to'g'ri aniqlaydi, 0,4 = 0,40 ekanligini ko'rsatadi va 0,40 > 0,35 xulosasini asoslaydi.",
      "To'g'ri javobni aniqlaydi, biroq xatoning sababini yoki taqqoslash usulini to'liq izohlamaydi.",
      "Javob noto'g'ri, xato aniqlanmagan yoki javob berilmagan.",
    ],
  },
  {
    id: "DA-2",
    n: 2,
    block: 1,
    component: "bilim",
    title: "Kasr va ulush",
    q: "Kasr va ulush tushunchalari o'rtasidagi farqni izohlang. Javobingizda har bir tushunchaga sodda matematik misol keltiring.",
    expected:
      "Ulush — butunning teng qismlaridan biri yoki bir nechtasini ifodalovchi miqdoriy munosabat; kasr esa sonning yozilish shakli bo'lib, surat va maxraj orqali ifodalanadi. Masalan, tortning 4 teng qismidan 1 qismi — 1/4 ulush.",
    rubric: [
      "Kasr va ulush o'rtasidagi farqni mazmunan to'g'ri izohlaydi va mos misol keltiradi.",
      "Kasr yoki ulush tushunchalaridan birini to'g'ri izohlaydi, biroq farqni to'liq ochib bermaydi yoki misolda kamchilik mavjud.",
      "Tushunchalar noto'g'ri izohlangan yoki javob berilmagan.",
    ],
  },
  {
    id: "DA-3",
    n: 3,
    block: 1,
    component: "bilim",
    title: "Tub ko'paytuvchilarga ajratish",
    q: "48 sonini tub ko'paytuvchilarga ajrating.",
    expected: "48 = 2 × 2 × 2 × 2 × 3 = 2⁴ × 3",
    rubric: [
      "48 sonini to'liq va to'g'ri tub ko'paytuvchilarga ajratadi: 2⁴ × 3.",
      "Ajratish jarayoni qisman to'g'ri, biroq bitta arifmetik yoki yozuv xatosiga yo'l qo'yadi.",
      "Tub ko'paytuvchilarga ajratish noto'g'ri yoki bajarilmagan.",
    ],
    auto: {
      kind: "factor",
      n: 48,
      points: 2,
      label: "Yoyilma (masalan, 2·2·5 yoki 2^2·5)",
      shown: "2⁴ × 3",
    },
  },
  {
    id: "DA-4",
    n: 4,
    block: 1,
    component: "bilim",
    title: "Kvadrat va to'g'ri to'rtburchak",
    q: "Kvadrat va to'g'ri to'rtburchakning umumiy hamda farqli xossalarini ko'rsating.",
    expected:
      "Umumiy: to'rtburchak, barcha burchaklari to'g'ri. Farqi: kvadratning barcha tomonlari teng; to'g'ri to'rtburchakda faqat qarama-qarshi tomonlar teng bo'lishi shart.",
    rubric: [
      "Kamida ikkita umumiy va bitta muhim farqli xususiyatni to'g'ri ko'rsatadi.",
      "Umumiy yoki farqli xususiyatlarning faqat bir qismini to'g'ri ko'rsatadi.",
      R0,
    ],
  },
  {
    id: "DA-5",
    n: 5,
    block: 2,
    component: "tafakkur",
    title: "Foizni hisoblash",
    q: "Sinfdagi 28 nafar o'quvchining 75 foizi matematika nazorat ishini muvaffaqiyatli bajardi. Necha nafar o'quvchi nazorat ishini muvaffaqiyatli bajargan?",
    expected: "28 × 0,75 = 21. Javob: 21 nafar o'quvchi.",
    rubric: [
      "Hisoblash usuli va natija to'g'ri: 21 nafar.",
      "Hisoblash jarayoni to'g'ri yo'nalishda, biroq arifmetik xato mavjud.",
      "Noto'g'ri usul yoki noto'g'ri javob.",
    ],
    auto: {
      kind: "open",
      answer: { type: "number", accept: [21] },
      points: 2,
      label: "Javob (son)",
      shown: "21",
    },
  },
  {
    id: "DA-6",
    n: 6,
    block: 2,
    component: "tafakkur",
    title: "Perimetr",
    q: "Tomonlari 12 m va 8 m bo'lgan to'g'ri to'rtburchak shaklidagi maydon atrofiga panjara tortilishi kerak. Kerakli panjara uzunligini hisoblang.",
    expected: "P = 2 · (12 + 8) = 40 m. Javob: 40 m.",
    rubric: [
      "Perimetr formulasini to'g'ri qo'llaydi va 40 m natijani oladi.",
      "Formula yoki yechim yo'li to'g'ri, lekin hisoblashda xato mavjud.",
      "Perimetr noto'g'ri aniqlangan yoki javob berilmagan.",
    ],
    auto: {
      kind: "open",
      answer: { type: "number", accept: [40] },
      points: 2,
      label: "Javob (metr)",
      shown: "40 m",
    },
  },
  {
    id: "DA-7",
    n: 7,
    block: 2,
    component: "tafakkur",
    title: "Kasrlarni qo'shish va xatoni tahlil qilish",
    q: "O'quvchi: 3/4 + 1/2 = 4/6 deb javob berdi. O'quvchining xatosini aniqlang, to'g'ri yechimni ko'rsating va xatoning kelib chiqish sababini qisqacha izohlang.",
    expected:
      "3/4 + 1/2 = 3/4 + 2/4 = 5/4 = 1 1/4. O'quvchi maxrajlarni qo'shib yuborgan va umumiy maxrajga keltirish qoidasini qo'llamagan.",
    rubric: [
      "Xatoni aniqlaydi, kasrlarni umumiy maxrajga keltiradi va 5/4 natijani to'g'ri hosil qiladi.",
      "To'g'ri natijaga keladi, biroq xatoning sababini yoki yechim bosqichlarini to'liq izohlamaydi.",
      "Noto'g'ri yechim yoki javob berilmagan.",
    ],
    auto: {
      kind: "open",
      answer: { type: "number", accept: [1.25] },
      points: 1,
      label: "To'g'ri yig'indi (masalan, 7/8)",
      shown: "5/4",
    },
  },
  {
    id: "DA-8",
    n: 8,
    block: 2,
    component: "tafakkur",
    title: "Foizli masala",
    q: "Maktab kutubxonasiga 240 ta kitob keltirildi. Ularning 35 foizi boshlang'ich sinf o'quvchilari uchun ajratildi. Nechta kitob boshlang'ich sinflar uchun ajratilgan?",
    expected: "240 × 0,35 = 84. Javob: 84 ta kitob.",
    rubric: [
      "Hisoblash usuli va natija to'g'ri: 84 ta.",
      "Yechish usuli to'g'ri, biroq hisoblashda xato mavjud.",
      "Noto'g'ri yechim yoki javob yo'q.",
    ],
    auto: {
      kind: "open",
      answer: { type: "number", accept: [84] },
      points: 2,
      label: "Javob (son)",
      shown: "84",
    },
  },
  {
    id: "DA-9",
    n: 9,
    block: 3,
    component: "tafakkur",
    title: "Kvadrat va to'g'ri to'rtburchak munosabati",
    q: "Quyidagi fikrni matematik jihatdan asoslang: \"Har qanday kvadrat to'g'ri to'rtburchak hisoblanadi, lekin har qanday to'g'ri to'rtburchak kvadrat bo'la olmaydi.\" Javobingizda geometrik xossalardan foydalaning.",
    expected:
      "Kvadratning barcha burchaklari to'g'ri va barcha tomonlari teng bo'lgani uchun u to'g'ri to'rtburchakning barcha shartlarini qanoatlantiradi. Ammo to'g'ri to'rtburchakning barcha tomonlari teng bo'lishi shart emas. Shuning uchun har qanday kvadrat — to'g'ri to'rtburchak, ammo har qanday to'g'ri to'rtburchak — kvadrat emas.",
    rubric: [
      "Fikrni geometrik xossalar asosida to'liq va mantiqiy asoslaydi.",
      "Fikrning mazmunini tushungan, biroq asoslash yetarlicha to'liq emas.",
      "Fikr noto'g'ri talqin qilingan yoki asoslanmagan.",
    ],
  },
  {
    id: "DA-10",
    n: 10,
    block: 3,
    component: "tafakkur",
    title: "Sonlar ketma-ketligi",
    q: "Sonlar ketma-ketligini davom ettiring: 1; 4; 9; 16; 25; ... Keyingi ikkita sonni aniqlang va ketma-ketlikdagi qonuniyatni tushuntiring.",
    expected: "1², 2², 3², 4², 5² — natural sonlarning kvadratlari. Javob: 36; 49.",
    rubric: [
      "36 va 49 sonlarini to'g'ri aniqlaydi hamda kvadrat sonlar qonuniyatini izohlaydi.",
      "Keyingi sonlarni yoki qonuniyatni qisman to'g'ri aniqlaydi.",
      "Qonuniyat noto'g'ri aniqlangan yoki javob berilmagan.",
    ],
    auto: {
      kind: "open",
      answer: { type: "set", accept: [36, 49] },
      points: 1,
      label: "Keyingi ikki son (masalan, 7; 9)",
      shown: "36; 49",
    },
  },
  {
    id: "DA-11",
    n: 11,
    block: 3,
    component: "tafakkur",
    title: "Bo'lish amalining mazmuni",
    q: "Boshlang'ich sinf o'quvchisi: 24 : 6 = 6 : 24 deb hisoblaydi. Ushbu tenglik nima sababdan noto'g'ri ekanligini matematik jihatdan izohlang.",
    expected:
      "24 : 6 = 4, 6 : 24 = 0,25. Ular teng emas. Bo'lish amalida sonlarning o'rni almashtirilganda natija, odatda, o'zgaradi (bo'lish o'rin almashtirish xossasiga ega emas).",
    rubric: [
      "Tenglikning noto'g'riligini matematik hisoblash va amal xossasi orqali to'liq asoslaydi.",
      "Tenglik noto'g'ri ekanligini anglaydi, lekin sababini to'liq asoslamaydi.",
      R0,
    ],
  },
  {
    id: "DA-12",
    n: 12,
    block: 3,
    component: "tafakkur",
    title: "Ikki xil yechim usuli",
    q: "Boshlang'ich sinf o'quvchilari uchun ikki xil yechim usulida bajarish mumkin bo'lgan matematik masala tuzing. Masalaning ikki xil yechimini ko'rsating va qaysi usul nima sababdan samaraliroq ekanligini izohlang.",
    expected:
      "Masalan: 4 ta daftar 12 000 so'm turadi. 7 ta daftar qancha turadi? 1-usul: 12 000 : 4 = 3 000; 3 000 × 7 = 21 000 so'm. 2-usul: 7 : 4 = 1,75; 12 000 × 1,75 = 21 000 so'm.",
    rubric: [
      "Mazmunli matematik masala tuzadi, uni ikki xil to'g'ri usulda yechadi va usullarni taqqoslaydi.",
      "Masala va kamida bitta yechim to'g'ri, biroq ikkinchi usul yoki izoh to'liq emas.",
      "Masala mazmunan noto'g'ri yoki yechimlar matematik jihatdan noto'g'ri.",
    ],
  },
  {
    id: "DA-13",
    n: 13,
    block: 4,
    component: "metodik",
    title: "Kasrlarni o'qitish",
    q: "Boshlang'ich sinf o'quvchilariga \"Kasrlar\" mavzusini tushuntirishda qanday ko'rgazmali vositalardan foydalanasiz? Tanlagan vositangizni asoslang va undan foydalanishning qisqa metodik ketma-ketligini ko'rsating.",
    expected:
      "Doira yoki to'g'ri to'rtburchakning teng qismlarga bo'lingan modeli, kasr chizig'i (son nuri), kasrlar lentasi kabi vositalar. Vosita kasrning \"butun–qism\" munosabatini vizual anglashga yordam berishi kerak.",
    rubric: [
      "Kamida bitta mos ko'rgazmali vositani tanlaydi, undan foydalanish usulini va pedagogik sababini asoslaydi.",
      "Mos vositani ko'rsatadi, biroq undan foydalanish yoki sababini to'liq izohlamaydi.",
      "Mos bo'lmagan vosita yoki noto'g'ri metodik izoh.",
    ],
  },
  {
    id: "DA-14",
    n: 14,
    block: 4,
    component: "metodik",
    title: "Amalni izohlash",
    q: "O'quvchi: 3 × 25 = 75 amalini to'g'ri bajardi, biroq natijani qanday hosil qilganini izohlab bera olmadi. Mazkur vaziyatda o'qituvchi sifatida qanday metodik yondashuvdan foydalanasiz? Javobingizni asoslang.",
    expected:
      "25 ni 20 + 5 ko'rinishida ajratish, takroriy qo'shish, taqsimot (distributiv) xossa yoki guruhlash orqali tushuntirish: 3 × 25 = 3 × (20 + 5) = 60 + 15 = 75.",
    rubric: [
      "O'quvchining natijasi to'g'ri ekanini saqlagan holda, uni matematik mazmun bilan izohlashga yo'naltirilgan aniq metodik yondashuvni asoslaydi.",
      "Metodik yondashuv taklif qiladi, biroq matematik asoslash yoki pedagogik izoh to'liq emas.",
      "Metodik yechim noto'g'ri yoki javob berilmagan.",
    ],
  },
  {
    id: "DA-15",
    n: 15,
    block: 4,
    component: "metodik",
    title: "Jadval asosida xulosa chiqarish",
    q: 'Quyidagi topshiriqning o\'quvchilarda qaysi matematik kompetensiyalarni rivojlantirishini aniqlang: "Bir haftalik suv sarfi haqidagi jadval asosida xulosa chiqaring." Javobingizni matematik va metodik nuqtai nazardan izohlang.',
    expected:
      "Ma'lumotlarni o'qish va tahlil qilish, taqqoslash, miqdoriy munosabatlarni aniqlash va dalillarga asoslangan xulosa chiqarish. PISA nuqtai nazaridan Employ va Interpret jarayonlari.",
    rubric: [
      "Topshiriqni matematik savodxonlik, ma'lumotlarni tahlil qilish va talqin qilish bilan bog'laydi hamda metodik jihatdan asoslaydi.",
      "Rivojlantiriladigan kompetensiyani to'g'ri ko'rsatadi, biroq metodik asoslash yetarli emas.",
      "Kompetensiya noto'g'ri aniqlangan yoki javob berilmagan.",
    ],
  },
  {
    id: "DA-16",
    n: 16,
    block: 4,
    component: "metodik",
    title: "Masalaning didaktik imkoniyatlari",
    q: "Boshlang'ich sinf darsligidagi quyidagi masalaning didaktik imkoniyatlarini tahlil qiling: \"Bog'da 12 ta olma daraxti va undan 4 ta kam nok daraxti bor.\" Ushbu masala asosida o'quvchilarda qanday matematik bilim va ko'nikmalarni shakllantirish mumkinligini izohlang.",
    expected:
      'Ayirish amalini mazmunan tushunish, "4 ta kam" munosabatini anglash, taqqoslash, matnli masalani matematik ifodaga aylantirish va javobni izohlash: 12 − 4 = 8, demak, 8 ta nok daraxti bor.',
    rubric: [
      "Masalaning matematik mazmuni, o'quv maqsadi va kamida ikkita didaktik imkoniyatini to'g'ri tahlil qiladi.",
      "Masalaning asosiy matematik mazmunini tushuntiradi, biroq didaktik imkoniyatlarni to'liq ochib bermaydi.",
      "Tahlil noto'g'ri yoki javob berilmagan.",
    ],
  },
  {
    id: "DA-17",
    n: 17,
    block: 5,
    component: "savodxonlik",
    title: "Ichimlik sarfi",
    q: "Maktab oshxonasida bir kunda 180 nafar o'quvchi ovqatlanadi. Har bir o'quvchi uchun o'rtacha 0,4 litr ichimlik sarflanadi.",
    parts: [
      "Vaziyatni matematik modelga keltiring.",
      "Bir kunlik zarur ichimlik miqdorini hisoblang.",
      "Olingan natijani real vaziyat nuqtai nazaridan izohlang.",
    ],
    expected: "Model: 180 × 0,4 = 72. Javob: 72 litr; talqin (masalan, zaxira bilan tayyorlash).",
    rubric: [
      "Vaziyatni matematik ifodaga keltiradi, 72 litr natijani hisoblaydi va uni real vaziyat nuqtai nazaridan to'g'ri talqin qiladi.",
      "Matematik model va hisoblashning asosiy qismi to'g'ri, biroq birlik yoki talqinda kamchilik mavjud.",
      "Model noto'g'ri tuzilgan yoki natija noto'g'ri.",
    ],
    auto: {
      kind: "open",
      answer: { type: "number", accept: [72] },
      points: 1,
      label: "Hisoblangan miqdor (litr)",
      shown: "72 l",
    },
  },
  {
    id: "DA-18",
    n: 18,
    block: 5,
    component: "savodxonlik",
    title: "Gulzor",
    q: "Maktab hovlisining bir qismi gulzor uchun ajratildi. Gulzorning uzunligi 15 m, eni 8 m. Har bir kvadrat metrga 3 tup gul ekiladi.",
    parts: [
      "Gulzor yuzasini aniqlang.",
      "Zarur gul ko'chatlari sonini hisoblang.",
      "Hisoblash jarayonini izohlang.",
    ],
    expected: "S = 15 × 8 = 120 m²; 120 × 3 = 360. Javob: 360 tup gul ko'chati.",
    rubric: [
      "Gulzor yuzasini va zarur ko'chatlar sonini to'g'ri hisoblaydi hamda yechimni izohlaydi.",
      "Yechish algoritmi to'g'ri, biroq bitta hisoblash xatosi mavjud.",
      "Matematik model yoki hisoblash noto'g'ri.",
    ],
    auto: {
      kind: "open",
      answer: { type: "number", accept: [360] },
      points: 1,
      label: "Ko'chatlar soni",
      shown: "360",
    },
  },
  {
    id: "DA-19",
    n: 19,
    block: 6,
    component: "refleksiya",
    title: "PISA topshiriqlaridagi qiyinchiliklar",
    q: "PISA tipidagi real hayotiy vaziyatga asoslangan matematik topshiriqlarni bajarishda boshlang'ich sinf o'quvchilari duch kelishi mumkin bo'lgan kamida ikkita qiyinchilikni aniqlang. Har bir qiyinchilikni bartaraf etishning metodik yo'lini taklif qiling.",
    expected:
      "Masalan: matnli vaziyatni matematik modelga aylantira olmaslik; muhim va ikkilamchi ma'lumotlarni ajrata olmaslik; jadval yoki grafikni talqin qilishdagi qiyinchilik; natijani real kontekstga qayta talqin qila olmaslik; yechim strategiyasini mustaqil tanlay olmaslik. Har biri uchun metodik yechim.",
    rubric: [
      "Kamida ikkita aniq qiyinchilikni ko'rsatadi va har biri uchun asoslangan metodik yechim taklif qiladi.",
      "Kamida ikkita qiyinchilikni ko'rsatadi, biroq metodik yechimlardan biri yoki ikkalasi yetarlicha asoslanmagan.",
      "Qiyinchiliklar noto'g'ri aniqlangan yoki yechimlar taklif qilinmagan.",
    ],
  },
  {
    id: "DA-20",
    n: 20,
    block: 6,
    component: "refleksiya",
    title: "TIMSS va PISAning matematik tayyorgarlikka ta'siri",
    q: "TIMSS va PISA tipidagi topshiriqlardan foydalanish bo'lajak boshlang'ich sinf o'qituvchisining matematik tayyorgarligini rivojlantirishga qanday ta'sir ko'rsatishi mumkin? Javobingizni matematik bilim, matematik tafakkur, matematik savodxonlik va matematik-metodik kompetentlik nuqtai nazaridan asoslang.",
    expected:
      "TIMSSning Knowing–Applying–Reasoning yo'nalishlari bilimni egallash, qo'llash va mulohaza yuritishni; PISAning Formulate–Employ–Interpret jarayonlari real vaziyatlarni matematiklashtirish, matematik vositalardan foydalanish va natijalarni talqin qilishni rivojlantiradi. Bular bilim, tafakkur, savodxonlik va metodik kompetentlik bilan bog'lanadi.",
    rubric: [
      "TIMSS va PISA yondashuvlarining ta'sirini kamida uchta matematik tayyorgarlik komponenti bilan aniq bog'laydi va fikrini asoslaydi.",
      "Ta'sirni umumiy tarzda tushuntiradi, biroq komponentlar bilan bog'lash yoki asoslash to'liq emas.",
      "Javob mavzuga mos emas yoki asoslanmagan.",
    ],
  },
];

/** Parallel B shakl: A bilan bir xil tuzilma va mezonlar, boshqa sonlar va vaziyatlar. */
const B: DiagItem[] = [
  {
    id: "DB-1",
    n: 1,
    block: 1,
    component: "bilim",
    title: "O'nli kasrlarni taqqoslash",
    q: "O'quvchi 0,7 va 0,65 sonlarini taqqoslashda: \"65 > 7, shuning uchun 0,65 > 0,7\" deb javob berdi. O'quvchining xatosini aniqlang va to'g'ri javobni izohlang.",
    expected:
      "0,7 = 0,70; 0,70 > 0,65. Demak, 0,7 > 0,65. O'quvchi kasr qismidagi raqamlarni butun son kabi taqqoslagan, xona qiymatiga (o'ndan, yuzdan birlar) e'tibor bermagan.",
    rubric: [
      "O'quvchi xatosini to'g'ri aniqlaydi, 0,7 = 0,70 ekanligini ko'rsatadi va 0,70 > 0,65 xulosasini asoslaydi.",
      "To'g'ri javobni aniqlaydi, biroq xatoning sababini yoki taqqoslash usulini to'liq izohlamaydi.",
      "Javob noto'g'ri, xato aniqlanmagan yoki javob berilmagan.",
    ],
  },
  {
    id: "DB-2",
    n: 2,
    block: 1,
    component: "bilim",
    title: "Oddiy va o'nli kasr",
    q: "Oddiy kasr va o'nli kasr o'rtasidagi bog'liqlik va farqni izohlang. Javobingizda har bir yozuv shakliga sodda matematik misol keltiring.",
    expected:
      "Ikkalasi ham butunning qismini (bir xil sonni) ifodalaydi, farqi — yozilish shaklida: oddiy kasr surat va maxraj orqali (3/10), o'nli kasr esa maxraji 10, 100, ... bo'lgan kasrning vergulli yozuvi (0,3). Masalan, 1/2 = 5/10 = 0,5.",
    rubric: [
      "Oddiy va o'nli kasr o'rtasidagi bog'liqlik va farqni mazmunan to'g'ri izohlaydi va mos misol keltiradi.",
      "Ikki shakldan birini to'g'ri izohlaydi, biroq bog'liqlikni yoki farqni to'liq ochib bermaydi yoki misolda kamchilik mavjud.",
      "Tushunchalar noto'g'ri izohlangan yoki javob berilmagan.",
    ],
  },
  {
    id: "DB-3",
    n: 3,
    block: 1,
    component: "bilim",
    title: "Tub ko'paytuvchilarga ajratish",
    q: "72 sonini tub ko'paytuvchilarga ajrating.",
    expected: "72 = 2 × 2 × 2 × 3 × 3 = 2³ × 3²",
    rubric: [
      "72 sonini to'liq va to'g'ri tub ko'paytuvchilarga ajratadi: 2³ × 3².",
      "Ajratish jarayoni qisman to'g'ri, biroq bitta arifmetik yoki yozuv xatosiga yo'l qo'yadi.",
      "Tub ko'paytuvchilarga ajratish noto'g'ri yoki bajarilmagan.",
    ],
    auto: {
      kind: "factor",
      n: 72,
      points: 2,
      label: "Yoyilma (masalan, 2·2·5 yoki 2^2·5)",
      shown: "2³ × 3²",
    },
  },
  {
    id: "DB-4",
    n: 4,
    block: 1,
    component: "bilim",
    title: "Kvadrat va romb",
    q: "Kvadrat va rombning umumiy hamda farqli xossalarini ko'rsating.",
    expected:
      "Umumiy: to'rtburchak, barcha tomonlari teng, qarama-qarshi tomonlari parallel, diagonallari perpendikulyar. Farqi: kvadratning barcha burchaklari to'g'ri; rombda burchaklar to'g'ri bo'lishi shart emas.",
    rubric: [
      "Kamida ikkita umumiy va bitta muhim farqli xususiyatni to'g'ri ko'rsatadi.",
      "Umumiy yoki farqli xususiyatlarning faqat bir qismini to'g'ri ko'rsatadi.",
      R0,
    ],
  },
  {
    id: "DB-5",
    n: 5,
    block: 2,
    component: "tafakkur",
    title: "Foizni hisoblash",
    q: "To'garakka qatnashadigan 45 nafar o'quvchining 80 foizi olimpiadaning saralash bosqichida ishtirok etdi. Necha nafar o'quvchi saralash bosqichida ishtirok etgan?",
    expected: "45 × 0,8 = 36. Javob: 36 nafar o'quvchi.",
    rubric: [
      "Hisoblash usuli va natija to'g'ri: 36 nafar.",
      "Hisoblash jarayoni to'g'ri yo'nalishda, biroq arifmetik xato mavjud.",
      "Noto'g'ri usul yoki noto'g'ri javob.",
    ],
    auto: {
      kind: "open",
      answer: { type: "number", accept: [36] },
      points: 2,
      label: "Javob (son)",
      shown: "36",
    },
  },
  {
    id: "DB-6",
    n: 6,
    block: 2,
    component: "tafakkur",
    title: "Perimetr",
    q: "Tomonlari 15 m va 9 m bo'lgan to'g'ri to'rtburchak shaklidagi sport maydonchasi atrofiga to'r tortilishi kerak. Kerakli to'r uzunligini hisoblang.",
    expected: "P = 2 · (15 + 9) = 48 m. Javob: 48 m.",
    rubric: [
      "Perimetr formulasini to'g'ri qo'llaydi va 48 m natijani oladi.",
      "Formula yoki yechim yo'li to'g'ri, lekin hisoblashda xato mavjud.",
      "Perimetr noto'g'ri aniqlangan yoki javob berilmagan.",
    ],
    auto: {
      kind: "open",
      answer: { type: "number", accept: [48] },
      points: 2,
      label: "Javob (metr)",
      shown: "48 m",
    },
  },
  {
    id: "DB-7",
    n: 7,
    block: 2,
    component: "tafakkur",
    title: "Kasrlarni qo'shish va xatoni tahlil qilish",
    q: "O'quvchi: 2/3 + 1/4 = 3/7 deb javob berdi. O'quvchining xatosini aniqlang, to'g'ri yechimni ko'rsating va xatoning kelib chiqish sababini qisqacha izohlang.",
    expected:
      "2/3 + 1/4 = 8/12 + 3/12 = 11/12. O'quvchi suratlarni suratlarga, maxrajlarni maxrajlarga qo'shgan va umumiy maxrajga keltirish qoidasini qo'llamagan.",
    rubric: [
      "Xatoni aniqlaydi, kasrlarni umumiy maxrajga keltiradi va 11/12 natijani to'g'ri hosil qiladi.",
      "To'g'ri natijaga keladi, biroq xatoning sababini yoki yechim bosqichlarini to'liq izohlamaydi.",
      "Noto'g'ri yechim yoki javob berilmagan.",
    ],
    auto: {
      kind: "open",
      answer: { type: "number", accept: [11 / 12], tol: 1e-6 },
      points: 1,
      label: "To'g'ri yig'indi (masalan, 7/8)",
      shown: "11/12",
    },
  },
  {
    id: "DB-8",
    n: 8,
    block: 2,
    component: "tafakkur",
    title: "Foizli masala",
    q: "Maktabga 160 ta yangi darslik keltirildi. Ularning 45 foizi boshlang'ich sinflar uchun ajratildi. Nechta darslik boshlang'ich sinflar uchun ajratilgan?",
    expected: "160 × 0,45 = 72. Javob: 72 ta darslik.",
    rubric: [
      "Hisoblash usuli va natija to'g'ri: 72 ta.",
      "Yechish usuli to'g'ri, biroq hisoblashda xato mavjud.",
      "Noto'g'ri yechim yoki javob yo'q.",
    ],
    auto: {
      kind: "open",
      answer: { type: "number", accept: [72] },
      points: 2,
      label: "Javob (son)",
      shown: "72",
    },
  },
  {
    id: "DB-9",
    n: 9,
    block: 3,
    component: "tafakkur",
    title: "Kvadrat va romb munosabati",
    q: 'Quyidagi fikrni matematik jihatdan asoslang: "Har qanday kvadrat romb hisoblanadi, lekin har qanday romb kvadrat bo\'la olmaydi." Javobingizda geometrik xossalardan foydalaning.',
    expected:
      "Kvadratning barcha tomonlari teng bo'lgani uchun u rombning barcha shartlarini qanoatlantiradi. Ammo rombning burchaklari to'g'ri bo'lishi shart emas. Shuning uchun har qanday kvadrat — romb, ammo har qanday romb — kvadrat emas.",
    rubric: [
      "Fikrni geometrik xossalar asosida to'liq va mantiqiy asoslaydi.",
      "Fikrning mazmunini tushungan, biroq asoslash yetarlicha to'liq emas.",
      "Fikr noto'g'ri talqin qilingan yoki asoslanmagan.",
    ],
  },
  {
    id: "DB-10",
    n: 10,
    block: 3,
    component: "tafakkur",
    title: "Sonlar ketma-ketligi",
    q: "Sonlar ketma-ketligini davom ettiring: 2; 6; 12; 20; 30; ... Keyingi ikkita sonni aniqlang va ketma-ketlikdagi qonuniyatni tushuntiring.",
    expected:
      "1·2, 2·3, 3·4, 4·5, 5·6 — ketma-ket natural sonlar ko'paytmasi (yoki ayirmalar 4, 6, 8, 10, ... ga ortadi). Javob: 42; 56.",
    rubric: [
      "42 va 56 sonlarini to'g'ri aniqlaydi hamda qonuniyatni izohlaydi.",
      "Keyingi sonlarni yoki qonuniyatni qisman to'g'ri aniqlaydi.",
      "Qonuniyat noto'g'ri aniqlangan yoki javob berilmagan.",
    ],
    auto: {
      kind: "open",
      answer: { type: "set", accept: [42, 56] },
      points: 1,
      label: "Keyingi ikki son (masalan, 7; 9)",
      shown: "42; 56",
    },
  },
  {
    id: "DB-11",
    n: 11,
    block: 3,
    component: "tafakkur",
    title: "Ayirish amalining mazmuni",
    q: "O'quvchi: \"9 + 4 = 4 + 9 bo'lgani kabi, 9 − 4 = 4 − 9\" deb hisoblaydi. Ushbu fikr nima sababdan noto'g'ri ekanligini matematik jihatdan izohlang.",
    expected:
      "9 − 4 = 5, 4 − 9 = −5 (boshlang'ich sinfda: kichik sondan katta sonni ayirib bo'lmaydi). Ular teng emas. Qo'shish o'rin almashtirish xossasiga ega, ayirish esa ega emas.",
    rubric: [
      "Tenglikning noto'g'riligini matematik hisoblash va amal xossasi orqali to'liq asoslaydi.",
      "Tenglik noto'g'ri ekanligini anglaydi, lekin sababini to'liq asoslamaydi.",
      R0,
    ],
  },
  {
    id: "DB-12",
    n: 12,
    block: 3,
    component: "tafakkur",
    title: "Ikki xil yechim usuli",
    q: "Boshlang'ich sinf o'quvchilari uchun yig'indini songa ko'paytirish (yoki bo'lish) bilan bog'liq, ikki xil usulda yechiladigan matnli masala tuzing. Ikki xil yechimni ko'rsating va qaysi usul nima sababdan qulayroq ekanligini izohlang.",
    expected:
      "Masalan: bir qatorda 6 ta qizil va 4 ta sariq lola bor. 5 ta shunday qatorda nechta lola bor? 1-usul: (6 + 4) × 5 = 50. 2-usul: 6 × 5 + 4 × 5 = 30 + 20 = 50.",
    rubric: [
      "Mazmunli matematik masala tuzadi, uni ikki xil to'g'ri usulda yechadi va usullarni taqqoslaydi.",
      "Masala va kamida bitta yechim to'g'ri, biroq ikkinchi usul yoki izoh to'liq emas.",
      "Masala mazmunan noto'g'ri yoki yechimlar matematik jihatdan noto'g'ri.",
    ],
  },
  {
    id: "DB-13",
    n: 13,
    block: 4,
    component: "metodik",
    title: "Ko'paytirishni o'qitish",
    q: "Boshlang'ich sinf o'quvchilariga \"Ko'paytirish\" amalining ma'nosini tushuntirishda qanday ko'rgazmali vositalardan foydalanasiz? Tanlagan vositangizni asoslang va undan foydalanishning qisqa metodik ketma-ketligini ko'rsating.",
    expected:
      "Teng guruhlar (sanoq cho'plari, kubiklar), massiv (qator va ustunlar) modeli, son nurida teng sakrashlar. Vosita ko'paytirishning \"teng qo'shiluvchilar yig'indisi\" ma'nosini vizual anglashga yordam berishi kerak.",
    rubric: [
      "Kamida bitta mos ko'rgazmali vositani tanlaydi, undan foydalanish usulini va pedagogik sababini asoslaydi.",
      "Mos vositani ko'rsatadi, biroq undan foydalanish yoki sababini to'liq izohlamaydi.",
      "Mos bo'lmagan vosita yoki noto'g'ri metodik izoh.",
    ],
  },
  {
    id: "DB-14",
    n: 14,
    block: 4,
    component: "metodik",
    title: "Amalni izohlash",
    q: "O'quvchi: 4 × 15 = 60 amalini to'g'ri bajardi, biroq natijani qanday hosil qilganini izohlab bera olmadi. Mazkur vaziyatda o'qituvchi sifatida qanday metodik yondashuvdan foydalanasiz? Javobingizni asoslang.",
    expected:
      "15 ni 10 + 5 ko'rinishida ajratish, takroriy qo'shish, taqsimot xossasi yoki guruhlash orqali tushuntirish: 4 × 15 = 4 × (10 + 5) = 40 + 20 = 60.",
    rubric: [
      "O'quvchining natijasi to'g'ri ekanini saqlagan holda, uni matematik mazmun bilan izohlashga yo'naltirilgan aniq metodik yondashuvni asoslaydi.",
      "Metodik yondashuv taklif qiladi, biroq matematik asoslash yoki pedagogik izoh to'liq emas.",
      "Metodik yechim noto'g'ri yoki javob berilmagan.",
    ],
  },
  {
    id: "DB-15",
    n: 15,
    block: 4,
    component: "metodik",
    title: "Diagramma asosida xulosa chiqarish",
    q: "Quyidagi topshiriqning o'quvchilarda qaysi matematik kompetensiyalarni rivojlantirishini aniqlang: \"Sinf o'quvchilarining sevimli mevalari haqidagi ustunli diagramma asosida xulosa chiqaring.\" Javobingizni matematik va metodik nuqtai nazardan izohlang.",
    expected:
      "Diagrammadan ma'lumotni o'qish, taqqoslash (eng ko'p/eng kam, nechtaga farq), miqdoriy munosabatlarni aniqlash va dalilga asoslangan xulosa chiqarish. PISA nuqtai nazaridan Employ va Interpret jarayonlari.",
    rubric: [
      "Topshiriqni matematik savodxonlik, ma'lumotlarni tahlil qilish va talqin qilish bilan bog'laydi hamda metodik jihatdan asoslaydi.",
      "Rivojlantiriladigan kompetensiyani to'g'ri ko'rsatadi, biroq metodik asoslash yetarli emas.",
      "Kompetensiya noto'g'ri aniqlangan yoki javob berilmagan.",
    ],
  },
  {
    id: "DB-16",
    n: 16,
    block: 4,
    component: "metodik",
    title: "Masalaning didaktik imkoniyatlari",
    q: "Boshlang'ich sinf darsligidagi quyidagi masalaning didaktik imkoniyatlarini tahlil qiling: \"Savatda 15 ta olma bor, nok esa olmadan 6 ta ko'p.\" Ushbu masala asosida o'quvchilarda qanday matematik bilim va ko'nikmalarni shakllantirish mumkinligini izohlang.",
    expected:
      "Qo'shish amalini mazmunan tushunish, \"6 ta ko'p\" munosabatini anglash, taqqoslash, matnli masalani matematik ifodaga aylantirish va javobni izohlash: 15 + 6 = 21, demak, 21 ta nok bor.",
    rubric: [
      "Masalaning matematik mazmuni, o'quv maqsadi va kamida ikkita didaktik imkoniyatini to'g'ri tahlil qiladi.",
      "Masalaning asosiy matematik mazmunini tushuntiradi, biroq didaktik imkoniyatlarni to'liq ochib bermaydi.",
      "Tahlil noto'g'ri yoki javob berilmagan.",
    ],
  },
  {
    id: "DB-17",
    n: 17,
    block: 5,
    component: "savodxonlik",
    title: "Sut sarfi",
    q: "Maktabda har kuni 240 nafar boshlang'ich sinf o'quvchisiga sut beriladi. Har bir o'quvchiga 0,25 litrdan sut tarqatiladi.",
    parts: [
      "Vaziyatni matematik modelga keltiring.",
      "Bir kunlik zarur sut miqdorini hisoblang.",
      "Olingan natijani real vaziyat nuqtai nazaridan izohlang.",
    ],
    expected:
      "Model: 240 × 0,25 = 60. Javob: 60 litr; talqin (masalan, nechta 1 litrlik idish kerakligi).",
    rubric: [
      "Vaziyatni matematik ifodaga keltiradi, 60 litr natijani hisoblaydi va uni real vaziyat nuqtai nazaridan to'g'ri talqin qiladi.",
      "Matematik model va hisoblashning asosiy qismi to'g'ri, biroq birlik yoki talqinda kamchilik mavjud.",
      "Model noto'g'ri tuzilgan yoki natija noto'g'ri.",
    ],
    auto: {
      kind: "open",
      answer: { type: "number", accept: [60] },
      points: 1,
      label: "Hisoblangan miqdor (litr)",
      shown: "60 l",
    },
  },
  {
    id: "DB-18",
    n: 18,
    block: 5,
    component: "savodxonlik",
    title: "Tajriba maydonchasi",
    q: "Maktab tajriba maydonchasining uzunligi 12 m, eni 9 m. Har bir kvadrat metrga 4 tup pomidor ko'chati ekiladi.",
    parts: [
      "Maydoncha yuzasini aniqlang.",
      "Zarur ko'chatlar sonini hisoblang.",
      "Hisoblash jarayonini izohlang.",
    ],
    expected: "S = 12 × 9 = 108 m²; 108 × 4 = 432. Javob: 432 tup ko'chat.",
    rubric: [
      "Maydoncha yuzasini va zarur ko'chatlar sonini to'g'ri hisoblaydi hamda yechimni izohlaydi.",
      "Yechish algoritmi to'g'ri, biroq bitta hisoblash xatosi mavjud.",
      "Matematik model yoki hisoblash noto'g'ri.",
    ],
    auto: {
      kind: "open",
      answer: { type: "number", accept: [432] },
      points: 1,
      label: "Ko'chatlar soni",
      shown: "432",
    },
  },
  {
    id: "DB-19",
    n: 19,
    block: 6,
    component: "refleksiya",
    title: "Jadval va diagrammali topshiriqlardagi qiyinchiliklar",
    q: "Jadval yoki diagramma bilan berilgan (TIMSS va PISA tipidagi) matematik topshiriqlarni bajarishda boshlang'ich sinf o'quvchilari duch kelishi mumkin bo'lgan kamida ikkita qiyinchilikni aniqlang. Har bir qiyinchilikni bartaraf etishning metodik yo'lini taklif qiling.",
    expected:
      "Masalan: shkala bo'linmasini noto'g'ri o'qish; kerakli ustun yoki qatorni topa olmaslik; savolni jadval ma'lumoti bilan bog'lay olmaslik; \"nechtaga ko'p\" va \"necha marta ko'p\"ni farqlamaslik; xulosani dalil bilan asoslay olmaslik. Har biri uchun metodik yechim.",
    rubric: [
      "Kamida ikkita aniq qiyinchilikni ko'rsatadi va har biri uchun asoslangan metodik yechim taklif qiladi.",
      "Kamida ikkita qiyinchilikni ko'rsatadi, biroq metodik yechimlardan biri yoki ikkalasi yetarlicha asoslanmagan.",
      "Qiyinchiliklar noto'g'ri aniqlangan yoki yechimlar taklif qilinmagan.",
    ],
  },
  {
    id: "DB-20",
    n: 20,
    block: 6,
    component: "refleksiya",
    title: "O'z tayyorgarligini baholash",
    q: "TIMSS va PISA tipidagi topshiriqlar bilan ishlash tajribangiz bo'lajak boshlang'ich sinf o'qituvchisi sifatidagi matematik tayyorgarligingizni qanday o'zgartirdi (yoki o'zgartirishi mumkin)? Javobingizni matematik bilim, matematik tafakkur, matematik savodxonlik va matematik-metodik kompetentlik nuqtai nazaridan asoslang.",
    expected:
      "Har bir komponent bo'yicha aniq misol: bilim (tushunchalarni aniqroq izohlash), tafakkur (yechimni asoslash, bir necha usul), savodxonlik (real vaziyatni modellashtirish va talqin), metodik kompetentlik (o'quvchi xatosini tahlil qilish, topshiriqni darsga moslashtirish).",
    rubric: [
      "TIMSS va PISA yondashuvlarining ta'sirini kamida uchta matematik tayyorgarlik komponenti bilan aniq bog'laydi va fikrini asoslaydi.",
      "Ta'sirni umumiy tarzda tushuntiradi, biroq komponentlar bilan bog'lash yoki asoslash to'liq emas.",
      "Javob mavzuga mos emas yoki asoslanmagan.",
    ],
  },
];

export const DIAG_FORMS = { A, B, O: ORALIQ } as const;
export type DiagFormKey = keyof typeof DIAG_FORMS;

export const diagItemById = new Map([...A, ...B, ...ORALIQ].map((it) => [it.id, it] as const));

/** Shakl bo'yicha maksimal ball: har bir topshiriq 0–2 ball. */
export const diagMax = (items: DiagItem[]) => items.length * 2;

/** Ishtirokchi javobi: `j` — qisqa son javob (avtomatik tekshiriladi), `t` — yechim va izoh. */
export type DiagAnswer = { j?: string; t?: string };
