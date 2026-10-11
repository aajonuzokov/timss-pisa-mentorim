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
              <b>Natija.</b> Yuborgandan keyin mavzular bo'yicha diagnostika, kuchli va
              rivojlantirish kerak bo'lgan tomonlar hamda tavsiyalar chiqadi. "Chop etish / PDF"
              tugmasi bilan hisobotni saqlang.
            </li>
          </ol>
        </Section>

        <Section icon={ClipboardList} title="2. Tajriba-sinov tashkilotchisi uchun">
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <b>Kodlar ro'yxati.</b> Har bir ishtirokchiga kod bering (masalan, <code>T-001</code>{" "}
              … <code>T-186</code>) va ism–kod ro'yxatini alohida saqlang. Platformada ism bilan
              birga faqat kod tahlil qilinadi.
            </li>
            <li>
              <b>Kirish testi.</b>{" "}
              <Link to="/sinov" className="text-primary hover:underline">
                Tajriba-sinov
              </Link>{" "}
              bo'limida "Kirish testi (A shakl)" — 30 ta topshiriq, taxminan 40–50 daqiqa. Imkon
              bo'lsa, auditoriyada bir vaqtda o'tkazing.
            </li>
            <li>
              <b>Tajriba davri.</b> Talabalar metodik tavsiyalar, rasmiy topshiriqlar va mashq
              testlari bilan ishlaydi (dars yoki mustaqil ish sifatida).
            </li>
            <li>
              <b>Yakuniy test.</b> "Yakuniy test (B shakl)" — xuddi shu kod bilan. A va B shakllar
              soha, javob turi va qiyinlik bo'yicha teng tanlangan, shuning uchun o'sish yodlash
              hisobiga bo'lmaydi.
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

        <Section icon={LineChart} title="3. Natijalarni tahlil qilish">
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Lovable loyihasida Cloud → Database → <code>test_results</code> jadvalini CSV formatda
              eksport qiling.
            </li>
            <li>
              <Link to="/monitoring" className="text-primary hover:underline">
                Monitoring
              </Link>{" "}
              sahifasiga faylni yuklang. Fayl faqat brauzerda qayta ishlanadi.
            </li>
            <li>
              <b>Tajriba-sinov jadvali:</b> kirish va yakuniy o'rtacha natija, o'sish, 95% ishonch
              oralig'i, bog'liq tanlanmalar t-mezoni, p-qiymat va Cohen dz effekt kattaligi;
              guruhlar bo'lsa, Welch t-mezoni. Daraja taqsimoti (A'lo, Yaxshi, O'rta, Quyi) oldin va
              keyin.
            </li>
            <li>
              <b>Test sifati:</b> har bir savolning qiyinligi va ajratish kuchi, testning KR-20
              ishonchlilik koeffitsiyenti. Pilot sinovdan keyin "qayta ko'rib chiqish kerak" belgisi
              tushgan savollarni mutaxassis bilan ko'rib chiqing.
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
