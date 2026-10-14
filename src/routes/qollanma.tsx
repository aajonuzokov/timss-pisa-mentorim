import { createFileRoute, Link } from "@tanstack/react-router";
import { Printer, GraduationCap, ClipboardList, LineChart, BookOpen } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/qollanma")({
  head: () => ({
    meta: [
      { title: "O'quv qo'llanma — TIMSS/PISA Platformasi" },
      {
        name: "description",
        content:
          "Platformadan foydalanish bo'yicha qo'llanma: talaba uchun, tajriba-sinov tashkilotchisi uchun va natijalarni tahlil qilish.",
      },
    ],
  }),
  component: Page,
});

const Section = ({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof BookOpen;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="p-6 rounded-2xl border bg-card shadow-card break-inside-avoid">
    <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
      <span className="w-9 h-9 rounded-lg bg-gradient-hero flex items-center justify-center text-primary-foreground print:hidden">
        <Icon className="w-5 h-5" />
      </span>
      {title}
    </h2>
    <div className="space-y-3 text-sm leading-relaxed">{children}</div>
  </section>
);

function Page() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Resurslar"
        title="O'quv qo'llanma"
        description="Platformadan foydalanish bo'yicha amaliy qo'llanma: talabalar, tajriba-sinov tashkilotchisi va natijalarni tahlil qiluvchi uchun."
      />
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
        <div className="flex justify-end print:hidden">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" /> Chop etish / PDF saqlash
          </Button>
        </div>

        <Section icon={GraduationCap} title="1. Talaba uchun">
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <b>Mashq qilish.</b>{" "}
              <Link to="/rasmiy" className="text-primary hover:underline">
                Rasmiy topshiriqlar
              </Link>
              ,{" "}
              <Link to="/timss" className="text-primary hover:underline">
                TIMSS
              </Link>{" "}
              va{" "}
              <Link to="/pisa" className="text-primary hover:underline">
                PISA
              </Link>{" "}
              bo'limlarida istalgan testni bosqich "Mashq" holatida yeching. Har bir topshiriqdan
              keyin izoh va uchta metodik qism chiqadi: o'quvchi uchun maqsad, bo'lajak o'qituvchi
              uchun metodik maqsad va darsda qo'llash usuli.
            </li>
            <li>
              <b>Ishtirokchi kodi.</b> Test boshida kod avtomatik beriladi. Tashkilotchi kod bergan
              bo'lsa, o'shani kiriting. Kodni yozib qo'ying: kirish va yakuniy testda bir xil kod
              bo'lishi shart.
            </li>
            <li>
              <b>Javoblar yo'qolmaydi.</b> Har bir javob qurilmada avtomatik saqlanadi. Sahifa
              yangilansa yoki internet uzilsa, sahifaga qaytganda davom ettirasiz.
            </li>
            <li>
              <b>Ochiq javoblar.</b> Javob son bo'lsa, faqat sonni yozing (masalan, <code>18</code>{" "}
              yoki <code>0,5</code>). Bo'shliq, vergul yoki nuqta, o'lchov birligi va oddiy kasr (
              <code>1/2</code>) to'g'ri tushuniladi.
            </li>
            <li>
              <b>Natija.</b> Yuborgandan keyin matematik tayyorgarlikning 5 komponenti va mavzular
              bo'yicha diagnostika, kuchli va rivojlantirish kerak bo'lgan tomonlar hamda tavsiyalar
              chiqadi. Daraja: past (≤ 50%), o'rta (51–75%), yuqori (&gt; 75%).
            </li>
            <li>
              <b>Refleksiya va E-portfolio.</b> Har bir testdan keyin "Nima qiyin bo'ldi?" va
              "Keyingi qadamim" savollariga qisqa javob yozing.{" "}
              <Link to="/portfolio" className="text-primary hover:underline">
                E-portfolio
              </Link>{" "}
              sahifasini ishtirokchi kodi va o'zingiz tanlagan PIN (4–8 raqam) bilan oching:
              natijalar tarixi, komponentlar dinamikasi, o'qituvchi izohi va tavsiyalar shu yerda.
            </li>
            <li>
              <b>Mening yo'lim va modullar.</b> E-portfoliodagi "Mening yo'lim" diagnostika
              natijangizga qarab qaysi{" "}
              <Link to="/modullar" className="text-primary hover:underline">
                modul
              </Link>
              ni to'liq, qaysi birini qisqa bajarish kerakligini ko'rsatadi. Har bir modul:
              nazariya, namunaviy tahlil, mashq, metodik topshiriq va refleksiya.
            </li>
            <li>
              <b>Amaliy metodik ishlar.</b>{" "}
              <Link to="/amaliyot" className="text-primary hover:underline">
                Amaliyot
              </Link>{" "}
              bo'limida o'quvchi xatolarini tahlil qiling, TIMSS 8-sinf va PISA topshiriqlarini
              boshlang'ich sinfga moslang, dars ishlanmasi, Microteaching va Lesson Study
              protokolini yuboring. Har bir ish kod bilan E-portfolioga tushadi va o'qituvchi
              baholaydi.
            </li>
            <li>
              <b>O'z-o'zini baholash.</b> Diagnostik testdan keyin har bir topshiriqqa o'zingiz 0–2
              ball qo'ying. O'qituvchi bahosi bilan farq E-portfolioda ko'rinadi.
            </li>
          </ol>
        </Section>

        <Section icon={ClipboardList} title="2. Tajriba-sinov tashkilotchisi uchun">
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <b>Kodlar ro'yxati.</b> Har bir ishtirokchiga kod bering (masalan, <code>T-001</code>{" "}
              … <code>T-360</code>) va ism–kod ro'yxatini alohida saqlang. Platformada ism bilan
              birga faqat kod tahlil qilinadi.
            </li>
            <li>
              <b>Kirish testi.</b>{" "}
              <Link to="/sinov" className="text-primary hover:underline">
                Tajriba-sinov
              </Link>{" "}
              bo'limida "Kirish testi (A shakl)" — dissertatsiyaning diagnostik testi (Ilova 1): 20
              ta ochiq topshiriq, 6 blok, har biri 0–2 ball, jami 40 ball; taxminan 60–80 daqiqa.
              Imkon bo'lsa, auditoriyada bir vaqtda o'tkazing.
            </li>
            <li>
              <b>Tajriba davri.</b> Talabalar "Mening yo'lim" bo'yicha variativ modul modullarini va
              amaliy metodik ishlarni bajaradi. Tajriba o'rtasida "Oraliq diagnostika" (30
              topshiriq, 60 ball) topshiriladi.
            </li>
            <li>
              <b>Yakuniy test.</b> "Yakuniy test (B shakl)" — xuddi shu kod bilan. B shakl A ning
              parallel varianti: har bir topshiriq bloki, komponenti, talabi va rubrikasi bir xil,
              sonlar va vaziyatlar boshqa, shuning uchun o'sish yodlash hisobiga bo'lmaydi.
            </li>
            <li>
              <b>Nazorat guruhi (ixtiyoriy).</b> Platformadan foydalanmagan guruh ham kirish va
              yakuniy testni topshirsa, test boshida "Nazorat guruhi"ni belgilaydi. Monitoring ikki
              guruh o'sishini statistik taqqoslaydi.
            </li>
            <li>
              <b>Qayta topshirish.</b> Har bir kod, test va bosqich uchun birinchi to'liq urinish
              hisobga olinadi; keyingilari mashq hisoblanadi.
            </li>
          </ol>
        </Section>

        <Section icon={LineChart} title="3. O'qituvchi kabineti va natijalarni tahlil qilish">
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <b>O'qituvchi hisobi (bir marta).</b>{" "}
              <Link to="/kabinet" className="text-primary hover:underline">
                O'qituvchi kabineti
              </Link>{" "}
              sahifasida "Hisobim yo'q" orqali email va parol bilan ro'yxatdan o'ting. So'ng
              administrator Lovable Cloud → Database → SQL bo'limida sahifada ko'rsatilgan{" "}
              <code>INSERT INTO public.teachers …</code> buyrug'ini bajaradi. Shundan keyingina
              hisob natijalarni ko'radi.
            </li>
            <li>
              <b>Rubrika bo'yicha baholash.</b> Kabinetdagi "Rubrika bo'yicha baholash" ro'yxatidan
              ishni tanlang va har bir topshiriqqa Ilova 5 mezonlari bo'yicha 2, 1 yoki 0 ball
              qo'ying (izoh ixtiyoriy). Hisoblash qismlari avtomatik tekshiriladi — bu dastlabki
              ball, uni o'zgartirishingiz mumkin. Daraja: 0–20 past, 21–30 o'rta, 31–40 yuqori.
            </li>
            <li>
              <b>E-portfolio.</b> "Ishtirokchilar" bo'limida talabaning natijalar tarixi va
              refleksiyalarini ko'rib, izoh va individual tavsiya yozing; ular talabaning
              portfoliosida chiqadi. PIN unutilgan bo'lsa, shu yerda bekor qiling.
            </li>
            <li>
              <b>Amaliy ishlar va guruh holati.</b> "Amaliy ishlar" bo'limida talabalar yuborgan
              xato tahlillari, moslashtirilgan topshiriqlar, dars ishlanmalari, Microteaching
              videolari va Lesson Study protokollarini 0–2 ball bilan baholang. "Guruh holati"
              guruhning qaysi komponentda orqada qolayotganini ko'rsatadi.
            </li>
            <li>
              <Link to="/monitoring" className="text-primary hover:underline">
                Monitoring
              </Link>{" "}
              sahifasida "Bazadan jonli yuklash" tugmasini bosing (CSV eksport shart emas). CSV fayl
              yuklash ham ishlaydi, lekin unda rubrika ballari bo'lmaydi.
            </li>
            <li>
              <b>Tajriba-sinov jadvali:</b> kirish va yakuniy o'rtacha natija, o'sish, 95% ishonch
              oralig'i, bog'liq tanlanmalar t-mezoni, p-qiymat va Cohen dz effekt kattaligi;
              guruhlar bo'lsa, Welch t-mezoni. Daraja taqsimoti (past, o'rta, yuqori) oldin va
              keyin.
            </li>
            <li>
              <b>Komponentlar kesimida:</b> 5 komponent bo'yicha M ± SD, tajriba va nazorat
              guruhlari uchun Welch t-mezoni va Cohen d (dissertatsiyadagi 3.6-jadval ko'rinishida),
              kirish bosqichida — guruhlarning boshlang'ich tengligi.
            </li>
            <li>
              <b>Test sifati:</b> har bir savolning qiyinligi va ajratish kuchi, testning KR-20
              ishonchlilik koeffitsiyenti (diagnostik testda — Cronbach alfa). Pilot sinovdan keyin
              "qayta ko'rib chiqish kerak" belgisi tushgan savollarni mutaxassis bilan ko'rib
              chiqing.
            </li>
            <li>"Tahlilni CSV yuklab olish" tugmasi bilan jadvalni dissertatsiya uchun saqlang.</li>
          </ol>
        </Section>

        <Section icon={BookOpen} title="4. Platformadagi materiallar">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <Link to="/tavsiyalar" className="text-primary hover:underline">
                Metodik tavsiyalar
              </Link>{" "}
              — TIMSS (Knowing, Applying, Reasoning), PISA (Formulate, Employ, Interpret) va MKT
              bo'yicha; har birini chop etish mumkin.
            </li>
            <li>
              <Link to="/rasmiy" className="text-primary hover:underline">
                Rasmiy namunaviy topshiriqlar
              </Link>{" "}
              — IEA va OECD ochiq e'lon qilgan topshiriqlar asosida, metodik tahlil bilan.
            </li>
            <li>
              <Link to="/kutubxona" className="text-primary hover:underline">
                Elektron kutubxona
              </Link>{" "}
              va{" "}
              <Link to="/resources" className="text-primary hover:underline">
                ilmiy manbalar
              </Link>
              .
            </li>
          </ul>
        </Section>
      </div>
    </SiteLayout>
  );
}
