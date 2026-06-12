export type MezonLevel = { level: string; ball: string; tavsif: string };

export type Adabiyot = { manba: string; link?: string };

export type Tavsiya = {
  slug: string;
  title: string;
  category: string;
  short: string;
  maqsad: string;
  kompetensiya: string;
  bogliqlik: string;
  algoritm: string[];
  topshiriq: string;
  javob: string;
  mezonTable: MezonLevel[];
  adabiyotlar: Adabiyot[];
};

export type Category = {
  key: string;
  title: string;
  desc: string;
  icon: string;
  items: Tavsiya[];
};

const standardAdabiyotlar: Adabiyot[] = [
  { manba: "Mullis, I.V.S., & Martin, M.O. (2017). TIMSS 2019 Assessment Frameworks. TIMSS & PIRLS International Study Center.", link: "https://timssandpirls.bc.edu/timss2019/frameworks/" },
  { manba: "OECD (2023). PISA 2022 Assessment and Analytical Framework. OECD Publishing, Paris.", link: "https://doi.org/10.1787/dfe0bf9c-en" },
  { manba: "Ball, D.L., Thames, M.H., & Phelps, G. (2008). Content knowledge for teaching: What makes it special? Journal of Teacher Education, 59(5), 389–407.", link: "https://doi.org/10.1177/0022487108324554" },
];

export const categories: Category[] = [
  {
    key: "timss",
    title: "TIMSS metodikasi",
    desc: "Knowing, Applying va Reasoning kognitiv sohalari bo'yicha metodik tavsiyalar.",
    icon: "BookOpen",
    items: [
      {
        slug: "knowing",
        title: "Knowing kompetensiyasi",
        category: "TIMSS metodikasi",
        short: "Matematik faktlar, tushuncha va protseduralarni bilish va eslab qolish ko'nikmasi.",
        maqsad: "Bo'lajak boshlang'ich sinf o'qituvchilarida matematik faktlar, atamalar, belgilar, hisoblash protseduralari va asosiy tushunchalarni mustahkam o'zlashtirish hamda ularni o'quvchilarga samarali yetkazish ko'nikmasini shakllantirish.",
        kompetensiya: "TIMSS Knowing — eslab qolish, tanib olish, hisoblash, o'lchash, klassifikatsiyalash va tartiblash.",
        bogliqlik: "Matematik tayyorgarlikning bilim komponenti bilan bevosita bog'liq: predmetga oid bazaviy bilimlar va protsedural ko'nikmalar bloki.",
        algoritm: [
          "Mavzuga oid asosiy faktlar va atamalarni vizual sxema (mind-map) orqali tizimlashtirish.",
          "Hisoblash algoritmlarini bosqichma-bosqich namoyish qilish va modellashtirish.",
          "Qisqa muddatli takroriy mashqlar (drill) tashkil etish va xatolarni qayd qilish.",
          "Tezkor og'zaki so'rovlar va flash-card texnikalari orqali eslab qolish darajasini tekshirish.",
          "Diagnostik mini-test orqali natijalarni qayd etib, individual yo'nalish belgilash.",
        ],
        topshiriq: "1248 sonida 4 raqami qaysi xona birligini bildiradi?\nA) birlik   B) o'nlik   C) yuzlik   D) minglik",
        javob: "To'g'ri javob: B) o'nlik. 1248 = 1·1000 + 2·100 + 4·10 + 8·1, demak 4 raqami o'nliklar xonasida turibdi.",
        mezonTable: [
          { level: "Past daraja", ball: "0–59%", tavsif: "Atamalar va xona birliklarini farqlashda qiynaladi, qo'shimcha mashq talab etiladi." },
          { level: "O'rta daraja", ball: "60–79%", tavsif: "Asosiy faktlarni biladi, standart misollarni mustaqil bajara oladi." },
          { level: "Yuqori daraja", ball: "80–100%", tavsif: "Tushunchalarni tizimli o'zlashtirgan, boshqalarga tushuntira oladi." },
        ],
        adabiyotlar: standardAdabiyotlar,
      },
      {
        slug: "applying",
        title: "Applying kompetensiyasi",
        category: "TIMSS metodikasi",
        short: "Olingan bilimlarni tanish vaziyatlarda qo'llash va standart masalalarni yechish.",
        maqsad: "Talabalarda standart matematik vaziyatlarda bilimlarni qo'llash, mos model tanlash va masala yechish metodikasini rivojlantirish.",
        kompetensiya: "TIMSS Applying — tanlash, ifodalash, modellashtirish, amalga oshirish, standart masalani yechish.",
        bogliqlik: "Matematik tayyorgarlikning amaliy-faoliyat komponenti bilan bog'liq: bilimlarni real masalalarga ko'chirish bloki.",
        algoritm: [
          "Masala shartini tahlil qilish va ma'lum/noma'lum miqdorlarni ajratish.",
          "Vaziyatga mos matematik amal yoki modelni tanlash.",
          "Yechim rejasini tuzish va bosqichma-bosqich amalga oshirish.",
          "Olingan javobni masala shartiga moslab tekshirish.",
          "Muqobil yechim usullarini muhokama qilib, optimalini tanlash.",
        ],
        topshiriq: "Do'konda 1 kg olma 12 000 so'm turadi. Onam 2,5 kg olma sotib oldi. U necha so'm to'laydi?",
        javob: "To'g'ri javob: 30 000 so'm. Yechim: 12 000 · 2,5 = 30 000 so'm.",
        mezonTable: [
          { level: "Past daraja", ball: "0–59%", tavsif: "Modelni tanlashda yordam talab qiladi, hisoblashda xatolar uchraydi." },
          { level: "O'rta daraja", ball: "60–79%", tavsif: "Standart masalalarni mustaqil yecha oladi, izoh berishda qiynaladi." },
          { level: "Yuqori daraja", ball: "80–100%", tavsif: "Mos modelni tez tanlaydi, yechimni izohlay oladi, muqobil usullarni biladi." },
        ],
        adabiyotlar: standardAdabiyotlar,
      },
      {
        slug: "reasoning",
        title: "Reasoning kompetensiyasi",
        category: "TIMSS metodikasi",
        short: "Notanish vaziyatlarda mantiqiy fikrlash, tahlil, umumlashtirish va isbotlash.",
        maqsad: "O'qituvchilarda mantiqiy mulohaza, taqqoslash, umumlashtirish, isbotlash va nostandart masalalarni yechish ko'nikmalarini shakllantirish.",
        kompetensiya: "TIMSS Reasoning — tahlil, sintez, baholash, umumlashtirish, asoslash, nostandart masala yechish.",
        bogliqlik: "Matematik tayyorgarlikning kognitiv-intellektual komponenti bilan bog'liq: yuqori darajadagi fikrlash bloki.",
        algoritm: [
          "Muammoli vaziyatni taqdim etish va ochiq savollar berish.",
          "Gipoteza ilgari surish va uni dalillar bilan asoslash.",
          "Bir necha muqobil yechim usullarini izlash va taqqoslash.",
          "Yechimni mantiqiy zanjir bilan bosqichma-bosqich asoslash.",
          "Xulosalarni umumlashtirib, yangi vaziyatga tatbiq etish.",
        ],
        topshiriq: "1, 4, 9, 16, … sonlar qatorida keyingi son qaysi va nima uchun?",
        javob: "To'g'ri javob: 25. Chunki har bir son tabiiy sonlarning kvadrati: aₙ = n². Demak, a₅ = 5² = 25.",
        mezonTable: [
          { level: "Past daraja", ball: "0–59%", tavsif: "Qonuniyatni topa olmaydi yoki asoslay olmaydi." },
          { level: "O'rta daraja", ball: "60–79%", tavsif: "Qonuniyatni topadi, lekin umumlashma formulani yozishda qiynaladi." },
          { level: "Yuqori daraja", ball: "80–100%", tavsif: "Qonuniyatni topadi, formula yozadi va yangi misollarga qo'llay oladi." },
        ],
        adabiyotlar: standardAdabiyotlar,
      },
    ],
  },
  {
    key: "pisa",
    title: "PISA metodikasi",
    desc: "Formulate, Employ va Interpret bosqichlari bo'yicha matematik savodxonlik metodikasi.",
    icon: "Compass",
    items: [
      {
        slug: "formulate",
        title: "Formulate kompetensiyasi",
        category: "PISA metodikasi",
        short: "Real vaziyatni matematik tilga o'tkazish va matematik muammo sifatida ifodalash.",
        maqsad: "Talabalarda kundalik hayotiy vaziyatlarni matematik model ko'rinishida ifodalash hamda o'quvchilarni shu jarayonga o'rgatish metodikasini shakllantirish.",
        kompetensiya: "PISA Formulate — vaziyatni soddalashtirish, o'zgaruvchilarni aniqlash, matematik model qurish.",
        bogliqlik: "Matematik tayyorgarlikning modellashtirish komponenti bilan bog'liq: real-matematik o'tish bloki.",
        algoritm: [
          "Vaziyat matnini diqqat bilan o'qish va asosiy mazmunni ajratish.",
          "Ma'lum va noma'lum miqdorlarni ro'yxatga olish.",
          "Shartni matematik belgilar va o'zgaruvchilar bilan yozish.",
          "Mos tenglama, nisbat yoki diagramma tuzish.",
          "Modelning real vaziyatga mosligini tekshirish.",
        ],
        topshiriq: "Avtobus 40 km/soat tezlikda yuradi. Maktabgacha 10 km masofa bor. Avtobus necha daqiqada yetib boradi?",
        javob: "Model: t = s/v = 10/40 = 0,25 soat = 15 daqiqa. To'g'ri javob: 15 daqiqa.",
        mezonTable: [
          { level: "Past daraja", ball: "0–59%", tavsif: "Vaziyatni matematik tilga ko'chira olmaydi." },
          { level: "O'rta daraja", ball: "60–79%", tavsif: "Modelni qisman quradi, ba'zi o'zgaruvchilar tushib qoladi." },
          { level: "Yuqori daraja", ball: "80–100%", tavsif: "To'liq va aniq matematik model quradi, belgilar mos." },
        ],
        adabiyotlar: standardAdabiyotlar,
      },
      {
        slug: "employ",
        title: "Employ kompetensiyasi",
        category: "PISA metodikasi",
        short: "Tuzilgan matematik modelni qo'llash, hisoblash va aniq natija olish.",
        maqsad: "Talabalarda matematik usul va vositalardan foydalanib aniq natija olish hamda o'quvchilarda shu ko'nikmani rivojlantirish metodikasini shakllantirish.",
        kompetensiya: "PISA Employ — algoritmlarni qo'llash, hisoblash, grafik va jadval bilan ishlash.",
        bogliqlik: "Matematik tayyorgarlikning hisoblash-protsedural komponenti bilan bog'liq.",
        algoritm: [
          "Model asosida zarur amallarni belgilash.",
          "Hisoblash usulini tanlash (yozma, og'zaki, kalkulyator).",
          "Oraliq natijalarni qayd etish va nazorat qilish.",
          "Xatoliklarni topish va tuzatish.",
          "Yakuniy natijani belgilangan birlikda yozish.",
        ],
        topshiriq: "5 kishilik oilaga bir hafta uchun 2 kg guruch yetadi. 8 kishilik oilaga bir hafta uchun necha kg guruch kerak?",
        javob: "Yechim: 2/5 · 8 = 16/5 = 3,2 kg. To'g'ri javob: 3,2 kg.",
        mezonTable: [
          { level: "Past daraja", ball: "0–59%", tavsif: "Hisoblashda xatolar ko'p, birliklar chalkash." },
          { level: "O'rta daraja", ball: "60–79%", tavsif: "Hisoblashlar to'g'ri, ammo nazorat qilish zaif." },
          { level: "Yuqori daraja", ball: "80–100%", tavsif: "Aniq hisoblaydi, natijani tekshiradi, birliklarni to'g'ri yozadi." },
        ],
        adabiyotlar: standardAdabiyotlar,
      },
      {
        slug: "interpret",
        title: "Interpret kompetensiyasi",
        category: "PISA metodikasi",
        short: "Olingan matematik natijani real vaziyatda izohlash va baholash.",
        maqsad: "Talabalarda matematik yechimni hayotiy kontekstda talqin qilish, xulosa chiqarish va o'quvchilarni shunga o'rgatish metodikasini shakllantirish.",
        kompetensiya: "PISA Interpret — natijani izohlash, asoslash, baholash, qaror qabul qilish.",
        bogliqlik: "Matematik tayyorgarlikning refleksiv-baholash komponenti bilan bog'liq.",
        algoritm: [
          "Hisob natijasini masala matniga qaytarish.",
          "Natijaning mantiqiyligini real cheklovlar bilan baholash.",
          "Yaxlitlash zarurligini aniqlash.",
          "Xulosani so'z bilan to'liq ifodalash.",
          "Qaror yoki tavsiyani asoslash.",
        ],
        topshiriq: "Hisob natijasi 3,2 kg guruch chiqdi. Do'konda guruch faqat 0,5 kg lik qoplarda sotiladi. Nechta qop sotib olish kerak?",
        javob: "Yechim: 3,2 / 0,5 = 6,4. Yaxlitlanadi: 7 qop. Chunki kam olsa, yetmaydi. To'g'ri javob: 7 qop.",
        mezonTable: [
          { level: "Past daraja", ball: "0–59%", tavsif: "Natijani izohlay olmaydi, yaxlitlashda yo'l qo'yadi." },
          { level: "O'rta daraja", ball: "60–79%", tavsif: "Izohlaydi, lekin asoslashda qiynaladi." },
          { level: "Yuqori daraja", ball: "80–100%", tavsif: "Natijani aniq izohlaydi, yaxlitlashni asoslaydi." },
        ],
        adabiyotlar: standardAdabiyotlar,
      },
    ],
  },
  {
    key: "qoshimcha",
    title: "Qo'shimcha yo'nalishlar",
    desc: "Modellashtirish, MKT va diagnostika bo'yicha metodik tavsiyalar.",
    icon: "GitBranch",
    items: [
      {
        slug: "modellashtirish",
        title: "Matematik modellashtirish",
        category: "Matematik modellashtirish",
        short: "Real vaziyatlarni matematiklashtirish bosqichlari va boshlang'ich sinflar uchun namunaviy topshiriqlar.",
        maqsad: "Talabalarni matematik modellashtirishning to'liq sikliga o'rgatish va boshlang'ich sinflarda modellashtirish metodikasini qo'llashga tayyorlash.",
        kompetensiya: "Modellashtirish sikli: vaziyat → soddalashtirish → model → yechim → talqin → baholash.",
        bogliqlik: "TIMSS Applying va PISA Formulate/Employ/Interpret kompetensiyalari bilan integrativ bog'liq.",
        algoritm: [
          "Real vaziyatni tushunish va soddalashtirish.",
          "Matematik model qurish (formula, sxema, grafik).",
          "Modelni yechish va natija olish.",
          "Natijani vaziyat doirasida talqin qilish.",
          "Modelni takomillashtirish bo'yicha xulosa chiqarish.",
        ],
        topshiriq: "Suv idishida boshlang'ich 5 l suv bor. Har daqiqada idishga 0,5 l suv qo'shiladi. t daqiqadan keyin idishda qancha suv bo'ladi?",
        javob: "Model: V(t) = 5 + 0,5·t. Masalan, 10 daqiqada: V(10) = 5 + 5 = 10 l.",
        mezonTable: [
          { level: "Past daraja", ball: "0–59%", tavsif: "Modelni qura olmaydi, bog'lanishni topa olmaydi." },
          { level: "O'rta daraja", ball: "60–79%", tavsif: "Modelni quradi, lekin talqin qilishda qiynaladi." },
          { level: "Yuqori daraja", ball: "80–100%", tavsif: "Modelni quradi, yechadi, talqin qiladi va baholaydi." },
        ],
        adabiyotlar: [
          { manba: "Blum, W., & Leiß, D. (2007). How do students and teachers deal with modelling problems? In Mathematical Modelling: Education, Engineering and Economics (pp. 222–231). Horwood Publishing.", link: "https://doi.org/10.1533/9780857099419.5.221" },
          ...standardAdabiyotlar,
        ],
      },
      {
        slug: "mkt",
        title: "Mathematical Knowledge for Teaching (MKT)",
        category: "MKT",
        short: "O'qituvchining matematik mazmunni o'qitish uchun zarur ixtisoslashgan bilimlari (SMK + PCK).",
        maqsad: "Bo'lajak o'qituvchilarda matematik mazmunni nafaqat bilish, balki uni pedagogik jihatdan transformatsiya qilib o'qitish ko'nikmasini shakllantirish.",
        kompetensiya: "MKT: Subject Matter Knowledge (CCK, SCK, HCK) va Pedagogical Content Knowledge (KCS, KCT, KCC).",
        bogliqlik: "Kasbiy-metodik tayyorgarlikning markaziy komponenti; barcha TIMSS/PISA kompetensiyalarini o'qitish asosi.",
        algoritm: [
          "Mavzuning matematik mohiyatini chuqur o'rganish.",
          "Bog'liq mavzular bilan tizim qurish (horizon knowledge).",
          "O'quvchilar uchun keng tarqalgan xatolarni oldindan tahlil qilish.",
          "Alternativ tushuntirish usullarini (vizual, raqamli, real model) tayyorlash.",
          "Refleksiya orqali o'qitish samaradorligini baholash.",
        ],
        topshiriq: "1/2 + 1/3 amalini boshlang'ich sinf o'quvchisiga uchta turli usulda (vizual model, raqamli algoritm, real hayotiy misol) tushuntirib bering.",
        javob: "Namuna javob: (1) Vizual — bir doirani 6 ga bo'lib, 3+2=5 qism bo'yash → 5/6. (2) Raqamli — umumiy maxraj 6: 3/6 + 2/6 = 5/6. (3) Real — pitsa: yarmi + uchdan biri = 5/6 qism.",
        mezonTable: [
          { level: "Past daraja", ball: "0–59%", tavsif: "Bitta usulda tushuntiradi, xatolar mavjud." },
          { level: "O'rta daraja", ball: "60–79%", tavsif: "Ikki usulda tushuntiradi, ammo bog'lanish kuchsiz." },
          { level: "Yuqori daraja", ball: "80–100%", tavsif: "Uchta usulni mustaqil quradi, bog'lanishini ko'rsatadi." },
        ],
        adabiyotlar: [
          { manba: "Hill, H.C., Ball, D.L., & Schilling, S.G. (2008). Unpacking pedagogical content knowledge. Journal for Research in Mathematics Education, 39(4), 372–400.", link: "https://doi.org/10.5951/jresematheduc.39.4.0372" },
          ...standardAdabiyotlar,
        ],
      },
      {
        slug: "diagnostika",
        title: "Diagnostika va baholash",
        category: "Diagnostika va baholash",
        short: "Diagnostik testlar, TIMSS/PISA topshiriqlari, rubrikalar va e-portfolio metodikasi.",
        maqsad: "Talabalarda o'quvchilarning matematik savodxonligini diagnostika qilish, baholash va kuzatib borish ko'nikmalarini rivojlantirish.",
        kompetensiya: "Diagnostik va formativ baholash, rubrika tuzish, e-portfolio yuritish.",
        bogliqlik: "Natijaviy-monitoring blokining markaziy komponenti, barcha kompetensiyalarni o'lchash asosi.",
        algoritm: [
          "Baholash maqsadi va vazifalarini aniqlash.",
          "Topshiriqlarni Knowing/Applying/Reasoning darajalariga ajratib tuzish.",
          "Diagnostik testni o'tkazish va natijalarni qayd etish.",
          "Rubrika bo'yicha obyektiv baholash va statistik tahlil.",
          "Individual yo'nalish va e-portfolio yuritish.",
        ],
        topshiriq: "20 ta savollik diagnostik test tuzing: 7 ta Knowing, 7 ta Applying, 6 ta Reasoning. Har bir savolga ball va izoh biriktiring.",
        javob: "Namuna: Knowing — xona birliklari, ko'paytirish jadvali; Applying — pul, masofa-tezlik masalalari; Reasoning — sonli qatordagi qonuniyatlar, mantiqiy masalalar. Har bir savolga 1–3 ball.",
        mezonTable: [
          { level: "Past daraja", ball: "0–59%", tavsif: "Test tuzilmasi noaniq, darajalar muvozanatlanmagan." },
          { level: "O'rta daraja", ball: "60–79%", tavsif: "Test tuziladi, ammo tahlil va izoh yetishmaydi." },
          { level: "Yuqori daraja", ball: "80–100%", tavsif: "Tuzilma to'g'ri, mezonlar aniq, tahlil to'liq." },
        ],
        adabiyotlar: [
          { manba: "Black, P., & Wiliam, D. (2009). Developing the theory of formative assessment. Educational Assessment, Evaluation and Accountability, 21(1), 5–31.", link: "https://doi.org/10.1007/s11092-008-9068-5" },
          ...standardAdabiyotlar,
        ],
      },
    ],
  },
];

export const allTavsiyalar: Tavsiya[] = categories.flatMap((c) => c.items);

export function findTavsiya(slug: string): Tavsiya | undefined {
  return allTavsiyalar.find((t) => t.slug === slug);
}
