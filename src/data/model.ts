// Dissertatsiyaning 2.1-bo'limi: TIMSS, PISA va MKT integratsiyasiga asoslangan adaptiv
// strukturaviy-funksional metodik model (2.1-rasm). Matnlar dissertatsiyadan olingan; kvadrat
// qavsdagi raqamlar — dissertatsiyadagi adabiyotlar ro'yxati raqamlari.

export const MODEL_TITLE =
  "TIMSS, PISA va MKT integratsiyasiga asoslangan adaptiv strukturaviy-funksional metodik model";

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
  /** Blokning funksiyasi — bir-ikki gap. */
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

// --- Model sxemasi (2.1-rasm) uchun yon panellar ----------------------------------------
export const EXPECTED_RESULTS = [
  "Yuqori darajadagi matematik bilim",
  "Rivojlangan matematik tafakkur",
  "Matematik savodxonlik",
  "Matematik-metodik kompetentlik",
  "Refleksiv faoliyat",
];

export const EXTERNAL_FACTORS = [
  "Davlat ta'lim standartlari",
  "Oliy ta'lim yo'nalishlari",
  "Xalqaro baholash talablari (TIMSS, PISA)",
  "Raqamli ta'lim muhiti",
  "Ijtimoiy buyurtma",
];

export const DIGITAL_ENV: PlatformLink[] = [
  L("Mentorim platformasi", "/"),
  L("Dashboard va analitika", "/monitoring"),
  L("Individual rivojlanish trayektoriyasi", "/portfolio"),
  L("Learning Analytics", "/monitoring"),
  L("Individual tavsiyalar", "/portfolio"),
];

export const INNER_RESULT =
  "Kasbiy faoliyatga tayyor, xalqaro talablar darajasidagi boshlang'ich sinf o'qituvchisi";

export const MODEL_GOAL =
  "Bo'lajak boshlang'ich sinf o'qituvchilarining matematik tayyorgarligini TIMSS, PISA kompetensiyalari va MKT modeli integratsiyasi asosida rivojlantirish.";

/** Annotatsiyada e'lon qilingan ishlash mexanizmi. */
export const MECHANISM: { name: string; text: string; to: string }[] = [
  { name: "Diagnostika", text: "Kirish diagnostikasi: Ilova 1 testi, 40 ball", to: "/sinov" },
  {
    name: "Individuallashtirish",
    text: "Past va o'rta darajadagi komponentlar bo'yicha modullar tayinlanadi",
    to: "/portfolio",
  },
  {
    name: "Faoliyat",
    text: "Modullar, TIMSS/PISA topshiriqlari, amaliy metodik ishlar",
    to: "/modullar",
  },
  { name: "Monitoring", text: "Oraliq diagnostika, jonli monitoring", to: "/monitoring" },
  { name: "Feedback", text: "Rubrika bo'yicha baho, o'qituvchi izohi", to: "/kabinet" },
  { name: "Refleksiya", text: "Refleksiya yozuvlari, o'z-o'zini baholash", to: "/portfolio" },
  { name: "Korreksiya", text: "Yangi natija asosida yo'l qayta tuziladi", to: "/portfolio" },
];

// --- Bloklar -------------------------------------------------------------------------------
export const BLOCKS: Block[] = [
  {
    slug: "maqsadli",
    n: 1,
    title: "Maqsadli blok",
    label: "Maqsadli blok",
    lead: "Modelning boshqaruvchi komponenti: strategik yo'nalishi va kutilayotgan natijalarini belgilaydi. Uchala konsepsiyaning integratsiyalashuvini ta'minlovchi konseptual yadro vazifasini bajaradi.",
    sources: "[6; 10; 22; 24]",
    sections: [
      {
        title: "Maqsad",
        lead: MODEL_GOAL,
        note: "Matematik tayyorgarlik faqat bilimlar tizimi emas, balki matematik bilim, matematik tafakkur, matematik savodxonlik, matematik-metodik kompetentlik va refleksiv faoliyatning integratsiyalashgan tizimi sifatida qaraladi [6; 10; 22; 24].",
      },
      {
        title: "Vazifalar va ularni bajaruvchi bloklar",
        lead: "Har bir vazifa modelning muayyan blokida amalga oshiriladi va platformada o'z vositasiga ega.",
        items: [
          {
            name: "Matematik tayyorgarlik komponentlarini aniqlash va tizimlashtirish",
            text: "Mazmuniy blok: 5 komponent, ularning TIMSS, PISA va MKT bilan bog'liqligi.",
            links: [L("Mazmuniy blok", "/model/mazmuniy")],
          },
          {
            name: "TIMSS va PISA kompetensiyalarini o'quv jarayoniga integratsiyalash",
            text: "Texnologik blok: TIMSS/PISA tipidagi topshiriqlar va rasmiy namunaviy topshiriqlar.",
            links: [L("TIMSS", "/timss"), L("PISA", "/pisa"), L("Rasmiy topshiriqlar", "/rasmiy")],
          },
          {
            name: "MKT asosida matematik-metodik kompetentlikni rivojlantirish",
            text: "Texnologik blok: MKT moduli, o'quvchi ishlari banki, topshiriqni moslashtirish.",
            links: [L("MKT moduli", "/modullar/metodik"), L("Amaliy metodik ishlar", "/amaliyot")],
          },
          {
            name: "Xalqaro baholashga mos topshiriqlar tizimini yaratish",
            text: "Texnologik blok: TIMSS (Knowing, Applying, Reasoning) va PISA (Formulate, Employ, Interpret) bo'yicha topshiriqlar banki.",
            links: [L("Topshiriqlar banki", "/rasmiy")],
          },
          {
            name: "Adaptiv raqamli ta'lim muhitini tashkil etish",
            text: "Texnologik va diagnostik-monitoring bloklari: diagnostika natijasiga qarab individual yo'l.",
            links: [
              L("Mening yo'lim (E-portfolio)", "/portfolio"),
              L("Variativ modul", "/modullar"),
            ],
          },
          {
            name: "Diagnostika, monitoring va individual rivojlanish trayektoriyasini ta'minlash",
            text: "Diagnostik-monitoring blok: kirish, oraliq va yakuniy diagnostika, jonli monitoring.",
            links: [L("Diagnostik test", "/sinov"), L("Monitoring", "/monitoring")],
          },
        ],
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
      {
        title: "Kutilayotgan natija va tashqi omillar",
        table: {
          head: ["Kutilayotgan natija", "Tashqi omillar"],
          rows: EXPECTED_RESULTS.map((r, i) => [r, EXTERNAL_FACTORS[i] ?? ""]),
        },
      },
    ],
  },
  {
    slug: "metodologik",
    n: 2,
    title: "Metodologik blok",
    label: "Metodologik blok",
    lead: "Modelning ilmiy-konseptual asosi: maqsad, mazmun, texnologiya va natijalar o'rtasidagi uzviy bog'liqlikni ta'minlaydi. Blok tizimli, kompetensiyaviy, integrativ, adaptiv va refleksiv yondashuvlar birligi asosida shakllantirilgan.",
    sources: "[14; 22–24; 31; 40–43]",
    sections: [
      {
        title: "Metodologik yondashuvlar",
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
              "Texnologik blok",
            ],
            ["P.Brusilovskiy", "Adaptiv ta'lim texnologiyalari", "Adaptiv yondashuv"],
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
    lead: "Metodologik yondashuvlarni aniq ta'lim mazmuniga aylantiradi va bo'lajak boshlang'ich sinf o'qituvchisining matematik tayyorgarligini tashkil etuvchi 5 komponentni belgilaydi. Metodologik va texnologik bloklarni bog'lovchi bo'g'in.",
    sources: "[13–19; 22–28; 40–43]",
    sections: [
      {
        title: "Matematik tayyorgarlikning 5 komponenti",
        items: [
          {
            name: "1. Matematik bilim",
            text: "Matematik tushunchalar, qonuniyatlar, algoritmlar va ular o'rtasidagi bog'lanishlarni egallash. TIMSS Knowing kognitiv sohasi va MKTning Subject Matter Knowledge (SMK) tarkibi bilan bog'lanadi.",
            source: "[6; 24]",
            links: [L("Bilim moduli", "/modullar/bilim")],
          },
          {
            name: "2. Matematik tafakkur",
            text: "Matematik vaziyatlarni tahlil qilish, mantiqiy xulosa chiqarish, asoslash va muammolarni hal etish. Schoenfeldning muammolarni hal etish yondashuvi va Boalerning matematik fikrlash haqidagi qarashlari bilan asoslanadi; TIMSS Reasoning va PISA Interpret jarayonlari bilan uyg'unlashadi.",
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
            text: "Matematik mazmunni o'quvchilarning yosh va bilish xususiyatlariga moslashtirish, topshiriqlarni tanlash, o'qitish strategiyalarini belgilash, o'quvchilarning matematik fikrlashini tahlil qilish va baholash. Nazariy asosi — Shulmanning PCK konsepsiyasi va Ball, Thames, Phelpsning MKT modeli.",
            source: "[22–28]",
            links: [L("MKT moduli", "/modullar/metodik")],
          },
          {
            name: "5. Refleksiv faoliyat",
            text: "O'z pedagogik faoliyati va natijalarini tahlil qilish, feedbackdan foydalanish, kamchiliklarni aniqlash va keyingi rivojlanish yo'nalishini belgilash. Schönning refleksiv amaliyot konsepsiyasi, Learning Analytics, feedback va E-Portfolio yondashuvlari bilan asoslanadi.",
            source: "[40–43]",
            links: [L("Refleksiya moduli", "/modullar/refleksiya")],
          },
        ],
        note: "Komponentlar o'zaro integratsiyalashgan tizim sifatida rivojlanadi: matematik bilim tafakkur uchun mazmuniy asos yaratadi; tafakkur bilimlarni savodxonlik faoliyatiga olib keladi; savodxonlik metodik kompetentlik orqali pedagogik faoliyatga transformatsiyalanadi; refleksiv faoliyat barcha jarayonlarni tahlil qilish va takomillashtirishni ta'minlaydi.",
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
    title: "Texnologik blok",
    label: "Texnologik blok",
    lead: "Metodologik va mazmuniy bloklarda belgilangan maqsadlarni amaliy o'quv faoliyatiga aylantirish mexanizmi. Topshiriqlar, pedagogik texnologiyalar, raqamli vositalar va monitoring yagona didaktik zanjirga birlashtiriladi.",
    sources: "[14; 20; 24; 41; 43–48]",
    sections: [
      {
        title: "Ta'lim texnologiyalari va metodlari",
        lead: "2.1-rasm va 2.1.2-bo'limda keltirilgan barcha texnologiyalar; har birining platformadagi vositasi.",
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
    lead: "Natijalarni aniqlash, rivojlanish dinamikasini kuzatish va olingan ma'lumotlar asosida ta'lim jarayonini korreksiyalash. Baholash, monitoring, feedback va adaptiv boshqaruvni yagona tizimda birlashtiradi; shu sababli model yopiq emas, o'z-o'zini takomillashtiruvchi tizim.",
    sources: "[6; 10; 14; 41–43; 47; 49]",
    sections: [
      {
        title: "Ishlash mexanizmi",
        lead: "Diagnostika → individuallashtirish → faoliyat → monitoring → feedback → refleksiya → korreksiya.",
        steps: MECHANISM.map((m) => ({ name: m.name, text: m.text, links: [L(m.name, m.to)] })),
      },
      {
        title: "Mezonlar, ko'rsatkichlar va diagnostika vositalari",
        table: {
          head: ["Komponent", "Mezon", "Ko'rsatkichlar", "Ilova 1 topshiriqlari", "Maks. ball"],
          rows: [
            [
              "Matematik bilim",
              "Kognitiv",
              "Tushunchalar, qonuniyatlar va algoritmlarni egallash; ta'riflarni to'g'ri ifodalash",
              "1–4",
              "8",
            ],
            [
              "Matematik tafakkur",
              "Tafakkur-faoliyat",
              "Tahlil, mantiqiy asoslash, muammoni hal qilish; bilimni qo'llash",
              "5–12",
              "16",
            ],
            [
              "Matematik-metodik kompetentlik",
              "Matematik-metodik",
              "Mazmunni pedagogik faoliyatga transformatsiya qilish: vosita tanlash, xatoni tahlil qilish, topshiriqning didaktik imkoniyatini ko'rish",
              "13–16",
              "8",
            ],
            [
              "Matematik savodxonlik",
              "Matematik savodxonlik",
              "Vaziyatni modellashtirish, hisoblash va natijani talqin qilish",
              "17–18",
              "4",
            ],
            [
              "Refleksiv faoliyat",
              "Refleksiv",
              "O'z faoliyatini tahlil qilish, qiyinchilikni aniqlash, rivojlanish yo'nalishini belgilash",
              "19–20",
              "4",
            ],
          ],
        },
        note: "Diagnostika vositalari: Ilova 1 diagnostik testi (kirish — A shakl, yakuniy — B shakl), oraliq mini-diagnostika, Ilova 5 baholash rubrikasi, refleksiya yozuvlari, o'z-o'zini baholash.",
      },
      {
        title: "Darajalar",
        table: {
          head: ["Daraja", "Ball (40)", "Tavsif"],
          rows: [
            ["Past", "0–20", "Bilim va ko'nikmalar fragmentar, yangi vaziyatlarda qo'llash qiyin."],
            [
              "O'rta",
              "21–30",
              "Asosiy kompetensiyalar shakllangan, standart vazifalarni mustaqil bajarish mumkin.",
            ],
            [
              "Yuqori",
              "31–40",
              "Kompetensiyalar integrallashgan va murakkab kasbiy vaziyatlarda mustaqil qo'llanadi.",
            ],
          ],
        },
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
            text: "Kirish–oraliq–yakuniy dinamika, t-mezon, Cohen d, Cronbach alfa, komponentlar kesimida taqqoslash.",
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
    lead: "Modelning barcha tarkibiy qismlari faoliyati natijasida shakllanadigan yakuniy pedagogik natijalar: matematik tayyorgarlikdagi sifat o'zgarishlari va kompetensiyaviy rivojlanish darajasi.",
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
        title: "Ichki natija",
        lead: `${INNER_RESULT}: matematik bilimni tafakkur, savodxonlik, metodik kompetentlik va refleksiv faoliyat bilan birgalikda kasbiy vaziyatlarda qo'llay oladigan mutaxassis.`,
      },
    ],
  },
];

export const findBlock = (slug: string) => BLOCKS.find((b) => b.slug === slug);
