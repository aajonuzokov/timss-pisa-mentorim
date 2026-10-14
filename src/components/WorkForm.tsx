import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Field } from "@/data/amaliyot";
import { submitWork, type SubmissionKind } from "@/lib/db";
import { isValidCode, loadProfile, normalizeCode, saveProfile } from "@/lib/participant";

type Props = {
  kind: SubmissionKind;
  refId: string;
  fields: Field[];
  /** Maydonlardan tashqari qo'shimcha ma'lumot (masalan, mezonlar bo'yicha o'z-o'zini baholash). */
  extra?: Record<string, unknown>;
  /** Formaning yuqorisidagi qo'shimcha elementlar (masalan, mezon tugmalari). */
  children?: ReactNode;
  submitLabel?: string;
  minFilled?: number;
  onDone?: () => void;
};

/** Talaba ishini ishtirokchi kodi bilan E-portfolioga yuboradi. */
export function WorkForm({
  kind,
  refId,
  fields,
  extra,
  children,
  submitLabel = "Portfolioga yuborish",
  minFilled,
  onDone,
}: Props) {
  const [code, setCode] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCode(loadProfile().code);
  }, []);

  const filled = fields.filter((f) => (values[f.id] ?? "").trim().length >= 2).length;
  const need = minFilled ?? fields.length;

  const send = async () => {
    setError("");
    if (!isValidCode(code))
      return setError("Ishtirokchi kodini kiriting (diagnostik testda olgan kodingiz).");
    if (filled < need) return setError(`Kamida ${need} ta maydonni to'ldiring.`);
    const bad = fields.find(
      (f) => f.url && values[f.id] && !/^https?:\/\/\S+$/.test(values[f.id].trim()),
    );
    if (bad) return setError(`"${bad.label}" — to'liq havola bo'lishi kerak (https://...).`);
    setBusy(true);
    const payload = Object.fromEntries(
      fields
        .filter((f) => (values[f.id] ?? "").trim())
        .map((f) => [f.id, values[f.id].trim().slice(0, 3000)]),
    );
    const res = await submitWork(code, kind, refId, { ...payload, ...extra });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    const prof = loadProfile();
    saveProfile({ ...prof, code });
    setDone(true);
    toast.success("Ish E-portfolioga yuborildi");
    onDone?.();
  };

  if (done)
    return (
      <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-sm flex gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <span>
          Yuborildi. O'qituvchi bahosi va izohi{" "}
          <Link to="/portfolio" className="text-primary hover:underline">
            E-portfolio
          </Link>
          da ko'rinadi.
        </span>
      </div>
    );

  return (
    <div className="space-y-3">
      {children}
      {fields.map((f) => (
        <label key={f.id} className="block text-sm">
          <span className="block font-medium mb-1">{f.label}</span>
          {f.rows === 1 ? (
            <input
              type={f.url ? "url" : "text"}
              maxLength={f.url ? 500 : 300}
              value={values[f.id] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border bg-background"
              aria-label={f.label}
            />
          ) : (
            <textarea
              rows={f.rows ?? 3}
              maxLength={3000}
              value={values[f.id] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border bg-background"
              aria-label={f.label}
            />
          )}
        </label>
      ))}
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm">
          <span className="block text-xs text-muted-foreground mb-1">Ishtirokchi kodi</span>
          <input
            value={code}
            maxLength={20}
            onChange={(e) => setCode(normalizeCode(e.target.value))}
            className="w-40 px-3 py-2 rounded-lg border bg-background font-mono"
            aria-label="Ishtirokchi kodi"
          />
        </label>
        <Button onClick={send} disabled={busy}>
          {submitLabel}
        </Button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
