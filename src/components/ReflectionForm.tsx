import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { NotebookPen, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

type Props = { code: string; resultId: string; testType: string };

/** Testdan keyingi qisqa refleksiya: E-portfolioga yoziladi. */
export function ReflectionForm({ code, resultId, testType }: Props) {
  const [difficulty, setDifficulty] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");

  const valid = difficulty.trim().length >= 3 && nextStep.trim().length >= 3;

  const send = async () => {
    if (!valid) {
      toast.error("Ikkala savolga ham qisqacha javob yozing.");
      return;
    }
    setState("saving");
    const { error } = await db.from("portfolio_reflections").insert({
      code,
      result_id: resultId,
      test_type: testType,
      difficulty: difficulty.trim(),
      next_step: nextStep.trim(),
    });
    if (error) {
      console.error("[portfolio_reflections] save failed", error);
      setState("idle");
      toast.error("Refleksiya saqlanmadi. Qayta urinib ko'ring.");
      return;
    }
    setState("saved");
    toast.success("Refleksiya portfoliongizga yozildi");
  };

  return (
    <div className="p-6 rounded-2xl border bg-card shadow-card print:hidden">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <NotebookPen className="w-5 h-5 text-primary" /> Refleksiya
      </h3>
      {state === "saved" ? (
        <p className="mt-3 text-sm flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Refleksiya saqlandi. Natijalar tarixi, komponentlar dinamikasi va o'qituvchi izohlarini{" "}
            <Link to="/portfolio" className="text-primary hover:underline">
              E-portfolio
            </Link>{" "}
            sahifasida <span className="font-mono">{code}</span> kodi bilan ko'rasiz.
          </span>
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mt-1">
            Ikki qisqa savol. Javoblaringiz E-portfolioingizga yoziladi va o'qituvchingiz ko'radi.
          </p>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <label className="text-sm">
              <span className="block font-medium mb-1">Nima qiyin bo'ldi?</span>
              <textarea
                maxLength={1000}
                rows={3}
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-background"
                placeholder="Masalan: kasrlarni taqqoslashni o'quvchiga tushuntirish"
              />
            </label>
            <label className="text-sm">
              <span className="block font-medium mb-1">Keyingi qadamim</span>
              <textarea
                maxLength={1000}
                rows={3}
                value={nextStep}
                onChange={(e) => setNextStep(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-background"
                placeholder="Masalan: Formulate bo'yicha metodik tavsiyani o'qib, 5 ta masala yechaman"
              />
            </label>
          </div>
          <Button className="mt-4" onClick={send} disabled={state === "saving"}>
            Portfolioga yozish
          </Button>
        </>
      )}
    </div>
  );
}
