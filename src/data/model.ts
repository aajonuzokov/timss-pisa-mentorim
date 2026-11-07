// Avtoreferatning 1-rasmi (dissertatsiyada 2.1-rasm): TIMSS, PISA va MKT integratsiyasiga
// asoslangan adaptiv strukturaviy-funksional model. Matnlar avtoreferat (Jizzax, 2026) va
// dissertatsiyadan olingan; kvadrat qavsdagi raqamlar — dissertatsiyadagi adabiyotlar raqamlari.

export const MODEL_TITLE =
  "TIMSS, PISA va MKT integratsiyasiga asoslangan bo'lajak boshlang'ich sinf o'qituvchilarining matematik tayyorgarligini oshirishning adaptiv strukturaviy-funksional modeli";

export type PlatformLink = { label: string; to: string; status: "ishlaydi" | "rejada" };
export type Item = { name: string; text: string; source?: string; links?: PlatformLink[] };
export type Section = {
  title: string;
  lead?: string;
  items?: Item[];
  steps?: Item[];
  table?: { head: string[]; rows: string[][] };
  note?: string;
};
export type BlockSlug =
  | "maqsadli"
  | "metodologik"
  | "mazmuniy"
  | "texnologik"
  | "diagnostik"
  | "natijaviy";
export type Block = {
  slug: BlockSlug;
  n: number;
  title: string;
  /** Sxemadagi qisqa nom. */
  label: string;
  /** Blokning tizimdagi funksiyasi (avtoreferat, 2.1-band). */
  func: string;
  /** Blokning vazifasi — bir-ikki gap. */
  lead: string;
  sources: string;
  sections: Section[];
};

const L = (
  label: string,
  to: string,
  status: PlatformLink["status"] = "ishlaydi",
): PlatformLink => ({
  label,
  to,
  status,
});

// --- 1-rasm: sxemaning umumiy elementlari -------------------------------------------------

/** Ijtimoiy buyurtma — modelning boshlang'ich asosi. */
export const SOCIAL_ORDER: Item[] = [
  {
    name: "Normativ-huquqiy asos",
    text: "O'RQ-637-son \"Ta'lim to'g'risida\"gi Qonun; PF-5847, PF-21-son Farmonlar; VMning 997-son qarori.",
  },
  {
    name: "Xalqaro talablar",
    text: "TIMSS va PISA tadqiqotlarida o'quvchilarning matematik savodxonligiga qo'yilayotgan talablar.",
  },
  {
    name: "Kasbiy ehtiyoj",
    text: "Xalqaro baholash topshiriqlari asosida o'qita oladigan boshlang'ich sinf o'qituvchisi.",
  },
];

export const MODEL_GOAL =
  "Bo'lajak boshlang'ich sinf o'qituvchilarining matematik tayyorgarligini TIMSS, PISA va MKT integratsiyasi asosida oshirish.";

/** Maqsadli blokdagi 4 ta pedagogik vazifa. */
export const MODEL_TASKS: Item[] = [
  {
    name: "Vazifa 1",
    text: "Matematik bilimlarni TIMSS mazmuniy va kognitiv sohalari asosida chuqurlashtirish.",
    links: [L("Matematik bilim moduli", "/modullar/bilim"), L("TIMSS topshiriqlari", "/timss")],
  },
  {
    name: "Vazifa 2",
    text: "Real vaziyatlarni matematiklashtirish va natijani talqin qilish (PISA) ko'nikmalarini shakllantirish.",
    links: [L("Savodxonlik moduli", "/modullar/savodxonlik"), L("PISA topshiriqlari", "/pisa")],
  },
  {
    name: "Vazifa 3",
    text: "Xalqaro baholash topshiriqlarini MKT asosida tanlash, tahlil qilish va moslashtirishga o'rgatish.",
    links: [L("MKT moduli", "/modullar/metodik"), L("Amaliy metodik ishlar", "/amaliyot")],
  },
  {
    name: "Vazifa 4",
    text: "O'z faoliyatini diagnostika natijalari asosida refleksiv baholash va takomillashtirishni rivojlantirish.",
    links: [L("Refleksiya moduli", "/modullar/refleksiya"), L("E-portfolio", "/portfolio")],
  },
];

export const APPROACHES: [string, string][] = [
  ["Tizimli", "komponentlarni yaxlit tizim sifatida qarash"],
  ["Kompetensiyaviy", "natijaga yo'naltirilganlik"],
  ["Faoliyatli", "amaliy faoliyatga tayanish"],
  ["Integrativ", "TIMSS, PISA va MKT imkoniyatlarini birlashtirish"],
  ["Adaptiv", "ta'limni individual ehtiyojlarga moslashtirish"],
  ["Refleksiv", "o'z faoliyatini tahlil qilish va takomillashtirish"],
];

export const PRINCIPLES = [
  "ilmiylik",
  "uzviylik",
  "kontekstuallik",
  "individuallashtirish",
  "natijaviylik",
];

/** Integratsiya asosi: xalqaro konsepsiya → rivojlanadigan komponent. */
export const INTEGRATION: { name: string; process: string; target: string }[] = [
  {
    name: "TIMSS",
    process: "Knowing–Applying–Reasoning",
    target: "matematik bilim, matematik tafakkur",
  },
  { name: "PISA", process: "Formulate–Employ–Interpret", target: "matematik savodxonlik" },
  {
    name: "MKT",
    process: "mazmuniy + pedagogik bilim",
    target: "matematik-metodik kompetentlik, refleksiv faoliyat",
  },
];

export const FORMS = ["ma'ruza", "amaliy mashg'ulot", "mustaqil ta'lim", "pedagogik amaliyot"];

export const METHODS: PlatformLink[] = [
  L("Case-study", "/amaliyot/xatolar"),
  L("Lesson Study", "/amaliyot/lesson-study"),
  L("Microteaching", "/amaliyot/microteaching"),
  L("Muammoli ta'lim (PBL)", "/modullar/tafakkur"),
  L("Matematik modellashtirish", "/modullar/savodxonlik"),
  L("Loyiha metodi", "/amaliyot/dars-ishlanmasi"),
];

export const DIGITAL_TOOLS: PlatformLink[] = [
  L("Mentorim platformasi", "/"),
  L("E-Portfolio", "/portfolio"),
  L("Dashboard", "/monitoring"),
  L("Learning Analytics", "/monitoring"),
];

/** Tashkiliy-texnologik blokdagi uch bosqich. */
export const STAGES: Item[] = [
  {
    name: "Motivatsion-yo'naltiruvchi",
    text: "Kirish diagnostikasi, TIMSS/PISA talablari bilan tanishtirish.",
    links: [L("Kirish testi (A)", "/sinov"), L("TIMSS", "/timss"), L("PISA", "/pisa")],
  },
  {
    name: "Faoliyatli-amaliy",
    text: "Topshiriqlar banki asosida mashg'ulotlar, metodik loyihalash.",
    links: [L("Variativ modul", "/modullar"), L("Amaliy metodik ishlar", "/amaliyot")],
  },
  {
    name: "Refleksiv-baholovchi",
    text: "E-Portfolio, o'zini o'zi baholash, yakuniy diagnostika.",
    links: [L("E-portfolio", "/portfolio"), L("Yakuniy test (B)", "/sinov")],
  },
];

/** Diagnostik-monitoring blok: komponent → mezon → ko'rsatkichlar (1-rasm). */
export const CRITERIA: { component: string; criterion: string; indicators: string }[] = [
  {
    component: "Matematik bilim",
    criterion: "kognitiv",
    indicators:
      "tushunchalar, qoidalar va algoritmlarni bilishi hamda qo'llashi (TIMSS: Knowing, Applying)",
  },
  {
    component: "Matematik tafakkur",
    criterion: "tafakkur-faoliyat",
    indicators:
      "mulohaza yuritishi, yechimni asoslashi, nostandart masalalarni yechishi (TIMSS: Reasoning)",
  },
  {
    component: "Matematik savodxonlik",
    criterion: "matematik savodxonlik",
    indicators: "real vaziyatni matematik modelga keltirishi, natijani talqin qilishi (PISA)",
  },
  {
    component: "Matematik-metodik kompetentlik",
    criterion: "matematik-metodik",
    indicators:
      "topshiriqni tanlashi, o'quvchi xatosini tahlil qilishi, metodik qaror qabul qilishi (MKT)",
  },
  {
    component: "Refleksiv faoliyat",
    criterion: "refleksiv",
    indicators:
      "o'z faoliyatini tahlil qilishi, rivojlanish ehtiyojini aniqlashi va rejalashtirishi",
  },
];

/** Darajalar va adaptiv trayektoriya: diagnostika darajasi → beriladigan topshiriqlar turi. */
export const TRAJECTORY: { level: string; tasks: string }[] = [
  { level: "past", tasks: "qo'llab-quvvatlovchi topshiriqlar" },
  { level: "o'rta", tasks: "rivojlantiruvchi topshiriqlar" },
  { level: "yuqori", tasks: "ijodiy-tadqiqotchilik topshiriqlari" },
];

export const DIAG_TOOLS: PlatformLink[] = [
  L("diagnostik test", "/sinov"),
  L("kuzatish", "/amaliyot/microteaching"),
  L("so'rovnoma", "/sinov"),
  L("ekspert baholash", "/kabinet"),
  L("Mentorim", "/monitoring"),
];

/** Ishlash mexanizmi (diagnostik-monitoring blok). */
export const MECHANISM: { name: string; text: string; to: string }[] = [
  {
    name: "Diagnostika",
    text: "Kirish diagnostikasi: Ilova 1 testi (A shakl), 40 ball",
    to: "/sinov",
  },
  {
    name: "Individuallashtirish",
    text: 'Har bir komponent darajasiga qarab "Mening yo\'lim" tuziladi',
    to: "/portfolio",
  },
  {
    name: "Faoliyat",
    text: "Variativ modul, TIMSS/PISA topshiriqlari, amaliy metodik ishlar",
    to: "/modullar",
  },
  { name: "Monitoring", text: "E-Portfolio, Dashboard va Learning Analytics", to: "/monitoring" },
  { name: "Feedback", text: "Rubrika bo'yicha baho, o'qituvchi izohi", to: "/kabinet" },
  { name: "Refleksiya", text: "Refleksiya yozuvlari, o'z-o'zini baholash", to: "/portfolio" },
  { name: "Korreksiya", text: "Yangi natija asosida yo'l qayta tuziladi", to: "/portfolio" },
];

/** Modelning samarali ishlashini ta'minlovchi pedagogik shart-sharoitlar. */
export const CONDITIONS: { text: string; block: string; slug: BlockSlug | "" }[] = [
  {
    text: "TIMSS/PISA topshiriqlarini MKT asosida o'quv jarayoniga bosqichma-bosqich integratsiyalash",
    block: "mazmuniy blok",
    slug: "mazmuniy",
  },
  {
    text: "Variativ modulni amaliy mashg'ulot, mustaqil ta'lim va pedagogik amaliyot bilan uzviy bog'lash",
    block: "tashkiliy-texnologik blok",
    slug: "texnologik",
  },
  {
    text: "Diagnostika natijalariga ko'ra individual rivojlanish trayektoriyasini belgilash",
    block: "diagnostik-monitoring blok",
    slug: "diagnostik",
  },
  {
    text: "Mentorim platformasi asosida raqamli monitoring va doimiy teskari aloqa muhitini yaratish",
    block: "barcha bloklar",
    slug: "",
  },
];

export const MODEL_RESULT =
  "Bo'lajak boshlang'ich sinf o'qituvchilari matematik tayyorgarligining besh komponent bo'yicha rivojlanganlik darajasi oshadi — xalqaro baholash talablariga mos o'qitishga kasbiy-metodik jihatdan tayyor mutaxassis.";

// --- Bloklar -------------------------------------------------------------------------------
export const BLOCKS: Block[] = [
  {
    slug: "maqsadli",
    n: 1,
    title: "Maqsadli blok",
    label: "Maqsadli blok",
    func: "Yo'naltiruvchi",
    lead: "Tizim hosil qiluvchi element: matematik tayyorgarlikni TIMSS, PISA va MKT integratsiyasi asosida oshirish maqsadini hamda uni amalga oshirishga yo'naltirilgan pedagogik vazifalarni belgilaydi. Boshlang'ich asosi — ijtimoiy buyurtma.",
    sources: "[6; 10; 22; 24]",
    sections: [
      {
        title: "Maqsad",
        lead: MODEL_GOAL,
        note: "Matematik tayyorgarlik matematik bilim, matematik tafakkur, matematik savodxonlik, matematik-metodik kompetentlik va refleksiv faoliyatdan iborat besh komponentli integrativ tuzilma sifatida qaraladi [6; 10; 22; 24].",
      },
      {
        title: "Pedagogik vazifalar",
        lead: "Har bir vazifa platformada o'z vositasiga ega.",
        items: MODEL_TASKS,
      },
      {
        title: "Ijtimoiy buyurtma",
        lead: "Modelning boshlang'ich asosi: ta'lim sohasidagi normativ hujjatlar, TIMSS va PISA talablari hamda xalqaro baholash topshiriqlari asosida o'qita oladigan o'qituvchiga bo'lgan kasbiy ehtiyoj.",
        items: SOCIAL_ORDER,
      },
      {
        title: "Konseptual yadro",
        items: [
          {
            name: "TIMSS",
            text: "Bilimni egallash, qo'llash va asoslashni ta'minlaydi.",
            source: "[6]",
          },
          {
            name: "PISA",
            text: "Matematik bilimlarni real hayotiy muammolarni hal etishda qo'llashni ta'minlaydi.",
            source: "[10]",
          },
          {
            name: "MKT",
            text: "Mazkur bilimlarni pedagogik faoliyatga transformatsiya qilishni ta'minlaydi.",
            source: "[24]",
          },
        ],
      },
    ],
  },
  {
    slug: "metodologik",
    n: 2,
    title: "Nazariy-metodologik blok",
    label: "Nazariy-metodologik blok",
    func: "Asoslovchi",
    lead: "Modelning ilmiy asosini belgilaydi: tizimli, kompetensiyaviy, faoliyatli, integrativ, adaptiv va refleksiv yondashuvlar hamda ilmiylik, uzviylik, kontekstuallik, individuallashtirish va natijaviylik tamoyillari. Integratsiya asosini TIMSS, PISA va MKT tashkil etadi.",
    sources: "[14; 22–24; 31; 40–43]",
    sections: [
      {
        title: "Yondashuvlar",
        items: [
          {
            name: "Tizimli yondashuv",
            text: "Matematik tayyorgarlikni alohida bilim va ko'nikmalar yig'indisi emas, balki maqsad, mazmun, metodlar, texnologiyalar, diagnostika va natijalardan iborat yaxlit pedagogik tizim sifatida qaraydi. Modelning olti bloki shu asosda yagona funksional tizimga birlashadi. Platformada: har bir blok o'z sahifasi va vositasiga ega, bloklar bir-biriga havola orqali bog'langan.",
            source: "[14; 31]",
            links: [L("Model sxemasi", "/model")],
          },
          {
            name: "Kompetensiyaviy yondashuv",
            text: "Ta'lim natijasini bilim hajmi bilan emas, balki bilimlarni kasbiy va amaliy vaziyatlarda qo'llash qobiliyati bilan bog'laydi. TIMSS Knowing–Applying–Reasoning va PISA Formulate–Employ–Interpret jarayonlari natijaviy indikatorlar sifatida qabul qilinadi. Platformada: diagnostik test va topshiriqlar shu jarayonlar bo'yicha tuzilgan.",
            source: "[6; 10; 15]",
            links: [L("Diagnostik test", "/sinov")],
          },
          {
            name: "Faoliyatli yondashuv",
            text: "Matematik tayyorgarlik amaliy faoliyat orqali shakllanadi: talaba topshiriqni yechadi, tahlil qiladi, moslashtiradi va darsga aylantiradi. Nazariy asosi — A.N.Leontyevning faoliyat nazariyasi va V.V.Davydovning o'quv faoliyati va umumlashtirish haqidagi qarashlari. Platformada: modullardagi mashqlar, amaliy metodik ishlar (xatolar tahlili, moslashtirish, dars ishlanmasi, microteaching).",
            source: "[8]",
            links: [L("Amaliy metodik ishlar", "/amaliyot")],
          },
          {
            name: "Integrativ yondashuv",
            text: "Tadqiqotning metodologik yangiligi shu yondashuvda: TIMSS va PISA kompetensiyalari MKT modelining kasbiy-metodik bilimlari bilan uyg'unlashtiriladi. Natijada 5 komponent alohida emas, yagona kasbiy tayyorgarlik tizimining o'zaro bog'liq elementlari sifatida rivojlantiriladi. Platformada: har bir topshiriqda o'quvchi uchun maqsad, bo'lajak o'qituvchi uchun metodik maqsad va darsda qo'llash usuli.",
            source: "[6; 10; 22; 24]",
            links: [L("Rasmiy topshiriqlar", "/rasmiy")],
          },
          {
            name: "Adaptiv yondashuv",
            text: "Ta'lim jarayonini talabaning individual tayyorgarligi, ehtiyojlari va o'zlashtirish dinamikasiga moslashtiradi: diagnostika natijasiga ko'ra topshiriqlar, metodik yordam va mazmun differensiallashtiriladi. Nazariy asosi: P.Brusilovskiyning adaptiv ta'lim texnologiyalari. Platformada: kirish diagnostikasidan keyin \"Mening yo'lim\" — har bir komponent darajasiga qarab modul tayinlanadi.",
            source: "[40; 41]",
            links: [L("Mening yo'lim", "/portfolio"), L("Variativ modul", "/modullar")],
          },
          {
            name: "Refleksiv yondashuv",
            text: "Talabaning o'z faoliyati va natijalarini tahlil qilishi, xatolarini aniqlashi va keyingi faoliyatini takomillashtirishiga yo'naltiriladi. Nazariy asosi — D.Schönning refleksiv amaliyot konsepsiyasi; raqamli muhitda feedback, Learning Analytics va E-Portfolio qo'llab-quvvatlaydi. Platformada: har bir testdan keyin refleksiya, o'z-o'zini baholash, o'qituvchi izohi.",
            source: "[40–43]",
            links: [L("E-portfolio", "/portfolio")],
          },
        ],
      },
      {
        title: "Tamoyillar",
        lead: "Avtoreferatda belgilangan beshta tamoyil va ularning platformadagi ifodasi.",
        items: [
          {
            name: "Ilmiylik",
            text: "Mazmun xalqaro baholash dasturlarining rasmiy asoslari (TIMSS 2023, PISA 2022 Frameworks) va MKT tadqiqotlariga tayanadi; rasmiy namunaviy topshiriqlar manbasi bilan beriladi.",
            links: [L("Rasmiy topshiriqlar", "/rasmiy"), L("Elektron kutubxona", "/kutubxona")],
          },
          {
            name: "Uzviylik",
            text: "Komponentlar ketma-ket bog'lanadi: bilim → tafakkur → savodxonlik → metodik kompetentlik → refleksiya; modullar shu tartibda joylashgan.",
            links: [L("Variativ modul", "/modullar")],
          },
          {
            name: "Kontekstuallik",
            text: "Topshiriqlar real hayotiy va kasbiy-pedagogik vaziyatlarga asoslanadi (PISA konteksti, o'quvchi ishlari, dars vaziyatlari).",
            links: [L("PISA", "/pisa"), L("O'quvchi ishlari banki", "/amaliyot/xatolar")],
          },
          {
            name: "Individuallashtirish",
            text: "Diagnostika natijasiga ko'ra har bir komponent bo'yicha alohida yo'l: qo'llab-quvvatlovchi, rivojlantiruvchi yoki ijodiy-tadqiqotchilik topshiriqlari.",
            links: [L("Mening yo'lim", "/portfolio")],
          },
          {
            name: "Natijaviylik",
            text: "Har bir bosqich o'lchanadigan natija bilan tugaydi: test bali, rubrika bahosi, E-Portfoliodagi ish.",
            links: [L("Monitoring", "/monitoring")],
          },
        ],
      },
      {
        title: "Integratsiya asosi",
        table: {
          head: ["Konsepsiya", "Jarayonlar", "Rivojlanadigan komponentlar"],
          rows: INTEGRATION.map((r) => [r.name, r.process, r.target]),
        },
      },
      {
        title: "MKT — integratsiyalovchi omil",
        lead: "MKT modeli matematik mazmunni chuqur tushunish bilan uni pedagogik faoliyatda samarali qo'llash o'rtasidagi bog'liqlikni ta'minlaydi. Shu jihatdan u TIMSS va PISA kompetensiyalarini bo'lajak boshlang'ich sinf o'qituvchisining kasbiy-metodik faoliyatiga transformatsiya qilishning nazariy asosidir [22; 23; 24].",
        table: {
          head: ["Konsepsiya", "Nima beradi", "Modelda"],
          rows: [
            [
              "TIMSS",
              "Knowing, Applying, Reasoning — bilish, qo'llash, mulohaza",
              "Bilim va tafakkur komponentlari",
            ],
            [
              "PISA",
              "Formulate, Employ, Interpret — real vaziyatni matematiklashtirish",
              "Savodxonlik komponenti",
            ],
            [
              "MKT",
              "O'qitish uchun matematik bilim (SMK va PCK)",
              "Matematik-metodik kompetentlik; barcha komponentlarni o'qitish faoliyatiga ulaydi",
            ],
          ],
        },
      },
      {
        title: "Nazariy manbalar",
        table: {
          head: ["Muallif", "G'oya", "Modeldagi o'rni"],
          rows: [
            [
              "D.L.Ball, M.H.Thames, G.Phelps",
              "Mathematical Knowledge for Teaching",
              "Integrativ yondashuv, metodik kompetentlik [24]",
            ],
            [
              "L.S.Shulman",
              "Pedagogik mazmuniy bilim (PCK)",
              "Matematik-metodik kompetentlik [22; 23]",
            ],
            ["A.Schoenfeld", "Matematik muammolarni hal etish", "Matematik tafakkur [16]"],
            ["J.Boaler", "Matematik fikrlash", "Matematik tafakkur [17]"],
            ["D.Schön", "Refleksiv amaliyot", "Refleksiv yondashuv [40]"],
            [
              "A.N.Leontyev, V.V.Davydov",
              "Faoliyatga yo'naltirilgan ta'lim, umumlashtirish",
              "Faoliyatli yondashuv",
            ],
            ["P.Brusilovskiy", "Adaptiv ta'lim texnologiyalari", "Adaptiv yondashuv"],
            [
              "J.Kilpatrick, M.Niss, T.Højgaard",
              "Matematik kompetensiyalar",
              "Komponentlar tarkibi",
            ],
          ],
        },
      },
    ],
  },
  {
    slug: "mazmuniy",
    n: 3,
    title: "Mazmuniy blok",
    label: "Mazmuniy blok",
    func: "Mazmun hosil qiluvchi",
    lead: "Matematik tayyorgarlikning besh komponentini va ularni rivojlantirishning mazmuniy ta'minotini qamrab oladi: \"Boshlang'ich sinfda xalqaro baholash metodikasi\" variativ moduli hamda TIMSS va PISA yondashuvlariga asoslangan kompetensiyaviy topshiriqlar banki.",
    sources: "[13–19; 22–28; 40–43]",
    sections: [
      {
        title: "Matematik tayyorgarlikning 5 komponenti",
        items: [
          {
            name: "1. Matematik bilim",
            text: "Matematik tushunchalar, qonuniyatlar, algoritmlar va ular o'rtasidagi bog'lanishlarni egallash. TIMSS Knowing va Applying jarayonlari hamda MKTning Subject Matter Knowledge (SMK) tarkibi bilan bog'lanadi.",
            source: "[6; 24]",
            links: [L("Bilim moduli", "/modullar/bilim")],
          },
          {
            name: "2. Matematik tafakkur",
            text: "Matematik vaziyatlarni tahlil qilish, mantiqiy xulosa chiqarish, asoslash va muammolarni hal etish. Schoenfeldning muammolarni hal etish yondashuvi va Boalerning matematik fikrlash haqidagi qarashlari bilan asoslanadi; TIMSS Reasoning jarayoni bilan bog'lanadi.",
            source: "[6; 10; 16; 17]",
            links: [L("Tafakkur moduli", "/modullar/tafakkur")],
          },
          {
            name: "3. Matematik savodxonlik",
            text: "Matematik bilimlarni real vaziyatlarda qo'llash, muammoni matematik shaklda ifodalash, yechimdan foydalanish va natijani talqin qilish. PISA Formulate–Employ–Interpret jarayonlari bilan bevosita bog'lanadi.",
            source: "[10; 18; 19]",
            links: [L("Savodxonlik moduli", "/modullar/savodxonlik")],
          },
          {
            name: "4. Matematik-metodik kompetentlik",
            text: "Matematik mazmunni o'quvchilarning yosh va bilish xususiyatlariga moslashtirish, topshiriqlarni tanlash, o'qitish strategiyalarini belgilash, o'quvchilarning matematik fikrlashini tahlil qilish va baholash. Nazariy asosi — Shulmanning PCK konsepsiyasi va Ball, Thames, Phelpsning MKT modeli (mazmuniy va pedagogik bilimlar).",
            source: "[22–28]",
            links: [L("MKT moduli", "/modullar/metodik")],
          },
          {
            name: "5. Refleksiv faoliyat",
            text: "O'z pedagogik faoliyati va natijalarini tahlil qilish, feedbackdan foydalanish, kamchiliklarni aniqlash va keyingi rivojlanish yo'nalishini belgilash. MKT va refleksiv yondashuv (Schön), Learning Analytics, feedback va E-Portfolio bilan asoslanadi.",
            source: "[40–43]",
            links: [L("Refleksiya moduli", "/modullar/refleksiya")],
          },
        ],
        note: "Komponentlar o'zaro integratsiyalashgan tizim sifatida rivojlanadi: matematik bilim tafakkur uchun mazmuniy asos yaratadi; tafakkur bilimlarni savodxonlik faoliyatiga olib keladi; savodxonlik metodik kompetentlik orqali pedagogik faoliyatga transformatsiyalanadi; refleksiv faoliyat barcha jarayonlarni tahlil qilish va takomillashtirishni ta'minlaydi.",
      },
      {
        title: "Mazmuniy ta'minot",
        items: [
          {
            name: '"Boshlang\'ich sinfda xalqaro baholash metodikasi" variativ moduli',
            text: "Besh komponentga mos besh tarkibiy modul; 60 soat (20 soat amaliy mashg'ulot, 40 soat mustaqil ta'lim). TIMSS topshiriqlari asosan bilim va tafakkurni, PISA topshiriqlari savodxonlikni, MKT elementlari metodik kompetentlik va refleksiv faoliyatni rivojlantiradi.",
            links: [L("Variativ modul", "/modullar")],
          },
          {
            name: "Kompetensiyaviy topshiriqlar banki",
            text: "250 ta TIMSS va 150 ta PISA tipidagi mashq topshiriqlari hamda 96 ta rasmiy namunaviy topshiriq. Topshiriqlar past, o'rta va yuqori murakkablik darajalari bo'yicha tabaqalashtirilgan: talaba diagnostika natijasiga ko'ra o'z darajasidan boshlab keyingi darajaga o'tadi.",
            links: [L("TIMSS", "/timss"), L("PISA", "/pisa"), L("Rasmiy topshiriqlar", "/rasmiy")],
          },
        ],
      },
      {
        title: "TIMSS mazmuniy va kognitiv sohalari",
        table: {
          head: ["", "4-sinf (boshlang'ich sinf o'qituvchisi uchun asosiy)", "8-sinf"],
          rows: [
            [
              "Mazmuniy sohalar",
              "Son; O'lchash va geometriya; Ma'lumotlar",
              "Son; Algebra; Geometriya; Ma'lumotlar va ehtimollik",
            ],
            [
              "Kognitiv sohalar",
              "Knowing (bilish), Applying (qo'llash), Reasoning (mulohaza)",
              "Knowing, Applying, Reasoning",
            ],
          ],
        },
      },
      {
        title: "PISA matematik savodxonligi",
        table: {
          head: ["Jarayonlar", "Mazmun kategoriyalari"],
          rows: [
            ["Formulate — vaziyatni matematik shaklga keltirish", "Miqdor"],
            [
              "Employ — matematik tushuncha va protseduralarni qo'llash",
              "O'zgarish va munosabatlar",
            ],
            ["Interpret — natijani real kontekstda talqin qilish va baholash", "Fazo va shakl"],
            ["", "Noaniqlik va ma'lumotlar"],
          ],
        },
        note: "PISA 15 yoshli o'quvchilarni baholaydi. Platformada PISA topshiriqlari boshlang'ich sinf o'quvchisiga emas, bo'lajak o'qituvchining o'ziga beriladi: maqsad — real vaziyatga asoslangan topshiriqlarni tushunish va ularni boshlang'ich sinfga moslashtirish.",
      },
      {
        title: "MKT tarkibi (Ball, Thames, Phelps) va boshlang'ich sinfdan misollar",
        table: {
          head: ["Tarkib", "Mazmuni", "Boshlang'ich sinfdan misol"],
          rows: [
            [
              "CCK — umumiy mazmuniy bilim",
              "Har qanday savodli odam biladigan matematika",
              "0,4 va 0,35 ni to'g'ri taqqoslash",
            ],
            [
              "SCK — maxsus mazmuniy bilim",
              "Faqat o'qitish uchun kerak bo'ladigan matematik bilim",
              '"0,35 > 0,4" javobidagi xato qayerdan kelganini matematik izohlash',
            ],
            [
              "HCK — gorizont bilimi",
              "Mavzuning keyingi sinflardagi davomini bilish",
              "Kasr tushunchasi o'nli kasr va foizga qanday ulanishini bilish",
            ],
            [
              "KCS — mazmun va o'quvchi",
              "O'quvchilar qanday o'ylashini, qayerda adashishini bilish",
              "O'quvchilar 3/4 + 1/2 da maxrajlarni qo'shib yuborishini oldindan bilish",
            ],
            [
              "KCT — mazmun va o'qitish",
              "Tushuntirish ketma-ketligi, misol va vosita tanlash",
              "Kasrni kasrlar lentasi bilan tushuntirish ketma-ketligini tanlash",
            ],
            [
              "KCC — mazmun va o'quv dasturi",
              "Mavzuning dasturdagi o'rni va materiallar",
              "Mavzu qaysi sinfda va qaysi mavzudan keyin o'tilishini bilish",
            ],
          ],
        },
        note: "SMK = CCK + SCK + HCK; PCK = KCS + KCT + KCC [24].",
      },
    ],
  },
  {
    slug: "texnologik",
    n: 4,
    title: "Tashkiliy-texnologik blok",
    label: "Tashkiliy-texnologik blok",
    func: "Amalga oshiruvchi (protsessual)",
    lead: "Model mazmunini amalga oshirish shakllari, metod va texnologiyalari hamda vositalarini belgilaydi. Jarayon uch bosqichda kechadi: motivatsion-yo'naltiruvchi, faoliyatli-amaliy va refleksiv-baholovchi.",
    sources: "[14; 20; 24; 41; 43–48]",
    sections: [
      {
        title: "Amalga oshirish bosqichlari",
        steps: STAGES,
      },
      {
        title: "Shakllar",
        lead: "Variativ modul \"Boshlang'ich ta'limda matematika o'qitish metodikasi\" fanining amaliy mashg'ulotlari, mustaqil ta'lim va pedagogik amaliyot jarayoniga integratsiyalashgan holda amalga oshiriladi.",
        table: {
          head: ["Shakl", "Platformada"],
          rows: [
            ["Ma'ruza", "Modullarning nazariy qismi, metodik tavsiyalar, o'quv qo'llanma"],
            [
              "Amaliy mashg'ulot (20 soat)",
              "Namunaviy tahlil, TIMSS/PISA topshiriqlari, Case-study, Lesson Study",
            ],
            [
              "Mustaqil ta'lim (40 soat)",
              "Mashqlar, metodik topshiriqlar, refleksiya, E-Portfolio",
            ],
            ["Pedagogik amaliyot", "Dars ishlanmasi, Microteaching, topshiriqni moslashtirish"],
          ],
        },
      },
      {
        title: "Metod, texnologiya va vositalar",
        lead: "1-rasmdagi metodlar va vositalar; har birining platformadagi o'rni.",
        items: [
          {
            name: "TIMSS/PISA tipidagi topshiriqlar",
            text: "Bilimni takrorlashdan tashqari, uni qo'llash, vaziyatni tahlil qilish, modellashtirish va natijani talqin qilishni talab etadi. Loyihalash mezoni — TIMSS Knowing–Applying–Reasoning va PISA Formulate–Employ–Interpret.",
            source: "[6; 7; 10]",
            links: [L("TIMSS", "/timss"), L("PISA", "/pisa"), L("Rasmiy topshiriqlar", "/rasmiy")],
          },
          {
            name: "Muammoli o'qitish",
            text: "Talaba matematik muammo qo'yish, gipoteza ilgari surish va asoslash bosqichlariga jalb etiladi.",
            links: [L("Tafakkur moduli", "/modullar/tafakkur")],
          },
          {
            name: "Matematik modellashtirish",
            text: "Real vaziyat → matematik model → yechim → talqin sikli (Formulate → Employ → Interpret).",
            links: [L("Modellashtirish trenajyori", "/modullar/savodxonlik")],
          },
          {
            name: "Case-study",
            text: "Real yoki kasbiy-pedagogik vaziyat tahlili: muammoning matematik va metodik jihatlari aniqlanadi, asoslangan yechim ishlab chiqiladi. Matematik-metodik kompetentlik va refleksiv faoliyatni birgalikda rivojlantiradi.",
            source: "[20; 24]",
            links: [L("O'quvchi ishlari banki", "/amaliyot/xatolar")],
          },
          {
            name: "Loyiha metodi",
            text: "Integrativ matematik-metodik loyiha: TIMSS/PISA topshirig'i asosida dars ishlanmasi tuzish.",
            links: [
              L("Dars ishlanmasi", "/amaliyot/dars-ishlanmasi"),
              L("Topshiriqni moslashtirish", "/amaliyot/moslashtirish"),
            ],
          },
          {
            name: "Lesson Study",
            text: "Darsni hamkorlikda rejalashtirish, kuzatish, o'quvchilar faoliyatini tahlil qilish va takomillashtirish. Predmet mazmuni, o'quvchi fikrlashi va o'qitish usullarini bog'laydi.",
            source: "[44]",
            links: [L("Lesson Study protokoli", "/amaliyot/lesson-study")],
          },
          {
            name: "Microteaching",
            text: "Qisqa dars fragmentini loyihalash, namoyish etish, kuzatish va feedback asosida qayta takomillashtirish.",
            source: "[45; 46]",
            links: [L("Microteaching", "/amaliyot/microteaching")],
          },
          {
            name: "Raqamli vositalar (Mentorim platformasi)",
            text: "Topshiriqlar banki, elektron resurslar, testlar, individual tavsiyalar va natijalarni kuzatish vositalari. Platforma mustaqil vosita emas, adaptiv o'qitish muhitining tarkibiy qismi.",
            source: "[47; 48]",
            links: [L("Variativ modul", "/modullar"), L("Videodarslar", "/modullar", "rejada")],
          },
          {
            name: "E-Portfolio",
            text: "Bajarilgan topshiriqlar, dars ishlanmalari, refleksiv yozuvlar va baholash natijalari jamlanadi; talabaning individual rivojlanish dinamikasini qayd etadi.",
            source: "[43]",
            links: [L("E-portfolio", "/portfolio")],
          },
          {
            name: "Dashboard va Learning Analytics",
            text: "O'quv faoliyati ma'lumotlarini tizimlashtirish, dinamikani kuzatish va muammoli jihatlarni aniqlash.",
            source: "[41; 47]",
            links: [L("Monitoring", "/monitoring"), L("O'qituvchi kabineti", "/kabinet")],
          },
        ],
      },
      {
        title: "Case-study protokoli",
        steps: [
          { name: "Vaziyat", text: "O'quvchi ishi yoki dars vaziyati bilan tanishish." },
          { name: "Matematik tahlil", text: "To'g'ri javob va xatoning matematik mohiyati." },
          { name: "Metodik tahlil", text: "Xato sababi: qaysi tushuncha shakllanmagan." },
          { name: "Yechim", text: "O'qituvchining keyingi qadami, topshiriq yoki vosita tanlash." },
          { name: "Asoslash", text: "Nega aynan shu yechim: manba yoki tajriba bilan." },
          { name: "Refleksiya", text: "Bu vaziyatdan o'z darsim uchun nima oldim." },
        ],
      },
      {
        title: "Lesson Study sikli",
        steps: [
          {
            name: "Rejalashtirish",
            text: "Guruh bitta TIMSS/PISA topshirig'i asosida dars rejasini tuzadi va o'quvchilar qayerda qiynalishini oldindan taxmin qiladi.",
          },
          {
            name: "O'tkazish va kuzatish",
            text: "Bir talaba darsni o'tadi, qolganlar kuzatuv protokoli bo'yicha o'quvchilar faoliyatini yozadi.",
          },
          {
            name: "Tahlil",
            text: "Taxminlar va kuzatuvlar solishtiriladi, o'quvchilar fikrlashidagi asosiy qiyinchilik aniqlanadi.",
          },
          { name: "Takomillashtirish", text: "Reja o'zgartiriladi va dars qayta o'tkaziladi." },
        ],
      },
      {
        title: "Microteaching sikli",
        steps: [
          {
            name: "Loyihalash",
            text: "5–7 daqiqalik dars fragmenti: bitta maqsad, bitta topshiriq.",
          },
          { name: "Namoyish", text: "Fragment guruh oldida o'tiladi va videoga yoziladi." },
          {
            name: "Feedback",
            text: "Rubrika bo'yicha o'z-o'zini baholash, guruhdoshlar va o'qituvchi bahosi.",
          },
          {
            name: "Qayta o'tkazish",
            text: "Feedback asosida takomillashtirilgan fragment qayta o'tiladi.",
          },
        ],
      },
    ],
  },
  {
    slug: "diagnostik",
    n: 5,
    title: "Diagnostik-monitoring blok",
    label: "Diagnostik-monitoring blok",
    func: "Nazorat-korreksion",
    lead: "Natijalarni aniqlash, rivojlanish dinamikasini kuzatish va olingan ma'lumotlar asosida ta'lim jarayonini korreksiyalash. Baholash, monitoring, feedback va adaptiv boshqaruvni yagona tizimda birlashtiradi; shu sababli model yopiq emas, o'z-o'zini takomillashtiruvchi tizim.",
    sources: "[6; 10; 14; 41–43; 47; 49]",
    sections: [
      {
        title: "Ishlash mexanizmi",
        lead: "Diagnostika → individuallashtirish → faoliyat → monitoring → feedback → refleksiya → korreksiya.",
        steps: MECHANISM.map((m) => ({ name: m.name, text: m.text, links: [L(m.name, m.to)] })),
      },
      {
        title: "Mezonlar va ko'rsatkichlar",
        table: {
          head: ["Komponent", "Mezon", "Ko'rsatkichlar", "Ilova 1 topshiriqlari", "Maks. ball"],
          rows: CRITERIA.map((c, i) => [
            c.component,
            c.criterion,
            c.indicators,
            ["1–4", "5–12", "17–18", "13–16", "19–20"][i],
            ["8", "16", "4", "8", "4"][i],
          ]),
        },
        note: "Diagnostika vositalari: diagnostik test (Ilova 1: kirish — A shakl, yakuniy — B shakl), pedagogik kuzatish (Microteaching rubrikasi), refleksiv so'rovnoma (testdan keyingi refleksiya), ekspert baholash (o'qituvchining Ilova 5 rubrikasi bo'yicha bahosi), Mentorim monitoringi.",
      },
      {
        title: "Darajalar",
        table: {
          head: ["Daraja", "Ball (40)", "Baho", "Tavsif"],
          rows: [
            [
              "Past",
              "0–20",
              "3",
              "Bilim va ko'nikmalar fragmentar, yangi vaziyatlarda qo'llash qiyin.",
            ],
            [
              "O'rta",
              "21–30",
              "4",
              "Asosiy kompetensiyalar shakllangan, standart vazifalarni mustaqil bajarish mumkin.",
            ],
            [
              "Yuqori",
              "31–40",
              "5",
              "Kompetensiyalar integrallashgan va murakkab kasbiy vaziyatlarda mustaqil qo'llanadi.",
            ],
          ],
        },
        note: 'Tajriba-sinov natijalarini baholashda darajalar baholarga o\'tkazildi: past — "3", o\'rta — "4", yuqori — "5" (avtoreferat, 3.2-band).',
      },
      {
        title: "Adaptiv trayektoriya va adaptiv korreksiya",
        lead: "Modelning adaptivligi diagnostika natijasiga ko'ra individual o'quv trayektoriyasini tanlash orqali ta'minlanadi.",
        table: {
          head: ["Komponent darajasi", "Beriladigan topshiriqlar", "Platformada"],
          rows: [
            [
              "Past",
              "Qo'llab-quvvatlovchi",
              "To'liq modul: nazariya, namunaviy tahlil, mashq, metodik topshiriq",
            ],
            ["O'rta", "Rivojlantiruvchi", "Mashq va metodik topshiriq"],
            ["Yuqori", "Ijodiy-tadqiqotchilik", "Modulning ijodiy-tadqiqotchilik topshiriqlari"],
          ],
        },
        note: "Adaptiv korreksiya: diagnostik-monitoring blokidan mazmuniy va tashkiliy-texnologik bloklarga qaytuvchi teskari aloqa. Monitoring natijalariga ko'ra topshiriqlar mazmuni, murakkablik darajasi va metodik yordam hajmi moslashtiriladi; platformada yangi natija kiritilgach \"Mening yo'lim\" qayta tuziladi.",
      },
      {
        title: "Platformadagi vositalar",
        items: [
          {
            name: "Diagnostik test (Ilova 1)",
            text: "20 topshiriq, 0–2 ball, avtomatik dastlabki ball va o'qituvchi rubrikasi.",
            links: [L("Tajriba-sinov", "/sinov")],
          },
          {
            name: "E-Portfolio",
            text: "Natijalar tarixi, komponentlar dinamikasi, refleksiya, o'qituvchi izohlari.",
            links: [L("E-portfolio", "/portfolio")],
          },
          {
            name: "Learning Analytics va Dashboard",
            text: "Kirish–yakuniy dinamika, t-mezon, Cohen d, Cronbach alfa, komponentlar kesimida taqqoslash.",
            links: [L("Monitoring", "/monitoring")],
          },
          {
            name: "Feedback",
            text: "Rubrika bo'yicha baho, topshiriqlar bo'yicha izoh va individual tavsiyalar.",
            links: [L("O'qituvchi kabineti", "/kabinet")],
          },
        ],
      },
    ],
  },
  {
    slug: "natijaviy",
    n: 6,
    title: "Natijaviy blok",
    label: "Natijaviy blok",
    func: "Baholovchi",
    lead: "Bo'lajak boshlang'ich sinf o'qituvchilari matematik tayyorgarligining besh komponent bo'yicha rivojlanganlik darajasi oshishini va xalqaro baholash talablariga mos o'qitishga kasbiy-metodik jihatdan tayyor mutaxassisni ifodalaydi.",
    sources: "[6; 7; 10; 14; 15; 18; 19; 22–24; 40–43; 47]",
    sections: [
      {
        title: "Komponentlar bo'yicha kutilgan natijalar",
        items: [
          {
            name: "Matematik bilim rivojlangan",
            text: "Tushuncha, qonuniyat va algoritmlarni chuqur anglash, turli vaziyatlarda qo'llash va mazmunni izchil tushuntirish. TIMSS Knowing va MKT Subject Matter Knowledge.",
            source: "[6; 7; 24]",
          },
          {
            name: "Matematik tafakkur rivojlangan",
            text: "Muammoli vaziyatlarni tahlil qilish, mantiqiy xulosa chiqarish, dalillash va turli yechimlarni asoslash. TIMSS Reasoning.",
            source: "[6; 14; 15]",
          },
          {
            name: "Matematik savodxonlik oshgan",
            text: "Bilimlarni real hayotiy va kasbiy vaziyatlarda qo'llash, modellashtirish, natijalarni tahlil qilish va talqin etish. PISA Formulate–Employ–Interpret.",
            source: "[10; 18; 19]",
          },
          {
            name: "Matematik-metodik kompetentlik shakllangan",
            text: "Mazmunni o'quvchilarning yosh va individual xususiyatlariga moslashtirish, o'qitish usullarini tanlash, o'quvchilar fikrlashini tahlil qilish, TIMSS/PISA topshiriqlarini darsga integratsiyalash. PCK, KCT va KCS.",
            source: "[22; 23; 24]",
          },
          {
            name: "Refleksiv faoliyat rivojlangan",
            text: "O'z pedagogik faoliyatini tahlil qilish, natijalarni baholash, kamchiliklarni aniqlash va keyingi rivojlanish yo'nalishini belgilash.",
            source: "[40; 42; 43]",
          },
        ],
      },
      {
        title: "Shakllanganlik darajalari",
        table: {
          head: ["Daraja", "Tavsif"],
          rows: [
            [
              "Past",
              "Komponentlar fragmentar shakllangan; yangi pedagogik vaziyatlarda bilimlarni qo'llash va refleksiv tahlil qilish qiyin.",
            ],
            [
              "O'rta",
              "Asosiy komponentlar shakllangan; standart vaziyatlarda mustaqil faoliyat mavjud, murakkab vaziyatlarda metodik yordam talab etiladi.",
            ],
            [
              "Yuqori",
              "Barcha komponentlar integrativ rivojlangan; murakkab pedagogik vaziyatlarda matematik bilim va metodik kompetensiyalarni mustaqil hamda ijodiy qo'llay oladi.",
            ],
          ],
        },
      },
      {
        title: "Natija",
        lead: MODEL_RESULT,
        note: "Tajriba-sinov natijasida tajriba guruhida yuqori darajadagi talabalar ulushi 15,0% dan 45,0% ga oshdi (nazorat guruhida 15,0% dan 20,0% ga); samaradorlik koeffitsiyenti η = 1,12.",
      },
    ],
  },
];

export const findBlock = (slug: string) => BLOCKS.find((b) => b.slug === slug);
