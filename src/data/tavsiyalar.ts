export type Tavsiya = {
  slug: string;
  title: string;
  category: string;
  short: string;
  maqsad: string;
  kompetensiya: string;
  algoritm: string[];
  topshiriq: string;
  mezon: string[];
};

export type Category = {
  key: string;
  title: string;
  desc: string;
  icon: string; // lucide icon name
  items: Tavsiya[];
};

export const categories: Category[] = [
  {
    key: "timss",
    title: "TIMSS metodikasi",
    desc: "Knowing, Applying va Reasoning kognitiv sohalari bo'yicha metodik tavsiyalar.",
    icon: "BookOpen",
    items: [
      {
        slug: "timss-knowing",
        title: "Knowing kompetensiyasi",
        category: "TIMSS metodikasi",
        short: "Matematik faktlar, tushuncha va protseduralarni bilish va eslab qolish ko'nikmasi.",
        maqsad: "O'quvchilarda matematik faktlar, atamalar, belgilar, hisoblash protseduralari va asosiy tushunchalarni mustahkam o'zlashtirishni ta'minlash.",
        kompetensiya: "Knowing — eslab qolish, tanib olish, hisoblash, o'lchash, klassifikatsiyalash va tartiblash.",
        algoritm: [
          "Mavzuga oid faktlar va atamalarni vizual sxema orqali taqdim etish.",
          "Hisoblash algoritmlarini bosqichma-bosqich namoyish qilish.",
          "Qisqa muddatli takroriy mashqlar (drill) tashkil etish.",
          "Tezkor og'zaki so'rovlar orqali eslab qolish darajasini tekshirish.",
          "Diagnostik mini-test orqali natijalarni qayd etish.",
        ],
        topshiriq: "1248 sonida 4 raqami qaysi xona birligini bildiradi? A) birlik B) o'nlik C) yuzlik D) minglik. To'g'ri javob: B) o'nlik.",
        mezon: [
          "To'g'ri javob — 1 ball.",
          "60% dan yuqori — qoniqarli daraja.",
          "80% dan yuqori — yaxshi daraja.",
          "90% dan yuqori — a'lo daraja.",
        ],
      },
      {
        slug: "timss-applying",
        title: "Applying kompetensiyasi",
        category: "TIMSS metodikasi",
        short: "Olingan bilimlarni tanish vaziyatlarda qo'llash va masalalar yechish.",
        maqsad: "O'quvchilarda standart matematik vaziyatlarda bilimlarini qo'llash, model tanlash va masala yechish ko'nikmasini shakllantirish.",
        kompetensiya: "Applying — tanlash, ifodalash, modellashtirish, amalga oshirish va standart masalani yechish.",
        algoritm: [
          "Masalani tushunish va shartini ajratib olish.",
          "Mos matematik model yoki amalni tanlash.",
          "Yechim rejasini tuzish va bosqichma-bosqich amalga oshirish.",
          "Javobni masala shartiga moslab tekshirish.",
          "Muqobil yechim usullarini muhokama qilish.",
        ],
        topshiriq: "Do'konda 1 kg olma 12 000 so'm. Onam 2,5 kg olma sotib oldi. U necha so'm to'laydi? Javob: 30 000 so'm.",
        mezon: [
          "Model to'g'ri tanlangan — 1 ball.",
          "Hisob to'g'ri bajarilgan — 1 ball.",
          "To'liq va izohli javob — 1 ball.",
        ],
      },
      {
        slug: "timss-reasoning",
        title: "Reasoning kompetensiyasi",
        category: "TIMSS metodikasi",
        short: "Notanish vaziyatlarda mantiqiy fikrlash, tahlil va umumlashtirish.",
        maqsad: "O'quvchilarda mantiqiy mulohaza yuritish, taqqoslash, umumlashtirish va isbotlash ko'nikmalarini rivojlantirish.",
        kompetensiya: "Reasoning — tahlil, sintez, baholash, umumlashtirish, asoslash va nostandart masalani yechish.",
        algoritm: [
          "Muammoli vaziyatni taqdim etish va savollar berish.",
          "Gipoteza ilgari surish va uni asoslash.",
          "Bir necha yechim usullarini izlash.",
          "Yechimni mantiqiy zanjir bilan asoslash.",
          "Xulosalarni umumlashtirib, yangi vaziyatga tatbiq etish.",
        ],
        topshiriq: "1, 4, 9, 16, … qatordagi keyingi son qaysi va nima uchun? Javob: 25, chunki har bir son tabiiy sonlarning kvadrati (n²).",
        mezon: [
          "To'g'ri javob — 1 ball.",
          "Mantiqiy asos berilgan — 1 ball.",
          "Umumlashtirilgan formula keltirilgan — 1 ball.",
        ],
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
        slug: "pisa-formulate",
        title: "Formulate kompetensiyasi",
        category: "PISA metodikasi",
        short: "Real vaziyatni matematik tilga o'tkazish va matematik muammo sifatida ifodalash.",
        maqsad: "O'quvchilarda kundalik hayotiy vaziyatni matematik model ko'rinishida ifodalash ko'nikmasini shakllantirish.",
        kompetensiya: "Formulate — vaziyatni soddalashtirish, o'zgaruvchilarni aniqlash, matematik model qurish.",
        algoritm: [
          "Vaziyat matnini diqqat bilan o'qish.",
          "Ma'lum va noma'lum miqdorlarni ajratish.",
          "Shartni matematik belgilar bilan yozish.",
          "Mos tenglama, nisbat yoki diagramma tuzish.",
          "Model bilan haqiqat o'rtasidagi mosligini tekshirish.",
        ],
        topshiriq: "Avtobus 40 km/soat tezlikda yuradi. Maktabgacha 10 km. Necha daqiqada yetib boradi? Model: t = s/v = 10/40 = 0,25 soat = 15 daqiqa.",
        mezon: [
          "Vaziyat to'g'ri tushunilgan — 1 ball.",
          "Model to'g'ri qurilgan — 1 ball.",
          "Belgilar va birliklar mos — 1 ball.",
        ],
      },
      {
        slug: "pisa-employ",
        title: "Employ kompetensiyasi",
        category: "PISA metodikasi",
        short: "Tuzilgan matematik modelni qo'llash, hisoblash va yechim olish.",
        maqsad: "O'quvchilarda matematik usul va vositalardan foydalanib aniq natija olish ko'nikmasini rivojlantirish.",
        kompetensiya: "Employ — algoritmlarni qo'llash, hisoblash, grafik va jadval bilan ishlash.",
        algoritm: [
          "Model asosida zarur amallarni belgilash.",
          "Hisoblash usulini tanlash (yozma, og'zaki, kalkulyator).",
          "Oraliq natijalarni qayd etish.",
          "Xatoliklarni nazorat qilish.",
          "Yakuniy natijani belgilangan birlikda yozish.",
        ],
        topshiriq: "5 kishilik oilaga 2 kg guruch yetadi. 8 kishiga necha kg guruch kerak? Yechim: 2/5 · 8 = 3,2 kg.",
        mezon: [
          "Amal to'g'ri tanlangan — 1 ball.",
          "Hisob aniq bajarilgan — 1 ball.",
          "Birlik to'g'ri ko'rsatilgan — 1 ball.",
        ],
      },
      {
        slug: "pisa-interpret",
        title: "Interpret kompetensiyasi",
        category: "PISA metodikasi",
        short: "Olingan matematik natijani real vaziyatda izohlash va baholash.",
        maqsad: "O'quvchilarda matematik yechimni hayotiy kontekstda talqin qilish va xulosa chiqarish ko'nikmasini rivojlantirish.",
        kompetensiya: "Interpret — natijani izohlash, asoslash, baholash va qaror qabul qilish.",
        algoritm: [
          "Hisob natijasini masala matniga qaytarish.",
          "Natijaning mantiqiyligini baholash.",
          "Real cheklovlar bilan solishtirish.",
          "Tegishli xulosani so'z bilan ifodalash.",
          "Qaror yoki tavsiyani asoslash.",
        ],
        topshiriq: "Hisob 3,2 kg guruch chiqdi. Do'konda guruch 0,5 kg lik qoplarda sotiladi. Nechta qop kerak? Javob: 7 qop (yaxlitlangan).",
        mezon: [
          "Natija to'g'ri izohlangan — 1 ball.",
          "Hayotiy mantiq saqlangan — 1 ball.",
          "Yaxlitlash asoslangan — 1 ball.",
        ],
      },
    ],
  },
  {
    key: "modellashtirish",
    title: "Matematik modellashtirish",
    desc: "Real vaziyatlarni matematiklashtirish bosqichlari va namunaviy topshiriqlar.",
    icon: "GitBranch",
    items: [
      {
        slug: "model-bosqichlar",
        title: "Modellashtirish bosqichlari",
        category: "Matematik modellashtirish",
        short: "Vaziyat → soddalashtirish → model → yechim → talqin bosqichlari.",
        maqsad: "O'quvchilarni matematik modellashtirishning to'liq sikliga o'rgatish va har bir bosqichni ongli bajarishga yo'naltirish.",
        kompetensiya: "Modellashtirish sikli: vaziyat — model — yechim — talqin — baholash.",
        algoritm: [
          "Real vaziyatni tushunish va soddalashtirish.",
          "Matematik model qurish (formula, sxema, grafik).",
          "Modelni yechish va natija olish.",
          "Natijani vaziyat doirasida talqin qilish.",
          "Modelni takomillashtirish bo'yicha xulosa chiqarish.",
        ],
        topshiriq: "Sinfda 24 ta o'quvchi bor. Har biriga 2 ta daftar tarqatildi. Jami nechta daftar sarflandi? Model: N = 24·2 = 48.",
        mezon: [
          "Barcha bosqichlar bajarilgan — 3 ball.",
          "Yechim aniq — 1 ball.",
          "Talqin to'liq — 1 ball.",
        ],
      },
      {
        slug: "model-real",
        title: "Real vaziyatlarni matematiklashtirish",
        category: "Matematik modellashtirish",
        short: "Kundalik hayot vaziyatlarini matematik tilga ko'chirish texnikasi.",
        maqsad: "O'quvchilarda atrof-muhit hodisalarini matematik miqdorlar va munosabatlar orqali ifodalash ko'nikmasini shakllantirish.",
        kompetensiya: "Vaziyatni tahlil qilish, o'zgaruvchilarni aniqlash, bog'lanish topish.",
        algoritm: [
          "Vaziyatni so'z bilan tasvirlash.",
          "Asosiy miqdorlarni aniqlash.",
          "Ular orasidagi bog'lanishni ifodalash.",
          "Matematik yozuvga o'tkazish.",
          "Modelni tekshirish.",
        ],
        topshiriq: "Suv idishida 5 l suv bor. Har daqiqada 0,5 l qo'shiladi. t daqiqada qancha bo'ladi? V(t) = 5 + 0,5t.",
        mezon: [
          "Bog'lanish to'g'ri — 1 ball.",
          "Funksiya yozilgan — 1 ball.",
          "Tekshirish bajarilgan — 1 ball.",
        ],
      },
      {
        slug: "model-namuna",
        title: "Namunaviy topshiriqlar",
        category: "Matematik modellashtirish",
        short: "Boshlang'ich sinflar uchun modellashtirish topshiriqlari to'plami.",
        maqsad: "O'qituvchilarni boshlang'ich sinf darajasiga mos modellashtirish topshiriqlari bilan ta'minlash.",
        kompetensiya: "Yosh xususiyatiga mos topshiriqlarni tanlash va loyihalash.",
        algoritm: [
          "Mavzu va maqsadni aniqlash.",
          "Hayotiy kontekst tanlash.",
          "Bosqichli savollar tizimini yaratish.",
          "Yechim namunasini tayyorlash.",
          "Baholash mezonini ishlab chiqish.",
        ],
        topshiriq: "Bog'da 3 qator olma daraxti, har qatorda 8 ta daraxt. Jami nechta? Model: 3·8 = 24.",
        mezon: [
          "Topshiriq yosh darajasiga mos — 1 ball.",
          "Yechim namunasi bor — 1 ball.",
          "Mezon aniq — 1 ball.",
        ],
      },
    ],
  },
  {
    key: "mkt",
    title: "Mathematical Knowledge for Teaching (MKT)",
    desc: "O'qituvchining matematik mazmunni o'qitish uchun zarur ixtisoslashgan bilimlari.",
    icon: "GraduationCap",
    items: [
      {
        slug: "mkt-smk",
        title: "Subject Matter Knowledge",
        category: "MKT",
        short: "Matematik mazmunni chuqur va tizimli bilish (SCK, CCK, HCK).",
        maqsad: "Bo'lajak o'qituvchilarda matematik mazmunni nafaqat bilish, balki o'qituvchilik nuqtai nazaridan tushunishni shakllantirish.",
        kompetensiya: "Common, Specialized va Horizon Content Knowledge.",
        algoritm: [
          "Mavzuning matematik mohiyatini o'rganish.",
          "Bog'liq mavzular bilan tizim qurish.",
          "O'quvchilar uchun keng tarqalgan xatolarni tahlil qilish.",
          "Alternativ tushuntirish usullarini tayyorlash.",
          "Mavzuni keyingi sinflar dasturi bilan bog'lash.",
        ],
        topshiriq: "1/2 + 1/3 ni o'quvchiga uchta turli usulda tushuntiring (vizual, raqamli, real model).",
        mezon: [
          "Har bir usul aniq — 1 ball.",
          "Vizual model to'g'ri — 1 ball.",
          "Bog'liqlik ko'rsatilgan — 1 ball.",
        ],
      },
      {
        slug: "mkt-pck",
        title: "Pedagogical Content Knowledge",
        category: "MKT",
        short: "Mazmun va pedagogikaning sintezi: qanday o'qitish kerak.",
        maqsad: "O'qituvchilarda matematik mazmunni o'quvchilar uchun tushunarli qilib taqdim etish ko'nikmasini rivojlantirish.",
        kompetensiya: "KCS, KCT, KCC — o'quvchini, o'qitishni va o'quv dasturini bilish.",
        algoritm: [
          "O'quvchilarning oldingi bilimini aniqlash.",
          "Mavzu uchun mos misol va modellarni tanlash.",
          "Mumkin bo'lgan xatolarni oldindan rejalashtirish.",
          "Faol metodlarni qo'llash.",
          "Refleksiya orqali samarani baholash.",
        ],
        topshiriq: "Ko'paytirishni o'quvchilarga real misol orqali tushuntirishning 2 usulini ishlab chiqing.",
        mezon: [
          "Metod tanlangan — 1 ball.",
          "Misol mos — 1 ball.",
          "Refleksiya bor — 1 ball.",
        ],
      },
      {
        slug: "mkt-transformatsiya",
        title: "Matematik mazmunni pedagogik transformatsiya qilish",
        category: "MKT",
        short: "Ilmiy mazmunni o'quvchiga mos shaklga o'tkazish texnikasi.",
        maqsad: "Murakkab matematik tushunchalarni boshlang'ich sinf o'quvchisi uchun tushunarli ko'rinishga keltirish.",
        kompetensiya: "Didaktik transformatsiya va soddalashtirish.",
        algoritm: [
          "Tushunchaning ilmiy ta'rifini olish.",
          "Yosh xususiyatiga mos metafora tanlash.",
          "Vizual va manipulyativ vositalardan foydalanish.",
          "Bosqichma-bosqich misollar tizimini qurish.",
          "Tushunish darajasini diagnostika qilish.",
        ],
        topshiriq: "Kasr tushunchasini pitsa modeli orqali tushuntiring va 3 ta bosqichli misol bering.",
        mezon: [
          "Model aniq — 1 ball.",
          "Bosqichlar mantiqiy — 1 ball.",
          "Diagnostika bor — 1 ball.",
        ],
      },
    ],
  },
  {
    key: "diagnostika",
    title: "Diagnostika va baholash",
    desc: "Diagnostik testlar, TIMSS/PISA topshiriqlari, baholash mezonlari va e-portfolio.",
    icon: "ClipboardList",
    items: [
      {
        slug: "diag-testlar",
        title: "Diagnostik testlar",
        category: "Diagnostika va baholash",
        short: "O'quvchining boshlang'ich bilim darajasini aniqlash uchun testlar.",
        maqsad: "Ta'lim jarayonini boshlashdan oldin o'quvchining tayyorgarlik darajasini aniqlash va individual yo'nalish belgilash.",
        kompetensiya: "Diagnostik baholash va natijalarni interpretatsiya qilish.",
        algoritm: [
          "Test maqsadini aniqlash.",
          "Topshiriqlarni darajalarga ajratib tuzish.",
          "Testni o'tkazish va natijalarni qayd etish.",
          "Statistik tahlil qilish.",
          "Individual yo'nalish bo'yicha xulosa chiqarish.",
        ],
        topshiriq: "20 ta savollik diagnostik test tuzing: 7 ta Knowing, 7 ta Applying, 6 ta Reasoning.",
        mezon: [
          "Tuzilma to'g'ri — 1 ball.",
          "Darajalar muvozanatli — 1 ball.",
          "Tahlil keltirilgan — 1 ball.",
        ],
      },
      {
        slug: "diag-topshiriqlar",
        title: "TIMSS/PISA topshiriqlari",
        category: "Diagnostika va baholash",
        short: "Xalqaro standartlarga mos topshiriqlar bilan baholash.",
        maqsad: "O'quvchilarni xalqaro baholash dasturlari formatiga moslashtirish va savodxonligini rivojlantirish.",
        kompetensiya: "Xalqaro topshiriqlar bilan ishlash va ularni dars jarayoniga integratsiyalash.",
        algoritm: [
          "TIMSS yoki PISA topshirig'ini tanlash.",
          "Mahalliy kontekstga moslashtirish.",
          "Topshiriqni dars jarayoniga kiritish.",
          "O'quvchilar javobini xalqaro mezon asosida baholash.",
          "Tahlil va refleksiya o'tkazish.",
        ],
        topshiriq: "PISA-2022 dan bitta topshiriqni tanlab, milliy kontekstga moslashtiring va yechim namunasini bering.",
        mezon: [
          "Moslashtirish to'g'ri — 1 ball.",
          "Yechim aniq — 1 ball.",
          "Tahlil bor — 1 ball.",
        ],
      },
      {
        slug: "diag-mezonlar",
        title: "Baholash mezonlari",
        category: "Diagnostika va baholash",
        short: "Rubrika va ball tizimi asosida obyektiv baholash.",
        maqsad: "Baholashda obyektivlik, izchillik va shaffoflikni ta'minlash.",
        kompetensiya: "Rubrika ishlab chiqish va qo'llash.",
        algoritm: [
          "Baholash maqsadini aniqlash.",
          "Mezonlar va darajalarni belgilash.",
          "Har bir darajaga ball berish.",
          "Rubrikani o'quvchilarga tanishtirish.",
          "Baholash natijalarini muhokama qilish.",
        ],
        topshiriq: "PISA Formulate kompetensiyasi uchun 4 darajali rubrika tuzing.",
        mezon: [
          "Darajalar aniq — 1 ball.",
          "Ballar mos — 1 ball.",
          "Tushunarli — 1 ball.",
        ],
      },
      {
        slug: "diag-eportfolio",
        title: "E-portfolio",
        category: "Diagnostika va baholash",
        short: "O'quvchining rivojlanishini elektron portfolio orqali kuzatish.",
        maqsad: "O'quvchining matematik savodxonligi rivojini uzluksiz kuzatish va to'plangan ishlarni saqlash.",
        kompetensiya: "Raqamli baholash va portfolio yuritish.",
        algoritm: [
          "E-portfolio tuzilmasini belgilash.",
          "Topshiriq va natijalarni yuklash.",
          "Refleksiv yozuvlar kiritish.",
          "Davriy tahlil o'tkazish.",
          "O'quvchi va ota-ona bilan muhokama qilish.",
        ],
        topshiriq: "Bir o'quvchining 1-chorak bo'yicha e-portfolio tuzilmasini ishlab chiqing (kamida 5 ta element).",
        mezon: [
          "Tuzilma to'liq — 1 ball.",
          "Refleksiya bor — 1 ball.",
          "Tahlil keltirilgan — 1 ball.",
        ],
      },
    ],
  },
];

export const allTavsiyalar: Tavsiya[] = categories.flatMap((c) => c.items);

export function findTavsiya(slug: string): Tavsiya | undefined {
  return allTavsiyalar.find((t) => t.slug === slug);
}
