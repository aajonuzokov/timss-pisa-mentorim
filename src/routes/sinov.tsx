import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ClipboardCheck, Flag, BookOpen, Info } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { Quiz } from "@/components/Quiz";
import { FORM_A, FORM_B } from "@/lib/results";
import type { Stage } from "@/lib/participant";
import type { TestKey } from "@/data/bank";

export const Route = createFileRoute("/sinov")({
  head: () => ({
    meta: [
      { title: "Tajriba-sinov testlari — TIMSS/PISA Platformasi" },
      {
        name: "description",
        content:
          "Kirish va yakuniy diagnostik testlar: 30 tadan topshiriq, natijalar ishtirokchi kodi bo'yicha solishtiriladi.",
      },
    ],
  }),
  component: Page,
});

type Choice = { key: TestKey; stage: Stage; title: string; desc: string; icon: typeof Flag };

const choices: Choice[] = [
  {
    key: "sinov-a",
    stage: "kirish",
    title: "Kirish testi (A shakl)",
    desc: "Tajriba boshida, platforma materiallari bilan ishlashdan oldin topshiriladi.",
    icon: Flag,
  },
  {
    key: "sinov-b",
    stage: "yakuniy",
    title: "Yakuniy test (B shakl)",
    desc: "Tajriba oxirida topshiriladi. Kirish testida ishlatilgan kod kiritiladi.",
    icon: ClipboardCheck,
  },
];

function Page() {
  const [sel, setSel] = useState<Choice | null>(null);
  const questions = sel?.key === "sinov-b" ? FORM_B : FORM_A;

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Pedagogik tajriba-sinov"
        title="Kirish va yakuniy testlar"
        description={`Har bir test ${FORM_A.length} ta topshiriqdan iborat (TIMSS 4- va 8-sinf, PISA), taxminan 40–50 daqiqa. Ikki shakl soha, javob turi va qiyinlik bo'yicha teng tanlangan.`}
      />

      <section className="max-w-5xl mx-auto px-6 pt-8 space-y-4">
        <div className="p-5 rounded-2xl border border-primary/30 bg-primary/5 text-sm leading-relaxed flex gap-3">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <ol className="list-decimal pl-4 space-y-1">
            <li>
              <b>Kirish testi</b>ni topshiring va ekrandagi <b>ishtirokchi kodi</b>ni yozib oling
              (tashkilotchi kod bergan bo'lsa, o'shani kiriting).
            </li>
            <li>
              Tajriba davomida platformadagi{" "}
              <Link to="/tavsiyalar" className="text-primary hover:underline">
                metodik tavsiyalar
              </Link>
              ,{" "}
              <Link to="/rasmiy" className="text-primary hover:underline">
                rasmiy namunaviy topshiriqlar
              </Link>{" "}
              va mashq testlari bilan ishlang.
            </li>
            <li>
              Tajriba oxirida <b>yakuniy test</b>ni xuddi shu kod bilan topshiring. Ikki natija
              monitoringda avtomatik solishtiriladi.
            </li>
          </ol>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-8 grid sm:grid-cols-2 gap-4">
        {choices.map((c) => {
          const Icon = c.icon;
          const active = sel?.key === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setSel(c)}
              className={`text-left p-5 rounded-2xl border bg-card shadow-card transition ${active ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/40"}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-semibold">{c.title}</div>
              </div>
              <p className="text-sm text-muted-foreground">{c.desc}</p>
            </button>
          );
        })}
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        {sel ? (
          <Quiz
            key={sel.key}
            questions={questions}
            testKey={sel.key}
            stage={sel.stage}
            label={sel.title}
          />
        ) : (
          <div className="p-8 rounded-2xl border border-dashed text-center text-muted-foreground">
            <BookOpen className="w-6 h-6 mx-auto mb-2" />
            Boshlash uchun yuqoridan testni tanlang.
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
