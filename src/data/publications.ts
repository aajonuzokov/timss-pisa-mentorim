// Avtoreferatdagi ilmiy faoliyat ma'lumotlari: e'lon qilingan ishlar, aprobatsiya va joriy etish.

export const DISSERTATION = {
  title:
    "Bo'lajak boshlang'ich sinf o'qituvchilarining matematik tayyorgarligini oshirish metodikasi (xalqaro baholash dasturlari asosida)",
  specialty: "13.00.02 – Ta'lim va tarbiya nazariyasi va metodikasi (boshlang'ich ta'lim)",
  registration: "B2024.3.PhD/Ped8116",
  university: "Jizzax davlat pedagogika universiteti",
  author: "Abdusattarova Zaynab Abdujalil qizi",
  supervisor:
    "Xamzayev Xaqnazar Xo'shmirzayevich, pedagogika fanlari bo'yicha falsafa doktori (PhD), dotsent",
};

export const ETR = {
  number: "DGU 38123",
  date: "2024-yil 17-may",
  title:
    "Xalqaro baholash dasturlari asosida bo'lajak boshlang'ich sinf o'qituvchilarining metodik tayyorgarligini takomillashtirish (matematika fani misolida)",
  issuer: "O'zbekiston Respublikasi Adliya vazirligi",
  authors: "Abdusattarova Z.A., Xamzayev X.X.",
};

export const APROBATSIYA =
  "Tadqiqot natijalari 4 ta xalqaro va 4 ta respublika miqyosidagi ilmiy-amaliy konferensiyalarda muhokamadan o'tkazilgan. Jami 15 ta ilmiy ish chop etilgan, shundan OAK tavsiya etgan nashrlarda 5 ta maqola (4 tasi respublika, 1 tasi xorijiy jurnalda); 1 ta elektron ta'lim resursi uchun guvohnoma olingan.";

export const IMPLEMENTATION = [
  "Besh komponentli integrativ tuzilma va uning TIMSS, PISA va MKT bilan bog'liqligiga oid tavsiyalar oliy pedagogik ta'lim amaliyotida foydalanilgan (Nizomiy nomidagi O'zbekiston milliy pedagogika universitetining 2026-yil 8-iyuldagi 11-05-4233/04-son ma'lumotnomasi).",
  "Adaptiv strukturaviy-funksional model bo'yicha takliflardan \"Zamonaviy ta'lim paradigmalari\" darsligini boyitishda foydalanilgan (O'zbekiston Milliy kutubxonasining 2026-yil 9-iyundagi ma'lumotnomasi).",
  "Diagnostika va monitoring mexanizmi DGU 38123 asosida ishlab chiqilgan va keyinchalik Mentorim platformasi sifatida rivojlantirilgan elektron ta'lim resursida qo'llanilgan (Adliya vazirligining 2024-yil 17-maydagi DGU 38123-son guvohnomasi).",
  "Variativ modul va kompetensiyaviy topshiriqlar banki \"Zamonaviy ta'lim paradigmalari\" darsligi mazmuniga kiritilgan (Oliy ta'lim, fan va innovatsiyalar vazirligining 2025-yil 9-iyuldagi 258-son buyrug'iga asosan berilgan 520185-sonli nashr ruxsatnomasi).",
  "Metodika Chirchiq davlat pedagogika universiteti, Qo'qon davlat universiteti va Ajiniyoz nomidagi Nukus davlat pedagogika institutining ta'lim jarayoniga joriy etilgan; tajriba guruhida samaradorlik nazorat guruhiga nisbatan 11,7% yuqori bo'lgan.",
];

export type Publication = { text: string; url?: string };

/** Avtoreferatdagi "E'lon qilingan ishlar ro'yxati" (16 ta). */
export const PUBLICATIONS: Publication[] = [
  {
    text: "Abdusattarova Z.A. Адаптивная структурно-функциональная модель формирования математической подготовки будущих учителей начального образования на основе интеграции TIMSS, PISA и концепции Mathematical Knowledge for Teaching (MKT) // Современное педагогическое образование. – 2026. – № 8. – С. 126–130.",
    url: "https://disk.yandex.ru/i/jGTwAafzSQS0JA",
  },
  {
    text: "Abdusattarova Z.A. Matematika fanini loyihaviy ta'lim texnologiyasi orqali o'qitish asosida boshlang'ich sinf o'quvchilarida XXI asr ko'nikmalarini rivojlantirishning ahamiyati // Ijtimoiy-gumanitar fanlarning dolzarb muammolari. – Toshkent, 2024. – № 12(4). – B. 575–582.",
    url: "https://doi.org/10.47390/SPR1342V4I12Y2024N80",
  },
  {
    text: "Abdusattarova Z.A. O'quvchilarni matematikadan muammoli masalalarni yechishga o'rgatish bo'lajak o'qituvchilar kasbiy rivojlanishining omili sifatida // Muǵallim hám úzliksiz bilimlendiriw. – Nukus, 2025. – № 1/3. – B. 74–80.",
  },
  {
    text: "Abdusattarova Z.A. Bo'lajak boshlang'ich sinf o'qituvchilarining matematik tayyorgarligi tarkibi: TIMSS va PISA xalqaro baholash dasturlari asosidagi nazariy tahlil // Maktabgacha va maktab ta'limi. – 2026. – № 8(1). – B. 235–242.",
  },
  {
    text: "Abdusattarova Z.A. Ta'lim amaliyotida faoliyat yondashuvini amalga oshirish tamoyillari // Journal of Innovations in Social Sciences. – 2023. – Vol. 3, Issue 9. – P. 35–39.",
  },
  {
    text: "Abdusattarova Z.A. Educational activity as a factor in solving mathematical problems of elementary school students through the theory of cognitive education // Web of Humanities: Journal of Social Science and Humanitarian Research. – 2024. – P. 9–13.",
    url: "https://webofjournals.com/index.php/9/article/view/1771",
  },
  {
    text: "Abdusattarova Z.A. Boshlang'ich ta'lim jarayonida tizimli faollik yondashuvining afzalligi // \"Boshlang'ich ta'limning zamonaviy tendensiyalari: ta'lim va tarbiya integratsiyasi\" II xalqaro ilmiy-amaliy konferensiya materiallari. – Jizzax, 2022. – B. 156–159.",
  },
  {
    text: "Abdusattarova Z.A. Bo'lajak o'qituvchilarni kasbiy tayyorlashda mantiqiy savodxonlikning o'rni // \"Yangi O'zbekistonda boshlang'ich ta'limning dolzarb muammolari, yechimlari va istiqbollari\" xalqaro ilmiy anjuman materiallari. – 2024. – B. 38–40.",
  },
  {
    text: "Abdusattarova Z.A. Xalqaro baholash dasturlarining bo'lajak o'qituvchilarni metodik tayyorlashdagi ahamiyati // \"Ta'limni rivojlantirish strategiyasi: qadriyatlarga asoslangan taraqqiyot\" xalqaro ilmiy-amaliy konferensiya materiallari. – Jizzax, 2024. – B. 350–357.",
  },
  {
    text: "Abdusattarova Z.A. Talabalarning matematik savodxonligini rivojlantirishda loyihaviy ta'lim texnologiyalarining ahamiyati // Xalqaro ilmiy-amaliy anjuman materiallari. – 2024. – B. 442–445.",
  },
  {
    text: "Abdusattarova Z.A. Matematika ta'limida o'quv kontekstlarini yaratish – ta'lim jarayonida samarali o'qitish omili sifatida // \"Ilm-fan muammolari tadqiqotchilar talqinida\" respublika ilmiy konferensiyasi materiallari. – 2025. – B. 66–71.",
  },
  {
    text: "Abdusattarova Z.A. PISA matematikasi ta'limida masalalar yechish qobiliyatini kontekst asosida rivojlantirishga amaliy yondashuvlar // \"Boshlang'ich ta'lim innovatsion g'oyalar va ilmiy-metodik taraqqiyot strategiyalari\" respublika ilmiy-amaliy konferensiyasi materiallari. – 2025. – B. 462–471.",
  },
  {
    text: "Abdusattarova Z.A., Xamzayev X.X. Bo'lajak o'qituvchilarda matematik savodxonlikni rivojlantirishning ahamiyati // Respublika ilmiy-nazariy anjumani materiallari. – Nukus, 2024. – B. 151–152.",
  },
  {
    text: "Abdusattarova Z.A., Xamzayev X.X. Xalqaro baholash dasturlarining boshlang'ich sinflarda matematika fanini o'qitish jarayonini takomillashtirishga ta'siri // Oriental Art and Culture Scientific Methodical Journal. – 2025. – Vol. 6, Issue 1. – P. 286–291.",
  },
  {
    text: "Abdusattarova Z.A., Xamzayev X.X. O'quvchilarning bilim, ko'nikma va malakalarini tashxis etishda raqamli didaktika va xalqaro baholash dasturlarining o'rni // Respublika ilmiy-amaliy anjumani materiallari. – 2024. – B. 251–254.",
    url: "https://zenodo.org/records/10982724",
  },
  {
    text: "Abdusattarova Z.A., Xamzayev X.X. Xalqaro baholash dasturlari asosida bo'lajak boshlang'ich sinf o'qituvchilarining metodik tayyorgarligini takomillashtirish (matematika fani misolida): elektron ta'lim resursi. – O'zbekiston Respublikasi Adliya vazirligi, 17.05.2024. – DGU 38123-son guvohnoma.",
  },
];
