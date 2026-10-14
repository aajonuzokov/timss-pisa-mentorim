// "Boshlang'ich sinfda xalqaro baholash metodikasi" variativ moduli: matematik tayyorgarlikning
// 5 komponenti bo'yicha o'quv modullari. Har bir modul: nazariya → namunaviy tahlil → mashq →
// metodik topshiriq → refleksiya. Mazmun dissertatsiyaning 2.1-bo'limi va Ilova 5 ga tayanadi.

import type { ComponentKey } from "@/lib/components";
import type { Field } from "@/data/amaliyot";

export const VARIATIV_MODUL = "Boshlang'ich sinfda xalqaro baholash metodikasi";

export type ConceptCard = {
  name: string;
  definition: string;
  images: string[];
  mistake: string;
};

export type Gallery = { problem: string; methods: { name: string; text: string }[]; note: string };

export type Scenario = {
  title: string;
  situation: string;
  data: { label: string; needed: boolean }[];
  models: string[];
  modelIndex: number;
  employ: { question: string; answer: number; unit: string; hint: string };
  interpret: { question: string; options: string[]; correct: number; why: string };
};

export type Module = {
  key: ComponentKey;
  n: number;
  title: string;
  goal: string;
  links: string;
  theory: string[];
  example: { title: string; task: string; steps: string[]; comment: string };
  practice?: {
    from: "r-knowing" | "r-applying" | "r-reasoning" | "r-pisa";
    count: number;
    note: string;
  };
  methodTask: { prompt: string; fields: Field[] };
  cards?: ConceptCard[];
  gallery?: Gallery[];
  scenarios?: Scenario[];
  tavsiya: { slug: string; title: string };
};

export const MODULES: Module[] = [
  {
    key: "bilim",
    n: 1,
    title: "Matematik bilim",
    goal: "Boshlang'ich sinf matematikasining asosiy tushunchalarini o'qituvchi darajasida bilish: ta'rifni aniq aytish, tushunchani bir necha tasvirda ko'rsatish va o'quvchilarning tipik xatosini oldindan bilish.",
    links: "TIMSS Knowing · MKT: SMK (CCK va SCK)",
    theory: [
      "TIMSS Knowing (bilish) kognitiv sohasi faktlar, tushunchalar va protseduralarni eslash, tanish, tasniflash, hisoblash va o'lchashni qamrab oladi. Bu keyingi barcha jarayonlar — qo'llash va mulohaza yuritish — uchun poydevor.",
      "MKT nuqtai nazaridan o'qituvchi uchun \"bilish\" ikki qatlamli. Umumiy mazmuniy bilim (CCK) — har qanday savodli odam biladigan matematika: 0,4 > 0,35. Maxsus mazmuniy bilim (SCK) — faqat o'qitish uchun kerak bo'ladigan bilim: o'quvchi nega 0,35 > 0,4 deb o'ylashini matematik izohlay olish.",
      "Shuning uchun har bir tushunchani o'rganishda uch narsa so'raladi: aniq ta'rif (o'quvchi tiliga o'girilgan), kamida ikki xil tasvir (model, son nuri, belgi) va tipik noto'g'ri tushuncha.",
    ],
    cards: [
      {
        name: "O'nli kasr",
        definition:
          "Maxraji 10, 100, 1000, ... bo'lgan kasrning vergul bilan yozilishi: 0,35 = 35/100.",
        images: [
          "10×10 katakli kvadratda 35 katak",
          "Son nurida 0 va 1 orasidagi nuqta",
          "Metr: 0,35 m = 35 sm",
        ],
        mistake: '"Uzun yozilgan son katta": 0,35 > 0,4. Tuzatish: 0,4 = 0,40 deb tenglashtirish.',
      },
      {
        name: "Kasr va ulush",
        definition:
          "Ulush — butunning teng qismlaridan biri; kasr — bir yoki bir nechta teng qismni surat va maxraj bilan yozish.",
        images: [
          "Tortni 4 teng bo'lakka bo'lish",
          "Kasrlar lentasi",
          "To'plamning qismi: 12 ta olmaning 1/3 qismi",
        ],
        mistake:
          "Maxrajlarni qo'shish: 1/2 + 1/3 = 2/5. Tuzatish: qism o'lchami (maxraj) bir xil bo'lishi kerak.",
      },
      {
        name: "Ko'paytirish ma'nosi",
        definition: "Bir xil qo'shiluvchilar yig'indisi: 3 × 4 = 4 + 4 + 4.",
        images: [
          "3 ta guruhda 4 tadan narsa",
          "3 qator 4 ustunli massiv",
          "Son nurida 4 qadamli 3 ta sakrash",
        ],
        mistake: '"Ko\'paytirish doim kattalashtiradi". Qarshi misol: × 1, × 0, × 0,5.',
      },
      {
        name: "Perimetr va yuza",
        definition:
          "Perimetr — figura chegarasining uzunligi (sm, m); yuza — figura ichini qoplaydigan kvadrat birliklar soni (sm², m²).",
        images: [
          "Chegarani ip bilan o'lchash",
          "Ichini kataklar bilan qoplash",
          "Bir xil perimetrli, har xil yuzali to'rtburchaklar",
        ],
        mistake: "Perimetr o'rniga yuzani topish (5 × 3 = 15) yoki yuzaga sm yozish.",
      },
      {
        name: "Foiz",
        definition: "Foiz — yuzdan bir ulush: 1% = 1/100; 25% = 25/100 = 1/4.",
        images: [
          "100 katakdan 25 tasi bo'yalgan",
          "Pul: 1000 so'mning 10% i — 100 so'm",
          "Kasr–o'nli kasr–foiz jadvali",
        ],
        mistake: "Foizni sonning o'zi deb olish: 240 ning 35% i = 35.",
      },
      {
        name: "Tub son",
        definition:
          "1 dan katta va faqat 1 ga va o'ziga bo'linadigan natural son: 2, 3, 5, 7, 11, ...",
        images: [
          "n ta kubikni to'g'ri to'rtburchak qilib terish: tub son faqat bir qator bo'ladi",
          "Eratosfen g'alviri",
          "Ko'paytuvchilar daraxti",
        ],
        mistake: "1 ni tub deb hisoblash; 9, 15, 21 kabi toq sonlarni tub deb o'ylash.",
      },
    ],
    example: {
      title: "O'nli kasrlarni taqqoslash (SCK)",
      task: 'O\'quvchi: "4,15 > 4,5, chunki 15 > 5". Javobni tahlil qiling.',
      steps: [
        "CCK: butun qismlar teng (4 = 4); o'ndan birlar: 5 > 1, demak 4,5 > 4,15.",
        'SCK: o\'quvchi kasr qismini butun son kabi o\'qigan: "o\'n besh" va "besh".',
        "Tasvir: 4,5 = 4,50 — 10×10 katakli kvadratda 50 katak va 15 katak.",
        "Keyingi qadam: kasr qismini tovush bilan o'qitish: \"to'rt butun o'ndan besh\" va \"to'rt butun yuzdan o'n besh\".",
      ],
      comment:
        "O'qituvchi javobni faqat \"noto'g'ri\" deb belgilamaydi: xato qaysi tushunchadan kelganini aniqlaydi va o'sha tushunchaga qaytadi.",
    },
    practice: {
      from: "r-knowing",
      count: 8,
      note: "TIMSS Knowing — rasmiy namunaviy topshiriqlar",
    },
    methodTask: {
      prompt:
        "Yuqoridagi kartalardan birini yoki o'zingiz tanlagan tushunchani olib, o'quvchi uchun tushuntirish tayyorlang.",
      fields: [
        { id: "tushuncha", label: "Tushuncha va sinf", rows: 1 },
        { id: "tarif", label: "O'quvchi tiliga o'girilgan ta'rif", rows: 2 },
        {
          id: "tasvirlar",
          label: "Ikki xil tasvir (model, son nuri, belgi, hayotiy misol)",
          rows: 3,
        },
        { id: "xato", label: "Tipik xato va uni oldini olish usuli", rows: 3 },
      ],
    },
    tavsiya: { slug: "knowing", title: "Knowing kompetensiyasi" },
  },
  {
    key: "tafakkur",
    n: 2,
    title: "Matematik tafakkur va qo'llash",
    goal: "Masalani tahlil qilish, bir necha usulda yechish, yechimni asoslash va umumiy tasdiqni misoldan farqlash; bilimni tanish va yangi vaziyatlarda qo'llash.",
    links: "TIMSS Applying va Reasoning · PISA Interpret · Schoenfeld, Boaler",
    theory: [
      "TIMSS Applying — bilimni tanish vaziyatda qo'llash: strategiya tanlash, model tuzish, hisoblash. Reasoning — yangi va murakkab vaziyatda tahlil, umumlashtirish, asoslash va isbotlash.",
      "Muammoni hal etish bosqichlari (Pólya, Schoenfeld): masalani tushunish → reja tuzish → bajarish → orqaga qarash (tekshirish, boshqa usulni izlash). Schoenfeld bunga \"nazorat\"ni qo'shadi: yechish davomida o'z yo'lini kuzatib borish.",
      "J.Boaler ta'kidlaganidek, bir masalaning bir necha yechimini solishtirish matematik tafakkurni rivojlantiradi: o'quvchi \"qaysi usul qulayroq va nega?\" degan savolga javob beradi. Bir nechta misol tasdiqni tushuntiradi, lekin isbotlamaydi.",
    ],
    gallery: [
      {
        problem: "25 × 12",
        methods: [
          { name: "Guruhlash", text: "25 × 4 × 3 = 100 × 3 = 300" },
          { name: "Taqsimot xossasi", text: "25 × 10 + 25 × 2 = 250 + 50 = 300" },
          { name: "Bo'lish orqali", text: "12 × 100 : 4 = 1200 : 4 = 300" },
        ],
        note: "Uchala usul ham ko'paytirish xossalariga tayanadi; o'quvchi qaysi xossani qo'llaganini aytib bera olishi kerak.",
      },
      {
        problem: "Bog'da 12 ta olma daraxti, nok undan 4 ta kam. Jami nechta daraxt?",
        methods: [
          { name: "Ikki qadam", text: "12 − 4 = 8; 12 + 8 = 20" },
          { name: "Bir ifoda", text: "12 × 2 − 4 = 20" },
          {
            name: "Kesmalar chizmasi",
            text: "Ikkita kesma: nok kesmasi olmanikidan 4 ga qisqa; jami = 2 ta 12 dan 4 kam",
          },
        ],
        note: "Chizma \"kam\" so'zini qo'shish deb o'qish xatosining oldini oladi.",
      },
      {
        problem: "1 dan 10 gacha bo'lgan sonlar yig'indisi",
        methods: [
          { name: "Ketma-ket qo'shish", text: "1 + 2 + 3 + ... + 10 = 55" },
          { name: "Juftlash", text: "(1 + 10) + (2 + 9) + ... = 11 × 5 = 55" },
          {
            name: "Geometrik",
            text: "Kubiklardan zinapoya; ikki zinapoya 10 × 11 to'rtburchak hosil qiladi: 110 : 2 = 55",
          },
        ],
        note: "Juftlash usuli umumlashtirishga olib keladi: 1 dan 100 gacha yig'indi ham shu yo'l bilan topiladi.",
      },
    ],
    example: {
      title: "Umumiy tasdiqni asoslash",
      task: "\"Ketma-ket kelgan uchta natural son yig'indisi 3 ga bo'linadi\". Asoslang.",
      steps: [
        "Misollar: 4 + 5 + 6 = 15, 10 + 11 + 12 = 33 — tasdiq to'g'ri ko'rinadi, lekin bu isbot emas.",
        "O'rtadagi sonni n desak, sonlar n − 1, n, n + 1.",
        "Yig'indi: (n − 1) + n + (n + 1) = 3n — har doim 3 ga bo'linadi.",
        "Boshlang'ich sinf uchun model: chetdagi sondan 1 ta kubikni ikkinchi chetga o'tkazsak, uchta teng ustun hosil bo'ladi.",
      ],
      comment:
        "Asoslash — misollar ro'yxati emas, barcha holatlar uchun ishlaydigan dalil. Boshlang'ich sinfda dalil model orqali ko'rsatiladi.",
    },
    practice: {
      from: "r-reasoning",
      count: 8,
      note: "TIMSS Reasoning — rasmiy namunaviy topshiriqlar",
    },
    methodTask: {
      prompt: "Boshlang'ich sinf uchun ikki xil usulda yechiladigan masala tuzing.",
      fields: [
        { id: "masala", label: "Masala matni va sinf", rows: 3 },
        { id: "usul1", label: "1-usul", rows: 2 },
        { id: "usul2", label: "2-usul", rows: 2 },
        { id: "taqqoslash", label: "Qaysi o'quvchi uchun qaysi usul qulayroq va nega", rows: 3 },
      ],
    },
    tavsiya: { slug: "reasoning", title: "Reasoning kompetensiyasi" },
  },
  {
    key: "savodxonlik",
    n: 3,
    title: "Matematik savodxonlik va modellashtirish",
    goal: "Real vaziyatni matematik modelga keltirish (Formulate), modelni yechish (Employ) va natijani vaziyat nuqtai nazaridan talqin qilish (Interpret).",
    links: "PISA Formulate–Employ–Interpret",
    theory: [
      "PISA matematik savodxonlikni modellashtirish sikli orqali tavsiflaydi: real vaziyat → Formulate (kerakli ma'lumotni ajratish, matematik masala tuzish) → Employ (hisoblash, protsedura) → matematik natija → Interpret (natijani vaziyatga qaytarish va baholash).",
      "Kontekst turlari: shaxsiy (xarid, vaqt), kasbiy (ish joyi), ijtimoiy (maktab, mahalla) va ilmiy. Boshlang'ich sinfda shaxsiy va ijtimoiy kontekstlar eng tushunarli.",
      "PISA 15 yoshli o'quvchilarni baholaydi. Bo'lajak o'qituvchi PISA topshiriqlarini o'zi yechadi va ulardagi modellashtirish g'oyasini boshlang'ich sinf darajasiga moslaydi: sonlar kichikroq, kontekst tanish, qadamlar kamroq.",
      "Eng ko'p uchraydigan qiyinchiliklar: ortiqcha ma'lumotni ajrata olmaslik, matnni modelga aylantira olmaslik va natijani vaziyatga qaytarmaslik (masalan, 2,5 avtobus).",
    ],
    scenarios: [
      {
        title: "Maktab oshxonasi",
        situation:
          "Oshxonada kuniga 180 o'quvchi ovqatlanadi. Har bir o'quvchiga 0,4 litr sharbat beriladi. Sharbat 1 litrlik qutilarda sotiladi. Oshxona soat 12:00 da ochiladi.",
        data: [
          { label: "O'quvchilar soni — 180", needed: true },
          { label: "Bir o'quvchiga — 0,4 litr", needed: true },
          { label: "Quti hajmi — 1 litr", needed: true },
          { label: "Ochilish vaqti — 12:00", needed: false },
        ],
        models: ["180 × 0,4", "180 + 0,4", "180 : 0,4"],
        modelIndex: 0,
        employ: {
          question: "Kuniga necha litr sharbat kerak?",
          answer: 72,
          unit: "litr",
          hint: "180 × 0,4 = 18 × 4",
        },
        interpret: {
          question: "Nechta quti olish kerak?",
          options: [
            "Aniq 72 ta, ortig'i isrof",
            "72 ta yoki biroz ko'proq: to'kilish va qo'shimcha o'quvchilar uchun zaxira",
            "7 ta",
          ],
          correct: 1,
          why: "Matematik natija 72, lekin real vaziyatda kichik zaxira oqilona. Talqin — natijani vaziyat bilan solishtirish.",
        },
      },
      {
        title: "Sinf ekskursiyasi",
        situation:
          "Ekskursiyaga 28 o'quvchi va 2 o'qituvchi boradi. Har bir mikroavtobusda 12 o'rindiq bor, bitta mikroavtobus ijarasi 150 000 so'm. Muzeygacha 40 km.",
        data: [
          { label: "Kishilar soni — 30", needed: true },
          { label: "O'rindiqlar — 12", needed: true },
          { label: "Ijara narxi — 150 000 so'm", needed: true },
          { label: "Masofa — 40 km", needed: false },
        ],
        models: ["30 : 12, natijani yuqoriga yaxlitlash", "28 : 12", "30 × 12"],
        modelIndex: 0,
        employ: {
          question: "Jami ijara necha so'm?",
          answer: 450000,
          unit: "so'm",
          hint: "30 : 12 = 2,5 → 3 ta mikroavtobus",
        },
        interpret: {
          question: "Har bir o'quvchi necha so'mdan to'lasa yetadi (o'qituvchilar to'lamaydi)?",
          options: ["15 000 so'm", "16 072 so'm, yaxlitlab 16 100 so'm", "5 000 so'm"],
          correct: 1,
          why: "450 000 : 28 ≈ 16 071,4; pulni yuqoriga yaxlitlash kerak, aks holda yetmaydi.",
        },
      },
      {
        title: "Maktab gulzori",
        situation:
          "Gulzorning uzunligi 15 m, eni 8 m. Har bir kvadrat metrga 3 tup gul ekiladi. Bir tup ko'chat 2 000 so'm. Gulzor maktab darvozasidan 20 m uzoqlikda.",
        data: [
          { label: "Uzunlik — 15 m, eni — 8 m", needed: true },
          { label: "Zichlik — 3 tup/m²", needed: true },
          { label: "Narx — 2 000 so'm", needed: true },
          { label: "Darvozagacha — 20 m", needed: false },
        ],
        models: ["15 × 8 × 3", "(15 + 8) × 2 × 3", "15 × 8 : 3"],
        modelIndex: 0,
        employ: {
          question: "Ko'chatlar uchun jami necha so'm kerak?",
          answer: 720000,
          unit: "so'm",
          hint: "15 × 8 = 120 m²; 120 × 3 = 360 tup",
        },
        interpret: {
          question: "Maktab byudjeti 500 000 so'm bo'lsa, nima qilish mumkin?",
          options: [
            "Zichlikni 2 tupga tushirish yoki gulzorning bir qismini ekish",
            "Hisob noto'g'ri, qayta hisoblash kerak",
            "Hech narsa qilib bo'lmaydi",
          ],
          correct: 0,
          why: "120 × 2 × 2 000 = 480 000 so'm — byudjetga sig'adi. Talqin modelni o'zgartirishni ham o'z ichiga oladi.",
        },
      },
    ],
    example: {
      title: "PISA topshirig'ini boshlang'ich sinfga moslash",
      task: "PISA: \"Oila oyiga 180 kVt·soat ishlatadi, tarif 450 so'm. Tarif 10% oshsa, oylik to'lov qancha o'zgaradi?\"",
      steps: [
        "Kognitiv g'oya: real vaziyatni ko'paytirish modeliga keltirish va natijani talqin qilish (Formulate–Interpret).",
        "4-sinf varianti: \"Sinfda 25 o'quvchi, har biri kuniga 2 ta varaq ishlatadi. Bir haftada (5 kun) nechta varaq kerak? Pachkada 100 ta varaq bo'lsa, nechta pachka olish kerak?\"",
        "Saqlangan: ortiqcha bo'lmagan ma'lumot, ko'paytirish modeli, natijani yuqoriga yaxlitlash (talqin).",
        "O'zgartirilgan: foiz o'rniga butun sonlar, tanish kontekst, qadamlar soni ikkita.",
      ],
      comment: "Moslashtirishda kognitiv jarayon saqlanadi, sonlar va kontekst soddalashtiriladi.",
    },
    practice: {
      from: "r-pisa",
      count: 6,
      note: "PISA — rasmiy namunaviy topshiriqlar (o'qituvchining o'zi uchun)",
    },
    methodTask: {
      prompt: "Boshlang'ich sinf uchun PISA tipidagi topshiriq tuzing.",
      fields: [
        { id: "kontekst", label: "Kontekst (shaxsiy, ijtimoiy...) va sinf", rows: 1 },
        { id: "matn", label: "Topshiriq matni: kamida bitta ortiqcha ma'lumot bilan", rows: 4 },
        { id: "model", label: "Kutilgan matematik model va javob", rows: 2 },
        { id: "talqin", label: "Talqin savoli: natijani vaziyatga qaytaruvchi savol", rows: 2 },
      ],
    },
    tavsiya: { slug: "formulate", title: "Formulate kompetensiyasi" },
  },
  {
    key: "metodik",
    n: 4,
    title: "Matematik-metodik kompetentlik (MKT)",
    goal: "Matematik mazmunni o'qitish faoliyatiga aylantirish: o'quvchi xatosini diagnoz qilish, tushuntirish yo'lini va vositani tanlash, topshiriqni sinf darajasiga moslashtirish.",
    links: "MKT: KCS, KCT, KCC (PCK) · Shulman, Ball–Thames–Phelps",
    theory: [
      "Shulman o'qituvchi bilimining alohida turini — pedagogik mazmuniy bilimni (PCK) ajratdi. Ball, Thames va Phelps uni matematika uchun MKT modeliga aylantirdi: mazmun va o'quvchi (KCS), mazmun va o'qitish (KCT), mazmun va o'quv dasturi (KCC).",
      "O'quvchi xatosini diagnoz qilishning uch qadami: (1) o'quvchi aniq nima qildi; (2) qaysi tushuncha shakllanmagan; (3) qanday topshiriq, vosita yoki savol bilan tuzatiladi. \"Noto'g'ri, qaytadan yech\" — diagnoz emas.",
      "TIMSS 8-sinf va PISA topshiriqlarini boshlang'ich sinfga moslashtirish qoidalari: kognitiv sohani (Knowing, Applying, Reasoning yoki Formulate, Employ, Interpret) saqlash; sonlarni kichraytirish; kontekstni tanish qilish; qadamlar sonini kamaytirish; ko'rgazmali tayanch berish; savol tilini soddalashtirish.",
    ],
    example: {
      title: "Xato tahlili: 3/4 + 1/2 = 4/6",
      task: "O'quvchi 3/4 + 1/2 = 4/6 deb yozdi.",
      steps: [
        "Nima qildi: suratlarni (3 + 1) va maxrajlarni (4 + 2) alohida qo'shdi.",
        "Sabab (KCS): kasr bitta son ekani, maxraj qism o'lchamini bildirishi tushunilmagan; natural sonlar qoidasini kasrga ko'chirgan.",
        "Tekshirish: 1/2 + 1/2 shu usulda 2/4 = 1/2 bo'ladi — yarimtaga yarimta qo'shsak yarimta qolmaydi. Bu o'quvchini o'zi xatoni ko'rishga olib keladi.",
        "Keyingi qadam (KCT): kasrlar lentasi bilan 1/2 = 2/4 ni ko'rsatish, so'ng 3/4 + 2/4 = 5/4.",
      ],
      comment:
        "Yaxshi tuzatish o'quvchiga qoidani qayta aytish emas, uning o'zi ziddiyatni ko'radigan vaziyat yaratishdir.",
    },
    methodTask: {
      prompt:
        "O'z tajribangizdan (amaliyot, repetitorlik) yoki o'quvchi ishlari bankidan bitta xatoni olib, uch qadamli diagnoz yozing.",
      fields: [
        { id: "vaziyat", label: "O'quvchi ishi: topshiriq va o'quvchi javobi", rows: 2 },
        { id: "diagnoz", label: "Diagnoz: o'quvchi aniq nima qildi?", rows: 2 },
        { id: "sabab", label: "Sabab: qaysi tushuncha shakllanmagan?", rows: 2 },
        { id: "qadam", label: "Keyingi qadam: qanday topshiriq, vosita yoki savol?", rows: 3 },
      ],
    },
    tavsiya: { slug: "mkt", title: "Mathematical Knowledge for Teaching (MKT)" },
  },
  {
    key: "refleksiya",
    n: 5,
    title: "Refleksiv faoliyat",
    goal: "O'z faoliyatini tahlil qilish, natijani o'qituvchi bahosi bilan solishtirish, feedbackdan foydalanish va keyingi rivojlanish yo'nalishini belgilash.",
    links: "Schön · feedback · Learning Analytics · E-Portfolio",
    theory: [
      "D.Schön ikki xil refleksiyani ajratadi: faoliyat jarayonidagi refleksiya (dars davomida rejani o'zgartirish) va faoliyatdan keyingi refleksiya (darsdan keyin tahlil). Ikkalasi ham o'rganiladigan ko'nikma.",
      "Refleksiya sikli to'rt savoldan iborat: Nima bo'ldi? Nega shunday bo'ldi? Nimani o'rgandim? Keyingi safar nima qilaman? Javob umumiy emas, aniq misolga tayanishi kerak.",
      "O'z-o'zini baholash refleksiyaning o'lchanadigan ko'rsatkichi. Diagnostik testdan keyin har bir topshiriqqa o'zingiz 0–2 ball qo'yasiz; o'qituvchi bahosi bilan farq kamaygani sari o'z ishingizni baholash aniqligi oshadi.",
      "Feedback samarali bo'lishi uchun u maqsad, hozirgi holat va keyingi qadamni bog'lashi kerak (Hattie va Timperley). E-portfolioda o'qituvchi izohlari va o'z refleksiyalaringiz yonma-yon saqlanadi.",
    ],
    example: {
      title: "Kuchsiz va kuchli refleksiya",
      task: "Talaba diagnostik testdan keyin refleksiya yozdi.",
      steps: [
        "Kuchsiz: \"Test qiyin bo'ldi, ko'proq o'qishim kerak.\" — aniq misol, sabab va qadam yo'q.",
        "Kuchli: \"13-topshiriqda ko'rgazmali vositani aytdim, lekin qanday foydalanishni yozmadim — 1 ball oldim. Sabab: vositani bilaman, lekin dars ketma-ketligini rejalashtirishga o'rganmaganman. Keyingi qadam: MKT modulidagi namunaviy tahlilni o'qib, kasrlar lentasi bilan 3 bosqichli reja yozaman.\"",
        "Kuchli refleksiyada: aniq topshiriq, baho, sabab va o'lchanadigan keyingi qadam bor.",
      ],
      comment: "Refleksiya — o'zini tanqid qilish emas, keyingi harakatni rejalashtirish vositasi.",
    },
    methodTask: {
      prompt:
        "Har bir komponent bo'yicha keyingi 4 haftaga bitta aniq maqsad qo'ying va uni qanday dalil bilan o'lchashingizni yozing.",
      fields: [
        { id: "bilim", label: "Matematik bilim", rows: 2 },
        { id: "tafakkur", label: "Matematik tafakkur va qo'llash", rows: 2 },
        { id: "savodxonlik", label: "Matematik savodxonlik", rows: 2 },
        { id: "metodik", label: "Matematik-metodik kompetentlik", rows: 2 },
        { id: "refleksiya", label: "Refleksiv faoliyat", rows: 2 },
      ],
    },
    tavsiya: { slug: "interpret", title: "Interpret kompetensiyasi" },
  },
];

export const findModule = (slug: string) => MODULES.find((m) => m.key === slug);

/** Modulni yakunlashdagi refleksiya savollari. */
export const COMPLETE_FIELDS: Field[] = [
  { id: "qiyin", label: "Bu modulda nima qiyin bo'ldi?", rows: 2 },
  { id: "organdim", label: "Nimani o'rgandim (aniq misol bilan)?", rows: 2 },
  { id: "keyingi", label: "Keyingi qadamim", rows: 2 },
];

/** Modul formalaridagi maydon nomlari (ishni ko'rsatishda kalit o'rniga). */
export const MODULE_FIELD_LABEL: Record<string, string> = Object.fromEntries(
  [...MODULES.flatMap((m) => m.methodTask.fields), ...COMPLETE_FIELDS].map((f) => [f.id, f.label]),
);
